<script>
	import { Footer } from 'mew-shared-ui';
	import { FOOTER_TEXT } from '$lib/common/const.js';

	const FOOTER_COLUMNS = [
		{
			title: 'Social',
			links: [
				{ label: 'Telegram', href: 'https://t.me/MewFinance', target: '_new' },
				{ label: 'Discord', href: 'https://discord.com/invite/ergo-platform-668903786361651200', target: '_new' },
				{ label: 'Twitter', href: 'https://x.com/Mew_Finance', target: '_new' }
			]
		},
		{
			title: 'Developers',
			links: [
				{ label: 'Smart contracts', href: 'https://github.com/AcoSmrkas/mew-smart-contracts', target: '_new' }
			]
		}
	];
</script>

<Footer columns={FOOTER_COLUMNS} year={2025}>
	<svelte:fragment slot="copyright">{@html FOOTER_TEXT}</svelte:fragment>
</Footer>
