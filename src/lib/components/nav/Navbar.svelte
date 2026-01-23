<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import WalletButton from './WalletButton.svelte';
  import NavDrawer from './NavDrawer.svelte';
  import QuickNavButton from './QuickNavButton.svelte';

  let menuOpen = false;
  let pageName: string;

  $: page.subscribe((value) => {
    pageName = value.route.id.substr(1);
  });

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
    // Add scroll listener
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<div id="navbar"
  class="z-10 fixed items-center w-full h-[112px]"
  style="padding-top:25px; background: var(--background); transition: all 0.5s ease;"
>
  <div class="flex relative items-center justify-between nav-container">
    <!-- Logo -->
    <a href="/" class="logo-wrapper">
      <img class="mew-logo" src="logo.png" alt="Mew Finance">
    </a>

    <!-- Desktop Navigation Links (keeping for now, can be removed later) -->
    <ul class="gap-x-4 d-none d-md-flex nav-links" style="position: absolute; left: 50%; transform: translateX(-50%);">
      <li class="text-lg {pageName == '' ? 'active' : ''}"><a href="/">Home</a></li>
      <li class="text-lg {pageName == 'tokenomics' ? 'active' : ''}"><a href="/tokenomics">Tokenomics</a></li>
      <li class="text-lg {pageName == 'kitties' ? 'active' : ''}"><a href="/kitties">Kitties</a></li>
      <li class="text-lg {pageName == 'claim' ? 'active' : ''}"><a href="/claim">Claim Kitty</a></li>
      <li class="text-lg {pageName == 'about' ? 'active' : ''}"><a href="/about">About</a></li>
    </ul>

    <!-- Wallet Button -->
    <div class="flex items-center gap-4" style="margin-left: auto; flex: 0 1 auto;">
      <WalletButton />
    </div>
  </div>
</div>

<!-- Navigation Drawer -->
<NavDrawer isOpen={menuOpen} on:close={closeMenu} />

<!-- Quick Navigation Button -->
<QuickNavButton bind:menuOpen />

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

  /* Logo Wrapper */
  .logo-wrapper {
    display: flex;
    align-items: center;
    flex: 0 1 auto;
    margin-right: auto;
    text-decoration: none;
  }

  /* Logo Image */
  .mew-logo {
    height: 57px;
    width: auto;
    transition: transform 0.2s ease;
  }

  .logo-wrapper:hover .mew-logo {
    transform: scale(1.05);
  }

  /* Mobile */
  @media (max-width: 768px) {
    .mew-logo {
      height: 48px;
    }
  }
</style>
