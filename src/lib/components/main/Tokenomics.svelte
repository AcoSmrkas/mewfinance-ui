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
  </script>
  
  <div class="tokenomics-container">
    <h1>TOKENOMICS</h1>
    <h2>Token Distribution</h2>
  
    <div class="content">
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
  </div>
  
  <style>
    .tokenomics-container {
      font-family: Arial, sans-serif;
      color: #FFFFFF;
      padding: 20px;
      text-align: center;
    }
  
    h1 {
      font-size: 2em;
      margin-bottom: 0;
      color: #00FFFF;
    }
  
    h2 {
      font-size: 1.2em;
      margin-top: 0;
      color: #FFD700;
    }
  
    .content {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 30px;
    }
  
    .chart-container {
      position: relative;
      width: 400px;
      height: 400px;
    }
  
    .center-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
  
    .amount {
      font-size: 1.8em;
      font-weight: bold;
      display: block;
    }
  
    .currency {
      font-size: 1.2em;
    }
  
    .allocation-details {
      text-align: left;
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
    }
  
    .allocation-text {
      display: flex;
      flex-direction: column;
    }
  
    .allocation-name {
      font-weight: bold;
    }
  
    .allocation-percentage {
      font-size: 1.2em;
    }
  </style>