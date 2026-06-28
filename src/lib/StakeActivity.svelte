<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { stake_activity, type StakeActivityState } from './stores/stakeActivity';

	let collapsed = true;
	let manualToggle = false;
	let hidden = false;
	let prevPending = 0;
	let collapseTimer: ReturnType<typeof setTimeout>;
	let hideTimer: ReturnType<typeof setTimeout>;

	const LABEL: Record<StakeActivityState, string> = {
		pending: 'Unconfirmed',
		confirmed: 'Confirmed',
		dropped: 'Dropped'
	};
	const ACCENT: Record<StakeActivityState, string> = {
		pending: '#f5a623',
		confirmed: '#3ecf8e',
		dropped: '#e5484d'
	};

	$: items = $stake_activity;
	$: ordered = [
		...items.filter((i) => i.state === 'pending'),
		...items.filter((i) => i.state !== 'pending')
	];
	$: pendingCount = ordered.filter((i) => i.state === 'pending').length;

	$: react(pendingCount, ordered.length);

	function react(pending: number, total: number) {
		if (pending > prevPending && pending > 0) {
			hidden = false;
			if (!manualToggle) {
				collapsed = false;
				clearTimeout(collapseTimer);
				collapseTimer = setTimeout(() => (collapsed = true), 6000);
			}
		}
		prevPending = pending;

		clearTimeout(hideTimer);
		if (pending > 0) {
			hidden = false;
		} else if (total > 0) {
			hideTimer = setTimeout(() => (hidden = true), 30000);
		}
	}

	function toggle() {
		collapsed = !collapsed;
		manualToggle = true;
		clearTimeout(collapseTimer);
	}

	onDestroy(() => {
		clearTimeout(collapseTimer);
		clearTimeout(hideTimer);
	});

	$: visible = !hidden && ordered.length > 0;

	function timeAgo(ts: number): string {
		const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
		if (s < 60) return `${s}s ago`;
		const m = Math.floor(s / 60);
		return m < 60 ? `${m}m ago` : `${Math.floor(m / 60)}h ago`;
	}
</script>

{#if visible}
	<section
		class="activity"
		class:collapsed
		transition:fly={{ y: 24, duration: 260, easing: quintOut }}
		aria-label="Stake activity"
	>
		<button class="header" on:click={toggle} aria-expanded={!collapsed}>
			<span class="title">
				{#if pendingCount > 0}
					<span class="dot" aria-hidden="true" />
					{pendingCount} pending
				{:else}
					Recent activity
				{/if}
			</span>
			<span class="chev" class:rot={collapsed} aria-hidden="true">⌄</span>
		</button>

		{#if !collapsed}
			<div class="list" transition:fade={{ duration: 120 }}>
				{#each ordered as it (it.id)}
					<div
						class="row"
						style="border-left-color: {ACCENT[it.state]};"
						animate:flip={{ duration: 260, easing: quintOut }}
						in:fly={{ y: 10, duration: 200 }}
						out:fade={{ duration: 160 }}
					>
						<span class="icon" style="color: {ACCENT[it.state]};">
							{#if it.state === 'confirmed'}
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
							{:else if it.state === 'dropped'}
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
							{:else}
								<span class="spin" aria-hidden="true" />
							{/if}
						</span>
						<div class="body">
							<div class="line1">
								<span class="op">{it.type} · {it.title}</span>
								<span class="status" style="color: {ACCENT[it.state]};">{LABEL[it.state]}</span>
							</div>
							<div class="line2">
								<span class="time">{timeAgo(it.timestamp)}</span>
								<a
									class="link"
									href={`https://ergexplorer.com/transactions/${it.txId}`}
									target="_blank"
									rel="noopener noreferrer">view tx ↗</a
								>
							</div>
						</div>
					</div>
				{/each}

				{#if pendingCount > 0}
					<p class="hint">Shown instantly — clears once confirmed in a block (~2&nbsp;min).</p>
				{/if}
			</div>
		{/if}
	</section>
{/if}

<style>
	.activity {
		position: fixed;
		right: 1rem;
		bottom: 1rem;
		z-index: 60;
		width: 320px;
		max-width: calc(100vw - 1.5rem);
		color: #e7ebf5;
		background: rgba(20, 24, 38, 0.94);
		border: 1px solid rgba(255, 255, 255, 0.09);
		border-radius: 16px;
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(12px);
		overflow: hidden;
		font-variant-numeric: tabular-nums;
		transition: width 0.2s ease;
	}
	.activity.collapsed {
		width: auto;
	}
	.activity.collapsed .header {
		border-bottom: none;
	}
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		gap: 0.75rem;
		padding: 0.7rem 1rem;
		background: rgba(255, 255, 255, 0.03);
		border: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		color: inherit;
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 500;
		white-space: nowrap;
	}
	.title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #f5a623;
		animation: pulse 1.6s ease-out infinite;
	}
	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(245, 166, 35, 0.55);
		}
		70% {
			box-shadow: 0 0 0 7px rgba(245, 166, 35, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(245, 166, 35, 0);
		}
	}
	.chev {
		opacity: 0.7;
		transition: transform 0.2s ease;
	}
	.chev.rot {
		transform: rotate(-90deg);
	}
	.list {
		max-height: 52vh;
		overflow-y: auto;
		padding: 0.25rem 0;
	}
	.row {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		padding: 0.55rem 1rem 0.55rem 0.8rem;
		border-left: 3px solid transparent;
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
	}
	.row:last-of-type {
		border-bottom: none;
	}
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.2rem;
		padding-top: 0.1rem;
		flex-shrink: 0;
	}
	.spin {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid rgba(245, 166, 35, 0.3);
		border-top-color: #f5a623;
		animation: sp 0.8s linear infinite;
	}
	@keyframes sp {
		to {
			transform: rotate(360deg);
		}
	}
	.body {
		flex: 1;
		min-width: 0;
	}
	.line1 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.op {
		font-size: 0.85rem;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.status {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		flex-shrink: 0;
	}
	.line2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 0.2rem;
	}
	.time {
		font-size: 0.7rem;
		color: #9aa6bf;
	}
	.link {
		font-size: 0.7rem;
		color: #8aa4ff;
		text-decoration: none;
	}
	.link:hover {
		text-decoration: underline;
	}
	.hint {
		margin: 0.3rem 0.2rem 0.1rem;
		padding: 0.5rem 0.8rem;
		font-size: 0.68rem;
		line-height: 1.3;
		color: #9aa6bf;
	}
	@media (max-width: 640px) {
		.activity {
			right: 0.5rem;
			left: 0.5rem;
			bottom: 0.5rem;
			width: auto;
			max-width: none;
		}
		.list {
			max-height: 42vh;
		}
	}
</style>
