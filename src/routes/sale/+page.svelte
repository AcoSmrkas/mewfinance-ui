<script>
    import { selected_wallet_ergo, connected_wallet_address } from "$lib/store/store.ts";
      import { contributeTx } from '$lib/contract/contributeTx.ts';
    import axios from 'axios';
    import { TOKEN_DECIMALS, TOKEN_ID, TOKEN_NAME, CONTRACT, CONTRACT_CRC32, API_HOST } from '$lib/common/const.js';
    import { nFormatter, showCustomToast, getConnectedWalletAddress, isWalletConected, getCommonBoxIds, clamp, parseDate, getCurrentUTCDate } from '$lib/utils/utils.js';
    import { onMount } from "svelte";
    import { writable, get } from 'svelte/store';
    import ErgopayModal from '$lib/components/common/ErgopayModal.svelte';
    import { prices } from '$lib/utils/prices.js';
    import Loading from "$lib/components/common/Loading.svelte";
      import { fetchBoxes, getBlockHeight, fetchContractBoxFromTx, updateTempBoxes } from '$lib/api-explorer/explorer.ts';
  
    let presaleData = null;
    let ergAmount = 1;
    let mewAmount = 0;
    let loading = true;
    let soldPercent = 0;
    let ergLimit = 0;
    let unsignedTx = undefined;
    let isAuth = false;
    let showErgopayModal = false;
    let saleClosed = true;
    let mewSold = 0;
  
    $: usdAmount = (ergAmount * prices['ERG']).toFixed(2);
    $: mewAmount = (ergAmount / presaleData?.price).toFixed(TOKEN_DECIMALS);
  
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
  
        unsigned = await contributeTx(
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
  
    onMount(async () => {
      presaleData = (await axios.get(`${API_HOST}tokens/getSale?id=37`)).data.items[0];
      let presaleInfo = (await axios.get(`${API_HOST}tokens/saleStats?id=37`)).data.items[0];
      
      mewSold = presaleInfo.totalprofit / 0.01;
      soldPercent = (mewSold / presaleData.amount) * 100;
  
      ergLimit = 20000;
  
      const saleDate = parseDate(presaleData.salestart);
      const currentDate = getCurrentUTCDate();
      
      saleClosed = (currentDate < saleDate) || (soldPercent >= 100);
  
      setTimeout(() => {      
        const input = document.getElementById('quantity');
  
        input.addEventListener('input', function() {
            if (parseFloat(input.value) > ergLimit) {
                ergAmount = input.value = ergLimit;
            }
        });
      }, 100);
  
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
      <h1 class="section-title text-4xl font-bold text-white text-center pt-2 mb-4">Sale</h1>
      <br>
    <div class="staker-sale">
    <div class="sale-container">
      <div class="sale-form">
      <h2 class="font-bold">Christmas Sale 🎄</h2>
      <br>    
      <div class="input-group">
        <input id="quantity" type="number" max="{ergLimit}" bind:value={ergAmount} />
        <span class="currency">ERG</span>
        <span class="usd-amount"> (~${usdAmount} USD)</span>
      </div>
      
      <div class="input-group">
        <input type="number" disabled bind:value={mewAmount} />
        <span class="currency">MEW</span>
      </div>
  
      <span class="mb-3">Buy Limit: {nFormatter(presaleData.buylimit)} <b class="text-primary">MEW</b></span>
      
      <button class="btn btn-primary w-100 btn-big mt-3" disabled={saleClosed} on:click={handleContribute}>Buy</button>
      </div>
      
      <div class="sale-info m-0" style="height: min-content;">
      
      <div class="info-item">
        <h4 class="text-custom-yellow">DATE</h4>
        <span>Opens <b class="text-primary">{presaleData.salestart} UTC</b></span>
      </div>
      
      <div class="info-item">
        <h4 class="text-custom-yellow">TOTAL MEW CLAIMED: {nFormatter(mewSold, TOKEN_DECIMALS)}</h4>
        
        <div class="progress-bar">
        <div class="progress-fill" style="width: {soldPercent}%"></div>
        </div>
        <span class="target"><b class="text-primary">MEW</b> TARGET: {nFormatter(presaleData.amount)}</span>
      </div>
      
      <div class="info-item m-0">
        <h4 class="text-custom-yellow">PRICE</h4>
        <span><b>1</b> <b class="text-primary">MEW</b> = <b>{presaleData?.price}</b> <b class="text-primary">ERG</b></span>
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
      font-size: 2.5em;
      color: #f7d52c;
    }
    
    .warning {
      color: #FF6347;
    }
    
    .input-group {
      margin-bottom: 15px;
      padding: 15px;
      border-radius: 10px;
      border: 1px solid #f7d52c;
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
      color: #f7d52c;
    }
    
    .checkbox-container {
      display: block;
      margin-bottom: 20px;
    }
    
    .link {
      color: #f7d52c;
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
      color: #f7d52c;
    }
    
    .progress-bar {
      background-color: #2D1C43;
      height: 20px;
      border-radius: 10px;
      overflow: hidden;
      margin-top: 10px;
    }
    
    .progress-fill {
      background-color: #f7d52c;
      height: 100%;
    }
    
    .target {
      display: block;
      font-size: 0.9em;
      color: #f7d52c;
      margin-top: 5px;
    }
    </style>