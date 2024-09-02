<script>
	import '../bootstrap.css'
	import '../app.css';
	import { onMount } from 'svelte';
	import { reconnectErgoWallet } from '$lib/common/wallet';
	import { getPrices } from '$lib/utils/prices.js';
	
	import Navbar from '$lib/components/nav/Navbar.svelte';
	import Footer from '$lib/components/nav/Footer.svelte';
	import Loading from '$lib/components/common/Loading.svelte';

	let ready = false;

	onMount(async () => {
		await getPrices(null);
		await reconnectErgoWallet();

		ready = true;
	});
</script>

<Navbar />
{#if ready}
	<slot />
{:else}
	<div class="container loading-holder">
		<Loading />
	</div>
{/if}
<Footer />