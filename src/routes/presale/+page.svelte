<script>
	let ergAmount = 100;
	let mewAmount = 14286;
  
	$: usdAmount = (ergAmount * 0.75).toFixed(9);
	$: mewAmount = (ergAmount / 0.01).toFixed(2);
  
	function handleContribute() {
	  
	}
  </script>
  
  <div class="container p-0 top-margin text-custom-light mb-5">
    <br>
    <h1 class="section-title text-4xl font-bold text-custom-cyan text-center pt-2 mb-4">Presale</h1>
    <br>
  <div class="staker-sale px-2">
	<div class="sale-container">
	  <div class="sale-form">
		<h2>Mew</h2>
		<h3>Sale contribution</h3>
		<br>		
		<div class="input-group">
		  <input type="number" bind:value={ergAmount} />
		  <span class="currency">ERG</span>
		  <span class="usd-amount"> ~${usdAmount}</span>
		</div>
		
		<div class="input-group">
		  <input type="number" bind:value={mewAmount} />
		  <span class="currency">MEW</span>
		</div>
		
		<br>		
		<button on:click={handleContribute} disabled>Contribute now</button>
	  </div>
	  
	  <div class="sale-info m-0" style="height: min-content;">
		
		<div class="info-item">
		  <h4 class="text-custom-yellow">ROUND CLOSED</h4>
		  <span>Opens 14-09-2024 16:00 UTC</span>
		</div>
		
		<div class="info-item">
		  <h4 class="text-custom-yellow">MEW CLAIMED: 0</h4>
		  
		  <div class="progress-bar">
			<div class="progress-fill" style="width: 0%"></div>
		  </div>
		  <span class="target">MEW TARGET: 6,000,000</span>
		</div>
		
		<div class="info-item m-0">
		  <h4 class="text-custom-yellow">PRICE</h4>
		  <span>1 MEW = 0.01 ERG</span>
		</div>
	  </div>
	</div>
  </div>
</div>
  
  <style>
  	h4 {
  		font-weight: bold;
  	}

	.staker-sale {
	  color: #FFFFFF;
	  max-width: 1200px;
	  margin: auto;
	  border-radius: 20px;
	}
  
	.sale-container {
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: space-between;
	}
  
	.sale-form, .sale-info {
	  background-color: #160d25;
	  padding: 20px;
	  border-radius: 15px;
	  width: 100%;
	  margin-bottom: 20px;
	}
  
	@media (min-width: 768px) {
	  .sale-form, .sale-info {
		width: 48%;
		margin-bottom: 0;
	  }
	}
   
	h2 {
	  font-size: 2.5em;
	  color: #f7d52c;
	}
  
	.warning {
	  color: #FF6347;
	}
  
	.input-group {
	  margin-bottom: 15px;
	
	  padding: 15px;
	  border-radius: 10px;
	  border: 1px solid #f7d52c;
	}
  
	input[type="number"] {
	  background-color: transparent;
	  border: none;
	  color: #FFFFFF;
	  font-size: 1.2em;
	  width: 100%;
	}
  
	.currency, .usd-amount, .remaining {
	  display: block;
	  font-size: 0.9em;
	  color: #f7d52c;
	}
  
	.checkbox-container {
	  display: block;
	  margin-bottom: 20px;
	}
  
	.link {
	  color: #f7d52c;
	  text-decoration: none;
	}
  
	button {
	  background-color: #f7d52c;
	  color: #2D1C43;
	  border: none;
	  padding: 15px 20px;
	  border-radius: 10px;
	  cursor: pointer;
	  width: 100%;
	  font-weight: bold;
	  font-size: 1.1em;
	  transition: background-color 0.3s;
	}
  
	button:hover:not(:disabled) {
	  background-color: #f7d52c;
	}
  
	button:disabled {
	  opacity: 0.5;
	  cursor: not-allowed;
	}
  
	.info-item {
	  margin-bottom: 20px;
	  background-color: #4D3A67;
	  padding: 15px;
	  border-radius: 10px;
	}
  
	.time {
	  font-size: 1.5em;
	  font-weight: bold;
	  color: #f7d52c;
	}
  
	.progress-bar {
	  background-color: #2D1C43;
	  height: 20px;
	  border-radius: 10px;
	  overflow: hidden;
	  margin-top: 10px;
	}
  
	.progress-fill {
	  background-color: #f7d52c;
	  height: 100%;
	}
  
	.target {
	  display: block;
	  font-size: 0.9em;
	  color: #f7d52c;
	  margin-top: 5px;
	}
  </style>