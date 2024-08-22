<script lang="ts">
  import MyOrders from "$lib/components/main/MyOrders.svelte";
  import { TOKEN_DECIMALS, TOKEN_ID, TOKEN_NAME, CONTRACT, CONTRACT_CRC32, API_HOST } from '$lib/common/const.js';
  import { offers, selected_wallet_ergo, connected_wallet_address, mewTier } from "$lib/store/store";
  import { nFormatter, showCustomToast, getConnectedWalletAddress, isWalletConected, getCommonBoxIds } from '$lib/utils/utils.js';
  import { get } from 'svelte/store';
  import { stakeTx } from '$lib/contract/stakeTx.ts';
  import { ErgoAddress } from "@fleet-sdk/core";
  import { fetchBoxes, getBlockHeight, fetchContractBoxFromTx, updateTempBoxes } from '$lib/api-explorer/explorer.ts';
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

  function toggleModal() {
    showModal = !showModal;
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

  $: connected_wallet_address.subscribe(async (value) => {
    if (value == '') {
      walletConnected = false;
    } else {
      walletConnected = true;

      let stakeData = (await axios.get(`${API_HOST}mew/getStakes?contract=${CONTRACT_CRC32}&staker=${get(connected_wallet_address)}&status=Stake`)).data.items;

      const totalValue = stakeData.reduce((sum, item) => sum + parseInt(item.stakeamount), 0);

      totalStaked = new BigNumber(totalValue).dividedBy(10 ** TOKEN_DECIMALS);
    }
  });

  onMount(async () => {

  })

</script>

<div class="container p-2 p-sm-4 top-margin text-custom-light mb-5">
    <br>
    <h1 class="section-title text-4xl font-bold text-custom-cyan text-center pt-2 mb-4">Profile</h1>
  {#if walletConnected}
    <p>Current {TOKEN_NAME} tier: {$mewTier}</p>
    <p>Total {TOKEN_NAME} staked: {nFormatter(totalStaked)}</p>
    <br>

    <form class="form-group bg-purple-900 p-4 rounded-lg w-auto">
      <h1 class="font-bold text-xl mb-2 text-yellow-400">Stake</h1>
      <input style="width:100px;display:inline;" bind:value={mewAmount} type="number" class="form-control" /> {TOKEN_NAME}
      <br>
      <br>
      <button class="btn btn-primary" on:click={stake}>Stake</button>
    </form>

    <h2 class="section-title text-3xl font-bold text-white pt-2">My Stake</h2>
    <div class="offers-container my-orders">
      <MyOrders />
    </div>
  {:else}
    <br>
    <p>Please connect wallet to see your profile.</p>
  {/if}  
</div>

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
