/**
 * CampusMart Global State Management
 */

const state = {
  currentUser: null,
  categories: [],
  wishlistIds: new Set(),
  unreadMessagesCount: 0,
  activeFilters: {
    q: '',
    category: '',
    condition: '',
    min_price: '',
    max_price: '',
    sort_by: 'newest'
  },

  async init() {
    try {
      // 1. Fetch categories
      this.categories = await api.getCategories();
    } catch (e) {
      console.warn('Could not load categories on init', e);
    }

    // 2. Auth restoration: Students restored from localStorage; Admin NEVER automatically authenticated on website load
    const storedStudentToken = localStorage.getItem('campusmart_token');
    const storedAdminToken = sessionStorage.getItem('campusmart_admin_token');

    if (window.location.hash.startsWith('#/admin') && !window.location.hash.startsWith('#/admin/login') && storedAdminToken) {
      // Only keep admin session if actively inside Admin Dashboard with valid sessionStorage token
      api.token = storedAdminToken;
      try {
        const user = await api.getMe();
        if (user && user.role === 'admin') {
          this.setCurrentUser(user);
        } else {
          api.clearTokens();
          this.currentUser = null;
        }
      } catch (err) {
        api.clearTokens();
        this.currentUser = null;
      }
    } else if (storedStudentToken) {
      // Check normal student session
      api.token = storedStudentToken;
      try {
        const user = await api.getMe();
        if (user && user.role !== 'admin') {
          this.setCurrentUser(user);
          await this.loadWishlist();
        } else {
          // If stored token was an admin token, purge it immediately! Never auto-login admin on site load!
          api.clearTokens();
          this.currentUser = null;
        }
      } catch (err) {
        api.clearTokens();
        this.currentUser = null;
      }
    } else {
      api.token = null;
      this.currentUser = null;
    }

    this.renderNavUserMenu();
  },

  setCurrentUser(user) {
    this.currentUser = user;
    this.renderNavUserMenu();
    if (user && user.stats) {
      this.unreadMessagesCount = user.stats.unread_messages || 0;
      this.updateMessagesBadge(this.unreadMessagesCount);
    }
  },

  async loadWishlist() {
    if (!this.currentUser) return;
    try {
      const items = await api.getWishlist();
      this.wishlistIds = new Set(items.map(i => i.id));
      this.updateWishlistBadge(this.wishlistIds.size);
    } catch (e) {
      console.warn('Error loading wishlist', e);
    }
  },

  updateWishlistBadge(count) {
    const badge = document.getElementById('wishlist-badge');
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  },

  updateMessagesBadge(count) {
    const badge = document.getElementById('messages-badge');
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  },

  renderNavUserMenu() {
    const container = document.getElementById('user-menu-container');
    const mobileLinks = document.getElementById('mobile-links');
    if (!container) return;

    if (this.currentUser) {
      const avatarUrl = this.currentUser.avatar_url || '/static/images/avatars/student.svg';
      const isAdmin = this.currentUser.role === 'admin';

      container.innerHTML = `
        <div class="user-avatar-btn" id="user-menu-trigger" onclick="toggleUserDropdown(event)">
          <img src="${avatarUrl}" class="user-avatar-img" alt="${this.currentUser.name}">
          <span class="user-name-short">${this.currentUser.name.split(' ')[0]}</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <div class="user-dropdown" id="nav-user-dropdown">
          <div class="dropdown-header">
            <div class="dropdown-user-name">${this.currentUser.name}</div>
            <div class="dropdown-user-role">${isAdmin ? 'Campus Moderator' : `${this.currentUser.department} • ${this.currentUser.year}`}</div>
          </div>
          ${isAdmin ? `
            <a href="#/admin" class="dropdown-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              Admin Dashboard
            </a>
          ` : ''}
          <a href="#/my-listings" class="dropdown-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            My Listings
          </a>
          <a href="#/wishlist" class="dropdown-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Wishlist
          </a>
          <a href="#/messages" class="dropdown-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Messages
          </a>
          <a href="#/profile" class="dropdown-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            My Profile
          </a>
          <div class="dropdown-divider"></div>
          <a href="javascript:void(0)" onclick="handleLogout()" class="dropdown-item" style="color: var(--rose);">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Log Out
          </a>
        </div>
      `;

      if (mobileLinks) {
        mobileLinks.innerHTML = `
          <a href="#/browse">Browse Marketplace</a>
          <a href="#/sell">Sell an Item</a>
          <a href="#/my-listings">My Listings</a>
          <a href="#/wishlist">Wishlist</a>
          <a href="#/messages">Messages</a>
          <a href="#/profile">Profile</a>
          ${isAdmin ? '<a href="#/admin">Admin Dashboard</a>' : ''}
          <a href="javascript:void(0)" onclick="handleLogout()" style="color: var(--rose);">Log Out</a>
        `;
      }
    } else {
      container.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <a href="#/login" class="btn btn-secondary btn-sm">Log In</a>
          <a href="#/register" class="btn btn-primary btn-sm">Register</a>
        </div>
      `;

      if (mobileLinks) {
        mobileLinks.innerHTML = `
          <a href="#/browse">Browse Marketplace</a>
          <a href="#/login">Log In</a>
          <a href="#/register">Register</a>
        `;
      }
    }
  }
};

// Toggle user menu dropdown
function toggleUserDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('nav-user-dropdown');
  if (dropdown) dropdown.classList.toggle('show');
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('nav-user-dropdown');
  if (dropdown && dropdown.classList.contains('show')) {
    if (!e.target.closest('#user-menu-trigger')) {
      dropdown.classList.remove('show');
    }
  }
});

// Toast notification helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '✕';

  toast.innerHTML = `
    <span style="font-weight:bold; font-size:1.1rem;">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Quick demo login for students
async function quickLogin(email, password) {
  try {
    showToast(`Logging in as ${email}...`, 'info');
    const res = await api.login(email, password);
    state.setCurrentUser(res.user);
    await state.loadWishlist();
    showToast(`Welcome back, ${res.user.name}!`, 'success');
    window.location.hash = res.user.role === 'admin' ? '#/admin' : '#/browse';
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Logout handler
async function handleLogout() {
  const wasAdmin = state.currentUser && state.currentUser.role === 'admin';
  try {
    await api.logout();
  } catch (e) {}
  api.clearTokens();
  state.setCurrentUser(null);
  state.wishlistIds.clear();
  state.updateWishlistBadge(0);
  state.updateMessagesBadge(0);
  showToast('You have been logged out.', 'info');
  window.location.hash = wasAdmin ? '#/admin/login' : '#/';
}
