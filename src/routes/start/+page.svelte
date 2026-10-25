<script>
  const NAUTILUS_URL = 'https://chromewebstore.google.com/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai';
  const ANDROID_URL = 'https://play.google.com/store/apps/details?id=org.ergoplatform.android';
  const IPHONE_URL = 'https://apps.apple.com/app/terminus-wallet-ergo/id1643137927';
  const MARKETS_URL = 'https://coinmarketcap.com/currencies/ergo/#Markets';
  const ROSEN_URL = 'https://app.rosen.tech/';

  const firstMoves = [
    { title: 'Swap tokens', text: 'Trade ERG for a token on the DEX.', icon: 'fa-right-left', href: 'https://dex.mewfinance.com/ergo/swap' },
    { title: 'Get SigUSD', text: 'Get the Ergo stablecoin with ERG.', icon: 'fa-dollar-sign', href: 'https://bank.mewfinance.com/stablecoins' },
    { title: 'Browse NFTs', text: 'See what is listed on NFT Mart.', icon: 'fa-image', href: 'https://mart.mewfinance.com' }
  ];
</script>

<svelte:head>
  <title>Get started | Mew Finance</title>
</svelte:head>

<div class="h-full flex flex-col grow main-page mt-[150px]">
  <section class="max-w-3xl w-full mx-auto px-4 py-8 text-white">
    <h1 class="text-4xl font-bold text-primary mb-3">Get started</h1>
    <p class="text-lg text-light mb-8">Three steps to your first transaction on Mew.</p>

    <ol class="steps">
      <li class="step">
        <div class="step-head">
          <span class="step-num">1</span>
          <h2>Get a wallet</h2>
        </div>
        <div class="step-body">
          <div class="options">
            <div class="option">
              <span class="option-title"><i class="fa-solid fa-desktop"></i> On a computer</span>
              <span class="option-text">Nautilus, a browser extension for Chrome and Brave.</span>
              <div class="links">
                <a class="btn btn-primary btn-sm" href={NAUTILUS_URL} target="_blank" rel="noopener noreferrer">
                  <img src="/wallets/nautilus.svg" alt="" class="btn-icon"> Install Nautilus
                </a>
              </div>
            </div>
            <div class="option">
              <span class="option-title"><i class="fa-solid fa-mobile-screen"></i> On a phone</span>
              <span class="option-text">Ergo Wallet on Android or Terminus on iPhone. Connect with ErgoPay.</span>
              <div class="links">
                <a class="btn btn-secondary btn-sm" href={ANDROID_URL} target="_blank" rel="noopener noreferrer">
                  <i class="fa-brands fa-android"></i> Android
                </a>
                <a class="btn btn-secondary btn-sm" href={IPHONE_URL} target="_blank" rel="noopener noreferrer">
                  <i class="fa-brands fa-apple"></i> iPhone
                </a>
              </div>
            </div>
          </div>
          <p class="note">
            <i class="fa-solid fa-key"></i>
            Write down your recovery phrase and keep it offline. Mew will never ask for it.
          </p>
        </div>
      </li>

      <li class="step">
        <div class="step-head">
          <span class="step-num">2</span>
          <h2>Get some ERG</h2>
        </div>
        <div class="step-body">
          <p class="step-text">Every transaction pays a small network fee in ERG, so keep a little in your wallet.</p>
          <div class="options">
            <div class="option">
              <span class="option-title"><i class="fa-solid fa-building-columns"></i> Buy on an exchange</span>
              <span class="option-text">Buy ERG, then withdraw it to your wallet address.</span>
              <div class="links">
                <a class="text-link" href={MARKETS_URL} target="_blank" rel="noopener noreferrer">
                  Where ERG trades <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </div>
            <div class="option">
              <span class="option-title"><i class="fa-solid fa-bridge"></i> Bring it from another chain</span>
              <span class="option-text">Have ADA, ETH or BTC? Rosen Bridge moves it to Ergo, then swap for ERG on the DEX.</span>
              <div class="links">
                <a class="text-link" href={ROSEN_URL} target="_blank" rel="noopener noreferrer">
                  Rosen Bridge <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </li>

      <li class="step">
        <div class="step-head">
          <span class="step-num">3</span>
          <h2>Make your first move</h2>
        </div>
        <div class="step-body">
          <p class="step-text">Connect your wallet in any Mew app. Start with a small amount.</p>
          <div class="moves">
            {#each firstMoves as move}
              <a class="move" href={move.href} target="_blank" rel="noopener noreferrer">
                <i class="fa-solid {move.icon} move-icon"></i>
                <span class="move-title">{move.title}</span>
                <span class="move-text">{move.text}</span>
              </a>
            {/each}
          </div>
        </div>
      </li>
    </ol>

    <p class="help">
      Stuck? <a href="https://t.me/MewFinance" target="_blank" rel="noopener noreferrer">Ask us on Telegram</a>
    </p>
  </section>
</div>

<style>
  .steps {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .step {
    padding: 20px;
    border-radius: 12px;
    background: var(--forms-bg);
    border: 1px solid var(--borders);
  }

  .step-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }

  .step-num {
    flex: 0 0 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    background: var(--main-color);
    color: #160d25;
  }

  .step-head h2 {
    font-size: 1.35rem;
    font-weight: 700;
    margin: 0;
  }

  .step-text {
    color: var(--text-light);
    margin-bottom: 12px;
  }

  .options {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .option {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px;
    border-radius: 10px;
    border: 1px solid var(--borders);
  }

  .option-title {
    font-weight: 700;
  }

  .option-title i {
    color: var(--main-color);
    margin-right: 6px;
  }

  .option-text {
    font-size: 0.9rem;
    color: var(--text-light);
    flex-grow: 1;
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
  }

  .links .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .btn-icon {
    width: 1.2em;
    height: 1.2em;
  }

  .text-link,
  .help a {
    color: var(--main-color);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .text-link i {
    font-size: 0.75em;
    margin-left: 4px;
  }

  .note {
    margin-top: 12px;
    font-size: 0.9rem;
    color: var(--text-light);
  }

  .note i {
    color: var(--info-color);
    margin-right: 6px;
  }

  .moves {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .move {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 14px;
    border-radius: 10px;
    border: 1px solid var(--borders);
    color: #fff;
    text-decoration: none;
    transition: border-color 0.15s, transform 0.15s;
  }

  .move:hover {
    border-color: var(--main-color);
    transform: translateY(-2px);
  }

  .move-icon {
    font-size: 1.3rem;
    color: var(--main-color);
  }

  .move-title {
    font-weight: 700;
  }

  .move-text {
    font-size: 0.85rem;
    color: var(--text-light);
  }

  .help {
    margin-top: 24px;
    text-align: center;
    color: var(--text-light);
  }

  @media (max-width: 640px) {
    .step {
      padding: 16px;
    }

    .step-num {
      flex-basis: 30px;
      height: 30px;
    }

    .options,
    .moves {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
