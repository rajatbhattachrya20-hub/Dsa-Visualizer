// ===== GRAPH VISUALIZER PAGE =====
import { bfsSteps, dfsSteps, dijkstraSteps, getShortestPath } from '../algorithms/graph.js';
import { showToast, addRecent, AlgorithmRunner } from '../utils.js';

let graphNodes = [
  { id: 'A', x: 80,  y: 120 },
  { id: 'B', x: 220, y: 60 },
  { id: 'C', x: 220, y: 200 },
  { id: 'D', x: 380, y: 60 },
  { id: 'E', x: 380, y: 200 },
  { id: 'F', x: 500, y: 130 },
];

let graphEdges = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'C', weight: 1 },
  { from: 'B', to: 'D', weight: 5 },
  { from: 'C', to: 'E', weight: 8 },
  { from: 'C', to: 'D', weight: 8 },
  { from: 'D', to: 'E', weight: 2 },
  { from: 'D', to: 'F', weight: 6 },
  { from: 'E', to: 'F', weight: 3 },
];

let mode = 'select'; // 'select' | 'add-node' | 'add-edge' | 'remove'
let selectedNodeForEdge = null;
let currentAlgo = 'bfs';
let runner = null;
let speedMs = 400;

export function renderGraphs(container) {
  addRecent('graphs');
  renderGraphPage(container);
}

function renderGraphPage(container) {
  container.innerHTML = `
    <div class="page-enter">
      <div style="margin-bottom:var(--space-6);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3)">
        <div>
          <h2>Graph Visualizer</h2>
          <p style="margin-top:4px">Interactive graph algorithm visualizations: BFS, DFS, and Dijkstra's Shortest Path</p>
        </div>
      </div>

      <div class="viz-layout">
        <div class="viz-panel">
          <div class="viz-panel-header">
            <span class="viz-panel-title">Graph Canvas</span>
            <div style="display:flex;gap:var(--space-2);align-items:center">
              <span class="badge badge-blue">Nodes: <span id="graph-node-count">${graphNodes.length}</span></span>
              <span class="badge badge-purple">Edges: <span id="graph-edge-count">${graphEdges.length}</span></span>
            </div>
          </div>

          <!-- Interactive canvas mode bar -->
          <div class="graph-mode-bar">
            <span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);display:flex;align-items:center;margin-right:4px">MODE:</span>
            <button class="graph-mode-btn ${mode === 'select' ? 'active' : ''}" data-mode="select">👆 Select / Inspect</button>
            <button class="graph-mode-btn ${mode === 'add-node' ? 'active' : ''}" data-mode="add-node">➕ Click to Add Node</button>
            <button class="graph-mode-btn ${mode === 'add-edge' ? 'active' : ''}" data-mode="add-edge">🔗 Connect Edges</button>
            <button class="graph-mode-btn ${mode === 'remove' ? 'active' : ''}" data-mode="remove">🗑️ Remove Node</button>
          </div>

          <!-- Canvas -->
          <div class="graph-canvas-wrap" id="graph-canvas-wrap">
            <svg id="graph-svg" class="graph-svg" width="100%" height="380" viewBox="0 0 580 340"></svg>
          </div>

          <!-- Step explainer -->
          <div style="padding:0 var(--space-5) var(--space-3)">
            <div class="step-explainer" id="graph-step-explainer">
              <div class="step-number" id="graph-step-num">Ready</div>
              <div class="step-text" id="graph-step-text">Select an algorithm, choose start/end nodes, and click Run.</div>
            </div>
          </div>

          <!-- Execution Controls -->
          <div class="controls-panel">
            <div class="controls-row" style="flex-wrap:wrap;gap:var(--space-3)">
              <div class="control-group">
                <label class="control-label">Algorithm</label>
                <select class="select" id="graph-algo-select" style="min-width:140px">
                  <option value="bfs">BFS (Breadth First)</option>
                  <option value="dfs">DFS (Depth First)</option>
                  <option value="dijkstra">Dijkstra's Algorithm</option>
                </select>
              </div>

              <div class="control-group">
                <label class="control-label">Start Node</label>
                <select class="select" id="graph-start-node" style="min-width:90px"></select>
              </div>

              <div class="control-group" id="graph-end-group" style="display:none">
                <label class="control-label">Target Node</label>
                <select class="select" id="graph-end-node" style="min-width:90px"></select>
              </div>

              <div class="playback-btns" style="align-self:flex-end">
                <button class="playback-btn" id="graph-reset-btn" title="Reset">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 101.854-4.147"/></svg>
                </button>
                <button class="playback-btn play-btn" id="graph-run-btn" title="Run Algorithm">
                  <svg id="graph-play-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
                <button class="playback-btn" id="graph-step-btn" title="Step Forward">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
                </button>
              </div>

              <div class="control-group" style="flex:1;min-width:120px">
                <label class="control-label">Speed</label>
                <input type="range" class="range-slider" id="graph-speed" min="1" max="5" value="3" />
              </div>
            </div>

            <div class="controls-row" style="gap:var(--space-2);margin-top:var(--space-3)">
              <button class="btn btn-secondary btn-sm" id="graph-preset-sample">Sample Graph</button>
              <button class="btn btn-secondary btn-sm" id="graph-preset-linear">Linear Graph</button>
              <button class="btn btn-secondary btn-sm" id="graph-preset-dense">Complete Graph</button>
              <button class="btn btn-danger btn-sm" id="graph-clear-all">Clear All</button>
            </div>
          </div>

          <!-- Dijkstra / Algorithm Data Display -->
          <div style="padding:var(--space-4) var(--space-5)" id="graph-extra-info">
            <div class="stats-grid" id="graph-state-stats">
              <div class="stat-item">
                <div class="stat-value" id="graph-curr-node" style="color:var(--accent-yellow)">—</div>
                <div class="stat-label">Current Node</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" id="graph-visited-count" style="color:var(--accent-green)">0</div>
                <div class="stat-label">Visited Nodes</div>
              </div>
              <div class="stat-item" style="grid-column: span 2">
                <div class="stat-value" id="graph-queue-state" style="font-size:0.95rem;text-align:left;overflow-x:auto;white-space:nowrap">—</div>
                <div class="stat-label" id="graph-queue-label">Queue / Stack State</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Info panel -->
        <div class="viz-info-panel">
          <!-- Dijkstra distance table card -->
          <div class="card" id="dijkstra-card" style="display:none">
            <h3>Shortest Path Table</h3>
            <div style="margin-top:var(--space-3);max-height:220px;overflow-y:auto">
              <table class="dijkstra-table" id="dijkstra-table-body"></table>
            </div>
            <div id="dijkstra-path-result" style="margin-top:var(--space-3);font-size:0.85rem;font-weight:700;color:var(--accent-green)"></div>
          </div>

          <div class="card">
            <h3 id="graph-info-title">Graph Algorithms</h3>
            <div class="info-section" style="margin-top:var(--space-4)">
              <h4>Algorithm Overview</h4>
              <p id="graph-info-desc"></p>
            </div>
            <div class="info-section">
              <h4>Complexity</h4>
              <div class="complexity-grid" id="graph-complexity-grid"></div>
            </div>
            <div class="info-section">
              <h4>Legend</h4>
              <div style="display:flex;flex-direction:column;gap:var(--space-2)">
                <div class="legend-item"><div class="legend-dot" style="border-radius:50%;background:var(--accent-blue)"></div>Unvisited Node</div>
                <div class="legend-item"><div class="legend-dot" style="border-radius:50%;background:var(--accent-yellow)"></div>Current Active Node</div>
                <div class="legend-item"><div class="legend-dot" style="border-radius:50%;background:var(--accent-green)"></div>Visited Node</div>
                <div class="legend-item"><div class="legend-dot" style="border-radius:50%;background:var(--accent-purple)"></div>Shortest Path / Target</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  populateNodeDropdowns();
  renderGraphSvg();
  updateGraphAlgoInfo();
  bindGraphEvents(container);
}

function getAdjacencyList() {
  const adj = {};
  graphNodes.forEach(n => { adj[n.id] = []; });
  graphEdges.forEach(e => {
    if (adj[e.from]) adj[e.from].push({ to: e.to, weight: e.weight || 1 });
    if (adj[e.to]) adj[e.to].push({ to: e.from, weight: e.weight || 1 });
  });
  return adj;
}

function populateNodeDropdowns() {
  const startSelect = document.getElementById('graph-start-node');
  const endSelect = document.getElementById('graph-end-node');
  if (!startSelect || !endSelect) return;

  const currentStart = startSelect.value;
  const currentEnd = endSelect.value;

  const options = graphNodes.map(n => `<option value="${n.id}">${n.id}</option>`).join('');
  startSelect.innerHTML = options;
  endSelect.innerHTML = options;

  if (graphNodes.some(n => n.id === currentStart)) startSelect.value = currentStart;
  if (graphNodes.some(n => n.id === currentEnd)) endSelect.value = currentEnd;
  else if (graphNodes.length > 1) endSelect.value = graphNodes[graphNodes.length - 1].id;
}

function renderGraphSvg(highlightState = {}) {
  const svg = document.getElementById('graph-svg');
  if (!svg) return;

  const { current = null, visited = new Set(), path = [], queue = null, stack = null } = highlightState;

  let edgesHtml = '';
  graphEdges.forEach(e => {
    const fromNode = graphNodes.find(n => n.id === e.from);
    const toNode = graphNodes.find(n => n.id === e.to);
    if (!fromNode || !toNode) return;

    const isPath = path.length > 1 && path.some((p, i) => {
      if (i === path.length - 1) return false;
      return (p === e.from && path[i+1] === e.to) || (p === e.to && path[i+1] === e.from);
    });

    const stroke = isPath ? 'var(--accent-purple)' : 'var(--border-hover)';
    const strokeWidth = isPath ? '4' : '2';

    // Midpoint for weight badge
    const mx = (fromNode.x + toNode.x) / 2;
    const my = (fromNode.y + toNode.y) / 2;

    edgesHtml += `
      <line x1="${fromNode.x}" y1="${fromNode.y}" x2="${toNode.x}" y2="${toNode.y}" stroke="${stroke}" stroke-width="${strokeWidth}" class="graph-edge"/>
      <g transform="translate(${mx}, ${my})">
        <rect x="-10" y="-8" width="20" height="16" rx="4" fill="var(--bg-secondary)" stroke="var(--border)" stroke-width="1"/>
        <text x="0" y="3" text-anchor="middle" font-size="10" font-weight="700" fill="var(--text-secondary)" font-family="JetBrains Mono">${e.weight}</text>
      </g>
    `;
  });

  let nodesHtml = '';
  graphNodes.forEach(n => {
    let fill = 'var(--accent-blue)';
    let stroke = 'rgba(79, 156, 249, 0.4)';

    if (path.includes(n.id)) {
      fill = 'var(--accent-purple)';
      stroke = 'rgba(167, 139, 250, 0.6)';
    } else if (current === n.id) {
      fill = 'var(--accent-yellow)';
      stroke = 'rgba(251, 191, 36, 0.7)';
    } else if (visited.has(n.id)) {
      fill = 'var(--accent-green)';
      stroke = 'rgba(52, 211, 153, 0.5)';
    }

    if (selectedNodeForEdge === n.id) {
      stroke = 'var(--accent-pink)';
    }

    nodesHtml += `
      <g class="graph-node-group" data-id="${n.id}" style="cursor:pointer">
        <circle cx="${n.x}" cy="${n.y}" r="22" fill="${fill}" stroke="${stroke}" stroke-width="3" class="graph-node-circle"/>
        <text x="${n.x}" y="${n.y + 5}" text-anchor="middle" fill="#ffffff" class="graph-node-text">${n.id}</text>
      </g>
    `;
  });

  svg.innerHTML = edgesHtml + nodesHtml;

  const countNode = document.getElementById('graph-node-count');
  const countEdge = document.getElementById('graph-edge-count');
  if (countNode) countNode.textContent = graphNodes.length;
  if (countEdge) countEdge.textContent = graphEdges.length;
}

function updateGraphAlgoInfo() {
  const algo = currentAlgo;
  const title = document.getElementById('graph-info-title');
  const desc = document.getElementById('graph-info-desc');
  const endGroup = document.getElementById('graph-end-group');
  const dijkstraCard = document.getElementById('dijkstra-card');
  const qLabel = document.getElementById('graph-queue-label');

  if (algo === 'bfs') {
    if (title) title.textContent = 'Breadth-First Search (BFS)';
    if (desc) desc.textContent = 'BFS explores the graph level by level starting from the source node using a Queue (FIFO). Ideal for finding shortest path in unweighted graphs.';
    if (endGroup) endGroup.style.display = 'none';
    if (dijkstraCard) dijkstraCard.style.display = 'none';
    if (qLabel) qLabel.textContent = 'Queue State (Front → Rear)';
    renderComplexity([
      { label: 'Time', value: 'O(V + E)' },
      { label: 'Space', value: 'O(V)' }
    ]);
  } else if (algo === 'dfs') {
    if (title) title.textContent = 'Depth-First Search (DFS)';
    if (desc) desc.textContent = 'DFS explores as deep as possible along each branch before backtracking, utilizing a Stack (LIFO) or recursion. Great for cycle detection and connectivity.';
    if (endGroup) endGroup.style.display = 'none';
    if (dijkstraCard) dijkstraCard.style.display = 'none';
    if (qLabel) qLabel.textContent = 'Stack State (Top → Bottom)';
    renderComplexity([
      { label: 'Time', value: 'O(V + E)' },
      { label: 'Space', value: 'O(V)' }
    ]);
  } else {
    if (title) title.textContent = "Dijkstra's Shortest Path";
    if (desc) desc.textContent = 'Finds the shortest paths between nodes in a weighted graph with non-negative edge weights. Greedily selects the unvisited node with minimal distance.';
    if (endGroup) endGroup.style.display = 'flex';
    if (dijkstraCard) dijkstraCard.style.display = 'block';
    if (qLabel) qLabel.textContent = 'Distance State';
    renderComplexity([
      { label: 'Time', value: 'O(V²)' },
      { label: 'Space', value: 'O(V)' }
    ]);
  }
}

function renderComplexity(items) {
  const grid = document.getElementById('graph-complexity-grid');
  if (!grid) return;
  grid.innerHTML = items.map(i => `
    <div class="complexity-item">
      <div class="complexity-label">${i.label}</div>
      <div class="complexity-value okay">${i.value}</div>
    </div>
  `).join('');
}

function bindGraphEvents(container) {
  // Mode switcher
  container.querySelectorAll('.graph-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      mode = btn.dataset.mode;
      selectedNodeForEdge = null;
      container.querySelectorAll('.graph-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGraphSvg();
    });
  });

  // Algorithm select
  const algoSelect = document.getElementById('graph-algo-select');
  if (algoSelect) {
    algoSelect.addEventListener('change', (e) => {
      currentAlgo = e.target.value;
      updateGraphAlgoInfo();
      resetGraphRunner();
    });
  }

  // SVG Click for adding nodes or connecting edges
  const svg = document.getElementById('graph-svg');
  if (svg) {
    svg.addEventListener('click', (e) => {
      const rect = svg.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 580;
      const clickY = ((e.clientY - rect.top) / rect.height) * 340;

      const group = e.target.closest('.graph-node-group');
      const nodeId = group ? group.dataset.id : null;

      if (mode === 'add-node') {
        if (!nodeId) {
          const nextLetter = String.fromCharCode(65 + graphNodes.length);
          graphNodes.push({ id: nextLetter, x: Math.round(clickX), y: Math.round(clickY) });
          populateNodeDropdowns();
          renderGraphSvg();
          showToast(`Added node ${nextLetter}`);
        }
      } else if (mode === 'remove') {
        if (nodeId) {
          graphNodes = graphNodes.filter(n => n.id !== nodeId);
          graphEdges = graphEdges.filter(ed => ed.from !== nodeId && ed.to !== nodeId);
          populateNodeDropdowns();
          renderGraphSvg();
          showToast(`Removed node ${nodeId}`);
        }
      } else if (mode === 'add-edge') {
        if (nodeId) {
          if (!selectedNodeForEdge) {
            selectedNodeForEdge = nodeId;
            showToast(`Selected ${nodeId}. Click another node to connect.`);
            renderGraphSvg();
          } else if (selectedNodeForEdge !== nodeId) {
            const exists = graphEdges.some(
              ed => (ed.from === selectedNodeForEdge && ed.to === nodeId) || (ed.from === nodeId && ed.to === selectedNodeForEdge)
            );
            if (!exists) {
              const weight = Math.floor(Math.random() * 9) + 1;
              graphEdges.push({ from: selectedNodeForEdge, to: nodeId, weight });
              showToast(`Connected ${selectedNodeForEdge} ↔ ${nodeId} (weight ${weight})`);
            }
            selectedNodeForEdge = null;
            renderGraphSvg();
          }
        }
      }
    });
  }

  // Speed
  document.getElementById('graph-speed').addEventListener('input', (e) => {
    const v = parseInt(e.target.value);
    const speeds = [0, 800, 500, 300, 150, 50];
    speedMs = speeds[v];
    if (runner) runner.setSpeed(speedMs);
  });

  // Presets
  document.getElementById('graph-preset-sample').addEventListener('click', () => {
    resetGraphRunner();
    graphNodes = [
      { id: 'A', x: 80,  y: 120 },
      { id: 'B', x: 220, y: 60 },
      { id: 'C', x: 220, y: 200 },
      { id: 'D', x: 380, y: 60 },
      { id: 'E', x: 380, y: 200 },
      { id: 'F', x: 500, y: 130 },
    ];
    graphEdges = [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'E', weight: 8 },
      { from: 'C', to: 'D', weight: 8 },
      { from: 'D', to: 'E', weight: 2 },
      { from: 'D', to: 'F', weight: 6 },
      { from: 'E', to: 'F', weight: 3 },
    ];
    populateNodeDropdowns();
    renderGraphSvg();
  });

  document.getElementById('graph-preset-linear').addEventListener('click', () => {
    resetGraphRunner();
    graphNodes = [
      { id: 'A', x: 70,  y: 170 },
      { id: 'B', x: 170, y: 170 },
      { id: 'C', x: 270, y: 170 },
      { id: 'D', x: 370, y: 170 },
      { id: 'E', x: 470, y: 170 },
    ];
    graphEdges = [
      { from: 'A', to: 'B', weight: 3 },
      { from: 'B', to: 'C', weight: 4 },
      { from: 'C', to: 'D', weight: 2 },
      { from: 'D', to: 'E', weight: 5 },
    ];
    populateNodeDropdowns();
    renderGraphSvg();
  });

  document.getElementById('graph-preset-dense').addEventListener('click', () => {
    resetGraphRunner();
    graphNodes = [
      { id: 'A', x: 280, y: 60 },
      { id: 'B', x: 440, y: 130 },
      { id: 'C', x: 380, y: 260 },
      { id: 'D', x: 180, y: 260 },
      { id: 'E', x: 120, y: 130 },
    ];
    graphEdges = [
      { from: 'A', to: 'B', weight: 2 },
      { from: 'B', to: 'C', weight: 3 },
      { from: 'C', to: 'D', weight: 1 },
      { from: 'D', to: 'E', weight: 4 },
      { from: 'E', to: 'A', weight: 5 },
      { from: 'A', to: 'C', weight: 6 },
      { from: 'B', to: 'D', weight: 7 },
    ];
    populateNodeDropdowns();
    renderGraphSvg();
  });

  document.getElementById('graph-clear-all').addEventListener('click', () => {
    resetGraphRunner();
    graphNodes = [];
    graphEdges = [];
    populateNodeDropdowns();
    renderGraphSvg();
  });

  // Play / Run
  document.getElementById('graph-run-btn').addEventListener('click', () => {
    if (graphNodes.length === 0) { showToast('Add some nodes first!'); return; }
    if (!runner || runner.isDone) initGraphRunner();
    if (runner.isPlaying) { runner.pause(); setGraphPlayIcon(false); }
    else { runner.play(); setGraphPlayIcon(true); }
  });

  // Step
  document.getElementById('graph-step-btn').addEventListener('click', () => {
    if (graphNodes.length === 0) { showToast('Add some nodes first!'); return; }
    if (!runner || runner.isDone) initGraphRunner();
    if (runner.isPlaying) runner.pause();
    setGraphPlayIcon(false);
    runner.stepForward();
  });

  // Reset
  document.getElementById('graph-reset-btn').addEventListener('click', () => {
    resetGraphRunner();
    renderGraphSvg();
  });
}

function initGraphRunner() {
  const startId = document.getElementById('graph-start-node').value;
  const endId = document.getElementById('graph-end-node').value;
  const adj = getAdjacencyList();

  let steps = [];
  let dijkstraResult = null;

  if (currentAlgo === 'bfs') {
    steps = bfsSteps(graphNodes, adj, startId);
  } else if (currentAlgo === 'dfs') {
    steps = dfsSteps(graphNodes, adj, startId);
  } else {
    dijkstraResult = dijkstraSteps(graphNodes, adj, startId);
    steps = dijkstraResult.steps;
  }

  runner = new AlgorithmRunner({
    steps,
    speed: speedMs,
    onStep: (step, idx, total) => {
      renderGraphSvg(step);
      document.getElementById('graph-step-num').textContent = `Step ${idx} / ${total}`;
      document.getElementById('graph-step-text').textContent = step.label;

      const currNode = document.getElementById('graph-curr-node');
      const visitedCount = document.getElementById('graph-visited-count');
      const queueState = document.getElementById('graph-queue-state');

      if (currNode) currNode.textContent = step.current || '—';
      if (visitedCount) visitedCount.textContent = step.visited ? step.visited.size : 0;

      if (step.queue) {
        queueState.textContent = step.queue.length > 0 ? step.queue.join(' → ') : '[empty]';
      } else if (step.stack) {
        queueState.textContent = step.stack.length > 0 ? step.stack.join(' → ') : '[empty]';
      } else if (step.dist) {
        queueState.textContent = Object.entries(step.dist).map(([k,v]) => `${k}:${v===Infinity?'∞':v}`).join(', ');
        renderDijkstraTable(step.dist, step.visited, step.current);
      }
    },
    onComplete: () => {
      setGraphPlayIcon(false);
      if (currentAlgo === 'dijkstra' && dijkstraResult) {
        const path = getShortestPath(dijkstraResult.prev, startId, endId);
        const finalDist = dijkstraResult.dist[endId];
        renderGraphSvg({ path, visited: new Set(graphNodes.map(n=>n.id)) });

        const pathResult = document.getElementById('dijkstra-path-result');
        if (pathResult) {
          pathResult.textContent = path.length > 0
            ? `✓ Shortest Path from ${startId} to ${endId}: ${path.join(' → ')} (Total Weight: ${finalDist})`
            : `✗ No path exists between ${startId} and ${endId}`;
        }
      }
      showToast(`${currentAlgo.toUpperCase()} visualization complete!`);
    }
  });
}

function renderDijkstraTable(dist, visited, current) {
  const table = document.getElementById('dijkstra-table-body');
  if (!table) return;

  table.innerHTML = `
    <thead>
      <tr>
        <th>Node</th>
        <th>Distance</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(dist).map(([node, d]) => `
        <tr class="${current === node ? 'current' : visited.has(node) ? 'visited' : ''}">
          <td><strong>${node}</strong></td>
          <td>${d === Infinity ? '∞' : d}</td>
          <td>${current === node ? 'Processing' : visited.has(node) ? 'Settled' : 'Unvisited'}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function resetGraphRunner() {
  if (runner) runner.reset();
  runner = null;
  setGraphPlayIcon(false);
  document.getElementById('graph-step-num').textContent = 'Ready';
  document.getElementById('graph-step-text').textContent = 'Select an algorithm, choose start/end nodes, and click Run.';
  const currNode = document.getElementById('graph-curr-node');
  const visitedCount = document.getElementById('graph-visited-count');
  const queueState = document.getElementById('graph-queue-state');
  const pathResult = document.getElementById('dijkstra-path-result');
  if (currNode) currNode.textContent = '—';
  if (visitedCount) visitedCount.textContent = '0';
  if (queueState) queueState.textContent = '—';
  if (pathResult) pathResult.textContent = '';
}

function setGraphPlayIcon(playing) {
  const icon = document.getElementById('graph-play-icon');
  if (!icon) return;
  icon.innerHTML = playing
    ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
    : '<polygon points="5 3 19 12 5 21 5 3"/>';
}
