<script type="ts">
	import { fetchAssetInfos } from '$lib/api-explorer/explorer.ts';
    import { onMount } from "svelte";
	import Loading from "$lib/components/common/Loading.svelte";

    let isLoading = true;
	let kittyIds = [
		"6e88329f8437c7fbf7dfd0d9f50c1e418f492ae857943e9981642d6df838693f",
		"4401ef5ca229d76e8ed38189fcecd0f27101c0737de4efbc32bf67d6c5daf2b9",
		"e29655594499bb101521a6dfe07ea66a9883a7e2a6c497bc229a296e64fa4ba8",
		"bbfdd2ce3d2a7b0276f1b54da155ecee2eb091fd8a802e45a579aefacac1d149",
		"8c09db2611125707d62bc1ffe1655674d21585e0946d179012ad2a2777ff3146",
		"e34452b5439e00f308bd765a373a067d5a6597ed1df96241b543b66a52128f56",
		"cb1441308dad3c25bdf94761d5c1dd3a924c9f600a9863ece9dfc3a7999511de",
		"71c1ae5e9cfbf4ea24ebbf4971851ab60ceb9f8341761b975a746a937f057450",
		"ea02d413a797eadb5f8b8869da41b0771f3168bf9b122283afbbc90c305b8321",
		"a4166528b1aa3138340e0c10b7132f0ee4d594b8a7cdd756a4d2fd18cc935877",
		"4a6ee489e668a4de084f9557146d723525a050d3c5526cf18e598a0b2134f395",
		"ab76bdbd37934b61beb6d01ffa0710820aa34c7d05f430a5956e39776abbeea3",
		"66fb622df0daec42f96f33bfbec686c4d0ba93196eb8f81ab8080572af8b67d9",
		"481f26b6c3792f8d00aafa970e5c76cd0894c4c0082f54f8aceda286612e0601",
		"a07f554a2118529695692654ff08b1bd4099cc336c9b2b2e82deb51e2575c030",
		"00637c27ea103663895e339e8c60f5b21699f4f274a392ba419936495e58c029",
		"0d035a5757a7ed0efd6c5de5b47a2eaf1c03ea194c3f1b98cac803862621f2d3",
		"b3fe55967946474d781d4043a4baaed47f0315f63f7aab47d3ae9e017fc8b665",
		"b58fd7318bf9054de685e54014b9f1811aaf8d9d6e8fdcfe0fb252c25a6687ae",
		"4a4109b691cff5212081181a39a093ad0719e4b277b5843d9ee8df371be1937d",
		"aa1eb7253585743b7f0dfb734bf42276f22a9bdebc560d2720a4e8946aecc750",
		"0df74b0df1e2d0c870fc400641c77d0fb220bd9cf94b03447eacd31d52161571",
		"e845e6235615fc88d96add9d02f2ab04e09d91526c10335a45913750cc0d4dcf",
		"6eb89d09797ceb5527a4f5ef3007ea1a06b21fd3df098a1fbc86939251e37069",
		"f2b7a5d0127f0aa5b6b88981b18323763df031a39b86f9df7ca7dad687a7b70e",
		"5f6618290848175408512f3db0e09877583f7bac3246f823b837233ff8a9f15d",
		"cd8761b195e3c9fef78b73fb6daa3ba15ade1317e175369090e751a1c5f265ee",
		"00b5a8a3e34bad169b49b93b6797596322bbb2ed629e912ef8ae32e00b8cff4c",
		"2c1fc53104a8bec9329a9bd77347ef5af3bc6ff83a5eb1361e4ad170804fa0d9",
		"38ba9b65d7a9c17084a8542ff84ef34fa5ca47ef22ac22343679843bc6d47add",
		"4d82871e4b7709e4b98b5587eae28adc767df59483145f4e935dc1e28a5de131",
		"eba2db4372a46a4469b0a38cfc9982f8dc7111771cf1c885a4cea8f525a6f298",
		"2b4c0340e035dc8bb421faf45d2971716ecabdb5cfaf3eed861ea79bf3424bb1",
		"ab26d6979d81010363edb78c6730aada0116f4db31d4208cafde38daf9be1e76",
		"444fa7c52206b1718d042c00f13ba9555af9b7c67f66016536bde66eea152707",
		"f8a8d3c62a70d3f0f56c38d1b738b157ce7ffd880babb9d30320d4a8a3d35211",
		"47bdb395abec7d3590d597e56050d2afde82114c5271c60c78059ada5b129ea8",
		"0df1e814000b638694385a58d7d188258cf07fd564f00f6e16d0385793c4f9cc",
		"c339c6434fd25d76e1f335fb27488426e9d8dc3310753a3df8c981f2a2af5718",
		"cfc761992c274e642aba53bf2b42ab74352863335cdbdd26f4a41356036e380b",
		"d8099deb79d26d8bcbf622d18163fa9f915ba837f27b66e72e69e279ea5c33b4",
		"78c071b4120b73767b4b1a01ac595e97e36f03c51cf4ea948796df64128cd48d",
		"97c532667290b2a2fe414996a5d95f97e415c0b5cf13dc90e8e9af72edffafed",
		"0b27ec470cd6cbaf25a28c5180d97cfca5c299876543347069c3b41981e8b974",
		"3fd8c6c31fd2bd63d33b5ad4757e20fcbb8e797f1e79ba256ad858d7ae643eb6",
		"b4a78fa32d4750d593723f7ada71f2d682bb3e9cf29a175aae7495c9264e76f3",
		"0b19c53c3ff95c5770f001114d223cde5419c1211114c6b11d9f7efcf1c2febd",
		"433819001cfca9c4e4b4257105f99e69b006e7fd276cc1fc2f4d830b40b72195",
		"21593cb3d410276c74a3253f2f66e14a764803572f76e6e139c42ea094f392b4",
		"dfcd99c744e94ad47acaefd212575a2147932cc79bd64e0e34c434efb1bbaa22"
	];

	let kittyInfos = [];

  	onMount(async () => {
  		kittyInfos = await fetchAssetInfos(kittyIds);

  		kittyInfos.sort((a, b) => {
		  const numA = parseInt(a.name.match(/\d+/)[0]);
		  const numB = parseInt(b.name.match(/\d+/)[0]);
		  
		  return numA - numB;
		});

  		isLoading = false;
  	});

</script>

<div class="container top-margin text-white mb-3">
    <br>
    <h1 class="section-title text-4xl font-bold text-white  text-center pt-2 mb-5">Mew Kitties</h1>
	{#if isLoading}
		<div class="loading-holder">
			<Loading />
		</div>
	{:else}
		<div class="kitties-container">
			{#if !isLoading}
				{#each kittyInfos as kitty}
					<div class="kitty-holder">
						<img src="{kitty.cachedurl}">
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style type="text/css">
	.kitties-container {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 20px;
		justify-content: space-between;
		margin-bottom: 34px;
	}

	.kitty-holder:hover {
		scale: 1.05;
	}

	.kitty-holder {
		scale: 1.0;
		transition: 0.2s all;
		cursor: pointer;
	}

	 @media (min-width: 400px) {
    .kitties-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 600px) {
    .kitties-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 750px) {
    .kitties-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 992px) {
    .kitties-container {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1200px) {
    .kitties-container {
      grid-template-columns: repeat(5, 1fr);
    }
  }
</style>