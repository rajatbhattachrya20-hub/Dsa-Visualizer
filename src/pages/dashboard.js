// ===== DASHBOARD PAGE =====
import { ALGORITHMS } from '../data/algorithms.js';
import { getFavorites, getProgress, getRecent, getProgressPct, addRecent, toggleFavorite, isFavorite, showToast } from '../utils.js';
import { navigate } from '../router.js';

export function renderDashboard(container) {
  const total = ALGORITHMS.length;
  const pct = getProgressPct(total);
  const recent = getRecent();
  const favs = getFavorites();

  const categories = [
    { name: 'Sorting', desc: '6 algorithms', icon: '⚡', color: '#4f9cf9', page: 'sorting', bg: 'rgba(79,156,249,0.12)' },
    { name: 'Searching', desc: '2 algorithms', icon: '🔍', color: '#34d399', page: 'searching', bg: 'rgba(52,211,153,0.12)' },
    { name: 'Arrays', desc: 'Access, Insert, Delete', icon: '📊', color: '#a78bfa', page: 'arrays', bg: 'rgba(167,139,250,0.12)' },
    { name: 'Linked Lists', desc: 'Singly linked list', icon: '🔗', color: '#fb923c', page: 'linkedlist', bg: 'rgba(251,146,60,0.12)' },
    { name: 'Stack', desc: 'LIFO structure', icon: '📚', color: '#fbbf24', page: 'stack', bg: 'rgba(251,191,36,0.12)' },
    { name: 'Queue', desc: 'FIFO structure', icon: '🚶', color: '#f472b6', page: 'queue', bg: 'rgba(244,114,182,0.12)' },
    { name: 'Binary Trees', desc: 'BST + traversals', icon: '🌳', color: '#22d3ee', page: 'trees', bg: 'rgba(34,211,238,0.12)' },
    { name: 'Graphs', desc: 'BFS, DFS, Dijkstra', icon: '🕸️', color: '#f87171', page: 'graphs', bg: 'rgba(248,113,113,0.12)' },
  ];

  const popularAlgos = [
    { id: 'bubble-sort', name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)', type: 'sorting' },
    { id: 'selection-sort', name: 'Selection Sort', time: 'O(n²)', space: 'O(1)', type: 'sorting' },
    { id: 'insertion-sort', name: 'Insertion Sort', time: 'O(n²)', space: 'O(1)', type: 'sorting' },
    { id: 'merge-sort', name: 'Merge Sort', time: 'O(n log n)', space: 'O(n)', type: 'sorting' },
    { id: 'quick-sort', name: 'Quick Sort', time: 'O(n log n)', space: 'O(log n)', type: 'sorting' },
    { id: 'binary-search', name: 'Binary Search', time: 'O(log n)', space: 'O(1)', type: 'searching' },
    { id: 'bfs', name: 'BFS', time: 'O(V+E)', space: 'O(V)', type: 'graph' },
    { id: 'dfs', name: 'DFS', time: 'O(V+E)', space: 'O(V)', type: 'graph' },
  ];

  const progressData = getProgress();
  const completed = Object.values(progressData).filter(v => v === 'completed').length;
  const learning = Object.values(progressData).filter(v => v === 'learning').length;

  container.innerHTML = `
    <div class="page-enter">
      <!-- Hero -->
      <div class="dashboard-hero">
        <div class="hero-content">
          <div class="hero-tag">Interactive Learning Platform</div>
          <h1 class="hero-title">
            Understand DSA.<br>
            <span class="gradient-text">Don't Just Memorize It.</span>
          </h1>
          <p class="hero-subtitle">
            Visualize algorithms, follow every step, and master Data Structures &amp; Algorithms interactively through beautiful animations.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary" id="hero-start-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start Visualizing
            </button>
            <button class="btn btn-secondary" id="hero-explore-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Explore Algorithms
            </button>
          </div>
        </div>
        <div class="hero-preview">
          ${[60,90,40,75,55,100,30,85].map((h, i) => `<div class="preview-bar" style="height:${h}%;animation-delay:${i*0.15}s;background:${['#4f9cf9','#fbbf24','#f87171','#4f9cf9','#fbbf24','#34d399','#4f9cf9','#a78bfa'][i]}"></div>`).join('')}
        </div>
      </div>

      <!-- Stats strip -->
      <div class="stats-strip">
        <div class="stat-strip-item">
          <div class="stat-strip-value" style="color:var(--accent-blue)">${total}</div>
          <div class="stat-strip-label">Total Algorithms</div>
        </div>
        <div class="stat-strip-item">
          <div class="stat-strip-value" style="color:var(--accent-green)">${completed}</div>
          <div class="stat-strip-label">Completed</div>
        </div>
        <div class="stat-strip-item">
          <div class="stat-strip-value" style="color:var(--accent-yellow)">${learning}</div>
          <div class="stat-strip-label">In Progress</div>
        </div>
        <div class="stat-strip-item">
          <div class="stat-strip-value" style="color:var(--accent-purple)">${pct}%</div>
          <div class="stat-strip-label">Progress</div>
        </div>
      </div>

      <!-- Learning Progress -->
      <div class="card" style="margin-bottom:var(--space-8)">
        <div class="section-header">
          <div>
            <div class="section-title">Learning Progress</div>
            <div class="section-subtitle">${completed} of ${total} algorithms completed</div>
          </div>
          <span class="badge badge-blue">${pct}%</span>
        </div>
        <div class="progress-bar-wrap" style="height:10px">
          <div class="progress-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>

      <!-- Recent & Favorites -->
      ${recent.length > 0 ? `
      <div style="margin-bottom:var(--space-8)">
        <div class="section-header"><div class="section-title">Recently Visited</div></div>
        <div class="pill-list">
          ${recent.map(id => {
            const algo = ALGORITHMS.find(a => a.id === id);
            return algo ? `<div class="pill" data-page="${algo.page}" data-algo="${algo.id}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${algo.name}
            </div>` : '';
          }).join('')}
        </div>
      </div>
      ` : ''}

      ${favs.length > 0 ? `
      <div style="margin-bottom:var(--space-8)">
        <div class="section-header"><div class="section-title">Favorites</div></div>
        <div class="pill-list">
          ${favs.map(id => {
            const algo = ALGORITHMS.find(a => a.id === id);
            return algo ? `<div class="pill" data-page="${algo.page}" data-algo="${algo.id}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="var(--accent-pink)"/></svg>
              ${algo.name}
            </div>` : '';
          }).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Categories -->
      <div class="section-header"><div class="section-title">Data Structures & Algorithms</div></div>
      <div class="categories-grid" style="margin-bottom:var(--space-8)">
        ${categories.map(cat => `
          <div class="category-card" data-page="${cat.page}">
            <div class="category-icon" style="background:${cat.bg}; font-size:1.6rem">${cat.icon}</div>
            <div class="category-info">
              <h4>${cat.name}</h4>
              <p>${cat.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Popular Algorithms -->
      <div class="section-header" style="margin-bottom:var(--space-6)">
        <div class="section-title">Popular Algorithms</div>
        <span class="badge badge-purple">${popularAlgos.length} algorithms</span>
      </div>
      <div class="algo-cards-grid">
        ${popularAlgos.map(algo => `
          <div class="algo-card ${algo.type}" data-algo-id="${algo.id}">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
              <span class="badge badge-${algo.type === 'sorting' ? 'blue' : algo.type === 'searching' ? 'green' : 'orange'}">${algo.type.charAt(0).toUpperCase() + algo.type.slice(1)}</span>
              <button class="fav-btn ${isFavorite(algo.id) ? 'active' : ''}" data-fav="${algo.id}" title="Favorite">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="${isFavorite(algo.id) ? 'var(--accent-pink)' : 'none'}" stroke="var(--accent-pink)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              </button>
            </div>
            <div class="algo-card-title">${algo.name}</div>
            <div class="algo-card-complexity">Time: <span>${algo.time}</span> · Space: <span>${algo.space}</span></div>
            <div class="algo-card-footer">
              <button class="btn btn-primary btn-sm visualize-btn" data-page="${algo.type === 'sorting' ? 'sorting' : algo.type === 'searching' ? 'searching' : 'graphs'}" data-algo="${algo.id}">
                Visualize →
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Events
  container.querySelector('#hero-start-btn').addEventListener('click', () => navigate('sorting'));
  container.querySelector('#hero-explore-btn').addEventListener('click', () => {
    container.querySelector('.categories-grid').scrollIntoView({ behavior: 'smooth' });
  });

  container.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => navigate(card.dataset.page));
  });

  container.querySelectorAll('.visualize-btn').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });

  container.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.fav;
      const favs = toggleFavorite(id);
      const isFav = favs.includes(id);
      btn.classList.toggle('active', isFav);
      btn.querySelector('svg').setAttribute('fill', isFav ? 'var(--accent-pink)' : 'none');
      showToast(isFav ? `Added "${id}" to favorites` : `Removed from favorites`);
    });
  });

  container.querySelectorAll('.pill[data-page]').forEach(pill => {
    pill.addEventListener('click', () => navigate(pill.dataset.page));
  });
}
