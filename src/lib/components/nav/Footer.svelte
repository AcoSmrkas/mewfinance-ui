<script>
	import { FOOTER_TEXT } from '$lib/common/const.js';
</script>

<div class="w-full flex flex-col gap-2 justify-around p-1 shadow-md" style="background: var(--footer)">
	<div class="flex flex-grow justify-center text-light text-sm p-1 pt-2 pb-2 font-azeret">
		<p>© {@html FOOTER_TEXT} 2024</p>
	</div>
</div>

<style>
	button:hover{
		background: unset;
		color: unset;
	}
</style>
