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

$: connected_wallet_address.subscribe(async (value) => {
  if (value == '') {
    mewTier.set(0);
    mewStaked.set(0);
    return;
  }

  const mewTierData = (await axios.get(`${API_HOST}staking/getMewTier?staker=${value}`)).data.items[0];

  mewTier.set(mewTierData.tier);
  mewStaked.set(mewTierData.totalstaked);

  localStorage.setItem(MEW_TIER, get(mewTier));
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

  const orders = await fetchOrders(0, 1000, null, walletAddress);
  
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