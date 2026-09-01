// ===== SEARCHING VISUALIZER PAGE =====
import { linearSearchSteps, binarySearchSteps } from '../algorithms/searching.js';
import { CODE_SNIPPETS, ALGO_INFO } from '../data/algorithms.js';
import { generateRandomArray, parseArrayInput, AlgorithmRunner, buildCodePanel, complexityClass, addRecent, showToast } from '../utils.js';

let currentAlgo = 'linear-search';
let currentArray = generateRandomArray(12, 1, 50).sort((a,b) => a-b);
let displayArr = currentArray;
let runner = null;
let speedMs = 300;
let currentResult = null;

export function renderSearching(container) {
  addRecent('linear-search');

  container.innerHTML = `
    <div class="page-enter">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);flex-wrap:wrap;gap:var(--space-3)">
        <div>
          <h2>Searching Visualizer</h2>
          <p style="margin-top:4px">See how Linear and Binary Search find elements in an array</p>
        </div>
      </div>

      <div class="viz-layout">
        <div class="viz-panel">
          <!-- Algorithm selector -->
          <div class="algo-selector">
            <button class="algo-chip active" data-algo="linear-search" id="chip-linear">Linear Search</button>
            <button class="algo-chip" data-algo="binary-search" id="chip-binary">Binary Search</button>
          </div>

          <!-- Search cells -->
          <div style="position:relative;min-height:200px">
            <div class="search-array-container" id="search-array-container"></div>
            <div class="result-overlay" id="search-result-overlay" style="display:none">
              <div style="font-size:3rem" id="search-result-icon"></div>
              <div class="result-text" id="search-result-text"></div>
              <button class="btn btn-secondary" id="search-overlay-close">Close</button>
            </div>
          </div>

          <!-- Legend -->
          <div class="legend">
            <div class="legend-item"><div class="legend-dot" style="border-radius:4px;background:var(--accent-yellow);"></div>Checking</div>
            <div class="legend-item"><div class="legend-dot" style="border-radius:4px;background:var(--accent-green);"></div>Found</div>
            <div class="legend-item" id="legend-pointers" style="display:none">
              <div class="legend-dot" style="border-radius:4px;background:var(--accent-blue);"></div>Left
              <div class="legend-dot" style="border-radius:4px;background:var(--accent-orange);margin-left:4px"></div>Mid
              <div class="legend-dot" style="border-radius:4px;background:var(--accent-purple);margin-left:4px"></div>Right
            </div>
          </div>

          <!-- Step explainer -->
          <div style="padding:0 var(--space-5) var(--space-3)">
            <div class="step-explainer" id="search-step-explainer">
              <div class="step-number" id="search-step-num">Ready</div>
              <div class="step-text" id="search-step-text">Enter a target value and press Play to begin.</div>
            </div>
          </div>

          <!-- Controls -->
          <div class="controls-panel">
            <div class="controls-row" style="flex-wrap:wrap;gap:var(--space-3)">
              <div class="input-group" style="flex:1;min-width:180px">
                <label class="control-label" style="white-space:nowrap">Target:</label>
                <input type="number" class="input" id="search-target" placeholder="e.g. 25" style="max-width:100px" />
              </div>
              <div class="playback-btns">
                <button class="playback-btn" id="search-reset-btn" title="Reset">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 101.854-4.147"/></svg>
                </button>
                <button class="playback-btn play-btn" id="search-play-btn" title="Play/Pause">
                  <svg id="search-play-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
                <button class="playback-btn" id="search-step-btn" title="Step Forward">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
                </button>
              </div>
              <div class="control-group" style="flex:1;min-width:120px">
                <label class="control-label">Speed: <span id="search-speed-label">Medium</span></label>
                <input type="range" class="range-slider" id="search-speed" min="1" max="5" value="3" />
              </div>
            </div>
            <div class="controls-row" style="flex-wrap:wrap;gap:var(--space-2)">
              <button class="btn btn-secondary btn-sm" id="search-random-btn">Random Array</button>
              <input type="text" class="input" id="search-custom-input" placeholder="Custom: 3, 10, 22, 45..." style="max-width:240px;flex:1" />
              <button class="btn btn-secondary btn-sm" id="search-custom-btn">Use Custom</button>
            </div>
            <div id="search-bsort-note" class="step-explainer" style="margin-top:var(--space-3);display:none">
              <div class="step-number">Note</div>
              <div class="step-text">Binary Search requires a sorted array. Your array has been automatically sorted.</div>
            </div>
          </div>

          <!-- Stats -->
          <div style="padding:var(--space-4) var(--space-5)">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value" id="search-stat-steps">0</div>
                <div class="stat-label">Steps</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" id="search-stat-step">0</div>
                <div class="stat-label">Current Step</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" id="search-stat-total">-</div>
                <div class="stat-label">Total Steps</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" id="search-stat-result" style="font-size:1rem">—</div>
                <div class="stat-label">Result</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Info panel -->
        <div class="viz-info-panel">
          <div class="card">
            <h3 id="search-algo-name">Linear Search</h3>
            <div class="complexity-grid" id="search-complexity-grid" style="margin-top:var(--space-4)"></div>
          </div>
          <div class="card">
            <div class="tabs">
              <div class="tab active" data-tab="search-info">How it works</div>
              <div class="tab" data-tab="search-code">Code</div>
            </div>
            <div class="tab-content active" id="tab-search-info">
              <div class="info-section">
                <h4>What is it?</h4>
                <p id="search-what-text"></p>
              </div>
              <div class="info-section">
                <h4>How does it work?</h4>
                <ol class="algo-steps-list" id="search-how-list"></ol>
              </div>
              <div class="info-section">
                <h4>Pseudocode</h4>
                <pre class="pseudocode" id="search-pseudocode"></pre>
              </div>
            </div>
            <div class="tab-content" id="tab-search-code">
              <div id="search-code-panel"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  renderSearchCells(displayArr, { checking: -1, found: -1, eliminated: [] }, currentAlgo);
  updateSearchInfo();
  updateSearchComplexity();

  // Tabs
  container.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
      if (tab.dataset.tab === 'search-code') buildCodePanel(CODE_SNIPPETS[currentAlgo] || {}, 'search-code-panel');
    });
  });

  // Algo chips
  container.querySelectorAll('.algo-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentAlgo = chip.dataset.algo;
      container.querySelectorAll('.algo-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const isBinary = currentAlgo === 'binary-search';
      document.getElementById('search-bsort-note').style.display = isBinary ? 'block' : 'none';
      document.getElementById('legend-pointers').style.display = isBinary ? 'flex' : 'none';
      if (isBinary) {
        displayArr = [...currentArray].sort((a, b) => a - b);
      } else {
        displayArr = [...currentArray];
      }
      resetSearchRunner();
      renderSearchCells(displayArr, { checking: -1, found: -1, eliminated: [] }, currentAlgo);
      updateSearchInfo();
      updateSearchComplexity();
      addRecent(currentAlgo);
    });
  });

  // Random array
  document.getElementById('search-random-btn').addEventListener('click', () => {
    currentArray = generateRandomArray(12, 1, 50);
    displayArr = currentAlgo === 'binary-search' ? [...currentArray].sort((a,b) => a-b) : [...currentArray];
    resetSearchRunner();
    renderSearchCells(displayArr, { checking: -1, found: -1, eliminated: [] }, currentAlgo);
  });

  // Custom array
  document.getElementById('search-custom-btn').addEventListener('click', () => {
    const parsed = parseArrayInput(document.getElementById('search-custom-input').value);
    if (parsed.length < 2) { showToast('Enter at least 2 numbers'); return; }
    currentArray = parsed;
    displayArr = currentAlgo === 'binary-search' ? [...currentArray].sort((a,b) => a-b) : [...currentArray];
    resetSearchRunner();
    renderSearchCells(displayArr, { checking: -1, found: -1, eliminated: [] }, currentAlgo);
  });

  // Speed
  document.getElementById('search-speed').addEventListener('input', e => {
    const v = parseInt(e.target.value);
    const labels = ['', 'Very Slow', 'Slow', 'Medium', 'Fast', 'Very Fast'];
    const speeds = [0, 900, 600, 350, 180, 60];
    speedMs = speeds[v];
    document.getElementById('search-speed-label').textContent = labels[v];
    if (runner) runner.setSpeed(speedMs);
  });

  // Play/Pause
  document.getElementById('search-play-btn').addEventListener('click', () => {
    const target = parseInt(document.getElementById('search-target').value);
    if (isNaN(target)) { showToast('Enter a valid target number'); return; }
    if (!runner || runner.isDone) initSearchRunner(target);
    if (runner.isPlaying) { runner.pause(); setSearchPlayIcon(false); }
    else { runner.play(); setSearchPlayIcon(true); }
  });

  // Step
  document.getElementById('search-step-btn').addEventListener('click', () => {
    const target = parseInt(document.getElementById('search-target').value);
    if (isNaN(target)) { showToast('Enter a valid target number'); return; }
    if (!runner || runner.isDone) initSearchRunner(target);
    if (runner.isPlaying) runner.pause();
    setSearchPlayIcon(false);
    runner.stepForward();
  });

  // Reset
  document.getElementById('search-reset-btn').addEventListener('click', () => {
    resetSearchRunner();
    renderSearchCells(displayArr, { checking: -1, found: -1, eliminated: [] }, currentAlgo);
  });

  // Overlay close
  document.getElementById('search-overlay-close').addEventListener('click', () => {
    document.getElementById('search-result-overlay').style.display = 'none';
  });
}

function initSearchRunner(target) {
  let result;
  if (currentAlgo === 'linear-search') {
    result = linearSearchSteps(displayArr, target);
  } else {
    result = binarySearchSteps(displayArr, target);
    if (result.sortedArr) displayArr = result.sortedArr;
  }
  currentResult = result;
  const steps = result.steps;
  document.getElementById('search-stat-total').textContent = steps.length;

  runner = new AlgorithmRunner({
    steps,
    speed: speedMs,
    onStep: (step, idx, total) => {
      renderSearchCells(displayArr, step, currentAlgo);
      document.getElementById('search-step-num').textContent = `Step ${idx} / ${total}`;
      document.getElementById('search-step-text').textContent = step.label;
      document.getElementById('search-stat-step').textContent = idx;
      document.getElementById('search-stat-steps').textContent = idx;
    },
    onComplete: () => {
      setSearchPlayIcon(false);
      const found = currentResult.found;
      const idx = currentResult.index;
      const overlay = document.getElementById('search-result-overlay');
      const icon = document.getElementById('search-result-icon');
      const text = document.getElementById('search-result-text');
      const statResult = document.getElementById('search-stat-result');
      if (found) {
        overlay.className = 'result-overlay found';
        icon.textContent = '🎉';
        text.textContent = `Target found at index ${idx}`;
        statResult.textContent = `Found @ ${idx}`;
        statResult.style.color = 'var(--accent-green)';
      } else {
        overlay.className = 'result-overlay not-found';
        icon.textContent = '❌';
        text.textContent = `Target not found in array`;
        statResult.textContent = 'Not Found';
        statResult.style.color = 'var(--accent-red)';
      }
      overlay.style.display = 'flex';
    },
    onReset: () => {
      document.getElementById('search-step-num').textContent = 'Ready';
      document.getElementById('search-step-text').textContent = 'Press Play or Step to start.';
      document.getElementById('search-stat-steps').textContent = '0';
      document.getElementById('search-stat-step').textContent = '0';
      document.getElementById('search-stat-total').textContent = '-';
      document.getElementById('search-stat-result').textContent = '—';
      document.getElementById('search-stat-result').style.color = '';
    }
  });
}

function resetSearchRunner() {
  if (runner) runner.reset();
  runner = null;
  currentResult = null;
  setSearchPlayIcon(false);
  document.getElementById('search-result-overlay').style.display = 'none';
  document.getElementById('search-step-num').textContent = 'Ready';
  document.getElementById('search-step-text').textContent = 'Enter a target and press Play to begin.';
  document.getElementById('search-stat-steps').textContent = '0';
  document.getElementById('search-stat-step').textContent = '0';
  document.getElementById('search-stat-total').textContent = '-';
  document.getElementById('search-stat-result').textContent = '—';
  document.getElementById('search-stat-result').style.color = '';
}

function setSearchPlayIcon(playing) {
  const icon = document.getElementById('search-play-icon');
  if (!icon) return;
  icon.innerHTML = playing
    ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
    : '<polygon points="5 3 19 12 5 21 5 3"/>';
}

function renderSearchCells(arr, step, algo) {
  const container = document.getElementById('search-array-container');
  if (!container) return;
  const isBinary = algo === 'binary-search';

  container.innerHTML = arr.map((val, i) => {
    let cls = '';
    const ptrs = [];

    if (step.found === i) cls = 'found';
    else if (step.checking === i) cls = 'checking';
    else if (step.eliminated && step.eliminated.includes(i)) cls = 'eliminated';
    else if (isBinary) {
      if (step.left === i) { cls += ' left-ptr'; ptrs.push('L'); }
      if (step.mid === i) { cls += ' mid-ptr'; ptrs.push('M'); }
      if (step.right === i) { cls += ' right-ptr'; ptrs.push('R'); }
    }

    const ptrHtml = isBinary ? `
      ${step.left === i ? `<div class="search-ptr-label left">L</div>` : ''}
      ${step.mid === i ? `<div class="search-ptr-label mid">M</div>` : ''}
      ${step.right === i ? `<div class="search-ptr-label right">R</div>` : ''}
    ` : '';

    return `
      <div class="search-cell-wrap">
        <div class="search-cell ${cls}" style="position:relative">${val}${ptrHtml}</div>
        <div class="search-cell-index">${i}</div>
      </div>
    `;
  }).join('');
}

function updateSearchInfo() {
  const info = ALGO_INFO[currentAlgo];
  if (!info) return;
  const nameEl = document.getElementById('search-algo-name');
  const whatEl = document.getElementById('search-what-text');
  const howEl = document.getElementById('search-how-list');
  const psEl = document.getElementById('search-pseudocode');
  if (nameEl) nameEl.textContent = currentAlgo === 'linear-search' ? 'Linear Search' : 'Binary Search';
  if (whatEl) whatEl.textContent = info.what;
  if (howEl) howEl.innerHTML = info.how.map(s => `<li>${s}</li>`).join('');
  if (psEl) psEl.textContent = info.pseudocode;
}

function updateSearchComplexity() {
  const complexities = {
    'linear-search': { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    'binary-search': { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
  };
  const c = complexities[currentAlgo];
  const grid = document.getElementById('search-complexity-grid');
  if (!grid) return;
  grid.innerHTML = [
    { label: 'Best', value: c.best },
    { label: 'Average', value: c.avg },
    { label: 'Worst', value: c.worst },
    { label: 'Space', value: c.space },
  ].map(item => `
    <div class="complexity-item">
      <div class="complexity-label">${item.label}</div>
      <div class="complexity-value ${complexityClass(item.value)}">${item.value}</div>
    </div>
  `).join('');
}
