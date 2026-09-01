// ===== SORTING VISUALIZER PAGE =====
import {
  bubbleSortSteps, selectionSortSteps, insertionSortSteps,
  mergeSortSteps, quickSortSteps, heapSortSteps
} from '../algorithms/sorting.js';
import { CODE_SNIPPETS, ALGO_INFO } from '../data/algorithms.js';
import {
  generateRandomArray, parseArrayInput, AlgorithmRunner,
  buildCodePanel, complexityClass, renderComplexityChart,
  addRecent, showToast, isFavorite, toggleFavorite
} from '../utils.js';

const ALGOS = {
  'bubble-sort':    { label: 'Bubble Sort',    fn: bubbleSortSteps,    best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  'selection-sort': { label: 'Selection Sort', fn: selectionSortSteps, best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  'insertion-sort': { label: 'Insertion Sort', fn: insertionSortSteps, best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  'merge-sort':     { label: 'Merge Sort',     fn: mergeSortSteps,     best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  'quick-sort':     { label: 'Quick Sort',     fn: quickSortSteps,     best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
  'heap-sort':      { label: 'Heap Sort',      fn: heapSortSteps,      best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
};

let currentAlgo = 'bubble-sort';
let currentArray = generateRandomArray(18, 5, 95);
let runner = null;
let speedMs = 300;
let isComplete = false;

export function renderSorting(container) {
  addRecent('bubble-sort');

  container.innerHTML = `
    <div class="page-enter">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);flex-wrap:wrap;gap:var(--space-3)">
        <div>
          <h2>Sorting Visualizer</h2>
          <p style="margin-top:4px">Visualize how different sorting algorithms work step by step</p>
        </div>
        <div style="display:flex;gap:var(--space-2)">
          <button class="fav-btn ${isFavorite(currentAlgo) ? 'active' : ''}" id="sort-fav-btn" title="Favorite">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFavorite(currentAlgo) ? 'var(--accent-pink)' : 'none'}" stroke="var(--accent-pink)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
        </div>
      </div>

      <div class="viz-layout">
        <!-- Main visualization panel -->
        <div class="viz-panel">
          <!-- Algorithm selector -->
          <div class="algo-selector" id="sort-algo-selector">
            ${Object.entries(ALGOS).map(([id, a]) => `
              <button class="algo-chip ${id === currentAlgo ? 'active' : ''}" data-algo="${id}">${a.label}</button>
            `).join('')}
          </div>

          <!-- Bar chart -->
          <div style="position:relative">
            <div class="sorting-bars-container" id="sort-bars"></div>
            <div class="legend">
              <div class="legend-item"><div class="legend-dot" style="background:var(--bar-default)"></div>Default</div>
              <div class="legend-item"><div class="legend-dot" style="background:var(--bar-comparing)"></div>Comparing</div>
              <div class="legend-item"><div class="legend-dot" style="background:var(--bar-swapping)"></div>Swapping</div>
              <div class="legend-item"><div class="legend-dot" style="background:var(--bar-selected)"></div>Selected</div>
              <div class="legend-item"><div class="legend-dot" style="background:var(--bar-sorted)"></div>Sorted</div>
              <div class="legend-item"><div class="legend-dot" style="background:var(--bar-pivot)"></div>Pivot</div>
            </div>
          </div>

          <!-- Step explainer -->
          <div style="padding:0 var(--space-5) var(--space-3)">
            <div class="step-explainer" id="sort-step-explainer">
              <div class="step-number" id="sort-step-num">Ready</div>
              <div class="step-text" id="sort-step-text">Generate an array and select an algorithm to begin.</div>
            </div>
          </div>

          <!-- Controls -->
          <div class="controls-panel">
            <div class="controls-row">
              <!-- Playback -->
              <div class="playback-btns">
                <button class="playback-btn" id="sort-reset-btn" title="Reset">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 101.854-4.147"/></svg>
                </button>
                <button class="playback-btn play-btn" id="sort-play-btn" title="Play/Pause">
                  <svg id="sort-play-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
                <button class="playback-btn" id="sort-step-btn" title="Step Forward">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
                </button>
              </div>

              <!-- Array size -->
              <div class="control-group" style="flex:1;min-width:120px">
                <label class="control-label">Array Size: <span id="sort-size-val">18</span></label>
                <input type="range" class="range-slider" id="sort-size" min="5" max="50" value="18" />
              </div>

              <!-- Speed -->
              <div class="control-group" style="flex:1;min-width:120px">
                <label class="control-label">Speed: <span id="sort-speed-label">Medium</span></label>
                <input type="range" class="range-slider" id="sort-speed" min="1" max="5" value="3" />
              </div>
            </div>
            <div class="controls-row" style="gap:var(--space-2)">
              <button class="btn btn-secondary btn-sm" id="sort-random-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
                Random Array
              </button>
              <input type="text" class="input" id="sort-custom-input" placeholder="Enter values: 5, 23, 11, 42..." style="max-width:260px;flex:1" />
              <button class="btn btn-secondary btn-sm" id="sort-custom-btn">Use Custom</button>
            </div>
          </div>

          <!-- Stats -->
          <div style="padding:var(--space-4) var(--space-5)">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value" id="stat-comparisons">0</div>
                <div class="stat-label">Comparisons</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" id="stat-swaps">0</div>
                <div class="stat-label">Swaps</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" id="stat-step">0</div>
                <div class="stat-label">Current Step</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" id="stat-total">-</div>
                <div class="stat-label">Total Steps</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Info panel -->
        <div class="viz-info-panel">
          <!-- Complexity -->
          <div class="card">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">
              <h3 id="sort-algo-name">${ALGOS[currentAlgo].label}</h3>
            </div>
            <div class="complexity-grid" id="sort-complexity-grid"></div>
          </div>

          <!-- Tabs: Info / Code / Complexity Chart -->
          <div class="card">
            <div class="tabs">
              <div class="tab active" data-tab="info">How it works</div>
              <div class="tab" data-tab="code">Code</div>
              <div class="tab" data-tab="chart">Complexity</div>
            </div>
            <div class="tab-content active" id="tab-info">
              <div class="info-section">
                <h4>What is it?</h4>
                <p id="sort-what-text"></p>
              </div>
              <div class="info-section">
                <h4>How does it work?</h4>
                <ol class="algo-steps-list" id="sort-how-list"></ol>
              </div>
              <div class="info-section">
                <h4>Pseudocode</h4>
                <pre class="pseudocode" id="sort-pseudocode"></pre>
              </div>
            </div>
            <div class="tab-content" id="tab-code">
              <div id="sort-code-panel"></div>
            </div>
            <div class="tab-content" id="tab-chart">
              <div id="sort-complexity-chart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize
  renderBars(currentArray, {});
  updateComplexityPanel();
  updateInfoPanel();

  // Tab switching
  container.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const tabId = `tab-${tab.dataset.tab}`;
      document.getElementById(tabId).classList.add('active');
      if (tab.dataset.tab === 'code') {
        buildCodePanel(CODE_SNIPPETS[currentAlgo] || {}, 'sort-code-panel');
      }
      if (tab.dataset.tab === 'chart') {
        renderComplexityChart('sort-complexity-chart');
      }
    });
  });

  // Algo selector
  container.querySelector('#sort-algo-selector').addEventListener('click', e => {
    const chip = e.target.closest('.algo-chip');
    if (!chip) return;
    resetRunner();
    currentAlgo = chip.dataset.algo;
    container.querySelectorAll('.algo-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    updateComplexityPanel();
    updateInfoPanel();
    addRecent(currentAlgo);
  });

  // Random array
  document.getElementById('sort-random-btn').addEventListener('click', () => {
    const size = parseInt(document.getElementById('sort-size').value);
    currentArray = generateRandomArray(size, 5, 95);
    resetRunner();
    renderBars(currentArray, {});
  });

  // Custom array
  document.getElementById('sort-custom-btn').addEventListener('click', () => {
    const input = document.getElementById('sort-custom-input').value;
    const parsed = parseArrayInput(input);
    if (parsed.length < 2) { showToast('Enter at least 2 numbers separated by commas'); return; }
    if (parsed.length > 60) { showToast('Max 60 elements allowed'); return; }
    currentArray = parsed;
    resetRunner();
    renderBars(currentArray, {});
  });

  // Size slider
  document.getElementById('sort-size').addEventListener('input', e => {
    document.getElementById('sort-size-val').textContent = e.target.value;
    const size = parseInt(e.target.value);
    currentArray = generateRandomArray(size, 5, 95);
    resetRunner();
    renderBars(currentArray, {});
  });

  // Speed slider
  document.getElementById('sort-speed').addEventListener('input', e => {
    const v = parseInt(e.target.value);
    const labels = ['', 'Very Slow', 'Slow', 'Medium', 'Fast', 'Very Fast'];
    const speeds = [0, 800, 500, 300, 150, 50];
    speedMs = speeds[v];
    document.getElementById('sort-speed-label').textContent = labels[v];
    if (runner) runner.setSpeed(speedMs);
  });

  // Play/Pause
  document.getElementById('sort-play-btn').addEventListener('click', () => {
    if (!runner || runner.isDone) {
      initRunner();
    }
    if (runner.isPlaying) {
      runner.pause();
      setPlayIcon(false);
    } else {
      runner.play();
      setPlayIcon(true);
    }
  });

  // Step
  document.getElementById('sort-step-btn').addEventListener('click', () => {
    if (!runner || runner.isDone) initRunner();
    if (runner.isPlaying) runner.pause();
    setPlayIcon(false);
    runner.stepForward();
  });

  // Reset
  document.getElementById('sort-reset-btn').addEventListener('click', () => {
    resetRunner();
    renderBars(currentArray, {});
  });

  // Favorite
  document.getElementById('sort-fav-btn').addEventListener('click', () => {
    const favs = toggleFavorite(currentAlgo);
    const isFav = favs.includes(currentAlgo);
    const btn = document.getElementById('sort-fav-btn');
    btn.classList.toggle('active', isFav);
    btn.querySelector('svg').setAttribute('fill', isFav ? 'var(--accent-pink)' : 'none');
    showToast(isFav ? 'Added to favorites! ❤️' : 'Removed from favorites');
  });
}

function initRunner() {
  const steps = ALGOS[currentAlgo].fn([...currentArray]);
  document.getElementById('stat-total').textContent = steps.length;
  isComplete = false;

  runner = new AlgorithmRunner({
    steps,
    speed: speedMs,
    onStep: (step, idx, total, comps, swaps) => {
      renderBars(step.array, step.highlight || {});
      document.getElementById('sort-step-num').textContent = `Step ${idx} / ${total}`;
      document.getElementById('sort-step-text').textContent = step.label;
      document.getElementById('stat-comparisons').textContent = comps;
      document.getElementById('stat-swaps').textContent = swaps;
      document.getElementById('stat-step').textContent = idx;
    },
    onComplete: () => {
      setPlayIcon(false);
      isComplete = true;
      document.getElementById('sort-step-num').textContent = '✓ Complete';
      showToast(`${ALGOS[currentAlgo].label} complete! 🎉`);
    },
    onReset: () => {
      renderBars(currentArray, {});
      document.getElementById('sort-step-num').textContent = 'Ready';
      document.getElementById('sort-step-text').textContent = 'Press Play or Step to start.';
      document.getElementById('stat-comparisons').textContent = '0';
      document.getElementById('stat-swaps').textContent = '0';
      document.getElementById('stat-step').textContent = '0';
      document.getElementById('stat-total').textContent = '-';
    }
  });
}

function resetRunner() {
  if (runner) runner.reset();
  runner = null;
  isComplete = false;
  setPlayIcon(false);
  document.getElementById('sort-step-num').textContent = 'Ready';
  document.getElementById('sort-step-text').textContent = 'Generate an array and press Play to start.';
  document.getElementById('stat-comparisons').textContent = '0';
  document.getElementById('stat-swaps').textContent = '0';
  document.getElementById('stat-step').textContent = '0';
  document.getElementById('stat-total').textContent = '-';
}

function setPlayIcon(playing) {
  const icon = document.getElementById('sort-play-icon');
  if (!icon) return;
  icon.innerHTML = playing
    ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
    : '<polygon points="5 3 19 12 5 21 5 3"/>';
}

function renderBars(arr, highlight) {
  const container = document.getElementById('sort-bars');
  if (!container) return;
  const maxVal = Math.max(...arr, 1);
  const h = container.offsetHeight || 320;

  container.innerHTML = arr.map((val, i) => {
    const heightPx = Math.max(4, Math.floor((val / maxVal) * (h - 60)));
    let cls = '';
    const hl = highlight;
    if (hl.sorted && hl.sorted.includes(i)) cls = 'sorted';
    else if (hl.swapping && hl.swapping.includes(i)) cls = 'swapping';
    else if (hl.comparing && hl.comparing.includes(i)) cls = 'comparing';
    else if (hl.selected && hl.selected.includes(i)) cls = 'selected';
    else if (hl.pivot === i) cls = 'pivot';

    return `
      <div class="bar-wrap">
        <div class="bar ${cls}" style="height:${heightPx}px"></div>
        ${arr.length <= 25 ? `<div class="bar-value">${val}</div>` : ''}
      </div>
    `;
  }).join('');
}

function updateComplexityPanel() {
  const algo = ALGOS[currentAlgo];
  const nameEl = document.getElementById('sort-algo-name');
  const gridEl = document.getElementById('sort-complexity-grid');
  if (!nameEl || !gridEl) return;
  nameEl.textContent = algo.label;

  const items = [
    { label: 'Best Case', value: algo.best },
    { label: 'Average', value: algo.avg },
    { label: 'Worst Case', value: algo.worst },
    { label: 'Space', value: algo.space },
  ];
  gridEl.innerHTML = items.map(item => `
    <div class="complexity-item">
      <div class="complexity-label">${item.label}</div>
      <div class="complexity-value ${complexityClass(item.value)}">${item.value}</div>
    </div>
  `).join('');
}

function updateInfoPanel() {
  const info = ALGO_INFO[currentAlgo];
  if (!info) return;
  const whatEl = document.getElementById('sort-what-text');
  const howEl = document.getElementById('sort-how-list');
  const psEl = document.getElementById('sort-pseudocode');
  if (whatEl) whatEl.textContent = info.what;
  if (howEl) howEl.innerHTML = info.how.map(s => `<li>${s}</li>`).join('');
  if (psEl) psEl.innerHTML = formatPseudocode(info.pseudocode);

  // If code tab is active, rebuild it
  const codeTabActive = document.querySelector('.tab[data-tab="code"]')?.classList.contains('active');
  if (codeTabActive) buildCodePanel(CODE_SNIPPETS[currentAlgo] || {}, 'sort-code-panel');
}

function formatPseudocode(code) {
  return code
    .replace(/\b(for|while|if|else|return|function|not|and|or|from|to|break|true|false)\b/g, '<span class="kw">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
}
