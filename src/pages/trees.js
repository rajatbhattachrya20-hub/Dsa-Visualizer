// ===== BINARY SEARCH TREE VISUALIZER PAGE =====
import { showToast, addRecent, AlgorithmRunner } from '../utils.js';

// BST Node
class BSTNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; }
}
class BST {
  constructor() { this.root = null; }
  insert(val) {
    const node = new BSTNode(val);
    if (!this.root) { this.root = node; return; }
    let cur = this.root;
    while (true) {
      if (val < cur.val) { if (!cur.left) { cur.left = node; break; } cur = cur.left; }
      else if (val > cur.val) { if (!cur.right) { cur.right = node; break; } cur = cur.right; }
      else break; // duplicate
    }
  }
  delete(val) { this.root = this._delete(this.root, val); }
  _delete(node, val) {
    if (!node) return null;
    if (val < node.val) { node.left = this._delete(node.left, val); }
    else if (val > node.val) { node.right = this._delete(node.right, val); }
    else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      let min = node.right;
      while (min.left) min = min.left;
      node.val = min.val;
      node.right = this._delete(node.right, min.val);
    }
    return node;
  }
  search(val) {
    let cur = this.root;
    while (cur) {
      if (val === cur.val) return true;
      cur = val < cur.val ? cur.left : cur.right;
    }
    return false;
  }
  inorder(node = this.root, res = []) { if (node) { this.inorder(node.left, res); res.push(node.val); this.inorder(node.right, res); } return res; }
  preorder(node = this.root, res = []) { if (node) { res.push(node.val); this.preorder(node.left, res); this.preorder(node.right, res); } return res; }
  postorder(node = this.root, res = []) { if (node) { this.postorder(node.left, res); this.postorder(node.right, res); res.push(node.val); } return res; }
  levelorder() {
    if (!this.root) return [];
    const res = [], q = [this.root];
    while (q.length) { const n = q.shift(); res.push(n.val); if (n.left) q.push(n.left); if (n.right) q.push(n.right); }
    return res;
  }
}

let bst = new BST();
let highlightNode = -1;
let traversalResult = [];
let traversalIdx = -1;
let traversalRunner = null;

// Seed with some values
[50, 30, 70, 20, 40, 60, 80].forEach(v => bst.insert(v));

export function renderTrees(container) {
  addRecent('trees');
  renderTreePage(container);
}

function renderTreePage(container) {
  container.innerHTML = `
    <div class="page-enter">
      <div style="margin-bottom:var(--space-6)">
        <h2>Binary Search Tree Visualizer</h2>
        <p style="margin-top:4px">Visualize BST operations and tree traversals</p>
      </div>

      <div class="viz-layout">
        <div class="viz-panel">
          <div class="viz-panel-header">
            <span class="viz-panel-title">Binary Search Tree</span>
            <span class="badge badge-purple">BST</span>
          </div>

          <!-- SVG Tree canvas -->
          <div class="tree-canvas-wrap" id="tree-canvas-wrap">
            <svg id="tree-svg" width="600" height="360" class="tree-canvas"></svg>
          </div>

          <!-- Step explainer -->
          <div style="padding:0 var(--space-5) var(--space-3)">
            <div class="step-explainer">
              <div class="step-number" id="tree-op-name">Ready</div>
              <div class="step-text" id="tree-op-text">Use the controls below to interact with the BST.</div>
            </div>
          </div>

          <!-- Traversal result -->
          <div style="padding:0 var(--space-5) var(--space-3)">
            <div style="font-size:0.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px" id="traversal-label"></div>
            <div class="traversal-result" id="traversal-result">
              <span style="color:var(--text-muted);font-size:0.85rem">Run a traversal to see the result here</span>
            </div>
          </div>

          <!-- Controls -->
          <div class="controls-panel">
            <div class="controls-row" style="flex-wrap:wrap;gap:var(--space-3)">
              <!-- Insert -->
              <div class="control-group">
                <label class="control-label">Insert Node</label>
                <div class="input-group">
                  <input type="number" class="input" id="tree-insert-val" placeholder="Value" style="width:90px"/>
                  <button class="btn btn-primary btn-sm" id="tree-insert-btn">Insert</button>
                </div>
              </div>
              <!-- Delete -->
              <div class="control-group">
                <label class="control-label">Delete Node</label>
                <div class="input-group">
                  <input type="number" class="input" id="tree-delete-val" placeholder="Value" style="width:90px"/>
                  <button class="btn btn-danger btn-sm" id="tree-delete-btn">Delete</button>
                </div>
              </div>
              <!-- Search -->
              <div class="control-group">
                <label class="control-label">Search Node</label>
                <div class="input-group">
                  <input type="number" class="input" id="tree-search-val" placeholder="Value" style="width:90px"/>
                  <button class="btn btn-secondary btn-sm" id="tree-search-btn">Search</button>
                </div>
              </div>
            </div>
            <div class="controls-row" style="flex-wrap:wrap;gap:var(--space-2)">
              <span style="font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-right:4px">Traversal:</span>
              <div class="traversal-btns">
                <button class="btn btn-secondary btn-sm" id="trav-inorder">Inorder</button>
                <button class="btn btn-secondary btn-sm" id="trav-preorder">Preorder</button>
                <button class="btn btn-secondary btn-sm" id="trav-postorder">Postorder</button>
                <button class="btn btn-secondary btn-sm" id="trav-level">Level Order</button>
              </div>
              <button class="btn btn-ghost btn-sm" id="tree-reset-btn">Reset Tree</button>
            </div>
          </div>

          <!-- Complexity -->
          <div style="padding:var(--space-4) var(--space-5)">
            <div class="complexity-grid">
              <div class="complexity-item"><div class="complexity-label">Search (avg)</div><div class="complexity-value okay">O(log n)</div></div>
              <div class="complexity-item"><div class="complexity-label">Insert (avg)</div><div class="complexity-value okay">O(log n)</div></div>
              <div class="complexity-item"><div class="complexity-label">Delete (avg)</div><div class="complexity-value okay">O(log n)</div></div>
              <div class="complexity-item"><div class="complexity-label">Worst case</div><div class="complexity-value bad">O(n)</div></div>
            </div>
          </div>
        </div>

        <!-- Info panel -->
        <div class="viz-info-panel">
          <div class="card">
            <h3>Binary Search Tree</h3>
            <div class="info-section" style="margin-top:var(--space-4)">
              <h4>BST Property</h4>
              <p>For every node: all values in the LEFT subtree are LESS than the node, and all values in the RIGHT subtree are GREATER.</p>
            </div>
            <div class="info-section">
              <h4>Traversal Orders</h4>
              <ul class="feature-list">
                <li><strong>Inorder (L→N→R):</strong> Visits nodes in sorted order</li>
                <li><strong>Preorder (N→L→R):</strong> Root first, then subtrees</li>
                <li><strong>Postorder (L→R→N):</strong> Leaves before root</li>
                <li><strong>Level Order (BFS):</strong> Level by level</li>
              </ul>
            </div>
            <div class="info-section">
              <h4>Tree Properties</h4>
              <div id="tree-props"></div>
            </div>
          </div>

          <!-- Legend -->
          <div class="card" style="padding:var(--space-4)">
            <div style="font-size:0.8rem;font-weight:700;margin-bottom:var(--space-3)">Node Colors</div>
            <div style="display:flex;flex-direction:column;gap:var(--space-2)">
              <div class="legend-item"><div class="legend-dot" style="border-radius:50%;background:var(--accent-blue)"></div>Default Node</div>
              <div class="legend-item"><div class="legend-dot" style="border-radius:50%;background:var(--accent-green)"></div>Found / Visited</div>
              <div class="legend-item"><div class="legend-dot" style="border-radius:50%;background:var(--accent-yellow)"></div>Current (traversal)</div>
              <div class="legend-item"><div class="legend-dot" style="border-radius:50%;background:var(--accent-red)"></div>Not found path</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  renderTree();
  updateTreeProps();
  bindTreeEvents();
}

function computeLayout(node, depth = 0, left = 0, right = 1, positions = new Map()) {
  if (!node) return positions;
  const x = (left + right) / 2;
  const y = depth;
  positions.set(node.val, { x, y, depth });
  computeLayout(node.left, depth + 1, left, x, positions);
  computeLayout(node.right, depth + 1, x, right, positions);
  return positions;
}

function renderTree(highlightVal = null, highlightColor = null) {
  const svg = document.getElementById('tree-svg');
  if (!svg) return;
  const wrap = document.getElementById('tree-canvas-wrap');
  const W = wrap ? wrap.offsetWidth - 32 || 600 : 600;
  const H = 360;
  const nodeR = 22;
  const levelH = 80;

  if (!bst.root) {
    svg.innerHTML = `<text x="${W/2}" y="${H/2}" text-anchor="middle" fill="var(--text-muted)" font-size="14" font-family="Inter, sans-serif">Tree is empty — insert some nodes</text>`;
    return;
  }

  const positions = computeLayout(bst.root);
  let edges = '', nodes = '';

  positions.forEach(({ x, y }, val) => {
    const cx = x * W;
    const cy = 40 + y * levelH;
    const node = findNode(bst.root, val);
    if (node) {
      if (node.left && positions.has(node.left.val)) {
        const lp = positions.get(node.left.val);
        edges += `<line x1="${cx}" y1="${cy}" x2="${lp.x * W}" y2="${40 + lp.y * levelH}" stroke="var(--border-hover)" stroke-width="2" class="graph-edge"/>`;
      }
      if (node.right && positions.has(node.right.val)) {
        const rp = positions.get(node.right.val);
        edges += `<line x1="${cx}" y1="${cy}" x2="${rp.x * W}" y2="${40 + rp.y * levelH}" stroke="var(--border-hover)" stroke-width="2" class="graph-edge"/>`;
      }
    }
  });

  positions.forEach(({ x, y }, val) => {
    const cx = x * W;
    const cy = 40 + y * levelH;
    let fill = 'var(--accent-blue)';
    let stroke = 'rgba(79,156,249,0.4)';
    if (highlightVal !== null && highlightVal === val) {
      fill = highlightColor || 'var(--accent-green)';
      stroke = 'rgba(52,211,153,0.5)';
    }
    nodes += `
      <g>
        <circle cx="${cx}" cy="${cy}" r="${nodeR}" fill="${fill}" stroke="${stroke}" stroke-width="3" class="tree-node-circle"/>
        <text x="${cx}" y="${cy + 5}" text-anchor="middle" fill="#fff" class="tree-node-text">${val}</text>
      </g>
    `;
  });

  svg.setAttribute('width', W);
  svg.innerHTML = edges + nodes;
}

function findNode(root, val) {
  if (!root) return null;
  if (root.val === val) return root;
  return val < root.val ? findNode(root.left, val) : findNode(root.right, val);
}

function updateTreeProps() {
  const el = document.getElementById('tree-props');
  if (!el) return;
  const inorder = bst.inorder();
  const height = getHeight(bst.root);
  el.innerHTML = `
    <table class="graph-info-table" style="width:100%">
      <tr><td>Height</td><td style="font-family:'JetBrains Mono',monospace;font-weight:600;color:var(--text-primary)">${height}</td></tr>
      <tr><td>Nodes</td><td style="font-family:'JetBrains Mono',monospace;font-weight:600;color:var(--text-primary)">${inorder.length}</td></tr>
      <tr><td>Min</td><td style="font-family:'JetBrains Mono',monospace;font-weight:600;color:var(--accent-green)">${inorder.length > 0 ? inorder[0] : '—'}</td></tr>
      <tr><td>Max</td><td style="font-family:'JetBrains Mono',monospace;font-weight:600;color:var(--accent-red)">${inorder.length > 0 ? inorder[inorder.length-1] : '—'}</td></tr>
    </table>
  `;
}

function getHeight(node) {
  if (!node) return 0;
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function setTreeOp(name, text) {
  const nameEl = document.getElementById('tree-op-name');
  const textEl = document.getElementById('tree-op-text');
  if (nameEl) nameEl.textContent = name;
  if (textEl) textEl.textContent = text;
}

function runTraversal(type) {
  let result, label;
  switch (type) {
    case 'inorder': result = bst.inorder(); label = 'Inorder (L → N → R)'; break;
    case 'preorder': result = bst.preorder(); label = 'Preorder (N → L → R)'; break;
    case 'postorder': result = bst.postorder(); label = 'Postorder (L → R → N)'; break;
    case 'level': result = bst.levelorder(); label = 'Level Order (BFS)'; break;
  }

  document.getElementById('traversal-label').textContent = label + ':';
  traversalResult = result;
  traversalIdx = -1;

  // Show all nodes with animated highlighting
  const resultEl = document.getElementById('traversal-result');
  resultEl.innerHTML = result.map((v, i) => `
    <span class="traversal-node" id="trav-node-${i}">${v}</span>
    ${i < result.length - 1 ? '<span class="traversal-arrow">→</span>' : ''}
  `).join('');

  setTreeOp(label, `Starting ${type} traversal of ${result.length} nodes...`);

  let idx = 0;
  const interval = setInterval(() => {
    if (idx > 0) {
      // Unhighlight previous
      const prev = document.getElementById(`trav-node-${idx-1}`);
      if (prev) prev.classList.remove('visited');
      renderTree(null, null);
    }
    if (idx >= result.length) {
      clearInterval(interval);
      // Mark all visited
      result.forEach((_, i) => {
        const n = document.getElementById(`trav-node-${i}`);
        if (n) n.classList.add('visited');
      });
      renderTree(null, null);
      setTreeOp(label + ' Complete', `Visited ${result.length} nodes: ${result.join(' → ')}`);
      return;
    }
    const val = result[idx];
    const nodeEl = document.getElementById(`trav-node-${idx}`);
    if (nodeEl) {
      nodeEl.classList.add('visited', 'new');
      setTimeout(() => nodeEl.classList.remove('new'), 300);
    }
    renderTree(val, 'var(--accent-yellow)');
    setTreeOp(label, `Visiting node ${val} (step ${idx + 1}/${result.length})`);
    idx++;
  }, 500);
}

function bindTreeEvents() {
  document.getElementById('tree-insert-btn').addEventListener('click', () => {
    const val = parseInt(document.getElementById('tree-insert-val').value);
    if (isNaN(val)) { showToast('Enter a valid value'); return; }
    if (bst.search(val)) { showToast(`${val} already exists in the tree`); return; }
    bst.insert(val);
    renderTree(val, 'var(--accent-green)');
    updateTreeProps();
    setTreeOp(`Insert(${val})`, `Node ${val} inserted. BST property maintained: left < node < right.`);
  });

  document.getElementById('tree-delete-btn').addEventListener('click', () => {
    const val = parseInt(document.getElementById('tree-delete-val').value);
    if (isNaN(val)) { showToast('Enter a valid value'); return; }
    if (!bst.search(val)) { showToast(`${val} not found in the tree`); return; }
    bst.delete(val);
    renderTree();
    updateTreeProps();
    setTreeOp(`Delete(${val})`, `Node ${val} deleted from BST. Successor used if node had two children.`);
  });

  document.getElementById('tree-search-btn').addEventListener('click', () => {
    const val = parseInt(document.getElementById('tree-search-val').value);
    if (isNaN(val)) { showToast('Enter a valid value'); return; }
    const found = bst.search(val);
    renderTree(val, found ? 'var(--accent-green)' : 'var(--accent-red)');
    setTreeOp(`Search(${val})`, found
      ? `✓ Found ${val} in the BST! Navigated from root comparing values at each node.`
      : `✗ ${val} not found. Searched from root — reached NULL leaf.`);
    showToast(found ? `${val} found in BST ✓` : `${val} not found`);
  });

  document.getElementById('trav-inorder').addEventListener('click', () => runTraversal('inorder'));
  document.getElementById('trav-preorder').addEventListener('click', () => runTraversal('preorder'));
  document.getElementById('trav-postorder').addEventListener('click', () => runTraversal('postorder'));
  document.getElementById('trav-level').addEventListener('click', () => runTraversal('level'));

  document.getElementById('tree-reset-btn').addEventListener('click', () => {
    bst = new BST();
    [50, 30, 70, 20, 40, 60, 80].forEach(v => bst.insert(v));
    renderTree();
    updateTreeProps();
    document.getElementById('traversal-result').innerHTML = '<span style="color:var(--text-muted);font-size:0.85rem">Run a traversal to see the result here</span>';
    document.getElementById('traversal-label').textContent = '';
    setTreeOp('Reset', 'Tree reset to default BST with nodes: 50, 30, 70, 20, 40, 60, 80.');
  });
}
