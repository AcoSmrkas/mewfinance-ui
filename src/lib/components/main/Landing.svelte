<script lang="ts">
  import { HERO_DESCRIPTION, HERO_IMAGE, LOGO_TEXT } from '$lib/common/const.js';
  import { offers, selected_wallet_ergo, connected_wallet_address } from "$lib/store/store";
  import { nFormatter, showCustomToast, getConnectedWalletAddress, isWalletConected } from '$lib/utils/utils.js';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';

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

  onMount(() => {
    const imageWrapper = document.querySelector('.image-wrapper');
    const heroImage = document.querySelector('#hero-image');

    let starOverlays = [
      document.querySelector('#star-overlay-1'),
      document.querySelector('#star-overlay-2'),
      document.querySelector('#star-overlay-3'),
      document.querySelector('#star-overlay-4'),
      document.querySelector('#star-overlay-5'),
      document.querySelector('#star-overlay-6')
    ];

    function updateStarPosition() {
      const wrapperWidth = imageWrapper.offsetWidth;
      const imageWidth = heroImage.offsetWidth;
      const imageHeight = heroImage.offsetHeight;

      if (imageWidth == 0) return;

      // These values represent the star's position in the original image
      // Adjust these to match your image (use percentages of the original image dimensions)
      let stars = [{
          x: 42.5,
          y: 26
        },{
          x: 56.3,
          y: 30
        },{
          x: 43.1,
          y: 68
        },{
          x: 59,
          y: 71
        },{
          x: 38.8,
          y: 46
        },{
          x: 50,
          y: 33
        }
      ];

      let i = 0;
      for (const star of stars) {
        const starXPercent = star.x; // example: star is 30% from the left of the image
        const starYPercent = star.y; // example: star is 40% from the top of the image

        // Calculate the offset from the center of the wrapper
        const xOffsetPercent = ((starXPercent / 100 * imageWidth) - (imageWidth / 2)) / (wrapperWidth / 2) * 100;

        // Set CSS variables for positioning
        starOverlays[i].style.setProperty('--star-offset-x', xOffsetPercent);
        starOverlays[i].style.setProperty('--star-offset-y', starYPercent + '%');
        starOverlays[i].style.opacity = 1;

        i++;
      }
    }

    updateStarPosition();

    // Update star position on load and resize
    window.addEventListener('load', updateStarPosition);
    window.addEventListener('resize', updateStarPosition);
  });

</script>

<div class="container p-0">  
  <section class="mt-[100px] relative h-auto">
    <div class="image-wrapper relative">
      <img id="hero-image" src="hero.png" class="absolute hero-image border-b-2 border-teal-500">

      <div id="star-overlay-1" class="star-overlay">
        <a target="_new" href="https://ergexplorer.com/token/b0b312cde931c8bbdac0dac5bfd8e2c03bf4611275dc967988c8d15bd5ec20e0">
          <img src="https://i.imgur.com/jGbzNci.png" class="token-float float-start-1">
        </a>
      </div>

      <div id="star-overlay-2" class="star-overlay">
        <a target="_new" href="https://ergexplorer.com/token/01dce8a5632d19799950ff90bca3b5d0ca3ebfa8aaafd06f0cc6dd1e97150e7f">
          <img src="https://raw.githubusercontent.com/spectrum-finance/token-logos/master/logos/ergo/01dce8a5632d19799950ff90bca3b5d0ca3ebfa8aaafd06f0cc6dd1e97150e7f.svg" class="token-float float-start-2">
        </a>
      </div>

      <div id="star-overlay-3" class="star-overlay">
        <a target="_new" href="https://ergexplorer.com/token/8b08cdd5449a9592a9e79711d7d79249d7a03c535d17efaee83e216e80a44c4b">
          <img src="https://spectrum.fi/logos/ergo/8b08cdd5449a9592a9e79711d7d79249d7a03c535d17efaee83e216e80a44c4b.svg" class="token-float float-start-3">
        </a>
      </div>

      <div id="star-overlay-4" class="star-overlay">
        <a target="_new" href="https://ergexplorer.com/token/9a06d9e545a41fd51eeffc5e20d818073bf820c635e2a9d922269913e0de369d">
          <img src="https://raw.githubusercontent.com/spectrum-finance/token-logos/master/logos/ergo/9a06d9e545a41fd51eeffc5e20d818073bf820c635e2a9d922269913e0de369d.svg" class="token-float float-start-4" style="width: 40px; height: 40px;">
        </a>
      </div>

      <div id="star-overlay-5" class="star-overlay">
        <a target="_new" href="https://ergexplorer.com/token/e023c5f382b6e96fbd878f6811aac73345489032157ad5affb84aefd4956c297">
          <img src="https://raw.githubusercontent.com/spectrum-finance/token-logos/2dee6788e99d2420a41447139db9afdc4b442948/logos/ergo/token-ada.svg" class="token-float float-start-5" style="width: 40px; height: 40px;">
        </a>
      </div>

      <div id="star-overlay-6" class="star-overlay">
        <a target="_new" href="https://ergexplorer.com/token/7a51950e5f548549ec1aa63ffdc38279505b11e7e803d01bcf8347e0123c88b0">
          <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" class="token-float float-start-6" style="width: 35px; height: 35px;">
        </a>
      </div>
    </div>

    <div class="title-holder absolute left-1/2 max-w-screen-xl">
      <div class="text-center mr-auto place-self-center lg:col-span-7">
        <h1 class="z-1 text-5xl leading-[60px] tracking-tight md:text-6xl md:leading-11 xl:text-6xl xl:leading-12 text-white font-extrabold" style="font-family:'Manrope';">
          {@html LOGO_TEXT}
        </h1>
        <!--
        <p class="z-1 mb-9 mt-8 text-light lg:mb-8 md:text-lg lg:text-md py-2" style="font-family:'Azeret Mono'; ">{@html HERO_DESCRIPTION}<br></p>
        -->
      </div>
    </div>
  </section>

  <section class="relative mt-4 mb-4 p-2 p-sm-4 overflow-x-hidden">
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-4 overflow-x-hidden">
      <div class="card mb-3 flex sm:flex-col lg:flex-row overflow-x-hidden">
        <div class="card-side sm:w-full lg:w-1/2 order-2 order-md-1">
          <img src="https://i.pinimg.com/736x/3c/41/ec/3c41ecbf81b44318e045eb93ed7f0928.jpg">
          <a href="https://dex.mewfinance.com" target="_new" class="card-link card-link-left">
            <div class="card-content">
              <h2 class="card-title">Launch DEX <i class="fa-solid fa-up-right-from-square"></i></h2>
              <p class="card-description">Swap tokens on Ergo blockchain.</p>
            </div>
          </a>
        </div>
        <div class="card-side sm:w-full lg:w-1/2 p-4 order-1 order-md-2">
          <h6 class="font-bold text-2xl text-white mb-3">DEX</h6>
          <p class="text-white text-xl text-justify leading-8">Imagine a cute and playful crypto DEX where transactions happen in a vibrant, colorful world. This DEX is designed to make trading crypto fun and accessible, with easy-to-use interfaces and whimsical visuals that bring a smile to your face. Whether you're swapping tokens or staking your assets, the experience feels like a delightful adventure, combining the thrill of crypto trading with engaging environment. Perfect for both beginners and seasoned traders who want to add a touch of joy to their crypto journey!</p>
        </div>
      </div>

      <div class="card flex sm:flex-col lg:flex-row">
        <div class="card-side sm:w-full lg:w-1/2 p-4">
          <h6 class="font-bold text-2xl text-white mb-3">Mart</h6>
            <p class="text-white text-xl text-justify leading-8">Picture a cute asset trading service where every transaction feels like a charming game. The platform is filled soft pastel colors, making the experience of buying, selling, and managing your assets both fun and inviting. The user-friendly interface is designed to feel like a playful adventure, where each trade is a step on your journey. Whether you're a seasoned investor or just starting, this service adds a touch of whimsy to the world of asset trading..</p>
        </div>
        <div class="card-side sm:w-full lg:w-1/2">
          <img src="https://i.pinimg.com/originals/f8/79/28/f879280dd2ea46948fec482792070bca.png">
          <a href="https://mart.mewfinance.com" target="_new" class="card-link card-link-right">
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
  .title-holder {
    transform: translateX(-50%);
    width: 100%;
    top: 12%;
  }

  .image-wrapper {
    position: relative;
    height: 100vh; /* Adjust this to maintain aspect ratio if needed */
  }

  .hero-image {
    z-index: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    width: auto;
    max-width: none;
  }

  .star-overlay {
    position: absolute;
    z-index: 1;
    /* Adjust these percentages to match the star's position in your image */
    left: calc(50% + (var(--star-offset-x) * 1%));
    top: var(--star-offset-y);
    transform: translate(-50%, -50%); /* Center the star div */
    filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.5));
    opacity: 0;
  }

  .card-link-left {
    border-radius: unset;
  }

  .card-link-right {
    border-radius: 0 0 0.5rem 0.5rem;
  }

  @media (min-width: 576px) {
    .image-wrapper {
      height: 100vh;
    }

    .hero-image {
      height: inherit;
    }
  }

  @media (min-width: 768px) { 
    .card-link-right {      
      border-radius: 0 0 0.5rem 0;
    }
  }

  .container {
    max-width: 1200px;
    margin: auto;
  }

  .card {
    background: var(--forms-bg);
    border: unset;
  }

  .card-link {
    display: block;
    text-decoration: none;
    color: inherit;
    background-color: var(--main-color) ;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

  h6 {
    color: var(--main-color) !important;
  }

  .token-float {
    width: 50px;
    height: 50px;
  }

  .float-start-1 {
    animation: float 12s ease-in-out infinite 0s;
  }

  .float-start-2 {
      animation: float 12s ease-in-out infinite -1s;
  }

  .float-start-3 {
      animation: float 12s ease-in-out infinite -2s;
  }

  .float-start-4 {
      animation: float 12s ease-in-out infinite -3s;
  }

  .float-start-5 {
      animation: float 12s ease-in-out infinite -4s;
  }

  .float-start-6 {
      animation: float 12s ease-in-out infinite -5s;
  }

@keyframes float {
    0% {
        transform: translateY(0) rotate(0deg);
    }
    25% {
        transform: translateY(-7.5px) rotate(-6deg); /* Float up and rotate left */
    }
    50% {
        transform: translateY(-15px) rotate(6deg); /* Float up and rotate right */
    }
    75% {
        transform: translateY(-7.5px) rotate(-6deg); /* Float down and rotate left */
    }
    100% {
        transform: translateY(0) rotate(0deg); /* Float down and return to center */
    }
}
</style>

