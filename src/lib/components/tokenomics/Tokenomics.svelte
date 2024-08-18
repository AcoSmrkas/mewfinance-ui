<script>
    import { onMount } from 'svelte';
  
    const segments = [
      { name: 'Segment 1', percentage: 30, color: '#00FFFF' },
      { name: 'Segment 2', percentage: 25, color: '#FFD700' },
      { name: 'Segment 3', percentage: 20, color: '#FF69B4' }, // Using a pink color for variety
      { name: 'Segment 4', percentage: 15, color: '#9370DB' }, // Using a purple color for variety
      { name: 'Segment 5', percentage: 10, color: '#20B2AA' }, // Using a light sea green for variety
    ];
  
    const size = 400;
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
	let plans = [
	  { name: "Starter", price: 49 },
	  { name: "Standard", price: 99 },
	  { name: "Premium", price: 199 },
	  { name: "Enterprise", price: 499 }
	];
	
	let selectedPlan = plans[1]; // Default to Standard plan
  
	function selectPlan(plan) {
	  selectedPlan = plan;
	}
  </script>


  <div class="main-container bg-custom-dark text-custom-light p-4 sm:p-8 rounded-lg max-w-4xl mx-auto">
	<div class="tokenomics-container">
	  <h1>TOKENOMICS</h1>
	  <h2>Token Distribution</h2>
  
	  <div class="chart-container">
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
		  {#each paths as path}
			<path d={path.d} fill={path.fill} on:click={() => handleSegmentClick(path.segment)} />
		  {/each}
		</svg>
		<div class="center-text">
		  <span class="amount">1,000,000,000</span>
		  <span class="currency">$HIFI</span>
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
  
	<div class="pricing-container mt-8">
	  <div class="bg-custom-purple p-4 sm:p-6 rounded-lg mb-8">
		<h2 class="text-xl mb-4 text-custom-yellow">Choose a tier plan:</h2>
		<div class="flex flex-wrap mb-6">
		  {#each plans as plan}
		  <button
			class="flex-1 py-2 px-4 text-custom-light mb-2 sm:mb-0 {selectedPlan === plan ? 'bg-custom-dark' : 'bg-custom-hover hover:bg-custom-dark'} 
			  rounded-lg sm:rounded-none
			  {plan === plans[0] ? 'sm:rounded-l-lg' : ''} 
			  {plan === plans[plans.length - 1] ? 'sm:rounded-r-lg' : ''}"
			on:click={() => selectPlan(plan)}
		  >
			{plan.name}
		  </button>
		  {/each}
		</div>
		<h3 class="text-lg mb-2">{selectedPlan.name} details:</h3>
		<ul>
		  <li>- 0% FEES</li>
		  <li>Free cancellation</li>
		</ul>
	  </div>
	  
	  <div class="bg-custom-purple p-4 sm:p-6 rounded-lg">
		<h2 class="text-2xl mb-2 text-custom-yellow">{selectedPlan.name} Tiers</h2>
		<p class="text-sm text-gray-400 mb-4">Starts at</p>
		<p class="text-4xl sm:text-5xl font-bold mb-6 text-custom-yellow">{selectedPlan.price} MEW</p>
		<button class="w-full bg-custom-yellow hover:bg-custom-hover text-custom-dark py-2 rounded-lg mb-4">
		  Buy now
		</button>
		<a href="#" class="text-custom-yellow hover:underline flex items-center justify-center sm:justify-start">
		  View pricing
		  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
			<path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
		  </svg>
		</a>
	  </div>
	</div>
  </div>
  
  <style>
	.main-container {
	  font-family: Arial, sans-serif;
	  color: #FFFFFF;
	  padding: 20px;
	  margin-top: 40px;
	}
  
	.tokenomics-container {
	  text-align: center;
	}
  
	h1 {
	  font-size: 1.8em;
	  margin-bottom: 0;
	  color: #00FFFF;
	}
  
	h2 {
	  font-size: 1.1em;
	  margin-top: 0;
	  color: #FFD700;
	}
  
	.chart-container {
	  position: relative;
	  width: 100%;
	  max-width: 400px;
	  margin: 30px auto;
	}
  
	.center-text {
	  position: absolute;
	  top: 50%;
	  left: 50%;
	  transform: translate(-50%, -50%);
	  text-align: center;
	}
  
	.amount {
	  font-size: 1.4em;
	  font-weight: bold;
	  display: block;
	}
  
	.currency {
	  font-size: 1em;
	}
  
	.allocation-details {
	  text-align: left;
	  width: 100%;
	  max-width: 400px;
	  margin: 0 auto;
	}
  
	.allocation-item {
	  display: flex;
	  align-items: center;
	  margin-bottom: 15px;
	  padding: 5px;
	  border-radius: 5px;
	  transition: background-color 0.3s;
	}
  
	.allocation-item.selected {
	  background-color: rgba(255, 255, 255, 0.1);
	}
  
	.color-indicator {
	  width: 20px;
	  height: 20px;
	  border-radius: 50%;
	  margin-right: 10px;
	  flex-shrink: 0;
	}
  
	.allocation-text {
	  display: flex;
	  flex-direction: column;
	}
  
	.allocation-name {
	  font-weight: bold;
	}
  
	.allocation-percentage {
	  font-size: 1.1em;
	}
  
	@media (min-width: 768px) {
	  h1 {
		font-size: 2em;
	  }
  
	  h2 {
		font-size: 1.2em;
	  }
  
	  .amount {
		font-size: 1.8em;
	  }
  
	  .currency {
		font-size: 1.2em;
	  }
  
	  .allocation-percentage {
		font-size: 1.2em;
	  }
	}
  
	.bg-custom-dark {
	  background-color: #0A0718;
	}
  
	.text-custom-light {
	  color: #D3D0E7;
	}
  
	.bg-custom-purple {
	  background-color: #4E215F;
	}
  
	.bg-custom-hover {
	  background-color: #2B1640;
	}
  
	.text-custom-yellow {
	  color: #FFDF46;
	}
  
	.bg-custom-yellow {
	  background-color: #FFDF46;
	}
  
	.text-custom-dark {
	  color: #0A0718;
	}
  </style>