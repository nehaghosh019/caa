/**
 * CampusMart — Browse Marketplace View
 */

let currentBrowseParams = {
  q: '',
  category: '',
  condition: '',
  min_price: '',
  max_price: '',
  sort_by: 'newest',
  status: 'all'
};

async function renderBrowseView(queryParams = {}) {
  // Sync state with queryParams
  currentBrowseParams = {
    q: queryParams.q || '',
    category: queryParams.category || '',
    condition: queryParams.condition || '',
    min_price: queryParams.min_price || '',
    max_price: queryParams.max_price || '',
    sort_by: queryParams.sort_by || 'newest',
    status: queryParams.status || 'all'
  };

  const appView = document.getElementById('app-view');
  appView.innerHTML = `
    <div class="container">
      <div class="marketplace-layout">
        <!-- Filter Sidebar -->
        <aside class="filter-sidebar">
          <div class="filter-header">
            <h3 class="filter-title">Filters</h3>
            <button class="btn-clear-filters" onclick="resetAllFilters()">Reset All</button>
          </div>

          <!-- Search in Marketplace -->
          <div class="filter-group">
            <label class="filter-label">Search Keywords</label>
            <div style="position:relative;">
              <input type="text" id="filter-search-input" class="form-input" 
                     placeholder="Title, author, brand..." 
                     value="${escapeHtml(currentBrowseParams.q)}" 
                     oninput="debounceSearch(this.value)" />
            </div>
          </div>

          <!-- Category Filter -->
          <div class="filter-group">
            <label class="filter-label">Category</label>
            <div class="category-filter-list" id="sidebar-category-list">
              <div class="category-filter-item ${!currentBrowseParams.category ? 'active' : ''}" onclick="applyCategoryFilter('')">
                <span>All Categories</span>
              </div>
              ${state.categories.map(cat => `
                <div class="category-filter-item ${currentBrowseParams.category === cat.name ? 'active' : ''}" onclick="applyCategoryFilter('${escapeHtml(cat.name)}')">
                  <span>${cat.name}</span>
                  <span style="font-size:0.75rem; color:var(--text-muted);">${cat.count}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="filter-group">
            <label class="filter-label">Price Range (₹)</label>
            <div class="price-inputs">
              <input type="number" id="filter-min-price" class="price-input-field" placeholder="Min" 
                     value="${currentBrowseParams.min_price}" onchange="applyPriceFilter()" />
              <span style="color:var(--text-muted);">-</span>
              <input type="number" id="filter-max-price" class="price-input-field" placeholder="Max" 
                     value="${currentBrowseParams.max_price}" onchange="applyPriceFilter()" />
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:8px;">
              <button class="quick-chip" onclick="setPricePreset('', '300')">&lt; ₹300</button>
              <button class="quick-chip" onclick="setPricePreset('300', '600')">₹300 - ₹600</button>
              <button class="quick-chip" onclick="setPricePreset('600', '')">₹600+</button>
            </div>
          </div>

          <!-- Condition Filter -->
          <div class="filter-group">
            <label class="filter-label">Condition</label>
            <div class="condition-checkboxes">
              ${['Brand New', 'Like New', 'Good', 'Fair'].map(cond => `
                <label class="checkbox-item">
                  <input type="radio" name="condition-radio" value="${cond}" 
                         ${currentBrowseParams.condition === cond ? 'checked' : ''} 
                         onchange="applyConditionFilter('${cond}')" />
                  <span>${cond}</span>
                </label>
              `).join('')}
              <label class="checkbox-item">
                <input type="radio" name="condition-radio" value="" 
                       ${!currentBrowseParams.condition ? 'checked' : ''} 
                       onchange="applyConditionFilter('')" />
                <span>Any Condition</span>
              </label>
            </div>
          </div>

          <!-- Status Filter -->
          <div class="filter-group">
            <label class="filter-label">Availability</label>
            <select id="filter-status-select" class="form-input" onchange="applyStatusFilter(this.value)">
              <option value="all" ${currentBrowseParams.status === 'all' ? 'selected' : ''}>All Listings (Active &amp; Sold)</option>
              <option value="active" ${currentBrowseParams.status === 'active' ? 'selected' : ''}>Active / Available Only</option>
              <option value="sold" ${currentBrowseParams.status === 'sold' ? 'selected' : ''}>Sold Items Only</option>
            </select>
          </div>
        </aside>

        <!-- Products Column -->
        <main class="marketplace-content">
          <div class="marketplace-header">
            <div class="results-count" id="browse-results-count">
              Loading listings...
            </div>

            <div class="sort-and-status-controls">
              <label for="sort-select" style="font-size:0.86rem; color:var(--text-muted); font-weight:600;">Sort By:</label>
              <select id="sort-select" class="sort-select" onchange="applySort(this.value)">
                <option value="newest" ${currentBrowseParams.sort_by === 'newest' ? 'selected' : ''}>Newest First</option>
                <option value="price_asc" ${currentBrowseParams.sort_by === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price_desc" ${currentBrowseParams.sort_by === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
                <option value="oldest" ${currentBrowseParams.sort_by === 'oldest' ? 'selected' : ''}>Oldest First</option>
              </select>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="products-grid" id="browse-products-grid">
            <div class="view-loading"><div class="spinner"></div><p>Searching campus items...</p></div>
          </div>
        </main>
      </div>
    </div>
  `;

  // Fetch and display filtered products
  await fetchBrowseProducts();
}

let searchDebounceTimer = null;
function debounceSearch(val) {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    currentBrowseParams.q = val.trim();
    fetchBrowseProducts();
  }, 350);
}

function applyCategoryFilter(cat) {
  currentBrowseParams.category = cat;
  // Update sidebar active classes
  const items = document.querySelectorAll('.category-filter-item');
  items.forEach(el => el.classList.remove('active'));
  event.currentTarget.classList.add('active');
  fetchBrowseProducts();
}

function applyPriceFilter() {
  currentBrowseParams.min_price = document.getElementById('filter-min-price').value;
  currentBrowseParams.max_price = document.getElementById('filter-max-price').value;
  fetchBrowseProducts();
}

function setPricePreset(min, max) {
  document.getElementById('filter-min-price').value = min;
  document.getElementById('filter-max-price').value = max;
  currentBrowseParams.min_price = min;
  currentBrowseParams.max_price = max;
  fetchBrowseProducts();
}

function applyConditionFilter(cond) {
  currentBrowseParams.condition = cond;
  fetchBrowseProducts();
}

function applyStatusFilter(status) {
  currentBrowseParams.status = status;
  fetchBrowseProducts();
}

function applySort(val) {
  currentBrowseParams.sort_by = val;
  fetchBrowseProducts();
}

function resetAllFilters() {
  currentBrowseParams = {
    q: '',
    category: '',
    condition: '',
    min_price: '',
    max_price: '',
    sort_by: 'newest',
    status: 'all'
  };
  renderBrowseView();
}

async function fetchBrowseProducts() {
  const container = document.getElementById('browse-products-grid');
  const countEl = document.getElementById('browse-results-count');
  if (!container) return;

  container.innerHTML = `<div class="view-loading" style="grid-column: 1 / -1;"><div class="spinner"></div><p>Finding listings...</p></div>`;

  try {
    const products = await api.getProducts(currentBrowseParams);
    
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${products.length}</strong> campus ${products.length === 1 ? 'item' : 'items'}${currentBrowseParams.q ? ` for "<em>${escapeHtml(currentBrowseParams.q)}</em>"` : ''}`;
    }

    if (products.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <h3 class="empty-title">No listings match your search</h3>
          <p class="empty-subtitle">Try adjusting your filters or search keywords. You can also list this item yourself!</p>
          <div style="display:flex; justify-content:center; gap:12px;">
            <button class="btn btn-secondary" onclick="resetAllFilters()">Clear Filters</button>
            <a href="#/sell" class="btn btn-primary">Sell an Item</a>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(product => renderProductCardHtml(product)).join('');
  } catch (err) {
    container.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1; color: var(--rose);">Failed to load listings: ${err.message}</div>`;
  }
}

/**
 * Reusable Product Card HTML Template adhering to exact Requirement 8:
 * [Product Image]
 * Title
 * ₹Price
 * Condition: Good
 * Category
 * Seller: Name
 * [♡] View Details
 */
function renderProductCardHtml(p) {
  const isWishlisted = state.wishlistIds.has(p.id) || p.is_wishlisted;
  const isSold = p.status === 'sold';
  const formattedPrice = Number(p.price).toLocaleString('en-IN');
  const sellerInitial = (p.seller_name || 'Student')[0].toUpperCase();

  return `
    <div class="product-card" id="product-card-${p.id}">
      <div class="product-image-wrap" onclick="window.location.hash='#/product/${p.id}'">
        <img src="${p.image_url}" alt="${escapeHtml(p.title)}" loading="lazy" 
             onerror="this.src='/static/images/categories/other.svg'">
        
        <div class="card-badges">
          <span class="badge ${p.condition === 'Brand New' ? 'badge-emerald' : 'badge-primary'}">${p.condition}</span>
        </div>

        <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                onclick="event.stopPropagation(); toggleWishlistClick(${p.id}, this)" 
                title="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="${isWishlisted ? '#f43f5e' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        ${isSold ? `
          <div class="card-sold-overlay">
            <span class="badge-sold">SOLD</span>
          </div>
        ` : ''}
      </div>

      <div class="product-content">
        <h3 class="product-title" onclick="window.location.hash='#/product/${p.id}'" title="${escapeHtml(p.title)}">
          ${escapeHtml(p.title)}
        </h3>

        <div class="product-price">₹${formattedPrice}</div>

        <div class="product-meta-row">
          <span class="condition-tag">Condition: <strong>${p.condition}</strong></span>
          <span class="category-tag">${p.category}</span>
        </div>

        <div class="product-seller-row">
          <div class="seller-avatar-mini">${sellerInitial}</div>
          <div class="seller-info-text">
            <span class="seller-name">Seller: ${escapeHtml(p.seller_name || 'Student')}</span>
            <span class="seller-dept">(${escapeHtml(p.seller_department || 'Campus')})</span>
          </div>
        </div>

        <div class="product-location-row">
          <span class="product-location">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg>
            ${escapeHtml(p.location || 'Campus')}
          </span>
          <span>${formatRelativeDate(p.created_at)}</span>
        </div>

        <div class="product-card-footer">
          <a href="#/product/${p.id}" class="btn btn-secondary btn-card-details">
            View Details
          </a>
        </div>
      </div>
    </div>
  `;
}

// Global toggle wishlist function
async function toggleWishlistClick(productId, btnElement) {
  if (!state.currentUser) {
    showToast('Please log in to save items to your wishlist.', 'info');
    window.location.hash = '#/login';
    return;
  }

  try {
    const res = await api.toggleWishlist(productId);
    if (res.saved) {
      state.wishlistIds.add(productId);
      btnElement.classList.add('active');
      btnElement.querySelector('svg').setAttribute('fill', '#f43f5e');
      showToast('Saved to wishlist!', 'success');
    } else {
      state.wishlistIds.delete(productId);
      btnElement.classList.remove('active');
      btnElement.querySelector('svg').setAttribute('fill', 'none');
      showToast('Removed from wishlist.', 'info');
    }
    state.updateWishlistBadge(state.wishlistIds.size);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Helper formatting utilities
function formatRelativeDate(dateStr) {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffInDays <= 0) return 'Today';
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
