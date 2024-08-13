<script>
    export let message = "";
    export let show = false; // Add a prop to control the visibility
  </script>
  
  <style>
    .tooltip-container {
      position: relative;
      display: inline-block;
    }
  
    .tooltip-text {
      visibility: hidden;
      width: 242px;
      background-color: var(--footer);
      color: #fff;
      text-align: left;
      border-radius: 12px;
      padding: 10px;
      position: absolute;
      z-index: 1;
      top: 125%; 
      right: -53px;
      margin-left: -110px;
      opacity: 0;
      transition: opacity 0.3s, visibility 0.3s;
    }
    
    .tooltip-container[data-show="true"] .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
  
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  
    li {
      padding: 5px 0;
    }
  </style>
  
  <div class="tooltip-container" data-show={show} onclick="event.stopPropagation()">
    <slot></slot>
    <div class="tooltip-text">
      <ul>
        {#each message.split('\n') as line}
          <li>{@html line}</li>
        {/each}
      </ul>
    </div>
  </div>
  