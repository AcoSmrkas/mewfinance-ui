<script lang="ts">
  import { ErgoAddress } from "@fleet-sdk/core";
  import { unstakeTx } from "$lib/contract/unstakeTx.ts";
  import { get } from 'svelte/store';
  import { selected_wallet_ergo, connected_wallet_address, assets, assetsInfos, showNsfw } from "$lib/store/store.ts";
  import { onMount } from "svelte";
  import JSONBig from 'json-bigint';
  import { nFormatter, showCustomToast, getConnectedWalletAddress, formatNftUrl, hex2a, getImageUrl, destroy, isWalletConected, setPlaceholderImage, getCommonBoxIds } from '$lib/utils/utils.js';
  import ErgopayModal from '$lib/components/common/ErgopayModal.svelte';
  import { TOKEN_ID, TOKEN_DECIMALS, TOKEN_NAME, DEV_PK } from '$lib/common/const.js';
  import { fetchBoxes, getBlockHeight, fetchContractBoxFromTx, updateTempBoxes } from '$lib/api-explorer/explorer.ts';
  import axios from 'axios';
  import BigNumber from 'bignumber.js';

  export let offer;

  let showAllAssets = false;
  let isLoading = true;
  let showErgopayModal = false;
  let isAuth = false;
  let unsignedTx = null;
  let connectedWalletAddress = '';
  let imageUrl = "";
  let showModal = false; // New state to control modal visibility

  async function unstake() {
    const selectedWalletErgo = get(selected_wallet_ergo);

    if (!isWalletConected()) {
      showCustomToast('Connect a wallet.', 1500, 'info');
      return;
    }

    const contractBox = await fetchContractBoxFromTx(offer.txidin);
    
    if (contractBox == null) {            
      showCustomToast('Failed to fetch contract box.', 1500, 'danger');
      return;
    }

    let myAddress, height, utxos;
    unsignedTx = null;

    if ($selected_wallet_ergo != 'ergopay') {
      myAddress = await ergo.get_change_address();
      utxos = await fetchBoxes($connected_wallet_address);
      height = await ergo.get_current_height();
    } else {
      myAddress = get(connected_wallet_address);
      utxos = await fetchBoxes($connected_wallet_address);
      height = await getBlockHeight();                  
    }

    contractBox.additionalRegisters.R4.renderedValue = contractBox.additionalRegisters.R4.renderedValue
      .replace(/^CBigInt\(|\)$/g, '');

    let box = JSON.parse(JSON.stringify(contractBox));
    for (const [k, v] of Object.entries(box.additionalRegisters)) {
      box.additionalRegisters[k] = v.serializedValue;
    }

    try {
      let unsigned = null;

      unsigned = await unstakeTx(box, myAddress, utxos, height);

      if (selectedWalletErgo != 'ergopay') {
        const signed = await ergo.sign_tx(unsigned);
        const transactionId = await ergo.submit_tx(signed);

        console.log("Transaction ID:", transactionId);

        showCustomToast(`Transaction submitted successfully.<br>TX ID: <a target="_new" href="https://ergexplorer.com/transactions/${transactionId}">${transactionId}</a>`, 5000, 'success');

        const usedBoxIds = getCommonBoxIds(utxos, signed.inputs);
        const newOutputs = signed.outputs.filter(output => output.ergoTree == utxos[0].ergoTree);

        updateTempBoxes(myAddress, usedBoxIds, newOutputs);
      } else {
        unsignedTx = unsigned;
        isAuth = false;
        showErgopayModal = true;
      }
    } catch (e) {
      console.error(e);

      if (e.message && e.message.substr(0, 19) == 'Insufficient inputs') {
        showCustomToast(`Insufficient funds.`, 5000, 'danger');
      } else if (e.info && e.info == 'User rejected') {
      //
      } else {
        showCustomToast(`Failed to submit TX.`, 5000, 'danger');
      }
    }
  }
  
  async function updateOffer() {
    const contractBox = await fetchContractBoxFromTx(offer.txidin);
    
    if (contractBox == null) {            
      showCustomToast('Failed to fetch contract box.', 1500, 'danger');
      return;
    }

    contractBox.additionalRegisters.R4.renderedValue = contractBox.additionalRegisters.R4.renderedValue
      .replace(/^CBigInt\(|\)$/g, '');

    try {
      offer.devFee = BigInt(contractBox.additionalRegisters.R6.renderedValue);
    } catch {
      offer.devFee = 2000;
    }

    if (offer.devFee < 2000) {
      offer.devFee = 2000;
    }

    try {
      offer.royaltyFee = BigInt(contractBox.additionalRegisters.R9.renderedValue);
    } catch {
      offer.royaltyFee = 0;
    }

    offer.royalties = [];
    if (offer.royaltyFee > 0) {
      try {
        let rData = (await axios.get(`https://api.ergoplatform.com/api/v1/transactions/${offer.assets[0].mintTx}`)).data;
        const rInput = rData.inputs[0];
        if (rInput.additionalRegisters && rInput.additionalRegisters.R5 && rInput.additionalRegisters.R5.renderedValue) {
          const royaltyRenderedValue = rInput.additionalRegisters.R5.renderedValue;

          const pairs = royaltyRenderedValue.slice(1, -1).split('],[');
          const extractedValues = pairs.flatMap(pair => {
              return pair.replace(/[\[\]]/g, '').split(',');
          });

          for (let i = 0, j = 0; i < extractedValues.length; i += 2, j++) {
            offer.royalties.push([
              extractedValues[j * 2],
              extractedValues[j * 2 + 1]
            ]);
          }
        }
      } catch (e) {
        console.error(e);
        showCustomToast('Failed to fetch royalty data.', 1500, 'danger');
        return;
      }
    }
  }
  
  function updateImageUrls() {
    imageUrl = getImageUrl({tokenId: TOKEN_ID}, true);
  }

  onMount(async () => {
    connectedWalletAddress = await getConnectedWalletAddress();
   
    offer.stakeassetname = TOKEN_NAME;
    let stakeAmount = new BigNumber(offer.stakeamount);

    if (TOKEN_DECIMALS > 0) {
      stakeAmount = stakeAmount.dividedBy(10 ** TOKEN_DECIMALS);
    }

    offer.stakeamount = stakeAmount.toString();
    offer.stakeasseturl = `https://ergexplorer.com/token/${TOKEN_ID}`;

    await updateOffer();
    updateImageUrls();

    isLoading = false;
  });

</script>
{#if isLoading}
  <div class="skeleton-card">
    <div class="skeleton-image"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-button"></div>
  </div>
{:else if offer}
  <div class="item relative flex flex-col rounded-lg min-w-1 overflow-hidden">
    <div class="relative w-full h-[180px] min-h-[200px]" style="background: black">
 <a class="img-container" href={`https://ergexplorer.com/token#${TOKEN_ID}`} target="_blank" rel="noopener noreferrer">
          <img 
            src={imageUrl} 
            class="max-w-full max-h-full h-auto m-auto max-w-1 cursor-pointer" 
            alt=""
            on:error="{(event) => setPlaceholderImage(event, {tokenId: TOKEN_ID})}"
          >
        </a>

              <button 
        style="left: 50%; top: 50%; transform: translate(-50%, -50%); width: 50%"
        class={`item-btn absolute z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
          offer.seller === connectedWalletAddress 
            ? "btn btn-secondary"
            : "btn btn-primary"
        }`}
        on:click={unstake} 
        disabled={isLoading}
      >
        {offer.staker === connectedWalletAddress ? 'Unstake' : 'Buy'}
      </button>
    </div>
    
    <div class="p-2">
      <div class="pt-2 flex justify-between items-center">
        <div class="w-100">
          <span class="text-sm text-light">Amount</span>          
            <span class="font-bold float-right">{nFormatter(offer.stakeamount, TOKEN_DECIMALS)}
              {#if offer.stakeasseturl}<a target="_new" href="{offer.stakeasseturl}" class="text-primary">{offer.stakeassetname ? offer.stakeassetname : 'ERG'}</a>
              {:else}
                <span class="text-primary">{offer.stakeassetname ? offer.stakeassetname : 'ERG'}</span>
              {/if}
            </span>
        </div>
      </div>
    </div>
  </div>

  {#if showErgopayModal}
    <ErgopayModal bind:showErgopayModal bind:isAuth bind:unsignedTx>
      <button slot="btn">Close</button>
    </ErgopayModal>
  {/if}
{:else}
  <div class="invalid-offer-message text-white">
    Invalid offer. Please check the parameters.
  </div>
{/if}

<style>
  .media-object {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #33244f;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.media-object-image {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 15px;
}

.media-object-content {
  flex-grow: 1;
}

.media-object-title {
  font-size: 1rem;
  font-weight: bold;
  color: var(--main-color) !important;
  margin: 0;
}

.media-object-subtitle {
  font-size: 0.875rem;
  color: #ffffff;
  margin-top: 5px;
}
  .item {
    background: var(--forms-bg);
    height: auto;
    min-height: 100px;
    transition: all 0.25s ease;
    scale: 1;
    width: 100%;
  }

  .item.single-asset {
    min-height: 400px; /* Adjust the height for a single asset */
  }

  .item:hover {
    scale: 1.05;
  }

  .item:hover .item-btn {
    visibility: visible;
    opacity: 1;
  }

  .item-btn {
    visibility: hidden;
    opacity: 0;
    transition: all 0.25s ease;
  }

  @keyframes zoom {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  @media (max-width: 990px) {
    .item-btn {
      visibility: visible !important;
      opacity: 1 !important;
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal-box {
    background: var(--forms-bg); /* Purple background for modal */
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    color: white;
    position: relative;
  }

  .asset-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .asset-cards-container {
    max-height: 400px; /* Fixed height for scrollable area */
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
  }

  .asset-card {
    background: #15111e; /* Darker card background */
    border-radius: 8px;
    padding: 10px;
    width: calc(50% - 10px); /* Two cards per row with a gap */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    max-width: 250px; /* Smaller cards */
  }

  .asset-card-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .asset-card-details {
    margin-top: 10px;
  }

  .asset-card-name {
    font-weight: bold;
  }

  .royalty-details {
    margin-top: 10px;
  }

  .modal-price {
    margin-top: 10px;
    font-size: 1.2em;
    color: #fff;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .btn {
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
    font-weight: bold;
    cursor: pointer;
  }

  .btn-primary {
    background-color: #4b3f72; /* Adjusted button color for visibility */
    color: white;
    width: 100%;
  }

  .btn-secondary {
    background-color: #6c757d;
    color: white;
    margin-left: 10px;
  }

  .btn-primary:hover {
    background-color: #3e2b59;
  }

  .btn-secondary:hover {
    background-color: #5a6268;
  }

  .invalid-offer-message {
    text-align: center;
    padding: 20px;
    background: #dc3545;
    color: white;
    border-radius: 4px;
    margin-top: 20px;
  }

  .scrollable {
    max-height: 150px; /* Fixed height for scrollable area */
    overflow-y: auto;
  }
</style>