<script lang="ts">
  import MyOrders from "$lib/components/main/MyOrders.svelte";
  import { TOKEN_DECIMALS, TOKEN_ID, TOKEN_NAME, CONTRACT, CONTRACT_CRC32, API_HOST } from '$lib/common/const.js';
  import { offers, selected_wallet_ergo, connected_wallet_address, mewTier, mewStaked } from "$lib/store/store";
  import { nFormatter, showCustomToast, getConnectedWalletAddress, isWalletConected, getCommonBoxIds, clamp } from '$lib/utils/utils.js';
  import { get } from 'svelte/store';
  import { stakeTx } from '$lib/contract/stakeTx.ts';
  import { ErgoAddress } from "@fleet-sdk/core";
  import ErgopayModal from '$lib/components/common/ErgopayModal.svelte';
  import { fetchBoxes, getBlockHeight, fetchContractBoxFromTx, updateTempBoxes, fetchConfirmedBalance } from '$lib/api-explorer/explorer.ts';
  import { BigNumber } from 'bignumber.js';
  import { onMount } from "svelte";
  import axios from 'axios';

  let showModal = false;
  let connectedWalletAddress = '';
  let walletConnected = false;
  let mewAmount = 0;
  let unsignedTx = null;
  let isAuth = false;
  let showErgopayModal = false;
  let totalStaked = 0;
  let paymentTokenBalance = 0;

  function toggleModal() {
    showModal = !showModal;
  }

  async function loadBalance(wallet) {
    if (!selected_wallet_ergo || !wallet) {
      return;
    }

    const balanceData =  await fetchConfirmedBalance($connected_wallet_address);

    // Fetch balance from API
    if (!balanceData) {
      throw 'Failed to fetch balance';
    }
    
    // Find payment token
    const paymentToken = balanceData.tokens.find(token => token.tokenId === TOKEN_ID);

    if (paymentToken) {
      paymentTokenBalance = paymentToken.amount / Math.pow(10, paymentToken.decimals), paymentToken.decimals;
    } else {
      paymentTokenBalance = "0";
    }
  }


  async function stake() {
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

      unsigned = await stakeTx(
        CONTRACT,
        myAddress,
        utxos,
        height,
        TOKEN_ID,
        new BigNumber(mewAmount).times(10 ** TOKEN_DECIMALS)
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

  function setMax() {
    mewAmount = paymentTokenBalance;
  }

  $: connected_wallet_address.subscribe(async (value) => {
    if (value == '') {
      walletConnected = false;
    } else {
      walletConnected = true;
      loadBalance($selected_wallet_ergo)
    }
  });

  let tiers = [];
  onMount(async () => {
    tiers = (await axios.get(`${API_HOST}mew/getTiers`)).data.items;
    $mewTier = 5;
  });

</script>

<div class="container top-margin text-white mb-5">
    <br>
    <h1 class="section-title text-4xl font-bold text-white  text-center pt-2 mb-5">Profile</h1>
  {#if walletConnected}
    <div class="flex flex-col sm:flex-row space-x-0 sm:space-x-3 space-y-3 sm:space-y-0">
      <div class="flex-1 form-group bg-form p-3 p-md-4 rounded-lg w-auto">
          <div class="flex flex-col lg:flex-row space-x-0 lg:space-x-3 space-y-4 lg:space-y-0">
            <div class="flex-1">
              <h1 class="font-bold text-2xl mb-3 text-yellow-400">Info</h1>
              <p><b class="inline-block w-[150px]"><span class="text-primary">{TOKEN_NAME}</span> tier:</b> {$mewTier}</p>
              <p><b class="inline-block w-[150px]">Total <span class="text-primary">{TOKEN_NAME}</span> locked:</b> {nFormatter($mewStaked)}</p>
            </div>
            <div class="flex-1">
              <h1 class="font-bold text-2xl mb-3 text-yellow-400">Benefits</h1>
              <ul>
                <li><b class="inline-block w-[150px]">DEX fee:</b> {($mewTier) <= 5 ? 0.3 - 0.03 * clamp($mewTier, 0, 5) : '0'}%</li>
                <li><b class="inline-block w-[150px]">Mart sale fee:</b> {3.0 - 0.2 * clamp($mewTier, 0, 5)}%</li>
                <li><b class="inline-block w-[150px]">Mart list fee:</b> {$mewTier <= 5 ? '0.03' : '0'} <span class="text-primary font-bold">ERG</span></li>
                <li><b class="inline-block w-[150px]">Mart cancel fee:</b> {$mewTier <= 5 ? '0.01' : '0'} <span class="text-primary font-bold">ERG</span></li>
                {@html $mewTier < 4 ? '' : `<li class="benefits-list-item">Share of <b class="text-primary">Mew Mart</b>'s revenue as rewards every quarter.</li>`}
                {@html  $mewTier <= 5 ? '' : `<li class="benefits-list-item">Share of <b class="text-primary">Mew DEX</b>'s revenue as rewards every quarter</li>`}
              </ul>
            </div>
          </div>
          {#if $mewTier != 6 && tiers.length != 0}
            <div class="p-3 mt-4 border-2 border-info rounded-lg">
            <p class="mb-2"><b class="">Next <span class="text-primary">{TOKEN_NAME}</span> tier at:</b> {nFormatter(tiers[$mewTier].amount)} <span class="text-primary font-bold">{TOKEN_NAME}</span>{#if $mewTier == 5} + <a href="kitties"><span class="text-primary font-bold">Mew Kitty NFT</span></a> {/if}</p>
                          <h1 class="font-bold text-xl mb-2 text-yellow-400">Benefits</h1>
              <ul class="mb-3">
                <li><b class="inline-block w-[150px]">DEX fee:</b> {($mewTier + 1) < 5 ? 0.3 - 0.03 * clamp($mewTier + 1, 0, 5) : '0'}%</li>
                <li><b class="inline-block w-[150px]">Mart sale fee:</b> {3.0 - 0.2 * clamp(($mewTier + 1), 0, 5)}%</li>
                <li><b class="inline-block w-[150px]">Mart list fee:</b> {($mewTier + 1) < 5 ? '0.03' : '0'} <span class="text-primary font-bold">ERG</span></li>
                <li><b class="inline-block w-[150px]">Mart cancel fee:</b> {($mewTier + 1) < 5 ? '0.01' : '0'} <span class="text-primary font-bold">ERG</span></li>
                {@html $mewTier + 1 < 4 ? '' : `<li class="benefits-list-item">Share of <b class="text-primary">Mew Mart</b>'s revenue as rewards every quarter.</li>`}
                {@html  $mewTier + 1 <= 5 ? '' : `<li class="benefits-list-item">Share of <b class="text-primary">Mew DEX</b>'s revenue as rewards every quarter</li>`}
              </ul>
            <a target="_new" href="https://dex.mewfinance.com">
              <button class="btn btn-primary mx-auto block mb-2">Buy</button>
            </a>
            </div>
          {/if}
      </div>
      <div class="flex-1 form-group bg-form  p-3 p-md-4 rounded-lg w-auto" style="height: fit-content;">
      <form class="">
        <h1 class="font-bold text-2xl mb-3 text-yellow-400">Lock MEW</h1>
        <div class="form-section">
          <label class="block text-sm font-medium mb-2" for="token"><b class="text-primary">{TOKEN_NAME}</b> Amount:</label>
          <div class="p-0 flex mb-4 w-100 max-w mx-auto">
            <input id="token" bind:value={mewAmount} class="p-0 h-[50px] w-100 border-0 text-white focus-primary p-3" style="border-radius: 10px 0 0 10px" type="text" placeholder="Search by seller address...">
            <button on:click={setMax} class="justify-center h-[50px] btn btn-lg btn-primary" style="border-radius: 0 10px 10px 0 !important;" type="button">MAX</button>
          </div>
        </div>
        <button class="btn btn-primary block mx-auto" on:click={stake}>Lock</button>
      </form>
      </div>
    </div>

    <h2 class="section-title text-3xl font-bold text-white pt-2">My Locks</h2>
    <div class="offers-container my-orders">
      <MyOrders />
    </div>
  {:else}
    <br>
    <p>Please connect wallet to see your profile.</p>
  {/if}  
</div>

{#if showErgopayModal}
 <ErgopayModal bind:showErgopayModal bind:isAuth bind:unsignedTx>
   <button slot="btn">Close</button>
 </ErgopayModal>
{/if}


<style>
  .section-title {
    margin-top: 30px;
    margin-bottom: 15px;
  }

  .offers-container {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    justify-content: space-between;
    margin-bottom: 34px;
  }

  @media (min-width: 400px) {
    .offers-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 600px) {
    .offers-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 750px) {
    .offers-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 992px) {
    .offers-container {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1200px) {
    .offers-container {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  .my-orders {
    margin-top: 20px;
  }

  .all-orders {
    margin-top: 20px;
  }

  .no-orders {
    grid-column: 1 / -1;
    text-align: center;
    color: #888;
  }
</style>
