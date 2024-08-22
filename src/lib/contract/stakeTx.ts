import { first } from "@fleet-sdk/common";
import { ErgoAddress, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SGroupElement, SBigInt, SSigmaProp, SByte, SLong, SColl } from "@fleet-sdk/serializer";
import { stringToBytes } from "@scure/base";
import { get } from "svelte/store";

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
        SAFE_MIN_BOX_VALUE,
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