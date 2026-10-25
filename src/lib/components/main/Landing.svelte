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
        name: 'Rosen Bridge',
        logo: 'https://rosen.tech/assets/logo/rosen-logo.svg',
        url: 'https://rosen.tech/',
        description: 'RosenBridge connects various blockchain networks for seamless interoperability.'
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
        name: 'PHP', 
        logo: 'https://ergexplorer.com/images/tokens/php.png', 
        url: 'https://demurrage.fun/', 
        description: 'First Storage Rent MEME Coin.' 
    }
];

  const goals = [
    { icon: 'fa-right-left', title: 'Swap tokens', text: 'Trade ERG and Ergo tokens.', cta: 'Open DEX', href: 'https://dex.mewfinance.com/ergo/swap', external: true },
    { icon: 'fa-dollar-sign', title: 'Use SigUSD', text: 'Get or redeem the Ergo stablecoin.', cta: 'Open Bank', href: 'https://bank.mewfinance.com/stablecoins', external: true },
    { icon: 'fa-chart-line', title: 'Track your assets', text: 'Prices, trades and your wallet in one place.', cta: 'Open Trading', href: 'https://trading.mewfinance.com', external: true },
    { icon: 'fa-rocket', title: 'Run a project', text: 'Raise funds, lock tokens, mint and airdrop.', cta: 'See project apps', href: '#projects', external: false }
  ];

  const appGroups = [
    {
      id: 'trade', title: 'Trade',
      apps: [
        { name: 'DEX', text: 'Swap tokens, add liquidity and farm.', url: 'https://dex.mewfinance.com', img: 'dex.png', bg: 'bg-cyan-500' },
        { name: 'Trading', text: 'Token prices, trades and DEX stats.', url: 'https://trading.mewfinance.com', img: 'trading.png', bg: 'bg-indigo-400' },
        { name: 'NFT Mart', text: 'Buy and sell tokens and NFTs, one by one or in packs.', url: 'https://mart.mewfinance.com', img: 'nftmart.png', bg: 'bg-yellow-500' }
      ]
    },
    {
      id: 'stablecoins', title: 'Stablecoins & loans',
      apps: [
        { name: 'Bank', text: 'SigUSD and other stablecoins on Ergo.', url: 'https://bank.mewfinance.com', img: 'bank.png', bg: 'bg-purple-900' },
        { name: 'Lend', text: 'Borrow against your tokens, or lend and earn interest.', url: 'https://lend.mewfinance.com', icon: 'fa-hand-holding-dollar', bg: 'bg-sky-700' }
      ]
    },
    {
      id: 'projects', title: 'For projects',
      apps: [
        { name: 'Fund', text: 'Raise funds for a project, or back one.', url: 'https://fund.mewfinance.com', img: 'fund.png', bg: 'bg-green-600' },
        { name: 'Lock', text: 'Lock ERG and tokens until a set time.', url: 'https://lock.mewfinance.com', icon: 'fa-lock', bg: 'bg-orange-700' },
        { name: 'Burn', text: 'Burn tokens and see every burn, with campaigns.', url: 'https://burn.mewfinance.com', icon: 'fa-fire', bg: 'bg-red-700' },
        { name: 'Ergo Tools', text: 'Mint, burn, airdrop and consolidate.', url: 'https://tools.mewfinance.com', img: 'tools_gatos_erg.png', bg: 'bg-blue-500' },
        { name: 'Cardano Tools', text: 'Mint and airdrop on Cardano.', url: 'https://ctools.mewfinance.com', img: 'tools_gatos_ada.png', bg: 'bg-orange-400' }
      ]
    },
    {
      id: 'shop', title: 'Shop & pay',
      apps: [
        { name: 'Phygital Store', text: 'Merch and items, paid in ERG or tokens.', url: 'https://store.mewfinance.com', img: 'mart.png', bg: 'bg-pink-600' },
        { name: 'Payments', text: 'Create ERG and token payment requests.', url: 'https://payment.mewfinance.com', icon: 'fa-cash-register', bg: 'bg-purple-700' }
      ]
    },
    {
      id: 'more', title: 'More',
      apps: [
        { name: 'Bridge', text: 'Move supported NFTs between Ergo and Cardano.', url: 'https://bridge.mewfinance.com', img: 'bridge.png', bg: 'bg-teal-400' },
        { name: 'Ergosanta', text: "Santa's list, checked by proof of work.", url: 'https://santa.mewfinance.com', img: 'santa.png', bg: 'bg-green-600' }
      ]
    }
  ];

  const reviews = [
  { name: 'Kushti', content: 'Mew Finance has revolutionized my crypto trading experience. The interface is intuitive and the features are top-notch!', rating: 5 },  
  { name: 'LIFΣ OF IF₳', content: `As a creative I have always enjoyed Ergo's NFT space. The team at Mew Finance has upped the game and offers support like no other with innovation that is off the charts!`, rating: 5 },
  { name: 'Andruis', content: 'I love how easy it is to use the Mart feature. It\'s made asset trading so much more accessible for me.', rating: 4 },
  { name: 'Maverick', content: 'The DEX is incredibly fast and efficient. Mew Finance has become my go-to platform for all my crypto needs.', rating: 5 },
  { name: 'ErgOne', content: 'Whether you are a beginner or a seasoned crypto enthusiast, MewFinance provides the tools needed to explore decentralized finance in a smart and efficient way. A solid option for those looking to expand their DeFi experience!', rating: 5 },

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

  <section class="goals relative mt-10 p-2 p-md-4 max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold text-center text-white mb-6">What do you want to do?</h2>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each goals as goal}
        <a class="goal-card" href={goal.href} target={goal.external ? '_blank' : undefined} rel={goal.external ? 'noopener noreferrer' : undefined}>
          <i class="fa-solid {goal.icon} goal-icon"></i>
          <span class="goal-title">{goal.title}</span>
          <span class="goal-text">{goal.text}</span>
          <span class="goal-cta">{goal.cta} <i class="fa-solid fa-arrow-right ml-1"></i></span>
        </a>
      {/each}
    </div>
  </section>

  <div id="dapps" class="relative top-[-90px]"></div>

  <section class="relative mt-12 mb-4 p-2 p-md-4 max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold text-center text-white mb-4">All apps</h2>
    <nav class="group-chips mb-6" aria-label="App groups">
      {#each appGroups as group}
        <a class="group-chip" href={'#' + group.id}>{group.title}</a>
      {/each}
    </nav>

    {#each appGroups as group}
      <div id={group.id} class="app-group">
        <h3 class="app-group-title">{group.title}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each group.apps as app}
            <a class="app-card" href={app.url} target="_blank" rel="noopener noreferrer">
              <span class="app-thumb {app.bg}" class:no-art={!app.img}>
                {#if app.img}
                  <img src={app.img} alt="" loading="lazy">
                {:else}
                  <i class="fa-solid fa-paw paw paw-1"></i>
                  <i class="fa-solid fa-paw paw paw-2"></i>
                  <span class="icon-badge"><i class="fa-solid {app.icon}"></i></span>
                {/if}
              </span>
              <span class="app-body">
                <span class="app-name">{app.name}</span>
                <span class="app-text">{app.text}</span>
              </span>
            </a>
          {/each}
        </div>
      </div>
    {/each}

    <p class="guard-note">
      <i class="fa-solid fa-shield-halved mr-2"></i>
      <b>Mew Guard</b> keeps a Telegram group open only to holders of your token.
      <a href="https://t.me/MewFinance" target="_blank" rel="noopener noreferrer">Ask us on Telegram</a>
    </p>
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
.goal-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px;
  border-radius: 12px;
  background: var(--forms-bg);
  border: 1px solid var(--borders);
  color: var(--text-strong);
  text-decoration: none;
  transition: border-color 0.15s, transform 0.15s;
}

.goal-card:hover {
  border-color: var(--main-color);
  transform: translateY(-2px);
}

.goal-icon {
  font-size: 1.5rem;
  color: var(--main-color);
}

.goal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
}

.goal-text {
  font-size: 0.9rem;
  color: var(--text-light);
  flex-grow: 1;
}

.goal-cta {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--main-color);
}

.group-chips {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.group-chip {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--borders);
  color: var(--text-strong);
  font-size: 0.9rem;
  text-decoration: none;
  white-space: nowrap;
}

.group-chip:hover {
  border-color: var(--main-color);
  color: var(--main-color);
}

.app-group {
  margin-bottom: 28px;
  scroll-margin-top: 90px;
}

.app-group-title {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-light);
  margin-bottom: 10px;
}

.app-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: var(--forms-bg);
  border: 1px solid var(--borders);
  text-decoration: none;
  transition: border-color 0.15s, transform 0.15s;
}

.app-card:hover {
  border-color: var(--main-color);
  transform: translateY(-2px);
}

.app-thumb {
  width: 100%;
  aspect-ratio: 1.45;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 5rem;
}

.app-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.no-art {
  position: relative;
  background-image:
    radial-gradient(circle at 28% 22%, rgba(255, 255, 255, 0.28), transparent 42%),
    radial-gradient(circle at 78% 85%, rgba(159, 4, 255, 0.45), transparent 55%);
}

.no-art::before {
  content: '';
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  top: 0;
  left: 0;
  background: #fff;
  box-shadow:
    40px 30px 0 0 rgba(255, 255, 255, 0.9), 120px 60px 0 1px rgba(255, 255, 255, 0.7),
    300px 40px 0 0 rgba(255, 255, 255, 0.8), 260px 150px 0 1px rgba(255, 255, 255, 0.6),
    60px 180px 0 0 rgba(255, 255, 255, 0.7), 320px 200px 0 1px rgba(255, 255, 255, 0.8),
    180px 25px 0 0 rgba(255, 255, 255, 0.6), 30px 110px 0 1px rgba(255, 255, 255, 0.5);
}

.paw {
  position: absolute;
  color: rgba(255, 255, 255, 0.14);
  font-size: 2.2rem;
}

.paw-1 {
  left: 12%;
  bottom: 14%;
  transform: rotate(-24deg);
}

.paw-2 {
  right: 13%;
  top: 14%;
  font-size: 1.6rem;
  transform: rotate(18deg);
}

.icon-badge {
  position: relative;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.16);
  border: 2px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.25), inset 0 0 24px rgba(255, 255, 255, 0.15);
  text-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s;
}

.app-card:hover .icon-badge {
  transform: scale(1.06) rotate(-4deg);
}

.app-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px 14px;
}

.app-name {
  font-size: 1.15rem;
}

.app-name {
  font-weight: 700;
  color: #fff;
}

.app-text {
  font-size: 0.85rem;
  color: var(--text-light);
}

.guard-note {
  margin-top: 8px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-light);
}

.guard-note a {
  color: var(--main-color);
  margin-left: 4px;
}

@media (max-width: 640px) {
  .group-chips {
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 4px;
  }
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

/* Responsive adjustments */
@media (min-width: 1024px) {
  .card {
    display: flex;
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

  .container {
    max-width: 1200px;
    margin: auto;
  }

  .card {
    background: var(--forms-bg);
    border: unset;
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

