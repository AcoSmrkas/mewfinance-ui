<script>
	import { FOOTER_TEXT } from '$lib/common/const.js';
</script>

<div class="w-full flex flex-col gap-2 justify-around p-1 shadow-md" style="background: var(--footer)">

		<div class="flex flex-row p-3 container font-azeret text-sm">
	    <div class="flex flex-col gap-2 grow">
	    	<h6 class="font-manrope text-white text-xl font-bold mb-2">Social</h6>
			<div>
				<a target="_new" class="text-light" href="https://t.me/MewFinance">Telegram</a>
			</div>
			<!--
			<div>
				<a target="_new" class="text-light" href="https://discord.com/channels/">Discord</a>
			</div>
			-->
			<div>
				<a target="_new" class="text-light" href="https://x.com/Mew_Finance">Twitter</a>
			</div>
		</div>

	</div>
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
