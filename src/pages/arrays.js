// ===== ARRAY VISUALIZER PAGE =====
import { showToast, addRecent } from '../utils.js';

let arr = [10, 20, 30, 40, 50];
let activeIdx = -1;
let operationMsg = '';
let opComplexity = '';
let opExplanation = '';

export function renderArrays(container) {
  addRecent('arrays');
  renderPage(container);
}

function renderPage(container) {
  container.innerHTML = `
    <div class="page-enter">
      <div style="margin-bottom:var(--space-6)">
        <h2>Array Visualizer</h2>
        <p style="margin-top:4px">Visualize array operations with animated indexing</p>
      </div>

      <div class="viz-layout">
        <div class="viz-panel">
          <div class="viz-panel-header">
            <span class="viz-panel-title">Array Visualization</span>
            <div style="display:flex;gap:var(--space-2)">
              <span class="badge badge-blue">Size: <span id="arr-size">${arr.length}</span></span>
            </div>
          </div>

          <div class="array-viz-container">
            <div style="text-align:center;margin-bottom:4px;font-size:0.75rem;color:var(--text-muted);font-weight:700;letter-spacing:0.1em;font-family:'JetBrains Mono',monospace">INDEX</div>
            <div id="array-display"></div>
          </div>

          <!-- Step explainer -->
          <div style="padding:var(--space-3) var(--space-5)">
            <div class="step-explainer" id="arr-step">
              <div class="step-number" id="arr-op-name">Ready</div>
              <div class="step-text" id="arr-op-text">Select an operation below to get started.</div>
            </div>
          </div>

          <!-- Operation controls -->
          <div class="controls-panel">
            <div class="controls-row" style="flex-wrap:wrap;gap:var(--space-3)">
              <!-- Access -->
              <div class="control-group">
                <label class="control-label">Access by Index</label>
                <div class="input-group">
                  <input type="number" class="input" id="arr-access-idx" placeholder="Index" style="width:80px" min="0"/>
                  <button class="btn btn-secondary btn-sm" id="arr-access-btn">Access</button>
                </div>
              </div>
              <!-- Insert -->
              <div class="control-group">
                <label class="control-label">Insert Value</label>
                <div class="input-group">
                  <input type="number" class="input" id="arr-insert-val" placeholder="Value" style="width:80px"/>
                  <input type="number" class="input" id="arr-insert-idx" placeholder="At index" style="width:80px" min="0"/>
                  <button class="btn btn-primary btn-sm" id="arr-insert-btn">Insert</button>
                </div>
              </div>
            </div>
            <div class="controls-row" style="flex-wrap:wrap;gap:var(--space-3)">
              <!-- Delete -->
              <div class="control-group">
                <label class="control-label">Delete by Index</label>
                <div class="input-group">
                  <input type="number" class="input" id="arr-delete-idx" placeholder="Index" style="width:80px" min="0"/>
                  <button class="btn btn-danger btn-sm" id="arr-delete-btn">Delete</button>
                </div>
              </div>
              <!-- Search -->
              <div class="control-group">
                <label class="control-label">Search Value</label>
                <div class="input-group">
                  <input type="number" class="input" id="arr-search-val" placeholder="Value" style="width:80px"/>
                  <button class="btn btn-secondary btn-sm" id="arr-search-btn">Search</button>
                </div>
              </div>
              <!-- Update -->
              <div class="control-group">
                <label class="control-label">Update</label>
                <div class="input-group">
                  <input type="number" class="input" id="arr-update-idx" placeholder="Index" style="width:80px" min="0"/>
                  <input type="number" class="input" id="arr-update-val" placeholder="New val" style="width:80px"/>
                  <button class="btn btn-secondary btn-sm" id="arr-update-btn">Update</button>
                </div>
              </div>
            </div>
            <div class="controls-row">
              <button class="btn btn-secondary btn-sm" id="arr-reset-btn">Reset Array</button>
              <input type="text" class="input" id="arr-custom-input" placeholder="Custom: 5, 12, 8, 33..." style="max-width:240px;flex:1"/>
              <button class="btn btn-secondary btn-sm" id="arr-set-btn">Set Array</button>
            </div>
          </div>

          <!-- Complexity info -->
          <div style="padding:var(--space-4) var(--space-5)" id="arr-complexity-area">
            <div class="complexity-grid">
              <div class="complexity-item">
                <div class="complexity-label">Access</div>
                <div class="complexity-value good">O(1)</div>
              </div>
              <div class="complexity-item">
                <div class="complexity-label">Search</div>
                <div class="complexity-value okay">O(n)</div>
              </div>
              <div class="complexity-item">
                <div class="complexity-label">Insert</div>
                <div class="complexity-value bad">O(n)</div>
              </div>
              <div class="complexity-item">
                <div class="complexity-label">Delete</div>
                <div class="complexity-value bad">O(n)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Info panel -->
        <div class="viz-info-panel">
          <div class="card">
            <h3>Arrays</h3>
            <div class="info-section" style="margin-top:var(--space-4)">
              <h4>What is an Array?</h4>
              <p>An array is a collection of elements stored at contiguous memory locations. Each element is identified by its index (0-based).</p>
            </div>
            <div class="info-section">
              <h4>Key Properties</h4>
              <ul class="feature-list">
                <li>Fixed size (in most languages)</li>
                <li>Elements are stored contiguously in memory</li>
                <li>O(1) random access by index</li>
                <li>Insertion/deletion is O(n) — requires shifting</li>
                <li>Cache-friendly data structure</li>
              </ul>
            </div>
            <div class="info-section">
              <h4>Current Operation</h4>
              <div class="step-explainer">
                <div class="step-number" id="arr-info-op">—</div>
                <div class="step-text" id="arr-info-complexity">Select an operation to see its time complexity.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  renderArrayDisplay();
  bindArrayEvents(container);
}

function renderArrayDisplay(highlightIdx = -1, state = '') {
  const display = document.getElementById('array-display');
  if (!display) return;
  display.innerHTML = `
    <div class="array-row">
      ${arr.map((val, i) => {
        let cls = 'array-cell';
        if (i === 0) cls += ' first';
        if (i === arr.length - 1) cls += ' last';
        if (i === highlightIdx) {
          cls += state === 'insert' ? ' inserting' : state === 'delete' ? ' deleting' : state === 'found' ? ' found' : ' active';
        }
        return `<div class="array-cell-group">
          <div class="${cls}">${val}</div>
          <div class="array-index">${i}</div>
        </div>`;
      }).join('')}
    </div>
  `;
  const sizeEl = document.getElementById('arr-size');
  if (sizeEl) sizeEl.textContent = arr.length;
}

function setOp(name, text, complexity = '') {
  const nameEl = document.getElementById('arr-op-name');
  const textEl = document.getElementById('arr-op-text');
  const infoOp = document.getElementById('arr-info-op');
  const infoC = document.getElementById('arr-info-complexity');
  if (nameEl) nameEl.textContent = name;
  if (textEl) textEl.textContent = text;
  if (infoOp) infoOp.textContent = name;
  if (infoC) infoC.textContent = complexity;
}

function bindArrayEvents(container) {
  // Access
  document.getElementById('arr-access-btn').addEventListener('click', () => {
    const idx = parseInt(document.getElementById('arr-access-idx').value);
    if (isNaN(idx) || idx < 0 || idx >= arr.length) { showToast(`Index must be between 0 and ${arr.length - 1}`); return; }
    renderArrayDisplay(idx, 'active');
    setOp(`Access arr[${idx}]`, `Accessed arr[${idx}] = ${arr[idx]} — direct O(1) random access`, 'Time: O(1) — array supports direct index access in constant time');
  });

  // Insert
  document.getElementById('arr-insert-btn').addEventListener('click', () => {
    const val = parseInt(document.getElementById('arr-insert-val').value);
    const idx = parseInt(document.getElementById('arr-insert-idx').value);
    if (isNaN(val)) { showToast('Enter a valid value to insert'); return; }
    if (isNaN(idx) || idx < 0 || idx > arr.length) { showToast(`Index must be 0 to ${arr.length}`); return; }
    if (arr.length >= 15) { showToast('Array is full (max 15 elements)'); return; }
    arr.splice(idx, 0, val);
    renderArrayDisplay(idx, 'insert');
    setOp(`Insert ${val} at index ${idx}`, `Inserted ${val} at index ${idx}. Elements from index ${idx} were shifted right.`, 'Time: O(n) — must shift elements after insertion index');
  });

  // Delete
  document.getElementById('arr-delete-btn').addEventListener('click', () => {
    const idx = parseInt(document.getElementById('arr-delete-idx').value);
    if (isNaN(idx) || idx < 0 || idx >= arr.length) { showToast(`Index must be 0 to ${arr.length - 1}`); return; }
    if (arr.length <= 1) { showToast('Array must have at least 1 element'); return; }
    const val = arr[idx];
    renderArrayDisplay(idx, 'delete');
    setOp(`Delete arr[${idx}]`, `Deleting arr[${idx}] = ${val}. Elements after index ${idx} will shift left.`, 'Time: O(n) — must shift elements after deletion index');
    setTimeout(() => {
      arr.splice(idx, 1);
      renderArrayDisplay();
    }, 400);
  });

  // Search
  document.getElementById('arr-search-btn').addEventListener('click', () => {
    const val = parseInt(document.getElementById('arr-search-val').value);
    if (isNaN(val)) { showToast('Enter a valid value to search'); return; }
    const idx = arr.indexOf(val);
    if (idx !== -1) {
      renderArrayDisplay(idx, 'found');
      setOp(`Search for ${val}`, `Found ${val} at index ${idx} after checking ${idx + 1} element(s).`, 'Time: O(n) — linear scan required');
    } else {
      renderArrayDisplay();
      setOp(`Search for ${val}`, `${val} was not found in the array. Checked all ${arr.length} elements.`, 'Time: O(n) — scanned entire array');
      showToast(`${val} not found in array`);
    }
  });

  // Update
  document.getElementById('arr-update-btn').addEventListener('click', () => {
    const idx = parseInt(document.getElementById('arr-update-idx').value);
    const val = parseInt(document.getElementById('arr-update-val').value);
    if (isNaN(idx) || idx < 0 || idx >= arr.length) { showToast(`Index must be 0 to ${arr.length - 1}`); return; }
    if (isNaN(val)) { showToast('Enter a valid new value'); return; }
    const old = arr[idx];
    arr[idx] = val;
    renderArrayDisplay(idx, 'active');
    setOp(`Update arr[${idx}]`, `Updated arr[${idx}] from ${old} to ${val} — direct O(1) assignment`, 'Time: O(1) — direct index access and assignment');
  });

  // Reset
  document.getElementById('arr-reset-btn').addEventListener('click', () => {
    arr = [10, 20, 30, 40, 50];
    renderArrayDisplay();
    setOp('Reset', 'Array reset to default values.', '');
  });

  // Custom
  document.getElementById('arr-set-btn').addEventListener('click', () => {
    const input = document.getElementById('arr-custom-input').value;
    const parsed = input.split(/[\s,]+/).map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (parsed.length < 1) { showToast('Enter at least 1 number'); return; }
    if (parsed.length > 15) { showToast('Max 15 elements'); return; }
    arr = parsed;
    renderArrayDisplay();
    setOp('Custom Array Set', `Array set to [${arr.join(', ')}]`, '');
  });
}
