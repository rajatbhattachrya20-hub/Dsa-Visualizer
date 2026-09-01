// ===== MAIN APPLICATION ENTRY POINT =====
import { initRouter, navigate, updateSidebarProgress } from './router.js';
import { ALGORITHMS } from './data/algorithms.js';
import { lsGet, lsSet } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management
  const savedTheme = lsGet('dsa_theme', 'dark');
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      lsSet('dsa_theme', next);
      updateThemeIcons(next);
    });
  }

  // 2. Mobile Sidebar Toggle
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  if (hamburger && sidebar && sidebarOverlay) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.add('open');
      sidebarOverlay.classList.add('visible');
    });
  }
  if (sidebarClose && sidebar && sidebarOverlay) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('visible');
    });
  }
  if (sidebarOverlay && sidebar) {
    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('visible');
    });
  }

  // 3. Navigation link clicks
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page) navigate(page);
    });
  });

  // 4. Algorithm Search Bar
  const searchInput = document.getElementById('sidebar-search-input');
  const searchResults = document.getElementById('search-results');

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        searchResults.classList.remove('visible');
        searchResults.innerHTML = '';
        return;
      }

      const matches = ALGORITHMS.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query) ||
        a.id.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        searchResults.innerHTML = `
          <div style="padding:10px 14px;font-size:0.8rem;color:var(--text-muted)">
            No algorithms found for "${query}"
          </div>
        `;
      } else {
        searchResults.innerHTML = matches.map(m => `
          <div class="search-result-item" data-page="${m.page}">
            <span>${m.name}</span>
            <span class="result-category">${m.category}</span>
          </div>
        `).join('');
      }

      searchResults.classList.add('visible');
    });

    searchResults.addEventListener('click', (e) => {
      const item = e.target.closest('.search-result-item');
      if (item && item.dataset.page) {
        navigate(item.dataset.page);
        searchInput.value = '';
        searchResults.classList.remove('visible');
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.sidebar-search')) {
        searchResults.classList.remove('visible');
      }
    });
  }

  // 5. Initialize Router & Sidebar Progress
  initRouter();
  updateSidebarProgress();
});

function updateThemeIcons(theme) {
  const moon = document.querySelector('.icon-moon');
  const sun = document.querySelector('.icon-sun');
  if (moon && sun) {
    if (theme === 'light') {
      moon.style.display = 'none';
      sun.style.display = 'block';
    } else {
      moon.style.display = 'block';
      sun.style.display = 'none';
    }
  }
}
