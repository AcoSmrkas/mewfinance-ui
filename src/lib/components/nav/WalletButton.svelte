<script lang="ts">
  import { get } from 'svelte/store';
  import { selected_wallet_ergo, connected_wallet_address, mewTier } from '$lib/store/store.ts';
  import WalletsModal from '$lib/components/common/WalletsModal.svelte';
  import ErgopayModal from '$lib/components/common/ErgopayModal.svelte';
  import Tooltip from '$lib/components/common/Tooltip.svelte'; // Import the Tooltip component
  import { connectErgoWallet, disconnectErgoWallet } from '$lib/common/wallet.js';
  import { fetchConfirmedBalance } from '$lib/api-explorer/explorer.ts';
  import { TOKEN_ID, TOKEN_DECIMALS, TOKEN_NAME } from '$lib/common/const.js';
  import { nFormatter, showCustomToast, truncateAddress, isMobileDevice } from '$lib/utils/utils.js';

  let showWalletsModal = false;
  let showErgopayModal = false;
  let qrCodeText = false;
  let isAuth = false;
  let balanceInNanoErg = '0';
  let balanceErg = '0.00';
  let paymentTokenBalance = '0.00';
  let truncatedAddress = "";
  let showTooltip = false;

  async function clickOnNautilusButton() {
    showWalletsModal = false;
    if ($selected_wallet_ergo) {
      await disconnectErgoWallet();
      balanceErg = '0.00';
      paymentTokenBalance = '0.00';
      truncatedAddress = "";
    } else {
      await connectErgoWallet('nautilus');
    }
  }

  async function clickOnErgopayButton() {
    showWalletsModal = false;
    if ($selected_wallet_ergo) {
      await disconnectErgoWallet();
      balanceErg = '0.00';
      paymentTokenBalance = '0.00';
      truncatedAddress = "";
    } else {
      isAuth = true;
      showErgopayModal = true;
    }
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
    
    balanceInNanoErg = balanceData.nanoErgs;
    balanceErg = (+balanceInNanoErg / 10 ** 9).toFixed(9);

    const address = $connected_wallet_address;
    truncatedAddress = address.substr(0, 6) + '...' + address.substr(address.length - 4);

    // Find payment token
    const paymentToken = balanceData.tokens.find(token => token.tokenId === TOKEN_ID);
    
    if (paymentToken) {
      paymentTokenBalance = nFormatter(paymentToken.amount / Math.pow(10, paymentToken.decimals), paymentToken.decimals);
    } else {
      paymentTokenBalance = '0.0';
    }
  }

  $: loadBalance($selected_wallet_ergo);

  function toggleTooltip(e) {
    showTooltip = !showTooltip;

    if (showTooltip) {
      loadBalance($selected_wallet_ergo, $connected_wallet_address);
    }

    e.stopPropagation();
  }

  document.addEventListener('click', function(event) {
    if (showTooltip) {
      showTooltip = false;
    }
});

</script>

<style>
  .wallet-button {
    position: relative;
    display: flex;
    align-items: center;
  }

  .wallet-button button {
    margin-left: 13px;
    margin-right: -2px;
  }

  .wallet-button .toggle-tooltip-button {
    padding: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wallet-button .toggle-tooltip-button svg {
    width: 24px;
    height: 24px;
  }

  .info-icon-fill {
    fill: var(--background);
  }

  .install-naut:hover {
    color: #000 !important;
  }
</style>

<div class="wallet-button gap-x-2">
  <Tooltip show={showTooltip} message={$selected_wallet_ergo ? `<b style="color: var(--main-color); display:inline-block; width:100px;">Connection:</b> ${get(selected_wallet_ergo).charAt(0).toUpperCase() + get(selected_wallet_ergo).slice(1).toLowerCase()}\n<b style="color: var(--main-color); display:inline-block; width:100px;">Address:</b> ${truncatedAddress} \n <b style="color: var(--main-color); display:inline-block; width:100px;">ERG:</b> ${nFormatter(balanceErg, 9)}\n <b style="color: var(--main-color); display:inline-block;width:100px;">${TOKEN_NAME}:</b> ${paymentTokenBalance}\n <b style="color: var(--main-color); display:inline-block;width:100px;">${TOKEN_NAME} Tier: </b>${$mewTier}`
                                      : "Connect your wallet to view details."}>
{#if $selected_wallet_ergo}
  <button class="btn btn-secondary" style="text-wrap: nowrap;" on:click={clickOnNautilusButton}>
    Disconnect  <i class="fa-solid fa-wallet"></i>
  </button>
{:else}
  <button class="btn btn-primary" style="text-wrap: nowrap;" on:click={() => (showWalletsModal = true)}>
    Connect  <i class="fa-solid fa-wallet"></i>
  </button>
{/if}
  </Tooltip>
    <button class="toggle-tooltip-button btn btn-info" on:click={toggleTooltip}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9ZM12 20.5C13.784 20.5 15.4397 19.9504 16.8069 19.0112C17.4108 18.5964 17.6688 17.8062 17.3178 17.1632C16.59 15.8303 15.0902 15 11.9999 15C8.90969 15 7.40997 15.8302 6.68214 17.1632C6.33105 17.8062 6.5891 18.5963 7.19296 19.0111C8.56018 19.9503 10.2159 20.5 12 20.5Z" fill="#160d25"></path> </g></svg>   </button>
</div>

{#if showWalletsModal}
  <WalletsModal bind:showWalletsModal>
    <div class="w-52 h-52">
      <div class="leading-6 pb-2 text-white w-100 text-center font-bold" style="font-family:'Manrope';font-size:1.5em;">Select Wallet</div>
      <div class="w-full mt-6 mb-4">
        {#if !isMobileDevice() && (!window.ergoConnector || !window.ergoConnector['nautilus'])}
          <a
            href="https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai"
            target="blank_"
            style="height: 50px;text-wrap:nowrap;"
            class="w-full flex justify-center items-center btn btn-primary mb-3 install-naut"
          >
            <img style="height: 1.4em; width: 1.4em;" src="/wallets/nautilus.svg" alt="" />
            <div> Install Nautilus</div>
          </a>
        {:else if !isMobileDevice()}
          <button
            on:click={clickOnNautilusButton}
            class:grayscale={!window.ergoConnector['nautilus']}
            class="w-full flex justify-center items-center btn btn-primary mb-3"
          >

            <img style="height: 1.4em; width: 1.4em;" src="/wallets/nautilus.svg" alt="" />
            <div class="flex justify-center">
              {#if $selected_wallet_ergo == 'nautilus'}
                Disconnect
              {/if}
               Nautilus
            </div>
          </button>          
        {/if}
          <button 
           on:click={clickOnErgopayButton}
          class="w-full flex justify-center items-center btn btn-primary mb-3"
          >

            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" focusable="false" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3.25-3H6.75V4h10.5v14z"></path></svg>
            <div class="flex justify-center">
              {#if $selected_wallet_ergo == 'ergopay'}
                Disconnect
              {/if}
               Ergopay
            </div>
          </button>
      </div>
    </div>
    <button slot="btn">Close</button>
  </WalletsModal>
{/if}

{#if showErgopayModal}
  <ErgopayModal bind:showErgopayModal bind:qrCodeText bind:isAuth>
    <button slot="btn">Close</button>
  </ErgopayModal>
{/if}
