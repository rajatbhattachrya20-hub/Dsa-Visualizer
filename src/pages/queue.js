// ===== QUEUE VISUALIZER PAGE =====
import { showToast, addRecent } from '../utils.js';

let queueData = [10, 20, 30, 40];

export function renderQueue(container) {
  addRecent('queue');
  renderQueuePage(container);
}

function renderQueuePage(container) {
  container.innerHTML = `
    <div class="page-enter">
      <div style="margin-bottom:var(--space-6)">
        <h2>Queue Visualizer</h2>
        <p style="margin-top:4px">Visualize FIFO (First In, First Out) queue operations</p>
      </div>

      <div class="viz-layout">
        <div class="viz-panel">
          <div class="viz-panel-header">
            <span class="viz-panel-title">Queue (FIFO)</span>
            <span class="badge badge-blue">Size: <span id="queue-size">${queueData.length}</span></span>
          </div>

          <!-- Queue visualization -->
          <div class="queue-container" id="queue-container">
            ${queueData.length === 0 ? '<div class="queue-empty" style="color:var(--text-muted);font-size:0.9rem">Queue is empty</div>' : ''}
          </div>

          <!-- Step explainer -->
          <div style="padding:0 var(--space-5) var(--space-3)">
            <div class="step-explainer">
              <div class="step-number" id="queue-op-name">Ready</div>
              <div class="step-text" id="queue-op-text">Use the controls below to perform queue operations.</div>
            </div>
          </div>

          <!-- Stats -->
          <div style="padding:var(--space-3) var(--space-5)">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value" style="color:var(--accent-blue)" id="queue-front-val">${queueData.length > 0 ? queueData[0] : '—'}</div>
                <div class="stat-label">Front</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" style="color:var(--accent-green)" id="queue-rear-val">${queueData.length > 0 ? queueData[queueData.length-1] : '—'}</div>
                <div class="stat-label">Rear</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" id="queue-size-stat">${queueData.length}</div>
                <div class="stat-label">Size</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" id="queue-empty-stat" style="color:${queueData.length === 0 ? 'var(--accent-green)' : 'var(--text-muted)'}">${queueData.length === 0 ? 'Yes' : 'No'}</div>
                <div class="stat-label">Is Empty?</div>
              </div>
            </div>
          </div>

          <!-- Controls -->
          <div class="controls-panel">
            <div class="controls-row" style="flex-wrap:wrap;gap:var(--space-3)">
              <div class="control-group">
                <label class="control-label">Enqueue (add to rear)</label>
                <div class="input-group">
                  <input type="number" class="input" id="queue-enqueue-val" placeholder="Value" style="width:100px"/>
                  <button class="btn btn-primary" id="queue-enqueue-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                    Enqueue
                  </button>
                </div>
              </div>
              <div class="control-group">
                <label class="control-label">Operations</label>
                <div style="display:flex;gap:var(--space-2);flex-wrap:wrap">
                  <button class="btn btn-danger" id="queue-dequeue-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                    Dequeue
                  </button>
                  <button class="btn btn-secondary" id="queue-front-btn">Front</button>
                  <button class="btn btn-secondary" id="queue-rear-btn">Rear</button>
                  <button class="btn btn-secondary" id="queue-isempty-btn">isEmpty?</button>
                  <button class="btn btn-ghost" id="queue-reset-btn">Reset</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Complexity -->
          <div style="padding:var(--space-4) var(--space-5)">
            <div class="complexity-grid">
              <div class="complexity-item"><div class="complexity-label">Enqueue</div><div class="complexity-value good">O(1)</div></div>
              <div class="complexity-item"><div class="complexity-label">Dequeue</div><div class="complexity-value good">O(1)</div></div>
              <div class="complexity-item"><div class="complexity-label">Front/Rear</div><div class="complexity-value good">O(1)</div></div>
              <div class="complexity-item"><div class="complexity-label">Space</div><div class="complexity-value okay">O(n)</div></div>
            </div>
          </div>
        </div>

        <!-- Info panel -->
        <div class="viz-info-panel">
          <div class="card">
            <h3>Queue (FIFO)</h3>
            <div class="info-section" style="margin-top:var(--space-4)">
              <h4>What is a Queue?</h4>
              <p>A queue is a linear data structure that follows the FIFO (First In, First Out) principle. Elements are added at the rear (enqueue) and removed from the front (dequeue) — like a real-world queue/line.</p>
            </div>
            <div class="info-section">
              <h4>Core Operations</h4>
              <ul class="feature-list">
                <li><strong>Enqueue:</strong> Add element to rear</li>
                <li><strong>Dequeue:</strong> Remove from front</li>
                <li><strong>Front:</strong> View front element</li>
                <li><strong>Rear:</strong> View rear element</li>
                <li><strong>isEmpty:</strong> Check if empty</li>
              </ul>
            </div>
            <div class="info-section">
              <h4>Real-world Uses</h4>
              <ul class="feature-list">
                <li>CPU scheduling (process queue)</li>
                <li>Printer job queue</li>
                <li>BFS graph traversal</li>
                <li>Keyboard buffer</li>
                <li>Network packet routing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  renderQueueVisualization();
  bindQueueEvents();
}

function renderQueueVisualization(enqueueIdx = -1, dequeueIdx = false) {
  const container = document.getElementById('queue-container');
  if (!container) return;

  if (queueData.length === 0) {
    container.innerHTML = '<div class="queue-empty">Queue is empty</div>';
  } else {
    let html = `<div class="queue-label front">FRONT →</div>`;
    html += queueData.map((val, i) => {
      let cls = 'queue-cell';
      if (i === enqueueIdx) cls += ' enqueuing';
      if (dequeueIdx && i === 0) cls += ' dequeuing';
      return `<div class="${cls}">${val}</div>`;
    }).join('');
    html += `<div class="queue-label rear">← REAR</div>`;
    container.innerHTML = html;
  }

  // Update stats
  const frontEl = document.getElementById('queue-front-val');
  const rearEl = document.getElementById('queue-rear-val');
  const sizeEl = document.getElementById('queue-size');
  const sizeStat = document.getElementById('queue-size-stat');
  const emptyEl = document.getElementById('queue-empty-stat');
  if (frontEl) frontEl.textContent = queueData.length > 0 ? queueData[0] : '—';
  if (rearEl) rearEl.textContent = queueData.length > 0 ? queueData[queueData.length-1] : '—';
  if (sizeEl) sizeEl.textContent = queueData.length;
  if (sizeStat) sizeStat.textContent = queueData.length;
  if (emptyEl) {
    emptyEl.textContent = queueData.length === 0 ? 'Yes' : 'No';
    emptyEl.style.color = queueData.length === 0 ? 'var(--accent-green)' : 'var(--text-muted)';
  }
}

function setQueueOp(name, text) {
  const nameEl = document.getElementById('queue-op-name');
  const textEl = document.getElementById('queue-op-text');
  if (nameEl) nameEl.textContent = name;
  if (textEl) textEl.textContent = text;
}

function bindQueueEvents() {
  document.getElementById('queue-enqueue-btn').addEventListener('click', () => {
    const val = parseInt(document.getElementById('queue-enqueue-val').value);
    if (isNaN(val)) { showToast('Enter a valid value to enqueue'); return; }
    if (queueData.length >= 10) { showToast('Queue is full! Max 10 elements.'); return; }
    queueData.push(val);
    renderQueueVisualization(queueData.length - 1);
    setQueueOp(`Enqueue(${val})`, `Element ${val} added to the rear of the queue. New rear = ${val}. Size = ${queueData.length}.`);
  });

  document.getElementById('queue-dequeue-btn').addEventListener('click', () => {
    if (queueData.length === 0) { showToast('Queue underflow! Queue is empty.'); return; }
    const val = queueData[0];
    renderQueueVisualization(-1, true);
    setQueueOp(`Dequeue()`, `Element ${val} removed from the front. New front = ${queueData[1] ?? 'none'}. Size = ${queueData.length - 1}.`);
    setTimeout(() => { queueData.shift(); renderQueueVisualization(); }, 400);
  });

  document.getElementById('queue-front-btn').addEventListener('click', () => {
    if (queueData.length === 0) { showToast('Queue is empty'); return; }
    setQueueOp(`Front()`, `Front element is ${queueData[0]}. This operation views the front element without removing it.`);
    showToast(`Front = ${queueData[0]}`);
  });

  document.getElementById('queue-rear-btn').addEventListener('click', () => {
    if (queueData.length === 0) { showToast('Queue is empty'); return; }
    setQueueOp(`Rear()`, `Rear element is ${queueData[queueData.length-1]}. This operation views the rear without removing it.`);
    showToast(`Rear = ${queueData[queueData.length-1]}`);
  });

  document.getElementById('queue-isempty-btn').addEventListener('click', () => {
    const empty = queueData.length === 0;
    setQueueOp(`isEmpty()`, `The queue is ${empty ? 'EMPTY' : `NOT empty. Size = ${queueData.length}. Front = ${queueData[0]}`}.`);
    showToast(`isEmpty() = ${empty}`);
  });

  document.getElementById('queue-reset-btn').addEventListener('click', () => {
    queueData = [10, 20, 30, 40];
    renderQueueVisualization();
    setQueueOp('Reset', 'Queue reset to default state.');
  });
}
