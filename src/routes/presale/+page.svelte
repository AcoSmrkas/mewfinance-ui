<script>
	let ergAmount = 100;
	let pdvAmount = 14286;
	let agreed = false;
  
	$: usdAmount = (ergAmount * 1.2821).toFixed(2);
  
	function handleContribute() {
	  if (agreed) {
		console.log('Contribution submitted');
	  } else {
		console.log('Please agree to the Terms of Use and Privacy Policy');
	  }
	}
  </script>
  
  <div class="staker-sale">
	<div class="sale-container">
	  <div class="sale-form">
		<h1>Mew</h1>
		<h3>Staker Sale contribution</h3>
		
		<p class="warning">
		  This round is 1st ido presale to launch mart
		</p>
		
		<p>Get Benefits like 0% fees on Mart and Dex</p>
		
		<div class="input-group">
		  <input type="number" bind:value={ergAmount} />
		  <span class="currency">ERG Σ</span>
		  <span class="usd-amount">${usdAmount}</span>
		</div>
		
		<div class="input-group">
		  <input type="number" bind:value={pdvAmount} />
		  <span class="currency">MeW</span>
		  <span class="remaining">6,000,000 MeW remaining</span>
		</div>
		
		<label class="checkbox-container">
		  <input type="checkbox" bind:checked={agreed}>
		  I agree to the <a href="#" class="link">Terms of Use</a> and <a href="#" class="link">Privacy Policy</a>.
		</label>
		
		<button on:click={handleContribute} disabled={!agreed}>Contribute now</button>
	  </div>
	  
	  <div class="sale-info">
	
		
		<div class="info-item">
		  <h4>ROUND CLOSED</h4>
		  <span>2024-05-28 6:00pm</span>
		</div>
		
		<div class="info-item">
		  <h4>MEW CLAIMED</h4>
		  <span>0</span>
		  <div class="progress-bar">
			<div class="progress-fill" style="width: 0%"></div>
		  </div>
		  <span class="target">MEW TARGET: 6,000,000</span>
		</div>
		
		<div class="info-item">
		  <h4>PRICE</h4>
		  <span>1 MEW = 0.007 Erg</span>
		</div>
		
		<div class="info-item">
		  <h4>TOTAL ERG DEPOSITED</h4>
		  <span>0 Σ</span>
		</div>
		
		
	  </div>
	</div>
  </div>
  
  <style>
	.staker-sale {
	  font-family: Arial, sans-serif;
	  color: #FFFFFF;
	  padding: 20px;
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
  
	h1, h2, h3, h4 {
	  margin: 0;
	  color: #f7d52c;
	}
  
	h1 {
	  font-size: 2.5em;
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