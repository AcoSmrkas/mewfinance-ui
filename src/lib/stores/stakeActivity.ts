import { get, writable } from 'svelte/store';

// Lightweight optimistic activity layer for the user's own stake action. This app
// has no mempool socket feed, so the lifecycle is driven purely by on-chain
// confirmation polling: pending -> confirmed, or -> dropped after a timeout.
// Cosmetic only; never builds a tx; the bot/backend remain source of truth.

export type StakeActivityState = 'pending' | 'confirmed' | 'dropped';

export type StakeActivityItem = {
	id: string;
	txId: string;
	type: 'Stake';
	title: string;
	state: StakeActivityState;
	timestamp: number;
	resolvedAt?: number;
};

export const stake_activity = writable<StakeActivityItem[]>([]);

export function recordStakeAction(title: string, txId: string) {
	if (!txId) return;
	stake_activity.update((l) => [
		{ id: txId, txId, type: 'Stake', title: title || 'Stake', state: 'pending', timestamp: Date.now() },
		...l.filter((x) => x.txId !== txId)
	]);
}

const TX_API = 'https://api.ergoplatform.com/api/v1/transactions/';
const DROP_AFTER_MS = 5 * 60_000; // never confirmed -> treat as dropped
const RESOLVED_TTL_MS = 45_000; // keep confirmed/dropped visible briefly

async function isConfirmed(txId: string): Promise<boolean | null> {
	try {
		const res = await fetch(TX_API + txId);
		if (res.status === 404) return false;
		if (!res.ok) return null;
		const data = await res.json();
		return typeof data?.inclusionHeight === 'number' && data.inclusionHeight > 0;
	} catch {
		return null;
	}
}

let started = false;

export function startStakeActivitySync() {
	if (started) return;
	started = true;
	setInterval(() => {
		void advance();
	}, 15000);
}

async function advance() {
	const now = Date.now();
	const items = get(stake_activity);
	let changed = false;

	for (const it of items) {
		if (it.state !== 'pending') continue;
		const confirmed = await isConfirmed(it.txId);
		if (confirmed === true) {
			it.state = 'confirmed';
			it.resolvedAt = now;
			changed = true;
		} else if (confirmed === false && now - it.timestamp > DROP_AFTER_MS) {
			it.state = 'dropped';
			it.resolvedAt = now;
			changed = true;
		}
		// null (network/api error) -> retry next tick
	}

	const pruned = items.filter((it) => !(it.resolvedAt && now - it.resolvedAt > RESOLVED_TTL_MS));
	if (changed || pruned.length !== items.length) {
		stake_activity.set([...pruned]);
	}
}
