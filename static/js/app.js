/**
 * CampusMart — Main Application Coordinator
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize State (Auth check, categories, user profile)
  await state.init();

  // 2. Initialize Router (starts rendering views)
  router.init();

  // 3. Setup Global Search in Top Nav
  setupGlobalNavSearch();

  // 4. Setup Mobile Navigation Drawer
  setupMobileDrawer();

  // 5. Setup Global Modal backdrop & keyboard dismiss
  setupGlobalModalEvents();
});

function setupGlobalNavSearch() {
  const input = document.getElementById('global-search-input');
  const btn = document.getElementById('global-search-btn');

  const executeSearch = () => {
    if (!input) return;
    const q = input.value.trim();
    window.location.hash = `#/browse?q=${encodeURIComponent(q)}`;
    input.value = '';
  };

  if (btn) btn.addEventListener('click', executeSearch);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeSearch();
    });
  }

  // Mobile search
  const mobInput = document.getElementById('mobile-search-input');
  const mobBtn = document.getElementById('mobile-search-btn');
  const execMobSearch = () => {
    if (!mobInput) return;
    const q = mobInput.value.trim();
    window.location.hash = `#/browse?q=${encodeURIComponent(q)}`;
    mobInput.value = '';
    closeMobileDrawer();
  };
  if (mobBtn) mobBtn.addEventListener('click', execMobSearch);
  if (mobInput) {
    mobInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') execMobSearch();
    });
  }
}

function setupMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.style.display = drawer.style.display === 'flex' ? 'none' : 'flex';
    });
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) drawer.style.display = 'none';
}

function setupGlobalModalEvents() {
  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal-backdrop');
      modals.forEach(m => m.style.display = 'none');
    }
  });

  // Close when clicking modal backdrop outside dialog
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(b => {
    b.addEventListener('click', (e) => {
      if (e.target === b) {
        b.style.display = 'none';
      }
    });
  });
}
