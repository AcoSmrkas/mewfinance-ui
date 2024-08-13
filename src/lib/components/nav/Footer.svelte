<script>
	import { onMount } from "svelte";
	import Modal from "$lib/components/common/Modal.svelte";
	import { LOGO_TEXT } from '$lib/common/const.js';
</script>

<div class="w-full flex flex-col gap-2 justify-around p-1 shadow-md" style="background: var(--footer)">
	<div class="flex flex-grow justify-center text-light text-sm p-1 pt-3 pb-3 font-azeret">
		<p>© {@html LOGO_TEXT} 2024</p>
	</div>
</div>

<style>
	button:hover{
		background: unset;
		color: unset;
	}
</style>
