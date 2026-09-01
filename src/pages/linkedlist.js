// ===== LINKED LIST VISUALIZER PAGE =====
import { showToast, addRecent } from '../utils.js';

let nodes = [10, 20, 30, 40];
let activeIdx = -1;
let activeState = '';
let opText = '';

export function renderLinkedList(container) {
  addRecent('linkedlist');
  renderLLPage(container);
}

function renderLLPage(container) {
  container.innerHTML = `
    <div class="page-enter">
      <div style="margin-bottom:var(--space-6)">
        <h2>Linked List Visualizer</h2>
        <p style="margin-top:4px">Visualize singly linked list operations with pointer animations</p>
      </div>

      <div class="viz-layout">
        <div class="viz-panel">
          <div class="viz-panel-header">
            <span class="viz-panel-title">Singly Linked List</span>
            <span class="badge badge-blue">Size: <span id="ll-size">${nodes.length}</span></span>
          </div>

          <div class="linkedlist-container" id="ll-container">
            <div class="linkedlist-scroll" id="ll-scroll"></div>
          </div>

          <!-- Step explainer -->
          <div style="padding:var(--space-3) var(--space-5)">
            <div class="step-explainer" id="ll-step">
              <div class="step-number" id="ll-op-name">Ready</div>
              <div class="step-text" id="ll-op-text">Select an operation below to get started.</div>
            </div>
          </div>

          <!-- Controls -->
          <div class="controls-panel">
            <div class="controls-row" style="flex-wrap:wrap;gap:var(--space-3)">
              <!-- Insert -->
              <div class="control-group">
                <label class="control-label">Insert</label>
                <div class="input-group">
                  <input type="number" class="input" id="ll-insert-val" placeholder="Value" style="width:80px"/>
                  <button class="btn btn-primary btn-sm" id="ll-insert-head">At Head</button>
                  <button class="btn btn-primary btn-sm" id="ll-insert-tail">At Tail</button>
                </div>
              </div>
              <!-- Insert at position -->
              <div class="control-group">
                <label class="control-label">Insert at Position</label>
                <div class="input-group">
                  <input type="number" class="input" id="ll-insert-pos-val" placeholder="Value" style="width:80px"/>
                  <input type="number" class="input" id="ll-insert-pos" placeholder="Position" style="width:80px" min="0"/>
                  <button class="btn btn-secondary btn-sm" id="ll-insert-pos-btn">Insert</button>
                </div>
              </div>
            </div>
            <div class="controls-row" style="flex-wrap:wrap;gap:var(--space-3)">
              <!-- Delete -->
              <div class="control-group">
                <label class="control-label">Delete</label>
                <div class="input-group">
                  <button class="btn btn-danger btn-sm" id="ll-delete-head">Delete Head</button>
                  <button class="btn btn-danger btn-sm" id="ll-delete-tail">Delete Tail</button>
                </div>
              </div>
              <!-- Delete at position -->
              <div class="control-group">
                <label class="control-label">Delete at Position</label>
                <div class="input-group">
                  <input type="number" class="input" id="ll-delete-pos" placeholder="Position" style="width:80px" min="0"/>
                  <button class="btn btn-danger btn-sm" id="ll-delete-pos-btn">Delete</button>
                </div>
              </div>
              <!-- Search -->
              <div class="control-group">
                <label class="control-label">Search</label>
                <div class="input-group">
                  <input type="number" class="input" id="ll-search-val" placeholder="Value" style="width:80px"/>
                  <button class="btn btn-secondary btn-sm" id="ll-search-btn">Search</button>
                </div>
              </div>
            </div>
            <div class="controls-row">
              <button class="btn btn-secondary btn-sm" id="ll-reset-btn">Reset</button>
            </div>
          </div>

          <!-- Complexity -->
          <div style="padding:var(--space-4) var(--space-5)">
            <div class="complexity-grid">
              <div class="complexity-item"><div class="complexity-label">Access</div><div class="complexity-value bad">O(n)</div></div>
              <div class="complexity-item"><div class="complexity-label">Search</div><div class="complexity-value bad">O(n)</div></div>
              <div class="complexity-item"><div class="complexity-label">Insert (head)</div><div class="complexity-value good">O(1)</div></div>
              <div class="complexity-item"><div class="complexity-label">Delete (head)</div><div class="complexity-value good">O(1)</div></div>
            </div>
          </div>
        </div>

        <!-- Info panel -->
        <div class="viz-info-panel">
          <div class="card">
            <h3>Linked List</h3>
            <div class="info-section" style="margin-top:var(--space-4)">
              <h4>What is it?</h4>
              <p>A linked list is a linear data structure where each element (node) contains a data field and a pointer to the next node. Unlike arrays, nodes are not stored contiguously in memory.</p>
            </div>
            <div class="info-section">
              <h4>Node Structure</h4>
              <pre class="pseudocode">Node {
  data  → value stored
  next  → pointer to next node
}</pre>
            </div>
            <div class="info-section">
              <h4>Advantages</h4>
              <ul class="feature-list">
                <li>Dynamic size (grows and shrinks)</li>
                <li>O(1) insertion/deletion at head</li>
                <li>No memory wastage upfront</li>
              </ul>
            </div>
            <div class="info-section">
              <h4>Disadvantages</h4>
              <ul class="feature-list">
                <li>O(n) access — no random access</li>
                <li>Extra memory for pointers</li>
                <li>Not cache-friendly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  renderLL();
  bindLLEvents(container);
}

function renderLL(highlightIdx = -1, state = '') {
  const scroll = document.getElementById('ll-scroll');
  if (!scroll) return;

  if (nodes.length === 0) {
    scroll.innerHTML = `<div class="ll-head-label">HEAD</div><div class="ll-arrow">→</div><div class="ll-null">NULL</div>`;
    const sizeEl = document.getElementById('ll-size');
    if (sizeEl) sizeEl.textContent = '0';
    return;
  }

  let html = `<div class="ll-head-label">HEAD</div><div class="ll-arrow">→</div>`;
  nodes.forEach((val, i) => {
    let cls = 'll-node';
    if (i === highlightIdx) cls += ` ${state}`;
    html += `
      <div class="${cls}" id="ll-node-${i}">
        <div class="ll-node-data">${val}</div>
        <div class="ll-node-ptr">next</div>
      </div>
      ${i < nodes.length - 1 ? '<div class="ll-arrow">→</div>' : ''}
    `;
  });
  html += `<div class="ll-arrow">→</div><div class="ll-null">NULL</div>`;
  scroll.innerHTML = html;

  const sizeEl = document.getElementById('ll-size');
  if (sizeEl) sizeEl.textContent = nodes.length;
}

function setLLOp(name, text) {
  const nameEl = document.getElementById('ll-op-name');
  const textEl = document.getElementById('ll-op-text');
  if (nameEl) nameEl.textContent = name;
  if (textEl) textEl.textContent = text;
}

function bindLLEvents(container) {
  // Insert at head
  document.getElementById('ll-insert-head').addEventListener('click', () => {
    const val = parseInt(document.getElementById('ll-insert-val').value);
    if (isNaN(val)) { showToast('Enter a valid value'); return; }
    if (nodes.length >= 10) { showToast('Max 10 nodes'); return; }
    nodes.unshift(val);
    renderLL(0, 'inserting');
    setLLOp('Insert at Head', `Node with value ${val} inserted at the beginning. HEAD now points to new node.`);
  });

  // Insert at tail
  document.getElementById('ll-insert-tail').addEventListener('click', () => {
    const val = parseInt(document.getElementById('ll-insert-val').value);
    if (isNaN(val)) { showToast('Enter a valid value'); return; }
    if (nodes.length >= 10) { showToast('Max 10 nodes'); return; }
    nodes.push(val);
    renderLL(nodes.length - 1, 'inserting');
    setLLOp('Insert at Tail', `Node with value ${val} appended at the end. Previous tail's next now points to new node.`);
  });

  // Insert at position
  document.getElementById('ll-insert-pos-btn').addEventListener('click', () => {
    const val = parseInt(document.getElementById('ll-insert-pos-val').value);
    const pos = parseInt(document.getElementById('ll-insert-pos').value);
    if (isNaN(val)) { showToast('Enter a valid value'); return; }
    if (isNaN(pos) || pos < 0 || pos > nodes.length) { showToast(`Position must be 0 to ${nodes.length}`); return; }
    if (nodes.length >= 10) { showToast('Max 10 nodes'); return; }
    nodes.splice(pos, 0, val);
    renderLL(pos, 'inserting');
    setLLOp(`Insert at Position ${pos}`, `Node ${val} inserted at position ${pos}. Pointer chain updated around it.`);
  });

  // Delete head
  document.getElementById('ll-delete-head').addEventListener('click', () => {
    if (nodes.length === 0) { showToast('List is already empty'); return; }
    const val = nodes[0];
    renderLL(0, 'deleting');
    setLLOp('Delete Head', `Removing head node with value ${val}. HEAD now points to the next node.`);
    setTimeout(() => { nodes.shift(); renderLL(); }, 450);
  });

  // Delete tail
  document.getElementById('ll-delete-tail').addEventListener('click', () => {
    if (nodes.length === 0) { showToast('List is already empty'); return; }
    const val = nodes[nodes.length - 1];
    renderLL(nodes.length - 1, 'deleting');
    setLLOp('Delete Tail', `Removing tail node with value ${val}. Previous node's next pointer set to NULL.`);
    setTimeout(() => { nodes.pop(); renderLL(); }, 450);
  });

  // Delete at position
  document.getElementById('ll-delete-pos-btn').addEventListener('click', () => {
    const pos = parseInt(document.getElementById('ll-delete-pos').value);
    if (isNaN(pos) || pos < 0 || pos >= nodes.length) { showToast(`Position must be 0 to ${nodes.length - 1}`); return; }
    const val = nodes[pos];
    renderLL(pos, 'deleting');
    setLLOp(`Delete at Position ${pos}`, `Removing node ${val} at position ${pos}. Pointer chain reconnected.`);
    setTimeout(() => { nodes.splice(pos, 1); renderLL(); }, 450);
  });

  // Search
  document.getElementById('ll-search-btn').addEventListener('click', () => {
    const val = parseInt(document.getElementById('ll-search-val').value);
    if (isNaN(val)) { showToast('Enter a valid value to search'); return; }
    const idx = nodes.indexOf(val);
    if (idx !== -1) {
      renderLL(idx, 'found');
      setLLOp(`Search for ${val}`, `Found ${val} at position ${idx} after traversing ${idx + 1} node(s) from HEAD.`);
    } else {
      renderLL();
      setLLOp(`Search for ${val}`, `${val} not found. Traversed all ${nodes.length} nodes without a match.`);
      showToast(`${val} not found in the list`);
    }
  });

  // Reset
  document.getElementById('ll-reset-btn').addEventListener('click', () => {
    nodes = [10, 20, 30, 40];
    renderLL();
    setLLOp('Reset', 'Linked list reset to default.');
  });
}
