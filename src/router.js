// ===== CLIENT ROUTER =====
import { renderDashboard } from './pages/dashboard.js';
import { renderSorting } from './pages/sorting.js';
import { renderSearching } from './pages/searching.js';
import { renderArrays } from './pages/arrays.js';
import { renderLinkedList } from './pages/linkedlist.js';
import { renderStack } from './pages/stack.js';
import { renderQueue } from './pages/queue.js';
import { renderTrees } from './pages/trees.js';
import { renderGraphs } from './pages/graphs.js';
import { renderAbout } from './pages/about.js';
import { ALGORITHMS } from './data/algorithms.js';
import { getProgressPct } from './utils.js';

const routes = {
  dashboard:  { render: renderDashboard,  title: 'Dashboard' },
  sorting:    { render: renderSorting,    title: 'Sorting Algorithms' },
  searching:  { render: renderSearching,  title: 'Searching Algorithms' },
  arrays:     { render: renderArrays,     title: 'Arrays' },
  linkedlist: { render: renderLinkedList, title: 'Linked Lists' },
  stack:      { render: renderStack,      title: 'Stack' },
  queue:      { render: renderQueue,      title: 'Queue' },
  trees:      { render: renderTrees,      title: 'Trees & BST' },
  graphs:     { render: renderGraphs,     title: 'Graph Algorithms' },
  about:      { render: renderAbout,      title: 'About' },
};

let currentPage = 'dashboard';

export function navigate(pageName) {
  const target = routes[pageName] ? pageName : 'dashboard';
  currentPage = target;

  // Update hash
  window.location.hash = target;

  // Render page
  const main = document.getElementById('page-content');
  if (main) {
    main.innerHTML = '';
    routes[target].render(main);
  }

  // Update breadcrumb
  const breadcrumb = document.getElementById('breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = target === 'dashboard'
      ? '<span>Dashboard</span>'
      : `<span>Dashboard</span> <span>${routes[target].title}</span>`;
  }

  // Update sidebar active link
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === target);
  });

  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('visible');

  // Update sidebar learning progress
  updateSidebarProgress();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function updateSidebarProgress() {
  const total = ALGORITHMS.length;
  const pct = getProgressPct(total);
  const fill = document.getElementById('sidebar-progress-fill');
  const pctText = document.getElementById('sidebar-progress-pct');
  if (fill) fill.style.width = `${pct}%`;
  if (pctText) pctText.textContent = `${pct}%`;
}

export function initRouter() {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    if (hash !== currentPage) navigate(hash);
  });

  const initial = window.location.hash.replace('#', '') || 'dashboard';
  navigate(initial);
}
