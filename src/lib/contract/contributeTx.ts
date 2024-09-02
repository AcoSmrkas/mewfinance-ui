import { first } from "@fleet-sdk/common";
import { ErgoAddress, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SGroupElement, SBigInt, SSigmaProp, SByte, SLong, SColl } from "@fleet-sdk/serializer";
import { stringToBytes } from "@scure/base";
import { get } from "svelte/store";
  import { BigNumber } from 'bignumber.js';

export function contributeTx(
    buyerBase58PK: string,
    stakerUtxos: Array<any>,
    height: number,
    ergAmount: number
): any {
    const buyerAddress = ErgoAddress.fromBase58(buyerBase58PK);
    let contract = '9g6LcnJw3tw1YEMa4CzLzYvB4VQX9w9QADb3GqcZsp3CAnz3jta';
    const buyBytes = stringToBytes("utf8", 'Buy');
    const saleBytes = stringToBytes("utf8", '34');
    const ergAmountNano = new BigNumber(ergAmount).plus(0.01).times(10 ** 9);

    const presaleBox = new OutputBuilder(
        ergAmountNano,
        contract
    )
        .setAdditionalRegisters({
            R4: SColl(SByte, buyBytes).toHex(),
            R5: SColl(SByte, saleBytes).toHex()
        });

    const unsignedTx = new TransactionBuilder(height)
        .configure((s) => s.setMaxTokensPerChangeBox(100))
        .from(stakerUtxos)
        .to([presaleBox])
        .sendChangeTo(buyerAddress)
        .payFee(RECOMMENDED_MIN_FEE_VALUE)
        .build()
        .toEIP12Object();

    return unsignedTx;
}