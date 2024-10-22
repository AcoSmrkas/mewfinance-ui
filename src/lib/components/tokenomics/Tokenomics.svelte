<script>
	import { onMount } from 'svelte';
	import { clamp } from '$lib/utils/utils.js';
  
	const segments = [
	  { name: 'Presale', percentage: 35, color: '#00FFFF' },
	  { name: 'IDO Liquidity', percentage: 15, color: '#FFD700' },
	  { name: 'Team + Marketing', percentage: 20, color: '#FF69B4' },
	  { name: 'Reserve (Locked)', percentage: 30, color: '#9370DB' },
	];
  
	const size = 300;
	const radius = size / 2;
	const centerX = size / 2;
	const centerY = size / 2;
	const innerRadius = radius * 0.6;
  
	let selectedSegment = null;
  
	function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
	  return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	  };
	}
  
	function describeArc(x, y, radius, startAngle, endAngle, innerRadius) {
	  const start = polarToCartesian(x, y, radius, endAngle);
	  const end = polarToCartesian(x, y, radius, startAngle);
	  const innerStart = polarToCartesian(x, y, innerRadius, endAngle);
	  const innerEnd = polarToCartesian(x, y, innerRadius, startAngle);
	  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
	  return [
		"M", start.x, start.y,
		"A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
		"L", innerEnd.x, innerEnd.y,
		"A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
		"Z"
	  ].join(" ");
	}
  
	let cumulativeAngle = 0;
	const paths = segments.map(segment => {
	  const startAngle = cumulativeAngle;
	  const endAngle = cumulativeAngle + (segment.percentage / 100 * 360);
	  cumulativeAngle = endAngle;
	  return {
		d: describeArc(centerX, centerY, radius, startAngle, endAngle, innerRadius),
		fill: segment.color,
		segment
	  };
	});
  
	function handleSegmentClick(segment) {
	  selectedSegment = segment;
	}
  
	function handleKeydown(event, segment) {
	  if (event.key === 'Enter' || event.key === ' ') {
		handleSegmentClick(segment);
	  }
	}
  
	let plans = [
	  { name: "Tier 1", price: 5, mew: 15000 },
	  { name: "Tier 2", price: 15, mew: 50000 },
	  { name: "Tier 3", price: 45, mew: 150000 },
	  { name: "Tier 4", price: 150, mew: 300000 },
	  { name: "Tier 5", price: 300, mew: 500000 },
	  { name: "Tier 6", price: 300, mew: 500000 }
	];
  
	let selectedPlan = plans[0]; // Default to Tier 1
  
	function selectPlan(plan) {
	  selectedPlan = plan;
	}
  </script>

<div class="container top-margin text-custom-light mb-5">
    <br>
    <h1 class="section-title text-4xl font-bold text-white text-center pt-2 mb-4">Tokenomics</h1>
	<h2 class="text-custom-yellow text-center">Token Distribution</h2>
  	<br>
	<div class="content">
	  <div class="chart-section">
		<div class="chart-container">
		  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
			{#each paths as path}
			  <path 
				d={path.d} 
				fill={path.fill} 
				on:click={() => handleSegmentClick(path.segment)}
				on:keydown={(event) => handleKeydown(event, path.segment)}
				tabindex="0"
				role="button"
				aria-label={`${path.segment.name}: ${path.segment.percentage}%`}
			  />
			{/each}
		  </svg>
		  <div class="center-text">
			<span class="amount text-white">1,000,000,000</span>
			<span class="currency font-bold text-primary">MEW</span>
		  </div>
		</div>
  	
		<div class="allocation-details mt-3">
		  {#each segments as segment}
			<div class="allocation-item" class:selected={selectedSegment === segment}>
			  <div class="color-indicator" style="background-color: {segment.color};"></div>
			  <div class="allocation-text">
				<span class="allocation-name">{segment.name}</span>
				<span class="allocation-percentage">{segment.percentage}%</span>
			  </div>
			</div>
		  {/each}
		</div>
	  </div>
  
	  <div class="tier-section bg-form rounded-lg p-6">
		<h3 class="text-xl mb-4 text-custom-yellow">Choose a tier plan:</h3>
		<div class="tier-buttons mb-6">
		  {#each plans as plan}
		  <button
			class="tier-button {selectedPlan === plan ? 'active' : ''}"
			on:click={() => selectPlan(plan)}
		  >
			{plan.name}
		  </button>
		  {/each}
		</div>
		<div class="tier-details">
		  <div class="tier-info">
			<h4 class="text-lg mb-2"><b class="text-primary">{selectedPlan.name}</b> details:</h4>
			<ul id="benefits-list">
				<li class="benefits-list-item"><b><b class="text-primary">Mew DEX</b> fee:</b> {plans.indexOf(selectedPlan) == 5 ? 0 : 0.3 - 0.03 * clamp(plans.indexOf(selectedPlan) + 1, 0, 5)}%</li>
				<li class="benefits-list-item"><b><b class="text-primary">Mew Mart</b> sale fee:</b> {3.0 - 0.2 * clamp(plans.indexOf(selectedPlan) + 1, 0, 5)}%</li>
				<li class="benefits-list-item"><b><b class="text-primary">Mew Mart</b> list fee:</b> {plans.indexOf(selectedPlan) < 5 ? '0.03' : '0'} <b class="text-primary">ERG</b></li>
				<li class="benefits-list-item"><b><b class="text-primary">Mew Mart</b> cancel fee:</b> {plans.indexOf(selectedPlan) < 5 ? '0.01' : '0'} <b class="text-primary">ERG</b></li>
				{@html plans.indexOf(selectedPlan) < 3 ? '' : `<li class="benefits-list-item">Share of <b class="text-primary">Mew Mart</b>'s revenue as rewards every quarter</li>`}
				{@html plans.indexOf(selectedPlan) < 5 ? '' : `<li class="benefits-list-item">Share of <b class="text-primary">Mew DEX</b>'s revenue as rewards every quarter</li>`}
			</ul>
		  </div>
		  <div class="tier-action">
			<p class="text-sm text-gray-200 mb-2">Lock amount</p>
			<p class="text-3xl font-bold mb-2 text-custom-yellow">{selectedPlan.mew.toLocaleString()} MEW</p>
			{#if plans.indexOf(selectedPlan) == 5}
			<p class="text-3xl font-bold mb-3 text-custom-yellow">+1 MEW NFT</p>
			{:else}
			<p class="text-3xl font-bold mb-3 text-custom-yellow"> </p>
			{/if}
			<!--
			<p class="text-xl font-bold mb-4 text-custom-yellow">~{selectedPlan.price} ERG</p>
			-->
			<a href="/profile">
			<button class="btn btn-primary btn-big w-100">
			  Lock now
			</button>
			</a>
		  </div>
		</div>
	  </div>
	</div>
</div>
  
  <style>
  	#benefits-list {
  		list-style: square;
  	}

  	:global(ul li::marker) {
    	color: var(--main-color);
  	}	

	.tokenomics-container {
	  padding: 13rem;
	  text-align: center;
	}
  
  
	h2 {
	  font-size: 1.5rem;
	  margin-top: 0;
	}
  
	.content {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  gap: 2rem;
	  margin-top: 2rem;
	}
  
	.chart-section {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  gap: 1rem;
	}
  
	.chart-container {
	  position: relative;
	  width: 100%;
	  max-width: 300px;
	}
  
	.center-text {
	  position: absolute;
	  top: 50%;
	  left: 50%;
	  transform: translate(-50%, -50%);
	  text-align: center;
	}
  
	.amount {
	  font-size: 1.2rem;
	  font-weight: bold;
	  display: block;
	}
  
	.currency {
	  font-size: 0.9rem;
	}
  
	.allocation-details {
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: center;
	  gap: 1rem;
	}
  
	.allocation-item {
	  display: flex;
	  align-items: center;
	  background-color: var(--forms-bg);
	  padding: 0.5rem;
	  border-radius: 0.5rem;
	  width: 100%;
	}

	@media (min-width: 576px) {
		.allocation-item {
			width: 45%;
		}
	}
  
	.color-indicator {
	  width: 1rem;
	  height: 1rem;
	  border-radius: 50%;
	  margin-right: 0.5rem;
	}
  
	.tier-section {
	  width: 100%;
	  max-width: 600px;
	}
  
	.tier-buttons {
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: center;
	  gap: 0.5rem;
	}
  
	.tier-button {
	  padding: 0.5rem 1rem;
	  border-radius: 0.25rem;
	  background-color: var(--footer);
	  color: #D3D0E7;
	  transition: background-color 0.3s;
	}
  
	.tier-button.active {
	  background-color: var(--main-color);
	  color: var(--background);
	}
  
	.tier-details {
	  display: flex;
	  flex-direction: column;
	  gap: 1rem;
	}
  
	.lock-button {
	  width: 100%;
	  padding: 0.75rem;
	  border-radius: 0.5rem;
	  font-weight: bold;
	  transition: opacity 0.3s;
	}
  
	.lock-button:hover {
	  opacity: 0.9;
	}
  
	@media (min-width: 768px) {
	  .content {
		flex-direction: row;
		align-items: flex-start;
	  }
  
	  .chart-section {
		flex: 1;
	  }
  
	  .tier-section {
		flex: 1;
	  }
  
	  .tier-details {
		flex-direction: row;
	  }
  
	  .tier-info, .tier-action {
		flex: 1;
	  }
	}
  
  </style>