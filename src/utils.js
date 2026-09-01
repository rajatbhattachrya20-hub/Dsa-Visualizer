// ===== SHARED UTILITIES & STATE =====

// ---- localStorage helpers ----
export function lsGet(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

export function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ---- Favorites ----
export function getFavorites() { return lsGet('dsa_favorites', []); }
export function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx === -1) favs.push(id); else favs.splice(idx, 1);
  lsSet('dsa_favorites', favs);
  return favs;
}
export function isFavorite(id) { return getFavorites().includes(id); }

// ---- Progress ----
export function getProgress() { return lsGet('dsa_progress', {}); }
export function setProgress(id, status) {
  const p = getProgress();
  p[id] = status; // 'not-started' | 'learning' | 'completed'
  lsSet('dsa_progress', p);
  return p;
}
export function getProgressPct(total) {
  const p = getProgress();
  const completed = Object.values(p).filter(v => v === 'completed').length;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

// ---- Recently used ----
export function getRecent() { return lsGet('dsa_recent', []); }
export function addRecent(id) {
  const recent = getRecent().filter(r => r !== id);
  recent.unshift(id);
  lsSet('dsa_recent', recent.slice(0, 8));
}

// ---- Toast ----
let toastTimer = null;
export function showToast(message, duration = 2500) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}

// ---- Copy to clipboard ----
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Code copied to clipboard! ✓');
    return true;
  } catch {
    showToast('Copy failed — please copy manually.');
    return false;
  }
}

// ---- Random array generator ----
export function generateRandomArray(size = 20, min = 5, max = 100) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// ---- Parse custom array input ----
export function parseArrayInput(str) {
  return str.split(/[\s,]+/).map(s => parseInt(s.trim())).filter(n => !isNaN(n));
}

// ---- Algorithm runner (step engine) ----
export class AlgorithmRunner {
  constructor({ steps, onStep, onComplete, onReset, speed = 500 }) {
    this.steps = steps;
    this.onStep = onStep;
    this.onComplete = onComplete;
    this.onReset = onReset;
    this.speed = speed;
    this.currentIdx = 0;
    this.playing = false;
    this.timer = null;
    this.comparisons = 0;
    this.swaps = 0;
  }

  play() {
    if (this.currentIdx >= this.steps.length) return;
    this.playing = true;
    this._tick();
  }

  pause() {
    this.playing = false;
    clearTimeout(this.timer);
  }

  reset() {
    this.pause();
    this.currentIdx = 0;
    this.comparisons = 0;
    this.swaps = 0;
    if (this.onReset) this.onReset();
  }

  stepForward() {
    if (this.currentIdx >= this.steps.length) return;
    this._applyStep(this.steps[this.currentIdx]);
    this.currentIdx++;
    if (this.currentIdx >= this.steps.length) {
      if (this.onComplete) this.onComplete();
    }
  }

  _tick() {
    if (!this.playing || this.currentIdx >= this.steps.length) {
      if (this.currentIdx >= this.steps.length) {
        this.playing = false;
        if (this.onComplete) this.onComplete();
      }
      return;
    }
    this._applyStep(this.steps[this.currentIdx]);
    this.currentIdx++;
    this.timer = setTimeout(() => this._tick(), this.speed);
  }

  _applyStep(step) {
    const h = step.highlight || {};
    if (h.comparing) this.comparisons++;
    if (h.swapping) this.swaps++;
    if (this.onStep) this.onStep(step, this.currentIdx, this.steps.length, this.comparisons, this.swaps);
  }

  setSpeed(ms) { this.speed = ms; }
  get isPlaying() { return this.playing; }
  get isDone() { return this.currentIdx >= this.steps.length; }
}

// ---- Code panel builder ----
export function buildCodePanel(snippets, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const langs = Object.keys(snippets);
  let activeLang = langs[0];

  container.innerHTML = `
    <div class="code-panel">
      <div class="code-panel-header">
        <div class="code-lang-tabs">
          ${langs.map(l => `<button class="code-lang-tab ${l === activeLang ? 'active' : ''}" data-lang="${l}">${langLabel(l)}</button>`).join('')}
        </div>
        <button class="copy-btn" id="${containerId}-copy">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copy
        </button>
      </div>
      ${langs.map(l => `
        <div class="tab-content ${l === activeLang ? 'active' : ''}" id="${containerId}-code-${l}">
          <pre><code class="language-${l === 'cpp' ? 'cpp' : l === 'js' ? 'javascript' : 'python'}">${escapeHtml(snippets[l])}</code></pre>
        </div>
      `).join('')}
    </div>
  `;

  // Tab switching
  container.querySelectorAll('.code-lang-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeLang = tab.dataset.lang;
      container.querySelectorAll('.code-lang-tab').forEach(t => t.classList.remove('active'));
      container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      container.querySelector(`#${containerId}-code-${activeLang}`).classList.add('active');
      if (window.Prism) Prism.highlightAllUnder(container);
    });
  });

  // Copy button
  const copyBtn = document.getElementById(`${containerId}-copy`);
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const code = snippets[activeLang];
      await copyToClipboard(code);
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy`;
      }, 2000);
    });
  }

  if (window.Prism) Prism.highlightAllUnder(container);
}

function langLabel(l) {
  return l === 'cpp' ? 'C++' : l === 'js' ? 'JavaScript' : 'Python';
}

export function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ---- Complexity rating helper ----
export function complexityClass(c) {
  if (!c) return '';
  if (c === 'O(1)' || c === 'O(log n)') return 'good';
  if (c === 'O(n)' || c === 'O(n log n)' || c === 'O(V+E)') return 'okay';
  return 'bad';
}

// ---- Complexity SVG chart ----
export function renderComplexityChart(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const W = 320, H = 200, pad = 40;
  const n = 20;
  const funcs = [
    { label: 'O(1)',      color: '#34d399', fn: _ => 1 },
    { label: 'O(log n)',  color: '#4f9cf9', fn: x => Math.log2(x + 1) },
    { label: 'O(n)',      color: '#a78bfa', fn: x => x },
    { label: 'O(n log n)',color: '#fbbf24', fn: x => x * Math.log2(x + 1) },
    { label: 'O(n²)',     color: '#f87171', fn: x => x * x },
  ];

  const xs = Array.from({length: n}, (_, i) => i + 1);
  const allValues = funcs.flatMap(f => xs.map(f.fn));
  const maxVal = Math.max(...allValues);

  function scaleX(x) { return pad + (x / n) * (W - 2 * pad); }
  function scaleY(y) { return H - pad - (y / maxVal) * (H - 2 * pad); }

  const paths = funcs.map(f => {
    const points = xs.map(x => `${scaleX(x).toFixed(1)},${scaleY(f.fn(x)).toFixed(1)}`).join(' ');
    return `<polyline points="${points}" fill="none" stroke="${f.color}" stroke-width="2" stroke-linejoin="round" opacity="0.85"/>`;
  });

  const legend = funcs.map((f, i) => `
    <g transform="translate(${pad}, ${pad + i * 22})">
      <line x1="0" y1="0" x2="18" y2="0" stroke="${f.color}" stroke-width="2.5"/>
      <text x="24" y="4" font-family="JetBrains Mono, monospace" font-size="11" fill="#94a3b8">${f.label}</text>
    </g>
  `).join('');

  el.innerHTML = `
    <div class="complexity-chart">
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="overflow:visible">
        <!-- Grid -->
        ${[0.25, 0.5, 0.75, 1].map(t => `<line x1="${pad}" y1="${scaleY(maxVal * t).toFixed(1)}" x2="${W - pad}" y2="${scaleY(maxVal * t).toFixed(1)}" stroke="var(--border)" stroke-width="1"/>`).join('')}
        <!-- Axes -->
        <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${H - pad}" stroke="var(--border-hover)" stroke-width="1.5"/>
        <line x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" stroke="var(--border-hover)" stroke-width="1.5"/>
        <!-- Axis labels -->
        <text x="${W / 2}" y="${H - 6}" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="JetBrains Mono, monospace">n (input size)</text>
        <text x="${pad - 10}" y="${(H) / 2}" text-anchor="middle" font-size="11" fill="var(--text-muted)" transform="rotate(-90,${pad - 10},${H / 2})" font-family="JetBrains Mono, monospace">Operations</text>
        <!-- Curves -->
        ${paths.join('')}
        <!-- Legend -->
        <g transform="translate(${W - 130}, ${pad})">
          ${legend}
        </g>
      </svg>
    </div>
  `;
}
