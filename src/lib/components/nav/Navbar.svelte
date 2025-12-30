<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import WalletButton from './WalletButton.svelte';
  import NavDrawer from './NavDrawer.svelte';

  let menuOpen = false;
  let showTooltip = false;
  let menuDiscovered = false;
  let pageName: string;

  $: page.subscribe((value) => {
    pageName = value.route.id.substr(1);
  });

  function toggleMenu() {
    menuOpen = !menuOpen;

    // Mark menu as discovered on first open
    if (menuOpen && !menuDiscovered) {
      menuDiscovered = true;
      showTooltip = false;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('mew-menu-discovered', 'true');
      }
    }
  }

  function closeMenu() {
    menuOpen = false;
  }

  function handleScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    if (window.scrollY === 0) {
      navbar.style.paddingTop = '25px';
      navbar.style.height = '112px';
    } else {
      navbar.style.paddingTop = '0';
      navbar.style.height = '87px';
    }
  }

  onMount(() => {
    // Check if user has discovered the menu before
    if (typeof localStorage !== 'undefined') {
      menuDiscovered = localStorage.getItem('mew-menu-discovered') === 'true';
    }

    // Show tooltip for first-time users after 2 seconds
    if (!menuDiscovered) {
      const tooltipTimer = setTimeout(() => {
        if (!menuDiscovered && !menuOpen) {
          showTooltip = true;
          // Auto-hide tooltip after 4 seconds
          setTimeout(() => {
            showTooltip = false;
          }, 4000);
        }
      }, 2000);

      // Cleanup timer
      return () => clearTimeout(tooltipTimer);
    }

    // Add scroll listener
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  });

  // Hide tooltip on any interaction
  function handleLogoInteraction() {
    if (showTooltip) {
      showTooltip = false;
    }
  }
</script>

<div id="navbar"
  class="z-10 fixed items-center w-full h-[112px]"
  style="padding-top:25px; background: var(--background); transition: all 0.5s ease;"
>
  <div class="flex relative items-center justify-between nav-container">
    <!-- Logo Menu Trigger -->
    <div class="logo-wrapper">
      <button
        class="mew-logo-btn"
        class:menu-open={menuOpen}
        on:click={toggleMenu}
        on:mouseenter={handleLogoInteraction}
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
      >
        <img class="mew-logo" src="logo.png" alt="Mew Finance - Click for menu">
      </button>

      <!-- First-time tooltip -->
      {#if showTooltip}
        <div class="menu-tooltip" role="tooltip">
          <span>Tap me for the menu!</span>
          <div class="tooltip-arrow"></div>
        </div>
      {/if}
    </div>

    <!-- Desktop Navigation Links (keeping for now, can be removed later) -->
    <ul class="gap-x-4 d-none d-md-flex nav-links" style="position: absolute; left: 50%; transform: translateX(-50%);">
      <li class="text-lg {pageName == '' ? 'active' : ''}"><a href="./">Home</a></li>
      <li class="text-lg {pageName == 'tokenomics' ? 'active' : ''}"><a href="./tokenomics">Tokenomics</a></li>
      <li class="text-lg {pageName == 'kitties' ? 'active' : ''}"><a href="./kitties">Kitties</a></li>
      <li class="text-lg {pageName == 'claim' ? 'active' : ''}"><a href="./claim">Claim Kitty</a></li>
      <li class="text-lg {pageName == 'about' ? 'active' : ''}"><a href="./about">About</a></li>
    </ul>

    <!-- Wallet Button -->
    <div class="flex items-center gap-4" style="margin-left: auto; flex: 0 1 auto;">
      <WalletButton />
    </div>
  </div>
</div>

<!-- Navigation Drawer -->
<NavDrawer isOpen={menuOpen} on:close={closeMenu} />

<style>
  .nav-links > li > a {
    display: inline-block;
    width: 100% !important;
    text-align: center;
  }

  .nav-container {
    padding: 15px;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    padding-right: 15px;
    padding-left: 15px;
    width: 1140px;
    max-width: 100%;
  }

  /* Logo Wrapper for tooltip positioning */
  .logo-wrapper {
    position: relative;
    flex: 0 1 auto;
    margin-right: auto;
  }

  /* Logo Button */
  .mew-logo-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    min-width: 44px;
    min-height: 44px;
    border-radius: 8px;
    transition: transform 0.2s ease;
  }

  .mew-logo-btn:focus {
    outline: 2px solid var(--info-color);
    outline-offset: 4px;
  }

  .mew-logo-btn:focus:not(:focus-visible) {
    outline: none;
  }

  /* Logo Image */
  .mew-logo {
    height: 57px;
    width: auto;
    transition: transform 0.2s ease, filter 0.2s ease;
  }

  /* Hover State */
  .mew-logo-btn:hover .mew-logo {
    transform: scale(1.08);
    filter: drop-shadow(0 0 8px var(--info-color));
  }

  /* Active/Pressed State */
  .mew-logo-btn:active .mew-logo {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }

  /* Menu Open State */
  .mew-logo-btn.menu-open .mew-logo {
    transform: rotate(8deg);
    filter: drop-shadow(0 0 12px var(--info-color));
  }

  .mew-logo-btn.menu-open:hover .mew-logo {
    transform: rotate(8deg) scale(1.05);
  }

  /* First-time Tooltip */
  .menu-tooltip {
    position: absolute;
    top: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--main-color);
    color: var(--background);
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    z-index: 1001;
    animation: tooltip-fade-in-out 4s ease forwards;
    box-shadow: 0 4px 20px rgba(249, 215, 45, 0.3);
  }

  .tooltip-arrow {
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid var(--main-color);
  }

  @keyframes tooltip-fade-in-out {
    0% {
      opacity: 0;
      transform: translateX(-50%) translateY(-8px);
    }
    10% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    80% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) translateY(-4px);
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    .mew-logo-btn {
      min-width: 44px;
      min-height: 44px;
    }

    .mew-logo {
      height: 48px;
    }

    .menu-tooltip {
      font-size: 13px;
      padding: 8px 14px;
    }
  }
</style>
