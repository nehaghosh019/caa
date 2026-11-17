/**
 * CampusMart — Wishlist View
 */

async function renderWishlistView() {
  if (!state.currentUser) {
    showToast('Please log in to view your wishlist.', 'info');
    window.location.hash = '#/login';
    return;
  }

  const appView = document.getElementById('app-view');
  appView.innerHTML = `
    <div class="container" style="padding: 40px 0 80px;">
      <div style="margin-bottom: 28px;">
        <span class="badge badge-rose" style="margin-bottom:6px;">Saved Items</span>
        <h1 style="font-size: 2.2rem;">Your Saved Wishlist</h1>
        <p style="color:var(--text-muted);">Keep track of textbooks, calculators, and essentials you plan to buy.</p>
      </div>

      <div id="wishlist-products-grid" class="products-grid">
        <div class="view-loading"><div class="spinner"></div><p>Loading your saved items...</p></div>
      </div>
    </div>
  `;

  try {
    const items = await api.getWishlist();
    const container = document.getElementById('wishlist-products-grid');
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <h3 class="empty-title">Your wishlist is empty</h3>
          <p class="empty-subtitle">Found a book or calculator you like? Click the heart icon on any product to save it here!</p>
          <a href="#/browse" class="btn btn-primary">Browse Campus Marketplace</a>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(p => renderProductCardHtml(p)).join('');
  } catch (err) {
    const container = document.getElementById('wishlist-products-grid');
    if (container) {
      container.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1; color:var(--rose);">Failed to load wishlist: ${err.message}</div>`;
    }
  }
}
