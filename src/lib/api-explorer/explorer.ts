import JSONbig from 'json-bigint';
import { totalBoxes } from "$lib/store/store";
import { ITEMS_PER_PAGE } from '$lib/common//const.js';
import axios from 'axios';
import { createWalletClient } from '$lib/api-explorer/chainClient.js';

// A wallet's spendable boxes come from chain.mewfinance.com/wallet/boxes, which
// applies pending transactions. chainClient (copied from chain-gateway) keeps the
// user's own sent transaction until the gateway lists it.
const wallet = createWalletClient({ parse: JSONbig.parse });

export const updateTempBoxes = wallet.updateTempBoxes;
export const clearTempBoxes = wallet.clearTempBoxes;

export async function fetchAssetInfos(tokenIds) {
  try {
    const url = `https://api.ergexplorer.com/tokens/byId`;
    const response  = await axios.post(url, {ids: tokenIds});

    return response.data.items;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function nautilusfFriendlyBox(box) {
  let newBox = JSON.parse(JSON.stringify(box));
  newBox.value = newBox.value.toString();

  if (newBox.assets === undefined) newBox.assets = [];

  for (let i = 0; i < newBox.assets.length; i++) {
    newBox.assets[i].amount = newBox.assets[i].amount.toString();
  }

  return newBox;
}

export async function fetchContractBoxFromTx(txid) {
  const url = `https://api.ergoplatform.com/api/v1/transactions/${txid}`;
  const response  = await fetch(url);

  if (response.status == 200) {
    const data = await response.arrayBuffer();
    const buffer = new TextDecoder("utf-8").decode(data);
    const stringFromBuffer = buffer.toString('utf8');
    const parsed = JSONbig.parse(stringFromBuffer);

    return parsed.outputs[0];
  } else {
    return null;
  }
}

export async function fetchContractBoxes(contract:string, offset:number) : Promise<Array<any>>{
  const url = `https://api.ergoplatform.com/api/v1/boxes/unspent/byAddress/${contract}?offset=${offset}&limit=${ITEMS_PER_PAGE}`;
  const response  = await fetch(url);

  if (response.status == 200) {
    const data = await response.arrayBuffer();
    const buffer = new TextDecoder("utf-8").decode(data);
    const stringFromBuffer = buffer.toString('utf8');
    const parsed = JSONbig.parse(stringFromBuffer);

    totalBoxes.set(parsed.total);
  
    return parsed.items.map(nautilusfFriendlyBox);
  } else {
    return [];
  }
}

export async function fetchConfirmedBalance(address) {
  const url = `https://api.ergoplatform.com/api/v1/addresses/${address}/balance/confirmed`;
  const response  = await fetch(url);

  if (response.status == 200) {
    const data = await response.arrayBuffer();
    const buffer = new TextDecoder("utf-8").decode(data);
    const stringFromBuffer = buffer.toString('utf8');
    const parsed = JSONbig.parse(stringFromBuffer);

    return parsed;
  } else {
    return 0;
  }
}

export async function fetchBoxes(address) {
  try {
    const { items: boxes } = await wallet.fetchWalletBoxes(address);

    for (const box of boxes) {
      for (const [k, v] of Object.entries(box.additionalRegisters ?? {})) {
        const serialized = (v as { serializedValue?: string } | null)?.serializedValue;
        if (serialized) {
          box.additionalRegisters[k] = serialized;
        }
      }
    }

    return boxes;
  } catch (error) {
    console.error('Error fetching boxes for address: ', address);
    throw error;
  }
}

export async function getBlockHeight() {
  try {
  const response = await axios.get('https://api.ergoplatform.com/api/v1/networkState');

  return response.data.height;
  } catch (error) {
  console.error('Error getting block height');
  throw error;
  }
}