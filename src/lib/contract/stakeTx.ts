import { first } from "@fleet-sdk/common";
import { ErgoAddress, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SGroupElement, SBigInt, SSigmaProp, SByte, SLong, SColl } from "@fleet-sdk/serializer";
import { stringToBytes } from "@scure/base";
import { get } from "svelte/store";

// 1 ERG locked into the staking box to make it storage-rent-proof. Ergo
// collects boxes whose value can't pay the periodic rent (~once every 4
// years); a SAFE_MIN_BOX_VALUE (0.001 ERG) box has ~4 yrs of safety before
// miners can sweep it. 1 ERG buys effectively unlimited safety and is
// fully refunded to the staker on unstake (unstakeTx preserves
// contractBox.value into the seller box, so the ERG round-trips cleanly).
const STAKE_BOX_VALUE = 1_000_000_000n; // 1 ERG in nanoErg

export function stakeTx(
    contract: string,
    stakerBase58PK: string,
    stakerUtxos: Array<any>,
    height: number,
    tokenId: string,
    tokenAmount: bigint | undefined
): any {
    const stakerAddress = ErgoAddress.fromBase58(stakerBase58PK);

    const tokenIdBytes = tokenId == '' ? [] : tokenId.match(/.{1,2}/g).map(byte => parseInt(byte, 16));

    const contractBox = new OutputBuilder(
        STAKE_BOX_VALUE,
        contract
    )
        .addTokens([
            {
                tokenId: tokenId,
                amount: tokenAmount
            }
        ])
        .setAdditionalRegisters({
            R4: SGroupElement(first(stakerAddress.getPublicKeys())).toHex(),
            R5: SColl(SByte, tokenIdBytes).toHex()
        });

    const unsignedTx = new TransactionBuilder(height)
        .configure((s) => s.setMaxTokensPerChangeBox(100))
        .from(stakerUtxos)
        .to([contractBox])
        .sendChangeTo(stakerAddress)
        .payFee(RECOMMENDED_MIN_FEE_VALUE)
        .build()
        .toEIP12Object();

    return unsignedTx;
}