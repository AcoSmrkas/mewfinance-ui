<script lang="ts">
  import { onMount } from 'svelte';

  export let menuOpen = false;
  let showTooltip = false;
  let menuDiscovered = false;

  export function toggleMenu() {
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
  });

  function handleInteraction() {
    if (showTooltip) {
      showTooltip = false;
    }
  }
</script>

<button
  class="quick-nav-btn"
  class:menu-open={menuOpen}
  on:click={toggleMenu}
  on:mouseenter={handleInteraction}
  aria-label={menuOpen ? 'Close quick navigation' : 'Open quick navigation'}
  aria-expanded={menuOpen}
>
  <!-- Rocket SVG -->
  <i class="fa-solid fa-rocket rocket-icon"></i>

  <!-- First-time tooltip -->
  {#if showTooltip}
    <div class="menu-tooltip" role="tooltip">
      <span>Quick Navigation!</span>
      <div class="tooltip-arrow"></div>
    </div>
  {/if}
</button>

<style>
  .quick-nav-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--main-color);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 997;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 16px rgba(249, 215, 45, 0.4),
                0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .quick-nav-btn:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 24px rgba(249, 215, 45, 0.5),
                0 12px 48px rgba(0, 0, 0, 0.3);
  }

  .quick-nav-btn:active {
    transform: translateY(-2px) scale(1);
    transition: all 0.1s ease;
  }

  .quick-nav-btn:focus {
    outline: 3px solid var(--info-color);
    outline-offset: 4px;
  }

  .quick-nav-btn:focus:not(:focus-visible) {
    outline: none;
  }

  /* Rocket Icon */
  .rocket-icon {
    font-size: 28px;
    color: var(--background);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .quick-nav-btn:hover .rocket-icon {
    transform: translateY(-4px) rotate(-15deg);
  }

  /* Menu Open State */
  .quick-nav-btn.menu-open {
    background: var(--info-color);
    transform: rotate(45deg);
  }

  .quick-nav-btn.menu-open:hover {
    transform: rotate(45deg) scale(1.05);
  }

  .quick-nav-btn.menu-open .rocket-icon {
    transform: rotate(-45deg);
  }

  .quick-nav-btn.menu-open:hover .rocket-icon {
    transform: rotate(-45deg);
  }

  /* Tooltip */
  .menu-tooltip {
    position: absolute;
    bottom: calc(100% + 12px);
    right: 0;
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
    bottom: -6px;
    right: 24px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid var(--main-color);
  }

  @keyframes tooltip-fade-in-out {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }
    10% {
      opacity: 1;
      transform: translateY(0);
    }
    80% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(4px);
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    .quick-nav-btn {
      bottom: 20px;
      right: 20px;
      width: 56px;
      height: 56px;
    }

    .rocket-icon {
      font-size: 24px;
    }

    .menu-tooltip {
      font-size: 13px;
      padding: 8px 14px;
    }
  }
</style>
