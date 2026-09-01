// ===== STACK VISUALIZER PAGE =====
import { showToast, addRecent } from '../utils.js';

let stackData = [10, 20, 30];
let lastOp = '';

export function renderStack(container) {
  addRecent('stack');
  renderStackPage(container);
}

function renderStackPage(container) {
  container.innerHTML = `
    <div class="page-enter">
      <div style="margin-bottom:var(--space-6)">
        <h2>Stack Visualizer</h2>
        <p style="margin-top:4px">Visualize LIFO (Last In, First Out) stack operations</p>
      </div>

      <div class="viz-layout">
        <div class="viz-panel" style="max-width:100%">
          <div class="viz-panel-header">
            <span class="viz-panel-title">Stack (LIFO)</span>
            <span class="badge badge-blue">Size: <span id="stack-size">${stackData.length}</span></span>
          </div>

          <div style="display:flex;gap:var(--space-6);flex-wrap:wrap;padding:var(--space-4) var(--space-5)">
            <!-- Stack visualization -->
            <div style="flex:1;min-width:200px;display:flex;flex-direction:column;align-items:center">
              <div id="stack-top-indicator" style="display:${stackData.length > 0 ? 'flex' : 'none'};margin-bottom:4px;flex-direction:column;align-items:center">
                <div class="stack-top-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  TOP
                </div>
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none"><line x1="8" y1="0" x2="8" y2="20" stroke="var(--accent-blue)" stroke-width="2"/><polyline points="2,14 8,20 14,14" stroke="var(--accent-blue)" stroke-width="2" fill="none"/></svg>
              </div>
              <div class="stack-container" id="stack-container">
                ${stackData.length === 0 ? '<div class="stack-empty">Stack is empty</div>' : ''}
              </div>
              <!-- Stack base line -->
              <div style="width:180px;height:3px;background:linear-gradient(90deg,transparent,var(--border-hover),transparent);border-radius:2px;margin-top:4px"></div>
              <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;font-family:\'JetBrains Mono\',monospace;font-weight:700">BOTTOM</div>
            </div>

            <!-- Stats -->
            <div style="flex:1;min-width:200px;display:flex;flex-direction:column;gap:var(--space-3)">
              <div class="stat-item">
                <div class="stat-value" style="color:var(--accent-blue)" id="stack-top-val">${stackData.length > 0 ? stackData[stackData.length - 1] : '—'}</div>
                <div class="stat-label">Top Element</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" id="stack-size-stat">${stackData.length}</div>
                <div class="stat-label">Stack Size</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" style="color:${stackData.length === 0 ? 'var(--accent-green)' : 'var(--text-muted)'}" id="stack-empty-stat">${stackData.length === 0 ? 'Yes' : 'No'}</div>
                <div class="stat-label">Is Empty?</div>
              </div>
            </div>
          </div>

          <!-- Step explainer -->
          <div style="padding:0 var(--space-5) var(--space-3)">
            <div class="step-explainer">
              <div class="step-number" id="stack-op-name">Ready</div>
              <div class="step-text" id="stack-op-text">Use the controls below to perform stack operations.</div>
            </div>
          </div>

          <!-- Controls -->
          <div class="controls-panel">
            <div class="controls-row" style="flex-wrap:wrap;gap:var(--space-3)">
              <div class="control-group">
                <label class="control-label">Push Value</label>
                <div class="input-group">
                  <input type="number" class="input" id="stack-push-val" placeholder="Value" style="width:100px"/>
                  <button class="btn btn-primary" id="stack-push-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    Push
                  </button>
                </div>
              </div>
              <div class="control-group">
                <label class="control-label">Operations</label>
                <div style="display:flex;gap:var(--space-2);flex-wrap:wrap">
                  <button class="btn btn-danger" id="stack-pop-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                    Pop
                  </button>
                  <button class="btn btn-secondary" id="stack-peek-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Peek
                  </button>
                  <button class="btn btn-secondary" id="stack-isempty-btn">isEmpty?</button>
                  <button class="btn btn-ghost" id="stack-reset-btn">Reset</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Complexity -->
          <div style="padding:var(--space-4) var(--space-5)">
            <div class="complexity-grid">
              <div class="complexity-item"><div class="complexity-label">Push</div><div class="complexity-value good">O(1)</div></div>
              <div class="complexity-item"><div class="complexity-label">Pop</div><div class="complexity-value good">O(1)</div></div>
              <div class="complexity-item"><div class="complexity-label">Peek</div><div class="complexity-value good">O(1)</div></div>
              <div class="complexity-item"><div class="complexity-label">Space</div><div class="complexity-value okay">O(n)</div></div>
            </div>
          </div>
        </div>

        <!-- Info panel -->
        <div class="viz-info-panel">
          <div class="card">
            <h3>Stack (LIFO)</h3>
            <div class="info-section" style="margin-top:var(--space-4)">
              <h4>What is a Stack?</h4>
              <p>A stack is a linear data structure that follows the LIFO (Last In, First Out) principle. The last element inserted is the first one to be removed — like a stack of plates.</p>
            </div>
            <div class="info-section">
              <h4>Core Operations</h4>
              <ul class="feature-list">
                <li><strong>Push:</strong> Add element to top</li>
                <li><strong>Pop:</strong> Remove top element</li>
                <li><strong>Peek:</strong> View top without removing</li>
                <li><strong>isEmpty:</strong> Check if stack is empty</li>
              </ul>
            </div>
            <div class="info-section">
              <h4>Real-world Uses</h4>
              <ul class="feature-list">
                <li>Undo/Redo operations in editors</li>
                <li>Browser back button history</li>
                <li>Function call stack (recursion)</li>
                <li>Expression evaluation (parentheses check)</li>
                <li>DFS graph traversal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  renderStackVisualization();
  bindStackEvents();
}

function renderStackVisualization(pushIdx = -1, popIdx = false) {
  const container = document.getElementById('stack-container');
  const indicator = document.getElementById('stack-top-indicator');
  if (!container) return;

  if (indicator) indicator.style.display = stackData.length > 0 ? 'flex' : 'none';

  if (stackData.length === 0) {
    container.innerHTML = '<div class="stack-empty">Stack is empty</div>';
  } else {
    // Stack renders bottom-to-top visually
    container.innerHTML = [...stackData].reverse().map((val, rIdx) => {
      const idx = stackData.length - 1 - rIdx;
      const isTop = idx === stackData.length - 1;
      let cls = `stack-cell ${isTop ? 'top-cell' : ''}`;
      if (idx === pushIdx) cls += ' pushing';
      return `<div class="${cls}">${val}</div>`;
    }).join('');
  }

  // Update stats
  const topVal = document.getElementById('stack-top-val');
  const sizeStat = document.getElementById('stack-size-stat');
  const emptyStat = document.getElementById('stack-empty-stat');
  const sizeEl = document.getElementById('stack-size');
  if (topVal) topVal.textContent = stackData.length > 0 ? stackData[stackData.length - 1] : '—';
  if (sizeStat) sizeStat.textContent = stackData.length;
  if (sizeEl) sizeEl.textContent = stackData.length;
  if (emptyStat) {
    emptyStat.textContent = stackData.length === 0 ? 'Yes' : 'No';
    emptyStat.style.color = stackData.length === 0 ? 'var(--accent-green)' : 'var(--text-muted)';
  }
}

function setStackOp(name, text) {
  const nameEl = document.getElementById('stack-op-name');
  const textEl = document.getElementById('stack-op-text');
  if (nameEl) nameEl.textContent = name;
  if (textEl) textEl.textContent = text;
}

function bindStackEvents() {
  document.getElementById('stack-push-btn').addEventListener('click', () => {
    const val = parseInt(document.getElementById('stack-push-val').value);
    if (isNaN(val)) { showToast('Enter a valid value to push'); return; }
    if (stackData.length >= 10) { showToast('Stack overflow! Max size 10.'); return; }
    stackData.push(val);
    renderStackVisualization(stackData.length - 1);
    setStackOp(`Push(${val})`, `Element ${val} pushed to top of stack. New top = ${val}. Size = ${stackData.length}.`);
  });

  document.getElementById('stack-pop-btn').addEventListener('click', () => {
    if (stackData.length === 0) { showToast('Stack underflow! Stack is empty.'); return; }
    const val = stackData[stackData.length - 1];
    // Animate removal
    const cells = document.querySelectorAll('.stack-cell');
    if (cells.length > 0) cells[0].classList.add('popping');
    setStackOp(`Pop()`, `Popped element ${val} from top. Stack size = ${stackData.length - 1}.`);
    setTimeout(() => {
      stackData.pop();
      renderStackVisualization();
    }, 400);
  });

  document.getElementById('stack-peek-btn').addEventListener('click', () => {
    if (stackData.length === 0) { showToast('Stack is empty — nothing to peek'); return; }
    const top = stackData[stackData.length - 1];
    renderStackVisualization();
    setStackOp(`Peek()`, `Top element is ${top}. Peek only views — it does NOT remove the element.`);
  });

  document.getElementById('stack-isempty-btn').addEventListener('click', () => {
    const empty = stackData.length === 0;
    setStackOp(`isEmpty()`, `The stack is ${empty ? 'EMPTY ✓' : `NOT empty. It has ${stackData.length} element(s). Top = ${stackData[stackData.length-1]}`}.`);
    showToast(`isEmpty() = ${empty}`);
  });

  document.getElementById('stack-reset-btn').addEventListener('click', () => {
    stackData = [10, 20, 30];
    renderStackVisualization();
    setStackOp('Reset', 'Stack reset to initial state with [10, 20, 30].');
  });
}
