<script>
	import { onMount } from 'svelte';
  
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
	  { name: "Tier 1", price: 5, mew: 5000 },
	  { name: "Tier 2", price: 15, mew: 15000 },
	  { name: "Tier 3", price: 45, mew: 45000 },
	  { name: "Tier 4", price: 150, mew: 150000 },
	  { name: "Tier 5", price: 300, mew: 300000 }
	];
  
	let selectedPlan = plans[0]; // Default to Tier 1
  
	function selectPlan(plan) {
	  selectedPlan = plan;
	}
  </script>
<div class="tokenomics-container bg-custom-dark text-custom-light">
	<h1 class="text-custom-cyan">TOKENOMICS</h1>
	<h2 class="text-custom-yellow">Token Distribution</h2>
  
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
			<span class="amount">1,000,000,000</span>
			<span class="currency">$MEW</span>
		  </div>
		</div>
  
		<div class="allocation-details">
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
  
	  <div class="tier-section bg-custom-purple rounded-lg p-6">
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
			<h4 class="text-lg mb-2">{selectedPlan.name} details:</h4>
			<ul>
			  <li>Lock {selectedPlan.mew.toLocaleString()} MEW</li>
			  <li>Staking booster: {0.5 * plans.indexOf(selectedPlan) + 0.5}%</li>
			  <li>Sale allocation: {0.15 * (plans.indexOf(selectedPlan) + 1)}x</li>
			</ul>
		  </div>
		  <div class="tier-action">
			<p class="text-sm text-gray-400 mb-2">Lock amount</p>
			<p class="text-3xl font-bold mb-2 text-custom-yellow">{selectedPlan.mew.toLocaleString()} MEW</p>
			<p class="text-xl font-bold mb-4 text-custom-yellow">{selectedPlan.price} ERG</p>
			<button class="lock-button bg-custom-yellow text-custom-dark">
			  Lock now
			</button>
		  </div>
		</div>
	  </div>
	</div>
  </div>
  
  <style>
	.tokenomics-container {
	  font-family: Arial, sans-serif;
	  padding: 13rem;
	  text-align: center;
	}
  
	h1 {
	  font-size: 2.5rem;
	  margin-bottom: 0;
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
	  background-color: rgba(255, 255, 255, 0.1);
	  padding: 0.5rem;
	  border-radius: 0.5rem;
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
	  background-color: rgba(255, 255, 255, 0.1);
	  color: #D3D0E7;
	  transition: background-color 0.3s;
	}
  
	.tier-button.active {
	  background-color: #2B1640;
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
  
	.text-custom-cyan {
	  color: #00FFFF;
	}
  
	.text-custom-yellow {
	  color: #FFD700;
	}
  
	.bg-custom-dark {
	  background-color: #0A0718;
	}
  
	.bg-custom-purple {
	  background-color: #4E215F;
	}
  
	.bg-custom-yellow {
	  background-color: #FFDF46;
	}
  
	.text-custom-dark {
	  color: #0A0718;
	}
  </style>