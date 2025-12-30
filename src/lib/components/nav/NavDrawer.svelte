<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { navMenu, isCurrentPage } from '$lib/nav/navMenu';

  export let isOpen = false;

  const dispatch = createEventDispatcher();
  let drawerElement: HTMLElement;

  function closeDrawer() {
    dispatch('close');
  }

  function handleItemClick(url: string, isExternal: boolean) {
    if (isExternal) {
      window.location.href = url;
    } else {
      goto(url);
      closeDrawer();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      closeDrawer();
    }
  }

  function handleOverlayClick() {
    closeDrawer();
  }

  // Lock body scroll when drawer is open
  $: {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    }
  });
</script>

<!-- Overlay -->
<div
  class="nav-overlay"
  class:open={isOpen}
  on:click={handleOverlayClick}
  on:keydown={(e) => e.key === 'Enter' && handleOverlayClick()}
  role="button"
  tabindex="-1"
  aria-label="Close menu"
></div>

<!-- Drawer -->
<nav
  bind:this={drawerElement}
  class="nav-drawer"
  class:open={isOpen}
  aria-label="Main menu"
  aria-hidden={!isOpen}
>
  <!-- Drawer Header -->
  <div class="drawer-header">
    <img class="drawer-logo" src="logo.png" alt="Mew Finance">
    <button
      class="close-btn"
      on:click={closeDrawer}
      aria-label="Close menu"
    >
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>

  <!-- Menu Content -->
  <div class="drawer-content">
    {#each navMenu as category}
      <div class="menu-category">
        <h3 class="category-title">{category.name}</h3>
        <ul class="category-items">
          {#each category.items as item}
            <li>
              <button
                class="menu-item"
                class:current={isCurrentPage(item.url, item.isExternal)}
                on:click={() => handleItemClick(item.url, item.isExternal)}
              >
                <span class="item-label">{item.label}</span>
                {#if item.isExternal}
                  <i class="fa-solid fa-arrow-right item-arrow"></i>
                {/if}
                {#if isCurrentPage(item.url, item.isExternal)}
                  <span class="current-indicator"></span>
                {/if}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</nav>

<style>
  /* Overlay */
  .nav-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.25s ease, visibility 0.25s;
    z-index: 998;
    backdrop-filter: blur(2px);
  }

  .nav-overlay.open {
    opacity: 1;
    visibility: visible;
  }

  /* Drawer */
  .nav-drawer {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    height: 100dvh;
    width: 320px;
    background: var(--background);
    transform: translateX(-100%);
    transition: transform 0.25s ease-out;
    z-index: 999;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--borders);
  }

  .nav-drawer.open {
    transform: translateX(0);
  }

  /* Drawer Header */
  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--borders);
    background: var(--background);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .drawer-logo {
    height: 48px;
    width: auto;
  }

  .close-btn {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--secondary-color);
    font-size: 24px;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.15s ease;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--main-color);
  }

  /* Drawer Content */
  .drawer-content {
    flex: 1;
    padding: 12px 0;
    overflow-y: auto;
  }

  /* Menu Category */
  .menu-category {
    padding: 8px 0;
  }

  .category-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-light);
    padding: 8px 20px;
    margin: 0;
  }

  .category-items {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Menu Item */
  .menu-item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 12px 20px;
    background: transparent;
    border: none;
    color: var(--secondary-color);
    font-size: 15px;
    text-align: left;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
    min-height: 48px;
  }

  .menu-item:hover {
    background: rgba(255, 255, 255, 0.08);
    padding-left: 24px;
  }

  .menu-item.current {
    background: rgba(249, 215, 45, 0.15);
    color: var(--main-color);
    font-weight: 600;
  }

  .menu-item.current::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--main-color);
  }

  .item-label {
    flex: 1;
  }

  .item-arrow {
    font-size: 12px;
    opacity: 0.5;
    transition: all 0.15s ease;
  }

  .menu-item:hover .item-arrow {
    opacity: 1;
    transform: translateX(4px);
  }

  .current-indicator {
    display: none;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .nav-drawer {
      width: 85vw;
      max-width: 320px;
    }

    .menu-item {
      min-height: 48px;
      padding: 14px 20px;
    }

    .close-btn {
      width: 44px;
      height: 44px;
    }
  }

  /* Scrollbar */
  .drawer-content::-webkit-scrollbar {
    width: 6px;
  }

  .drawer-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .drawer-content::-webkit-scrollbar-thumb {
    background-color: var(--borders);
    border-radius: 3px;
  }

  .drawer-content::-webkit-scrollbar-thumb:hover {
    background-color: var(--text-light);
  }
</style>
