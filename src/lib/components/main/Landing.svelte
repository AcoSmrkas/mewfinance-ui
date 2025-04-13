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
    return;
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

      if (imageWidth == 0) {
        setTimeout(updateStarPosition, 500);
        return;
      };

      let stars = [{
          x: 42.5,
          y: 26
        },{
          x: 56.3,
          y: 30
        },{
          x: 42.6,
          y: 68
        },{
          x: 58,
          y: 71
        },{
          x: 38.5,
          y: 46
        },{
          x: 50,
          y: 33
        }
      ];

      let i = 0;
      for (const star of stars) {
        const starXPercent = star.x;
        const starYPercent = star.y; 

        const xOffsetPercent = ((starXPercent / 100 * imageWidth) - (imageWidth / 2)) / (wrapperWidth / 2) * 100;

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
  const partners = [
    { 
        name: 'CyberVerse', 
        logo: 'https://static.wikia.nocookie.net/cyberverse/images/5/54/Cyberverse_Logo.png', 
        url: 'https://cyberverse.io/', 
        description: 'Cyberverse is a next-gen blockchain platform focused on immersive experiences.' 
    },
    { 
        name: 'Rosen Bridge', 
        logo: 'https://rosen.tech/assets/logo/rosen-logo.svg', 
        url: 'https://rosen.tech/', 
        description: 'RosenBridge connects various blockchain networks for seamless interoperability.' 
    },
    { 
        name: 'Crooks Finance', 
        logo: 'https://crooks-fi.com/images/logo.png', 
        url: 'https://crooks-fi.com/', 
        description: 'Crooks-finance is a decentralized finance platform for secure and fast transactions.' 
    },
  { 
    name: 'ErgOne', 
    logo: 'https://www.ergone.io/img/background.png', 
    url: 'https://www.ergone.io/', 
    description: 'A unique approach to blockchain engagement. promoting and supporting the Ergo ecosystem.' 
},
{ 
  name: 'Sigmanauts', 
  logo: 'https://sigmanauts.com/img/sigmanaut-logo.png', 
  url: 'https://sigmanauts.com/', 
  description: 'Sigmanauts is a community that believes in a decentralized, open, permissionless and secure platform.' 
},
    { 
        name: 'Bober', 
        logo: 'https://bobertoken.io/img/bober.webp', 
        url: 'https://bobertoken.io/', 
        description: 'Bober is a community-driven token with unique rewards and staking features.' 
    },
    { 
        name: 'PHP', 
        logo: 'https://ergexplorer.com/images/tokens/php.png', 
        url: 'https://demurrage.fun/', 
        description: 'First Storage Rent MEME Coin.' 
    }
];

  const reviews = [
  { name: 'Kushti', content: 'Mew Finance has revolutionized my crypto trading experience. The interface is intuitive and the features are top-notch!', rating: 5 },  
  { name: 'LIFΣ OF IF₳', content: `As a creative I have always enjoyed Ergo's NFT space. The team at Mew Finance has upped the game and offers support like no other with innovation that is off the charts!`, rating: 5 },
  { name: 'Andruis', content: 'I love how easy it is to use the Mart feature. It\'s made asset trading so much more accessible for me.', rating: 4 },
  { name: 'Maverick', content: 'The DEX is incredibly fast and efficient. Mew Finance has become my go-to platform for all my crypto needs.', rating: 5 },
  { name: 'Ergone', content: 'Whether you are a beginner or a seasoned crypto enthusiast, MewFinance provides the tools needed to explore decentralized finance in a smart and efficient way. A solid option for those looking to expand their DeFi experience!', rating: 5 },

   { name: 'TheSTOPHE', content: 'MewFi is a great peer-to-peer marketplace and trading experience, wrapping great tech in a cute, fun spot. Love the sell bundle option. Looking forward to exploring escrow sales.', rating: 5 }
];
const supportedChains = [
    { name: 'Ethereum', logo: '/path/to/ethereum-logo.png' },
    { name: 'Binance Smart Chain', logo: '/path/to/bsc-logo.png' },
    { name: 'Polygon', logo: '/path/to/polygon-logo.png' },
    { name: 'Avalanche', logo: '/path/to/avalanche-logo.png' }
  ];
    document.querySelectorAll('[data-tooltip-target]').forEach(function (element) {
    const tooltipId = element.getAttribute('data-tooltip-target');
    const tooltip = document.getElementById(tooltipId);

    element.addEventListener('mouseenter', function () {
      tooltip.classList.remove('invisible');
    });

    element.addEventListener('mouseleave', function () {
      tooltip.classList.add('invisible');
    });
  });

</script>
<div class="container p-0 p-xl-0 mb-3 lg:mb-0">  
  <section class="mt-[150px] relative h-auto flex flex-col sm:flex-row">
    <div id="title-holder" class="mb-2 title-holder flex-1 space-y-3">
      <div class="text-center mr-auto place-self-center lg:col-span-7">
        <h1 class="text-5xl leading-[60px] tracking-tight md:text-6xl md:leading-11 xl:text-6xl xl:leading-12 text-white font-extrabold" style="font-family:'Manrope';">
          {@html LOGO_TEXT}
        </h1>
      </div>
      <div>
        <p class="text-light text-center mb-4 md:text-lg lg:text-md py-2" style="font-family:'Azeret Mono'; ">{@html HERO_DESCRIPTION}<br></p>
      </div>
      
       <div id="buttons-holder" class="px-4 px-md-0 flex justify-center text-center flex-col space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4">
        <a target="_new" href="/mewfinance-whitepaper-v1.pdf">
          <button class="btn btn-big btn-secondary w-[190px]">Whitepaper</button>
        </a>
        <a href="#dapps">
          <button class="btn btn-big btn-primary w-[190px]">Launch dApps</button>
        </a>
      </div>
    </div>

    <div class="image-wrapper relative flex-1">
      <img id="hero-image" src="hero.png" alt="Hero" class="hero-image">
      <div class="full-gradient">
        
      </div>
    </div>
  </section>

  <div id="dapps" class="relative top-[-30px]"></div>

  <section  class="relative mt-10 mb-4 p-2 p-md-4 max-w-6xl mx-auto">
    <!-- Content for your DEX and Mart sections -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl overflow-hidden  border border-purple-500 transform transition-transform duration-300">
        <div class="relative h-100 bg-cyan-300 flex items-center justify-center overflow-hidden">
          <div class="flex items-center justify-center w-full h-full">
            <img src="dex.png" alt="DEX" class="object-contain max-w-full max-h-full">
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-2xl font-bold text-primary mb-2">DEX</h3>
          <p class="text-white mb-4">Looking for a one-stop place to trade all Ergo native and wrapped assets with low fees, provide token liquidity, and yield farm?</p>
          <a href="https://dex.mewfinance.com" target="_new" class="btn btn-primary text-bg w-full">
            Launch DEX <i class="fa-solid fa-rocket ml-2"></i>
          </a>
        </div>
      </div>
      
      <div class="card bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl overflow-hidden  border border-purple-500 transform transition-transform duration-300">
        <div class="relative h-100 bg-primary flex items-center justify-center overflow-hidden">
          <div class="flex items-center justify-center w-full h-full">
            <img src="nftmart.png" alt="Mart" class="object-contain max-w-full max-h-full">
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-2xl font-bold text-yellow-300 mb-2">NFT Mart</h3>
          <p class="text-white mb-4">A marketplace for trading digital assets as individual or bundled packs, with support for payments in native and wrapped assets.</p>
          <a href="https://mart.mewfinance.com" target="_new" class="btn btn-primary text-bg w-full">
            Launch Mart <i class="fa-solid fa-rocket ml-2"></i>
          </a>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl overflow-hidden  border border-purple-500 transform transition-transform duration-300">
        <div class="relative h-100 bg-pink-500 flex items-center justify-center overflow-hidden">
          <div class="flex items-center justify-center w-full h-full">
            <img src="mart.png" alt="Store" class="object-contain max-w-full max-h-full">
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-2xl font-bold text-yellow-300 mb-2">Phygital Store</h3>
          <p class="text-white mb-4">A marketplace for trading phygital assets and services, with support for payments in native and wrapped assets.</p>
          <a href="https://store.mewfinance.com" target="_new" class="btn btn-primary text-bg w-full">
            Launch Store <i class="fa-solid fa-rocket ml-2"></i>
          </a>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl overflow-hidden  border border-purple-500 transform transition-transform duration-300">
        <div class="relative h-100 bg-purple-600 flex items-center justify-center overflow-hidden">
          <div class="flex items-center justify-center w-full h-full">
            <img src="bank.png" alt="Store" class="object-contain max-w-full max-h-full">
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-2xl font-bold text-yellow-300 mb-2">Bank</h3>
          <p class="text-white mb-4">A decentralized banking and DeFi interface for everything stablecoin related on the Ergo Blockchain.</p>
          <a href="https://bank.mewfinance.com" target="_new" class="btn btn-primary text-bg w-full">
            Launch Bank <i class="fa-solid fa-rocket ml-2"></i>
          </a>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl overflow-hidden  border border-purple-500 transform transition-transform duration-300">
        <div class="relative h-100 bg-green-600 flex items-center justify-center overflow-hidden">
          <div class="flex items-center justify-center w-full h-full">
            <img src="fund.png" alt="Fund" class="object-contain max-w-full max-h-full">
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-2xl font-bold text-yellow-300 mb-2">Fund</h3>
          <p class="text-white mb-4">A decentralized platform empowering projects on the Ergo Blockchain to raise funds transparently and securely.</p>
          <a href="https://fund.mewfinance.com" target="_new" class="btn btn-primary text-bg w-full">
            Launch Fund <i class="fa-solid fa-rocket ml-2"></i>
          </a>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl overflow-hidden  border border-purple-500 transform transition-transform duration-300">
        <div class="relative h-100 bg-teal-400 flex items-center justify-center overflow-hidden">
          <div class="flex items-center justify-center w-full h-full">
            <img src="bridge.png" alt="Bridge" class="object-contain max-w-full max-h-full">
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-2xl font-bold text-yellow-300 mb-2">Bridge</h3>
          <p class="text-white mb-4">The multi-chain NFT bridge! Effortlessly mint and transfer supported NFTs between Ergo and Cardano blockchains.</p>
          <a href="https://bridge.mewfinance.com" target="_new" class="btn btn-primary text-bg w-full">
            Launch Bridge <i class="fa-solid fa-rocket ml-2"></i>
          </a>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl overflow-hidden  border border-purple-500 transform transition-transform duration-300">
        <div class="relative h-100 bg-yellow-400 flex items-center justify-center overflow-hidden">
          <div class="flex items-center justify-center w-full h-full">
            <img src="trading.png" alt="Trading" class="object-contain max-w-full max-h-full">
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-2xl font-bold text-yellow-300 mb-2">Trading</h3>
          <p class="text-white mb-4">The only trading dashboard you will ever need! Track all assets and dApps on the Ergo Blockchain in one place.</p>
          <a href="https://trading.mewfinance.com" target="_new" class="btn btn-primary text-bg w-full">
            Launch Trading <i class="fa-solid fa-rocket ml-2"></i>
          </a>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl overflow-hidden  border border-purple-500 transform transition-transform duration-300">
        <div class="relative h-100 bg-[#230430] flex items-center justify-center overflow-hidden">
          <div class="flex items-center justify-center w-full h-full">
            <img src="gamblor.png" alt="Fun" class="object-contain max-w-full max-h-full">
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-2xl font-bold text-yellow-300 mb-2">Fun</h3>
          <p class="text-white mb-4">A decentralized finance platform offering blockchain-powered lottery services with secure, and fair gameplay.</p>
          <a href="https://fun.mewfinance.com" target="_new" class="btn btn-primary text-bg w-full">
            Launch Fun <i class="fa-solid fa-rocket ml-2"></i>
          </a>
        </div>
      </div>
      
      <div class="card bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl overflow-hidden  border border-purple-500 transform transition-transform duration-300">
        <div class="relative h-100 bg-green-600 flex items-center justify-center overflow-hidden">
          <div class="flex items-center justify-center w-full h-full">
            <img src="santa.png" alt="Santa" class="object-contain max-w-full max-h-full">
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-2xl font-bold text-primary mb-2">Ergosanta</h3>
          <p class="text-white mb-4">Santa has embraced the digital age, and with the magic of proof of work, checking his list twice is a thing of the past.</p>
          <a href="https://santa.mewfinance.com" target="_new" class="btn btn-primary text-bg w-full">
            Launch Ergosanta <i class="fa-solid fa-rocket ml-2"></i>
          </a>
        </div>
      </div>
      <div class="card bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl overflow-hidden  border border-purple-500 transform transition-transform duration-300">
        <div class="relative h-100 bg-blue-600 flex items-center justify-center overflow-hidden">
          <div class="flex items-center justify-center w-full h-full">
            <div class="object-contain max-w-full max-h-full py-5">
              <img src="tools_gatos_erg.png" alt="Fund" class="object-contain max-w-full max-h-full">
            </div>
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-2xl font-bold text-primary mb-2">Ergo Tools</h3>
          <p class="text-white mb-4">An essential toolkit for your wallet: mint, burn, airdrop, and consolidate with ease.</p>
          <a href="https://tools.mewfinance.com" target="_new" class="btn btn-primary text-bg w-full">
            Launch Ergo Tools <i class="fa-solid fa-rocket ml-2"></i>
          </a>
        </div>
      </div>
      <div class="card bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl overflow-hidden  border border-purple-500 transform transition-transform duration-300">
        <div class="relative h-100 bg-orange-500 flex items-center justify-center overflow-hidden">
          <div class="flex items-center justify-center w-full h-full">
            <div class="object-contain max-w-full max-h-full py-5">
              <img src="tools_gatos_ada.png" alt="Fund" class="object-contain max-w-full max-h-full">
            </div>
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-2xl font-bold text-primary mb-2">Cardano Tools</h3>
          <p class="text-white mb-4">An essential toolkit for your Cardano wallet: mint and airdrop with ease.</p>
          <a href="https://ctools.mewfinance.com" target="_new" class="btn btn-primary text-bg w-full">
            Launch Cardano Tools <i class="fa-solid fa-rocket ml-2"></i>
          </a>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Partners Section -->
  <section class="partners mt-10 p-2 p-md-4">
    <h2 class="text-3xl font-bold text-center text-white mb-8">Our partners</h2>
    <div class="partners-container">
      {#each partners as partner}
        <div class="partner-logo p-4">
          <a target="_new" href={partner.url} class="block text-center space-y-4">
            <div class="h-[100px] align-content-center">
              <img src={partner.logo} alt={partner.name} class="w-full h-auto">
            </div>
            <h3 class="font-semibold">{partner.name}</h3>
          </a>
        </div>
      {/each}
    </div>
  </section>

  <!-- User Reviews Section -->
 <!-- User Reviews Section -->
<section class="user-reviews mt-7 p-2 p-md-4">
  <h2 class="text-3xl font-bold text-center text-white mb-8">What our users say</h2>
  <div class="reviews-container">
    {#each reviews as review}
      <div class="review-card p-6 rounded-lg" style="background: var(--forms-bg);">
        <div class="flex items-center mb-4">
          <div>
            <h3 class="font-semibold">{review.name}</h3>
            <div class="flex">
              {#each Array(5) as _, i}
                <span class="text-yellow-400">{i < review.rating ? '★' : '☆'}</span>
              {/each}
            </div>
          </div>
        </div>
        <p class="text-gray-300">{review.content}</p>
      </div>
    {/each}
  </div>
</section>
</div>

<style>
  .text-main-color {
  color: var(--main-color); /* Use the variable for text color */
}
/* General card styling */
.card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.card img {
  max-width: 100%;
  height: auto;
}

/* Tooltip styling */
.tooltip-container {
  position: relative;
}

.tooltip-icon {
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;
}

.tooltip-content {
  display: none;
  white-space: nowrap;
  z-index: 20;
  top: -10px; /* Adjust as needed */
  right: 0;
  width: 300px; /* Adjust width as needed */
}

.tooltip-container .tooltip-icon:focus + .tooltip-content,
.tooltip-container .tooltip-icon:hover + .tooltip-content {
  display: block;
}

/* Responsive adjustments */
@media (min-width: 1024px) {
  .card {
    display: flex;
  }
  
  .card-side {
    padding: 16px;
  }
  
  .card-side img {
    max-width: 150px;
  }
}



  .partner-logo {
    display: flex;
    align-items: center;
    flex-direction: column; /* Stack image and text vertically */
    padding: 10px; /* Reduced padding around the logos */
    background-color: var(--forms-bg); /* Light gray background for each logo */
    border-radius: 8px; /* Rounded corners for each logo container */
    transition: transform 0.1s ease;
    max-width: 150px; /* Set a maximum width for the logo containers */
}

.partner-logo img {
    max-width: 100px; /* Limit the image size */
    height: auto; /* Maintain aspect ratio */
    margin-bottom: 8px; /* Add space between the image and the text */
}

.partners-container {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 16px; /* Add some padding to the bottom to prevent the scrollbar from overlapping content */
    scroll-snap-type: x mandatory;
    gap: 16px; /* Adjust the gap between the partner logos */
}

.partner-logo {
    flex: 0 0 auto;
    scroll-snap-align: center;
    text-align: center; /* Center-align text below the image */
    font-size: 14px; /* Adjust font size if needed */
}
.reviews-container {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 16px; /* Gap between each card */
    padding-bottom: 16px; /* Padding to avoid scrollbar overlap */
  }

  .review-card {
    flex: 0 0 auto;
    scroll-snap-align: center;
    width: 100%;
    max-width: 300px; /* Maximum width of each card */
  }

  @media (min-width: 1024px) {
    .reviews-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr); /* Display 4 cards in a row */
      gap: 24px; /* Adjust gap between review cards */
      overflow-x: hidden; /* Disable horizontal scrolling on larger screens */
    }

    .review-card {
      flex: 1 0 21%; /* Adjust width for responsive layout */
      max-width: none; /* Remove max-width restriction */
    }
  }

  @media (min-width: 1024px) {
    .partners-container, .reviews-container {
      overflow-x: hidden; /* Hide overflow on larger screens */
      flex-wrap: wrap; /* Allow wrapping on larger screens */
    }

    .partner-logo, .review-card {
      flex: 1 0 21%; /* Display items in a row with wrapping */
    }
  }
  .star-overlay {
    position: absolute;
    z-index: 2;
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
    transition: all 0.2s ease;
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
    color: #0c0a18;
    margin-bottom: 10px;
  }

  .card-description {
    font-size: 1rem;
    color: #0c0a18;
  }

  .card-link:hover {
    background-color: var(--info-color);
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
        transform: translateY(-10px) rotate(-6deg); /* Float up and rotate left */
    }
    50% {
        transform: translateY(-20px) rotate(6deg); /* Float up and rotate right */
    }
    75% {
        transform: translateY(-10px) rotate(-6deg); /* Float down and rotate left */
    }
    100% {
        transform: translateY(0) rotate(0deg); /* Float down and return to center */
    }
  }

  .full-gradient {
    z-index: 0;
    position: absolute;
    left: -500%;
    width: 1000%;
    top: -20px;
    height: inherit;
    background: rgb(0,0,0);
    background: linear-gradient(0deg, rgba(0,0,0,0.1) 0%, rgba(159,4,255,0.2) 20%, rgba(159,4,255,0.2) 40%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0) 100%); 
  }


  .title-holder {
    align-self: center;
  }

  .image-wrapper {
    position: relative;
    height: 500px;
  }

   #title-holder {
    z-index: 5;
    position: relative;
  }

  .hero-image {
    z-index: 4;
    position: relative;
    left: 0;
    height: 100%;
    width: auto;
    max-width: 100%;
  }

  @media (min-width: 1024px) {
    .hero-image {
      max-width: 200%;
      left: -100px !important;
    }
  }

  @media (min-width: 1240px) {
    .hero-image {
      max-width: 200%;
      left: -100px !important;
    }
  }

  @media (min-width: 640px) {
    .hero-image {
      max-width: 200%;
      left: -200px;
    }
  }

  @media (min-width: 640px) {
    .hero-image {
      max-width: 200%;
      left: -200px;
    }
  }

</style>

