<svelte:head>
  <title>Security Incident Report — Mew Finance</title>
  <meta name="description" content="Mew Finance security incident report — what happened in June 2026, what it affected, and what we changed." />
  <meta name="robots" content="index, follow" />
</svelte:head>

<div class="h-full flex flex-col grow main-page mt-[150px]">
  <section class="max-w-3xl mx-auto px-4 py-12 text-white font-sans">

    <h1 class="text-4xl font-bold text-primary mb-2">Security Incident Report</h1>
    <p class="text-light text-sm mb-8">June 2026 &middot; published 8 September 2026</p>

    <p class="mb-4 text-lg">
      In June 2026 an attacker got into the server that ran Mew Finance's backend services. This page is
      the public record of it: what happened, what it touched, and what we changed. The response is
      complete, so we can write it plainly instead of in fragments.
    </p>

    <div class="mb-10 p-4 rounded-lg" style="background: rgba(255,255,255,0.04); border: 1px solid var(--borders)">
      <p class="mb-0">
        <strong class="text-primary">The short version.</strong>
        The attacker reached our server through a flaw in one of our own API endpoints, escalated from
        there into the database, and took the wallet keys we were keeping in it. Project-owned hot wallets
        were drained and 15 Mew Kitty NFTs were stolen. Because the keys tied to the MEW token were
        exposed, MEW was retired, re-minted as <strong>MEOW</strong>, and airdropped 1:1 to holders.
        <strong>Funds in your own wallet were never at risk</strong> &mdash; Mew Finance is non-custodial
        and has never held your keys. The server was rebuilt from scratch.
      </p>
    </div>

    <h2 class="text-2xl font-bold text-primary mb-3">How it happened</h2>
    <p class="mb-4 text-lg">Three of our own mistakes, chained together:</p>
    <ol class="space-y-4 list-decimal list-outside pl-6 mb-10 text-lg">
      <li>
        <strong>A code flaw.</strong> One of our API endpoints passed unchecked input through to the
        system shell. That alone let the attacker run commands on our server.
      </li>
      <li>
        <strong>No isolation.</strong> Every application on that machine ran as the same system user and
        connected to the database with full administrative rights, and a password had been reused. So a
        foothold in one web endpoint was a foothold in everything: the attacker could read every
        application's secrets and dump every database &mdash; including the wallet keys stored in them.
      </li>
      <li>
        <strong>Persistence we would not have caught.</strong> Using a stolen code-repository token, the
        attacker committed a hidden install hook into one of our repositories that quietly re-added their
        own SSH key every time the project was installed or deployed. Rebuilding the server would not have
        removed them &mdash; the next deploy would have handed access straight back.
      </li>
    </ol>

    <h2 class="text-2xl font-bold text-primary mb-3">What was affected</h2>
    <ul class="space-y-3 list-disc list-outside pl-6 mb-10 text-lg">
      <li>Project-controlled hot wallets, including the wallet that collected service fees, were drained.</li>
      <li>15 Mew Kitty NFTs held in a project wallet were stolen.</li>
      <li>
        The keys tied to the MEW token were exposed. MEW was not broken on-chain, but we could no longer
        vouch for it, so we retired it rather than ask you to trust it.
      </li>
      <li>Every database on that server was dumped &mdash; see <em>Your data</em> below.</li>
      <li>
        Our fee address was embedded inside several of our smart contracts, so every one of those contracts
        had to be replaced even though the contracts themselves were never exploited.
      </li>
    </ul>

    <h2 class="text-2xl font-bold text-primary mb-3">What was not affected</h2>
    <ul class="space-y-3 list-disc list-outside pl-6 mb-10 text-lg">
      <li>
        <strong>Your wallet.</strong> Mew Finance is non-custodial. We have never held your seed phrase or
        private keys, and nothing in this incident gave the attacker access to a wallet you control.
      </li>
      <li>
        <strong>The contracts on chain.</strong> No contract was exploited and no assets locked in the old
        contracts became unspendable by their owners. Replacing them was precautionary, because our
        compromised fee address was baked into them.
      </li>
      <li>
        <strong>Your seed phrase.</strong> We will never ask for it. Anyone who does &mdash; in DMs, in
        &ldquo;support&rdquo; chats, on a lookalike site &mdash; is not us.
      </li>
    </ul>

    <h2 class="text-2xl font-bold text-primary mb-3">Your data</h2>
    <p class="mb-10 text-lg">
      The databases on the old server were copied wholesale, so please treat anything you gave us
      server-side before the rebuild as exposed. That includes order records and the details held against
      them. Mew Finance has no accounts to sign into &mdash; you connect a wallet, and we hold no password
      for you &mdash; and we do not store payment card numbers.
    </p>

    <h2 class="text-2xl font-bold text-primary mb-3">What we did</h2>
    <p class="mb-4 text-lg">The response, in order (all 2026):</p>
    <ul class="space-y-3 list-disc list-outside pl-6 mb-10 text-lg">
      <li>
        <strong>23 June</strong> &mdash; A brand-new server, provisioned from scratch by automation.
        Nothing was carried across from the compromised machine; every service was rebuilt from reviewed
        source. The attacker's commits were purged from our repository history.
      </li>
      <li>
        <strong>24 June</strong> &mdash; All 66 of our code repositories audited for planted backdoors and
        for secrets that should never have been committed. Rotation of everything the attacker could have
        taken: fee addresses, affected contracts, API keys, bot tokens, database credentials, node keys.
      </li>
      <li>
        <strong>25 June</strong> &mdash; MEW retired. MEOW minted and airdropped 1:1 against the snapshot.
        The 15 stolen Mew Kitties re-minted with identical metadata, and the stolen originals flagged as
        stolen on ErgExplorer and blocked from purchase on Mew Mart.
      </li>
      <li>
        <strong>27 June</strong> &mdash; A second intrusion attempt, using a collaborator's SSH key that
        had been stolen in the original breach and then re-authorised by us, was detected and shut down the
        same day. Forensics found no persistence and no tampering. It is the clearest evidence we have that
        the new monitoring works, and a lesson we should not have needed: a credential that existed before
        the breach never comes back.
      </li>
    </ul>

    <h2 class="text-2xl font-bold text-primary mb-3">What changed, so this can't repeat</h2>
    <ul class="space-y-3 list-disc list-outside pl-6 mb-10 text-lg">
      <li>
        Every application runs as its own system user with its own database role, scoped to its own
        database. No shared user, and no application connects as a database administrator. A flaw in one
        app now stays inside that app.
      </li>
      <li>
        Secrets live in an encrypted vault and are written out only to files readable by the single app
        that needs them. Nothing sensitive lives in code.
      </li>
      <li>
        Deploys go through a service that can act as individual app users and never as root, so a
        compromised public endpoint cannot deploy anything or reach another app's secrets.
      </li>
      <li>
        File-integrity monitoring, audit logging, intrusion alerting, brute-force banning, key-only SSH and
        automatic security updates run continuously, with alerts delivered to us in real time.
      </li>
      <li>
        Hot wallets are kept to a working float. The treasury is held off the server.
      </li>
    </ul>

    <h2 class="text-2xl font-bold text-primary mb-3">What this means for you</h2>
    <ul class="space-y-4 list-disc list-outside pl-6 mb-10 text-lg">
      <li>
        <strong>MEW is retired and worthless.</strong> Do not buy it. Old token id:
        <code class="text-sm break-all text-light">6c35aa395c7c75b0f67f7804d6930f0e11ef93c3387dc1faa86498d54af7962c</code>
      </li>
      <li>
        <strong>MEOW is the token.</strong> Token id:
        <code class="text-sm break-all text-info">d4f0192622b440afc09711aa0545eacd04d78ad3f8a063523f451e10d3d0e6ef</code><br />
        If you held MEW in your own wallet at the June snapshot, MEOW is already there &mdash; it was sent
        1:1 and needs no action from you. The airdrop covered community wallets; project-owned wallets and
        balances sitting inside contracts (DEX liquidity and similar) were excluded by design. If you think
        you were missed, message us and we'll check the snapshot.
      </li>
      <li>
        <strong>Buying a Mew Kitty?</strong> The 15 stolen originals are flagged as stolen on ErgExplorer
        and blocked from purchase on Mew Mart. The re-minted kitties carry the same names and artwork and
        are the legitimate ones.
      </li>
    </ul>

    <h2 class="text-2xl font-bold text-primary mb-3">Questions</h2>
    <p class="mb-4 text-lg">
      Ask us on <a class="text-info" target="_new" href="https://t.me/MewFinance">Telegram</a>. If you
      believe you were affected in a way this page doesn't cover, tell us there and we'll look at it
      properly.
    </p>
    <p class="text-lg text-light">
      None of this was sophisticated, and that's the uncomfortable part &mdash; it was our own unchecked
      input, our own shared account, our own reused password. We've written it down in full rather than
      letting it fade, because a project that asks you to connect a wallet owes you the whole story.
    </p>

  </section>
</div>

<style lang="postcss">
  :global(html) {
    min-height: 100vh;
  }
  .main-page {
    background-position: cover;
    background-repeat: no-repeat;
  }
  code {
    background: rgba(255, 255, 255, 0.06);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Azeret Mono', monospace;
  }
</style>
