<script>
  import { page } from '$app/stores';
  import WalletButton from './WalletButton.svelte';

  let showModal = false;
  let walletConnected = false;
  let navCollapsed = true;
  let pageName;

  $: page.subscribe((value) => {
    pageName = value.route.id.substr(1);
    
    navCollapsed = false;
    toggleNav();
  });

  function toggleModal() {
    showModal = !showModal;
  }

  function toggleNav() {
    navCollapsed = !navCollapsed;

    if (navCollapsed) {
      jQuery('#navmob').css('visibility', 'hidden');
      jQuery('#navmob').css('opacity', '0');
    } else {
      jQuery('#navmob').css('visibility', 'visible');
      jQuery('#navmob').css('opacity', '1');
    }
  }

  document.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY === 0) {
      navbar.style.paddingTop = '25px';
      navbar.style.height = '112px';
    } else {
      navbar.style.paddingTop = '0';
      navbar.style.height = '87px';
    }
  });
</script>

<div id="navbar"
  class="backdrop-blur-sm z-10 fixed items-center w-full h-[112px]" style="padding-top:25px; background: #0c0a18dd; transition: all 0.5s ease;"
>
  <div class="flex relative items-center justify-between nav-container ps-3 pe-3 ps-sm-4 pe-sm-4" style="  display: flex;
  justify-content: space-between;
  align-items: center; /* Optional: for vertical centering if needed */">
    <a href="/" class="flex items-center gap-2" style="margin-right: auto;flex: 0 1 auto; /* Allow items to have their natural widths */">
      <img class="h-[57px] relative" src="logo.png" alt="Logo">
    </a>
    <ul class="gap-x-4 d-none d-md-flex" style="position: absolute;
  left: 50%;
  transform: translateX(-50%);">
      <li class="text-lg {pageName == '' ? 'active' : ''}"><a href="./">Home</a></li>
      <li class="text-lg {pageName == 'tokenomics' ? 'active' : ''}"><a href="./tokenomics">Tokenomics</a></li>
      <li class="text-lg {pageName == 'presale' ? 'active' : ''}"><a href="./presale">Presale</a></li>
      <!--
      <li class="text-lg {pageName == 'about' ? 'active' : ''}"><a href="./about">About</a></li>
      -->
    </ul>
    <div class="flex items-center gap-4" style="margin-left: auto;flex: 0 1 auto; /* Allow items to have their natural widths */">
      <WalletButton />
      <button type="button" on:click={toggleNav} class="d-block d-md-none navbar-toggler text-4xl"><i class="fa-solid fa-bars cursor-pointer"></i></button>
    </div>
  </div>
  <div id="navmob" class="nav-mob flex relative justify-between pt-2 pt-4 pb-2" style="visibility: hidden;opacity:0;">
    <ul class="w-100 gap-y-4 d-flex flex-col d-md-none" style="position: relative;
  left: 50%;
  transform: translateX(-50%);">
      <li class="leading-10 pb-2 text-lg border-b border-gray-700 {pageName == '' ? 'active' : ''}"><a href="./">   Home</a></li>
      <li class="leading-10 pb-2 text-lg border-b border-gray-700 {pageName == 'tokenomics' ? 'active' : ''}"><a href="./tokenomics">   Tokenomics</a></li>
      <li class="leading-10 pb-2 text-lg border-b border-gray-700 {pageName == 'presale' ? 'active' : ''}"><a href="./presale">   Presale</a></li>
      <!--
      <li class="leading-10 pb-2 text-lg {pageName == 'about' ? 'active' : ''}"><a href="./about">   About</a></li>
      -->
    </ul>
  </div>
</div>

<style>
  .nav-mob {
    background: var(--background);
    transition: all 0.2s ease;
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

  .navbar-toggler {
    transition: all 0.2s ease;
    color: white;
  }

  .navbar-toggler:hover {
    color: var(--main-color);
  }
</style>