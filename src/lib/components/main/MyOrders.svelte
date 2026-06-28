<script lang="ts">
  import { offersMy, assetsInfos, selected_wallet_ergo, connected_wallet_address } from "$lib/store/store";
  import BuyWidget from "$lib/components/common/BuyWidget.svelte";
  import { ErgoAddress } from "@fleet-sdk/core";
  import { get } from 'svelte/store';
  import { getConnectedWalletAddress } from '$lib/utils/utils.js';
  import { onMount, onDestroy } from "svelte";

  let myOrders = [];
  let connectedWalletAddress = '';
  let loadComplete = false;
  let offersLoaded = false;
  let unsubAssetsInfos;
  let unsubOffersMy;

  onMount(() => {
    unsubAssetsInfos = assetsInfos.subscribe((value) => {
      if (value.length == 0) {
        offersLoaded = false;
        loadComplete = false;
        return;
      }

      if (offersLoaded || loadComplete) return;

      offersLoaded = true;
      loadComplete = true;
    });

    // Subscribe to offers and filter for my orders
    unsubOffersMy = offersMy.subscribe(async (offers) => {
      // Clear the stale list when offers empties (e.g. on address switch /
      // disconnect) instead of early-returning, so the previous account's
      // "My Locks" no longer shows.
      if (offers.length == 0) {
        myOrders = [];
        return;
      }

      connectedWalletAddress = await getConnectedWalletAddress();

      myOrders = $offersMy.filter(offer => {
        return offer.staker === connectedWalletAddress;
      });

      loadComplete = true;
    });
  });

  onDestroy(() => {
    if (unsubAssetsInfos) unsubAssetsInfos();
    if (unsubOffersMy) unsubOffersMy();
  });
</script>

{#if loadComplete && myOrders.length > 0}
  {#each myOrders as offer}
    <BuyWidget {offer}></BuyWidget>
  {/each}
{:else}
  <p>No locked tokens found.</p>
{/if}
