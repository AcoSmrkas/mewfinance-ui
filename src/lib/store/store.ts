import { fetchContractBoxes } from "$lib/api-explorer/explorer.js";
import { CONTRACT_CRC32, ITEMS_PER_PAGE, MAIN_PAGE_ITEMS, API_HOST } from '$lib/common/const.js';
import { writable, get } from 'svelte/store';
import axios from 'axios';

const MEW_TIER = 'mew_tier';

export type Token = {
  amount: bigint,
  tokenId: string
}

export const selected_wallet_ergo = writable('');
export const connected_wallet_address = writable('');
export const connected_wallet_addresses = writable([]);
export const utxos = writable([]);
export const assets = writable([]);
export const offers = writable([]);
export const offersPackage = writable([]);
export const offersSolo = writable([]);
export const offersMy = writable([]);
export const assetsInfos = writable([]);
export const totalBoxes = writable(0);
export const mewTier = writable(0);
export const mewStaked = writable(0);

export const showNsfw = persistentWritable('showNsfw', false);

let selectedCategory, selectedAsset, selectedBundle, selectedSort, selectedSearch, selectedAddress;

// --- address-change guard primitives (paired with $lib/common/userScope) ---
// connected_wallet_address can switch between the user's own addresses while
// per-address fetches are in flight. Each such fetch captures the generation +
// address it started for and only writes its result back if both are still
// current, so a slow response for a previous address can never clobber the
// freshly-selected one. resetUserScope() bumps the generation on every
// address transition (before the new address is set).
let addressGeneration = 0;
export function currentAddressGeneration() {
  return addressGeneration;
}
export function bumpAddressGeneration() {
  return ++addressGeneration;
}
export function isCurrentAddress(addr, gen) {
  return gen === addressGeneration && addr === get(connected_wallet_address);
}
export async function withAddressGuard(addr, gen, promise, apply) {
  const result = await promise;
  if (isCurrentAddress(addr, gen)) {
    apply(result);
  }
  return result;
}

$: connected_wallet_address.subscribe(async (value) => {
  // Clear the previous account's tier/stake on every switch (empty OR a
  // non-empty switch to another address) so stale values never linger while
  // the new address's data loads.
  mewTier.set(0);
  mewStaked.set(0);

  if (value == '') {
    return;
  }

  const gen = currentAddressGeneration();

  await withAddressGuard(
    value,
    gen,
    axios.get(`${API_HOST}staking/getMewTier?staker=${value}`),
    (res) => {
      const mewTierData = res.data.items[0];

      mewTier.set(mewTierData.tier);
      mewStaked.set(mewTierData.totalstaked);

      localStorage.setItem(MEW_TIER, get(mewTier));
    }
  );
});

export async function setOffersFilter(category, asset, bundle, sort, search, address) {
  if (category == 'None') {
    category = undefined;
  }

  if (asset == 'None') {
    asset = undefined;
  }

  if (bundle == 'None') {
    bundle = undefined;
  }

  if (sort == 'None') {
    sort = undefined;
  }

  if (search == '') {
    search = undefined;
  }
  if (address == '') {
    address = undefined;
  }

  selectedCategory = category;
  selectedAsset = asset;
  selectedBundle = bundle;
  selectedSort = sort;
  selectedSearch = search;
  selectedAddress = address;
}

export async function loadOffers(offset) {
  offers.set([]);
  totalBoxes.set(0);

  const orders = await fetchOrders(offset, ITEMS_PER_PAGE);

  await onOffersLoaded(offers, orders);
}

export async function loadOffersPackage() {  
  offersPackage.set([]);

  const orders = await fetchOrders(0, MAIN_PAGE_ITEMS, true);

  await onOffersLoaded(offersPackage, orders);
}

export async function loadOffersSolo() {  
  offersSolo.set([]);

  const orders = await fetchOrders(0, MAIN_PAGE_ITEMS, false);

  await onOffersLoaded(offersSolo, orders);
}

export async function loadMyOffers() {
  offersMy.set([]);

  let walletAddress = get(connected_wallet_address);
  if (walletAddress == '') {
    return;
  }

  const gen = currentAddressGeneration();
  const orders = await fetchOrders(0, 1000, null, walletAddress);

  // Drop the result if the user switched address while this was in flight.
  if (!isCurrentAddress(walletAddress, gen)) {
    return;
  }

  await onOffersLoaded(offersMy, orders);
}

async function onOffersLoaded(container, offers) {
  container.set(offers);

  await fetchAssetsInfo(offers);
}

async function fetchOrders(offset, limit, bundle = null, staker = null) {
  try {
    let url = `${API_HOST}mew/getStakes?contract=${CONTRACT_CRC32}&status=Stake`;

    if (bundle !== null || selectedBundle != null) {
      url += `&bundle=${bundle == true || selectedBundle == 't' ? 't' : 'f'}`;
    }

    if (selectedCategory != null) {
      url += `&category=${selectedCategory}`;
    }

    if (selectedAsset != null) {
      url += `&asset=${selectedAsset}`;
    }

    if (selectedSort != null) {
      switch (selectedSort) {
        case 'recent':
          url += `&sortDir=DESC`;
          break;
        case 'oldest':
          url += `&sortDir=ASC`;
          break;
        default:
          break;
      }
    }

    if (selectedSearch != null) {
      url += `&search=${selectedSearch}`;
    }

    if (selectedAddress != null) {
      url += `&address=${selectedAddress}`;
    }

    if (staker !== null) {
      url += `&staker=${staker}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching orders list: ${response.statusText}`);
    }

    const data = await response.json();

    if (bundle === null) {
      totalBoxes.set(data.total);
    }

    return data.items;
  } catch (error) {
    console.error('Failed to fetch orders list:', error);
    return [];
  }
}

async function fetchAssetsInfo(orders) {
  let ids = []

  const assetsInfosVal = get(assetsInfos);

  for (let offer of orders) {
    ids.push(offer.stakeasset);
    if (offer.assets)  {
      for (let asset of offer.assets) {
        const assetInfo = assetsInfosVal.find((a) => a.id === asset.tokenId)

        if (assetInfo) {
          continue;
        }

        if (!ids.includes(asset.tokenId)) {
          ids.push(asset.tokenId);
        }
      }
    }
  }

  if (ids.length == 0) {
    return;
  }

  const response = await fetch(`https://api.ergexplorer.com/tokens/byId`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ids: ids })
  });

  const responseItems = (await response.json()).items;

  assetsInfos.update(a => {
    return a.concat(responseItems);
  });
}

function persistentWritable(key, initialValue) {
  // Get the initial value from localStorage if it exists, otherwise use the provided initialValue
  const storedValue = localStorage.getItem(key);
  const data = storedValue ? JSON.parse(storedValue) : initialValue;

  const store = writable(data);

  // Subscribe to the store and update localStorage whenever the store's value changes
  store.subscribe(value => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  return store;
}