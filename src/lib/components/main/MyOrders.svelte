<script lang="ts">
  import { offersMy, assetsInfos, selected_wallet_ergo, connected_wallet_address } from "$lib/store/store";
  import BuyWidget from "$lib/components/common/BuyWidget.svelte";
  import { ErgoAddress } from "@fleet-sdk/core";
  import { get } from 'svelte/store';
  import { getConnectedWalletAddress } from '$lib/utils/utils.js';

  let myOrders = [];
  let connectedWalletAddress = '';
  let loadComplete = false;
  let offersLoaded = false;

  $: assetsInfos.subscribe(async (value) => {
    if (value.length == 0) {
      offersLoaded = false;
      loadComplete = 0;
      return;
    }

    if (offersLoaded || loadComplete) return;

    offersLoaded = true;
    loadComplete = true;
   });

  // Subscribe to offers and filter for my orders
  $: offersMy.subscribe(async (offers) => {
    if (offers.length == 0) return;

    connectedWalletAddress = await getConnectedWalletAddress();
    
    myOrders = $offersMy.filter(offer => {
      return offer.staker === connectedWalletAddress;
    });

    loadComplete = true;
  });
</script>

{#if loadComplete && myOrders.length > 0}
  {#each myOrders as offer}
    <BuyWidget {offer}></BuyWidget>
  {/each}
{:else}
  <p>No staked tokens found.</p>
{/if}
