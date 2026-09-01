// ===== ABOUT PAGE =====
import { renderComplexityChart } from '../utils.js';

export function renderAbout(container) {
  container.innerHTML = `
    <div class="page-enter">
      <div class="about-hero">
        <span class="badge badge-purple" style="margin-bottom:var(--space-3)">About the Platform</span>
        <h2>Master DSA Interactively</h2>
        <p style="max-width:640px;margin:12px auto 0;font-size:1.05rem">
          DSA Visualizer is built for engineering students, interview candidates, and programmers who want to truly understand Data Structures &amp; Algorithms through step-by-step visual execution.
        </p>
      </div>

      <div class="about-section">
        <div class="card" style="margin-bottom:var(--space-6)">
          <div class="section-header">
            <div>
              <div class="section-title">Asymptotic Complexity Comparison</div>
              <div class="section-subtitle">Growth rates of common Big-O complexity classes</div>
            </div>
          </div>
          <div id="about-complexity-chart"></div>
          <div style="margin-top:var(--space-4);overflow-x:auto">
            <table class="dijkstra-table">
              <thead>
                <tr>
                  <th>Notation</th>
                  <th>Name</th>
                  <th>Example Algorithms</th>
                  <th>Performance Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="badge badge-green">O(1)</span></td>
                  <td>Constant</td>
                  <td>Array index access, Stack push/pop, Queue enqueue/dequeue</td>
                  <td><span style="color:var(--accent-green);font-weight:700">Excellent</span></td>
                </tr>
                <tr>
                  <td><span class="badge badge-blue">O(log n)</span></td>
                  <td>Logarithmic</td>
                  <td>Binary Search, BST Search (balanced)</td>
                  <td><span style="color:var(--accent-blue);font-weight:700">Great</span></td>
                </tr>
                <tr>
                  <td><span class="badge badge-purple">O(n)</span></td>
                  <td>Linear</td>
                  <td>Linear Search, Traversal, Array insertion/deletion</td>
                  <td><span style="color:var(--accent-purple);font-weight:700">Fair</span></td>
                </tr>
                <tr>
                  <td><span class="badge badge-yellow">O(n log n)</span></td>
                  <td>Linearithmic</td>
                  <td>Merge Sort, Heap Sort, Quick Sort (average)</td>
                  <td><span style="color:var(--accent-yellow);font-weight:700">Good for sorting</span></td>
                </tr>
                <tr>
                  <td><span class="badge badge-red">O(n²)</span></td>
                  <td>Quadratic</td>
                  <td>Bubble Sort, Selection Sort, Insertion Sort</td>
                  <td><span style="color:var(--accent-red);font-weight:700">Slow for large n</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card" style="margin-bottom:var(--space-6)">
          <div class="section-title" style="margin-bottom:var(--space-4)">Supported Visualizations</div>
          <ul class="feature-list">
            <li><strong>Sorting:</strong> Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort with animated comparisons, swaps, pivots, and custom input.</li>
            <li><strong>Searching:</strong> Linear Search and Binary Search with pointer tracking and eliminated zone visualization.</li>
            <li><strong>Arrays:</strong> Real-time animated memory indexing, insert/delete shifts, search, and update operations.</li>
            <li><strong>Linked Lists:</strong> Singly linked list with animated pointer traversal, insertions, deletions, and search.</li>
            <li><strong>Stack:</strong> Vertical LIFO visualizer with slide push/pop animations, peek, and capacity limits.</li>
            <li><strong>Queue:</strong> Horizontal FIFO visualizer with front/rear tracking and enter/exit animations.</li>
            <li><strong>Trees:</strong> Binary Search Tree with SVG graph nodes, dynamic layout, insert/delete/search, and animated Inorder, Preorder, Postorder, and Level-order traversals.</li>
            <li><strong>Graphs:</strong> Interactive graph creation canvas with BFS, DFS, Dijkstra shortest path table, and shortest path highlighting.</li>
            <li><strong>Multi-language Code:</strong> Clean syntax-highlighted code in C++, JavaScript, and Python with one-click copy.</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  renderComplexityChart('about-complexity-chart');
}
