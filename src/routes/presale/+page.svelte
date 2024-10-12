<script>
  import { selected_wallet_ergo, connected_wallet_address } from "$lib/store/store.ts";
    import { nftTx } from '$lib/contract/contributeTx.ts';
  import axios from 'axios';
  import { TOKEN_DECIMALS, TOKEN_ID, TOKEN_NAME, CONTRACT, CONTRACT_CRC32, API_HOST } from '$lib/common/const.js';
  import { nFormatter, showCustomToast, getConnectedWalletAddress, isWalletConected, getCommonBoxIds, clamp, parseDate, getCurrentUTCDate } from '$lib/utils/utils.js';
  import { onMount } from "svelte";
  import { BigNumber } from 'bignumber.js';
  import { writable, get } from 'svelte/store';
  import ErgopayModal from '$lib/components/common/ErgopayModal.svelte';
  import { prices } from '$lib/utils/prices.js';
  import Loading from "$lib/components/common/Loading.svelte";
    import { fetchBoxes, getBlockHeight, fetchContractBoxFromTx, updateTempBoxes } from '$lib/api-explorer/explorer.ts';

  let presaleData = null;
  let ergAmount = 500;
  let mewAmount = 0;
  let loading = true;
  let soldPercent = 0;
  let ergLimit = 0;
  let unsignedTx = undefined;
  let isAuth = false;
  let showErgopayModal = false;
  let saleClosed = true;
  let mewSold = 0;
  let saleDate = '';
  let price = 500;
  let totalNfts = 50;

  $: usdAmount = (ergAmount * prices['ERG']).toFixed(2);
  $: mewAmount = (ergAmount / price).toFixed(TOKEN_DECIMALS);

  async function handleContribute() {
    const selectedWalletErgo = get(selected_wallet_ergo);

    if (!isWalletConected()) {
      showCustomToast('Connect a wallet.', 1500, 'info');
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

    try {
      let unsigned = null;

      unsigned = await nftTx(
        myAddress,
        utxos,
        height,
        ergAmount
      );

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

  function formatDate(date) {
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based, so add 1
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

  onMount(async () => {
    const stats = (await axios.get(`https://api.mewfinance.com/mew/getMewNftStatus`)).data.items;

    mewSold = 0;

    for (let s of stats) {
      if (s.sold) {
        mewSold++;
      }
    }

    soldPercent = (mewSold / totalNfts) * 100;

    ergLimit = 500;

    saleDate = parseDate('2025-10-31 18:00:00');
    const currentDate = getCurrentUTCDate();
    
    saleClosed = (currentDate < saleDate) || (soldPercent >= 100);

    loading = false;
  });

  </script>
  
  {#if loading}
    <div class="loading-holder">
      <Loading />
    </div>
  {:else}

  <div class="h-full flex flex-col grow main-page">
  <div class="container top-margin text-custom-light mb-5">
    <br>
    <h1 class="section-title text-4xl font-bold text-white text-center pt-2 mb-4">Presale</h1>
    <br>
  <div class="staker-sale">
  <div class="sale-container">
    <div class="sale-form">
    <h2 class="font-bold mb-3">MEW Tier 6 NFT</h2>
    <div class="w-100">
      <img class="w-[200px] mx-auto" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwVoGyjALjx5evXWHG908w7sJ9UWny7EzBQw&s">
    </div>
    <br>

    <span><b>Price:</b> {nFormatter(500)} <b class="text-primary">ERG</b></span>
  
    <button class="btn btn-primary mt-2 w-100 btn-big" disabled={saleClosed} on:click={handleContribute}>Buy</button>
    </div>
    
    <div class="sale-info m-0" style="height: min-content;">
    
    <div class="info-item">
      <h4 class="text-primary">DATE</h4>
      <span>Opens <b class="text-primary">{formatDate(saleDate)} UTC</b></span>
    </div>
    
    <div class="info-item">
      <h4 class="text-primary">REQUIREMENTS</h4>
      <p>Active <b class="text-primary">MEW Tier 5</b></p>
    </div>

    <div class="info-item">
      <h4><span class="text-primary">MEW NFTs CLAIMED:</span> {mewSold}</h4>
      
      <div class="progress-bar">
      <div class="progress-fill" style="width: {soldPercent}%"></div>
      </div>
      <span class="target"><b class="text-primary">TOTAL MEW NFTs</b>: {totalNfts}</span>
    </div>
    
    <div class="info-item m-0">
      <h4 class="text-primary">LIMIT</h4>
      <span><b>1</b> <b class="text-primary">MEW NFT</b> per address</span>
    </div>
    </div>
  </div>
  </div>
</div>
</div>

{/if}

{#if showErgopayModal}
 <ErgopayModal bind:showErgopayModal bind:isAuth bind:unsignedTx>
   <button slot="btn">Close</button>
 </ErgopayModal>
{/if}

  
  <style>
    h4 {
      font-weight: bold;
    }

  .staker-sale {
    color: #FFFFFF;
    max-width: 1200px;
    margin: auto;
    border-radius: 20px;
  }
  
  .sale-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .sale-form, .sale-info {
    background-color: var(--forms-bg);
    padding: 20px;
    border-radius: 15px;
    width: 100%;
    margin-bottom: 20px;
  }
  
  @media (min-width: 768px) {
    .sale-form, .sale-info {
    width: 49%;
    margin-bottom: 0;
    }
  }
   
  h2 {
    font-size: 2em;
    color: var(--main-color);
  }
  
  .warning {
    color: #FF6347;
  }
  
  .input-group {
    margin-bottom: 15px;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid var(--main-color);
    background-color: var(--footer);
  }
  
  input[type="number"] {
    background-color: transparent;
    border: none;
    color: #FFFFFF;
    font-size: 1.2em;
    width: 100%;
  }
  
  .currency, .usd-amount, .remaining {
    display: block;
    font-size: 0.9em;
    color: var(--main-color);
  }
  
  .checkbox-container {
    display: block;
    margin-bottom: 20px;
  }
  
  .link {
    color: var(--main-color);
    text-decoration: none;
  }
    
  .info-item {
    margin-bottom: 20px;
    background-color: var(--footer);
    padding: 15px;
    border-radius: 10px;
  }
  
  .time {
    font-size: 1.5em;
    font-weight: bold;
    color: var(--main-color);
  }
  
  .progress-bar {
    background-color: #2D1C43;
    height: 20px;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 10px;
  }
  
  .progress-fill {
    background-color: var(--main-color);
    height: 100%;
  }
  
  .target {
    display: block;
    font-size: 0.9em;
    margin-top: 5px;
  }
  </style>