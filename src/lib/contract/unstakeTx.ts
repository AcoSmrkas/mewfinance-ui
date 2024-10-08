
import { ErgoAddress, OutputBuilder, TransactionBuilder, RECOMMENDED_MIN_FEE_VALUE, ErgoUnsignedInput, TokensCollection } from "@fleet-sdk/core";
import { SByte } from "@fleet-sdk/serializer";
import { BigNumber } from 'bignumber.js';
import { get } from "svelte/store";

export async function unstakeTx(
    contractBox:any,
    stakerBase58PK: string,
    stakerUtxos: Array<any>,
    height: number)
  : any {
  const stakerAddress = ErgoAddress.fromBase58(stakerBase58PK);
  const sellerBox = new OutputBuilder(
    contractBox.value,
    stakerBase58PK
  ).addTokens(contractBox.assets);

  const unsignedTx = new TransactionBuilder(height)
    .configure((s) => s.setMaxTokensPerChangeBox(100))
    .configureSelector((selector) => selector.ensureInclusion(contractBox.boxId))
    .from([contractBox, ...stakerUtxos])
    .to(sellerBox)
    .sendChangeTo(stakerAddress)
    .payFee(RECOMMENDED_MIN_FEE_VALUE)
    .build()
    .toEIP12Object();

  return unsignedTx
}