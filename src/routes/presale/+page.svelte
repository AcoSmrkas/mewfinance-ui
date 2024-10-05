<script>
  import { selected_wallet_ergo, connected_wallet_address } from "$lib/store/store.ts";
  import { contributeTx } from '$lib/contract/contributeTx.ts';
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
  let ergAmount = 1;
  let loading = true;
  let soldPercent = 0;
  let ergLimit = 0;
  let unsignedTx = undefined;
  let isAuth = false;
  let showErgopayModal = false;
  let saleClosed = false;

  // New variables for additional metrics
  let totalSoldTokens = 0;
  let percentageCompleted = 0;
  let numberOfSupporters = 0;
  let remainingTokens = 0;
  let totalRaisedERG = 0;

  // Reactive statements for calculated values
  $: usdAmount = (ergAmount * prices['ERG']).toFixed(2);
  $: mewAmount = (ergAmount / (presaleData?.price || 1)).toFixed(TOKEN_DECIMALS); // Avoid division by zero

  onMount(async () => {
    try {
      // Fetching presale data
      const response = await axios.get('https://api.crooks-fi.com/tokens/saleStats?id=34');
      const stats = response.data.items[0];

      // Assuming this is still the price per MEW token in ERG
      presaleData = {
        price: 0.002, // Set your price here
        salestart: "2023-06-01 12:00", // Replace with actual start date
        buylimit: 1000000, // Replace with actual buy limit
      };

      // Calculate additional metrics
      totalSoldTokens = stats.totalprofit / presaleData.price;
      const totalTokensInPresale = 10_000_000; // Assuming 10M total tokens
      percentageCompleted = (totalSoldTokens / totalTokensInPresale) * 100;
      numberOfSupporters = stats.buyercount;
      remainingTokens = totalTokensInPresale - totalSoldTokens;
      totalRaisedERG = stats.totalprofit;

      // Update soldPercent
      soldPercent = percentageCompleted;

      // Set ergLimit
      ergLimit = presaleData.buylimit * presaleData.price;

      const saleDate = parseDate(presaleData.salestart);
      const currentDate = getCurrentUTCDate();
      saleClosed = currentDate < saleDate;

      console.log("Fetched Data:", { totalSoldTokens, percentageCompleted, numberOfSupporters, remainingTokens, totalRaisedERG, soldPercent });
      
      // Set up the input event listener
      const input = document.getElementById('quantity');
      input.addEventListener('input', function() {
          if (parseFloat(input.value) > ergLimit) {
              ergAmount = input.value = ergLimit;
          }
      });

    } catch (error) {
      console.error("Error fetching presale data:", error);
      showCustomToast('Failed to fetch presale data', 1500, 'error');
    } finally {
      loading = false; // Ensure loading is set to false in the end
    }
  });

  async function handleContribute() {
    const selectedWalletErgo = get(selected_wallet_ergo);

    if (!isWalletConected()) {
      showCustomToast('Connect a wallet.', 1500, 'info');
      return;
    }

    let myAddress, height, utxos;
    unsignedTx = null;

    if (selectedWalletErgo != 'ergopay') {
      myAddress = await ergo.get_change_address();
      utxos = await fetchBoxes(connected_wallet_address);
      height = await ergo.get_current_height();
    } else {
      myAddress = get(connected_wallet_address);
      utxos = await fetchBoxes(connected_wallet_address);
      height = await getBlockHeight();                  
    }

    try {
      let unsigned = await contributeTx(myAddress, utxos, height, ergAmount);

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
        // Handle user rejection
      } else {
        showCustomToast(`Failed to submit TX.`, 5000, 'danger');
      }
    }
  }
</script>

{#if loading}
<div class="loading-holder">
  <Loading />
</div>
{:else}
<div class="h-full flex flex-col grow main-page">
  <div class="container top-margin text-custom-light mb-5">
    <br>
    <h1 class="section-title text-4xl font-bold text-center pt-2 mb-4">Presale</h1>
    <br>
    <div class="staker-sale">
      <div class="sale-container">
        <div class="sale-form">
          <h2 class="font-bold">Mew</h2>
          <h3>Contribution</h3>
          <br>    
          <div class="input-group">
            <input id="quantity" type="number" max="{ergLimit}" bind:value={ergAmount} />
            <span class="currency">ERG</span>
            <span class="usd-amount"> (~${usdAmount} USD)</span>
          </div>
          
          <div class="input-group">
            <input type="number" disabled bind:value={mewAmount} />
            <span class="currency">MEW</span>
          </div>

          <span class="mb-3">Buy Limit: {nFormatter(presaleData.buylimit)} <b class="text-primary">MEW</b></span>
          
          <br>
          <br>    
          <button class="btn btn-primary w-100 btn-big" disabled={saleClosed} on:click={handleContribute}>Contribute</button>
        </div>
        
        <div class="sale-info m-0">
          <div class="info-item">
            <h4 class="text-custom-yellow">DATE</h4>
            <span>Opens <b class="text-primary">{presaleData.salestart} UTC</b></span>
          </div>
          
          <div class="info-item">
            <h4 class="text-custom-yellow">PRICE</h4>
            <span><b>1</b> <b class="text-primary">MEW</b> = <b>{presaleData?.price}</b> <b class="text-primary">ERG</b></span>
          </div>

          <div class="presale-stats">
            <h4 class="text-custom-yellow">PRESALE STATS</h4>
            <div class="stat-item">
              <span class="stat-label">Total Sold:</span>
              <span class="stat-value">{nFormatter(totalSoldTokens)} MEW</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Supporters:</span>
              <span class="stat-value">{numberOfSupporters}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Remaining:</span>
              <span class="stat-value">{nFormatter(remainingTokens)} MEW</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Raised:</span>
              <span class="stat-value">{nFormatter(totalRaisedERG)} ERG</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Progress:</span>
              <span class="stat-value">{soldPercent.toFixed(2)}%</span>
            </div>
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
.main-page {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.section-title {
  color: #ffd700; /* Adjust based on your image */
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.staker-sale {
  background-color: var(--forms-bg); /* Adjust background color */
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.sale-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (min-width: 768px) {
    flex-direction: row; /* Make it horizontal on larger screens */
  }
}

.sale-form, .sale-info {
  flex: 1;
  border-radius: 8px;
  padding: 20px;
}

.sale-form h2, .sale-form h3 {
  color: #ffffff;
  margin-bottom: 10px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  background-color: #444444; /* Adjust input background color */
  border: 1px solid #555555;
  border-radius: 5px;
  color: #ffffff;
}

.currency, .usd-amount {
  color: #aaaaaa;
  font-size: 0.9em;
}

.btn {
  width: 100%;
  padding: 12px;
  background-color: #ffd700; /* Adjust button color */
  color: #1a1a1a;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #ffed4a; /* Hover effect */
}

.btn:disabled {
  background-color: #888888;
  cursor: not-allowed;
}

.info-item {
  margin-bottom: 20px;
}

.info-item h4 {
  color: #ffd700; /* Adjust heading color */
  margin-bottom: 5px;
}

.info-item span {
  color: #ffffff;
}

.text-primary {
  color: #ffd700; /* Adjust primary text color */
}

.presale-stats {
  margin-top: 20px;
}

.presale-stats h4 {
  margin-bottom: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 8px;
  border-radius: 5px;
}

.stat-label {
  color: #aaaaaa;
}

.stat-value {
  color: #ffffff;
  font-weight: bold;
}

.loading-holder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
