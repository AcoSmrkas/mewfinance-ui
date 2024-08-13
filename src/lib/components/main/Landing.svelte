<script lang="ts">
  import { HERO_DESCRIPTION, HERO_IMAGE, LOGO_TEXT } from '$lib/common/const.js';
  import { offers, selected_wallet_ergo, connected_wallet_address } from "$lib/store/store";
  import { nFormatter, showCustomToast, getConnectedWalletAddress, isWalletConected } from '$lib/utils/utils.js';
  import { get } from 'svelte/store';

  let showModal = false;
  let connectedWalletAddress = '';
  let walletConnected = false;

  function toggleModal() {
    showModal = !showModal;
  }

  $: connected_wallet_address.subscribe((value) => {
    if (value == '') {
      walletConnected = false;
    } else {
      walletConnected = true;
    }
  });

</script>

<div class="container p-0">  
  <section class="mt-[200px] relative h-[400px]" style="background: var(--footer);">
    <img src="hero.png" class="absolute hero-image">
    <div class="relative max-w-screen-xl px-2 px-sm-4 pt-2 pb-5 mb-5 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:pt-28">
      <div class="text-center mr-auto place-self-center lg:col-span-7">
        <h1 class="z-1 mt-4 text-5xl leading-[60px] tracking-tight md:text-6xl md:leading-11 xl:text-6xl xl:leading-12 text-white font-bold" style="font-family:'Manrope';">
          {@html LOGO_TEXT}
        </h1>
        <p class="z-1 mb-9 mt-8 text-light lg:mb-8 md:text-lg lg:text-md py-2" style="font-family:'Azeret Mono'; ">{@html HERO_DESCRIPTION}<br></p>
      </div>
  </div>
  </section>

  <section class="relative mt-5 mb-5 p-4">
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-4">
      <div class="card">
        <div class="card-side">
          <img src="https://i.pinimg.com/736x/3c/41/ec/3c41ecbf81b44318e045eb93ed7f0928.jpg">
          <a href="https://dex.mewfinance.com" target="_new" class="card-link">
            <div class="card-content">
              <h2 class="card-title">Launch DEX <i class="fa-solid fa-up-right-from-square"></i></h2>
              <p class="card-description">Swap tokens on Ergo blockchain.</p>
            </div>
          </a>
        </div>
        <div class="card-side p-4">
          <h6 class="font-bold text-2xl text-white mb-3">Heading</h6>
          <p class="text-white text-xl text-justify leading-8">Imagine a cute and playful crypto DEX (Decentralized Exchange) where transactions happen in a vibrant, colorful world filled with adorable mascots and charming animations. This DEX is designed to make trading crypto fun and accessible, with easy-to-use interfaces and whimsical visuals that bring a smile to your face. Whether you're swapping tokens or staking your assets, the experience feels like a delightful adventure, combining the thrill of crypto trading with a light-hearted, engaging environment. Perfect for both beginners and seasoned traders who want to add a touch of joy to their crypto journey!</p>
        </div>
      </div>
      <div class="card">
        <div class="card-side p-4">
          <h6 class="font-bold text-2xl text-white mb-3">Heading</h6>
            <p class="text-white text-xl text-justify leading-8">Picture a cute asset trading service where every transaction feels like a charming game. The platform is filled with delightful characters and soft pastel colors, making the experience of buying, selling, and managing your assets both fun and inviting. The user-friendly interface is designed to feel like a playful adventure, where each trade is a step on your journey, guided by friendly mascots. Whether you're a seasoned investor or just starting, this service adds a touch of whimsy to the world of asset trading, making it a joyful experience for everyone.</p>
        </div>
        <div class="card-side">
          <img src="https://i.pinimg.com/originals/f8/79/28/f879280dd2ea46948fec482792070bca.png">
          <a href="https://mart.mewfinance.com" target="_new" class="card-link">
            <div class="card-content">
              <h2 class="card-title">Launch Mart <i class="fa-solid fa-up-right-from-square"></i></h2>
              <p class="card-description">Trade assets on Ergo blockchain.</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .hero-image {
    width: 65%;
    bottom: -13px;
    z-index: 0;
    left: 50%;    
    transform: translateX(-50%);
    margin: 0 auto;
  }

  .container {
    max-width: 1200px;
    margin: auto;
  }

  .card {
    background: var(--forms-bg);
    display: flex;
    flex-direction: row;
  }

  .card-link {
    display: block;
    text-decoration: none;
    color: inherit;
    background-color: var(--main-color) ; /* Dark background for the card */
    border-radius: 0 0 0.5rem 0.5rem; /* Rounded corners */
    overflow: hidden; /* Ensure content doesn't spill out */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add shadow */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    transition: all 0.3s ease;
  }

  .card-content {
    padding: 20px;
    text-align: center;
  }

  .card-side {
    display: flex;
    flex-direction: column;
    width: 50%;
  }

  .card-img {

  }

  .card-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #000000;
    margin-bottom: 10px;
  }

  .card-description {
    font-size: 1rem;
    color: #000000;
  }

  .card-link:hover {
    background-color: #fff;
    transform: translateY(-3px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
</style>

