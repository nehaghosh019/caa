/**
 * CampusMart — My Listings View
 */

let myListingsFilter = 'all';

async function renderMyListingsView() {
  if (!state.currentUser) {
    showToast('Please log in to manage your listings.', 'info');
    window.location.hash = '#/login';
    return;
  }

  const appView = document.getElementById('app-view');
  appView.innerHTML = `
    <div class="container" style="padding: 40px 0 80px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:28px; flex-wrap:wrap; gap:16px;">
        <div>
          <span class="badge badge-primary" style="margin-bottom:6px;">Seller Dashboard</span>
          <h1 style="font-size: 2.2rem;">My Campus Listings</h1>
          <p style="color:var(--text-muted);">Manage your products, mark items as sold, or update prices.</p>
        </div>
        <a href="#/sell" class="btn btn-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Post New Item
        </a>
      </div>

      <!-- Filter Tabs: All, Active, Sold -->
      <div class="admin-tabs" style="margin-bottom: 24px;">
        <button class="admin-tab-btn ${myListingsFilter === 'all' ? 'active' : ''}" onclick="filterMyListings('all')">
          All Listings
        </button>
        <button class="admin-tab-btn ${myListingsFilter === 'active' ? 'active' : ''}" onclick="filterMyListings('active')">
          Active Listings
        </button>
        <button class="admin-tab-btn ${myListingsFilter === 'sold' ? 'active' : ''}" onclick="filterMyListings('sold')">
          Sold Items
        </button>
      </div>

      <!-- Listings Grid -->
      <div id="my-listings-container" class="products-grid">
        <div class="view-loading"><div class="spinner"></div><p>Loading your listings...</p></div>
      </div>
    </div>
  `;

  await fetchMyListings();
}

function filterMyListings(filter) {
  myListingsFilter = filter;
  renderMyListingsView();
}

async function fetchMyListings() {
  const container = document.getElementById('my-listings-container');
  if (!container) return;

  try {
    const products = await api.getProducts({
      seller_id: state.currentUser.id,
      status: myListingsFilter === 'all' ? 'all' : myListingsFilter
    });

    if (products.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <h3 class="empty-title">No ${myListingsFilter === 'all' ? '' : myListingsFilter} listings found</h3>
          <p class="empty-subtitle">Got books, lab gear, or dorm items you don't use? Turn them into campus cash!</p>
          <a href="#/sell" class="btn btn-primary">Sell an Item Now</a>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(p => {
      const isSold = p.status === 'sold';
      const formattedPrice = Number(p.price).toLocaleString('en-IN');

      return `
        <div class="product-card" id="my-card-${p.id}">
          <div class="product-image-wrap" onclick="window.location.hash='#/product/${p.id}'">
            <img src="${p.image_url}" alt="${escapeHtml(p.title)}" onerror="this.src='/static/images/categories/other.svg'">
            <div class="card-badges">
              <span class="badge ${p.condition === 'Brand New' ? 'badge-emerald' : 'badge-primary'}">${p.condition}</span>
              <span class="badge" style="background:var(--bg-surface); color:var(--text-secondary);">${p.category}</span>
            </div>
            ${isSold ? `
              <div class="card-sold-overlay">
                <span class="badge-sold">SOLD</span>
              </div>
            ` : ''}
          </div>

          <div class="product-content">
            <h3 class="product-title" onclick="window.location.hash='#/product/${p.id}'">${escapeHtml(p.title)}</h3>
            <div class="product-price">₹${formattedPrice}</div>
            
            <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">
              Pickup: <strong style="color:var(--text-secondary);">${escapeHtml(p.location)}</strong>
            </div>

            <!-- Action buttons for Seller -->
            <div style="display:flex; flex-direction:column; gap:8px; margin-top:auto; padding-top:12px; border-top:1px solid var(--border-subtle);">
              <div style="display:flex; gap:8px;">
                <button class="btn ${isSold ? 'btn-success' : 'btn-secondary'} btn-sm" style="flex:1;" 
                        onclick="toggleSoldStatusInList(${p.id}, '${isSold ? 'active' : 'sold'}')">
                  ${isSold ? '✓ Reactivate' : 'Mark as Sold'}
                </button>
                <button class="btn btn-outline btn-sm" onclick='openEditModal(${JSON.stringify(p).replace(/'/g, "&apos;")})'>
                  Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteListingInList(${p.id})">
                  Delete
                </button>
              </div>
              <a href="#/product/${p.id}" class="btn btn-secondary btn-sm" style="width:100%; text-align:center;">
                View Public Listing &rarr;
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1; color:var(--rose);">Error loading listings: ${err.message}</div>`;
  }
}

async function toggleSoldStatusInList(productId, newStatus) {
  try {
    await api.updateProductStatus(productId, newStatus);
    showToast(`Item marked as ${newStatus}!`, 'success');
    fetchMyListings();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteListingInList(productId) {
  if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
  try {
    await api.deleteProduct(productId);
    showToast('Listing deleted successfully.', 'info');
    fetchMyListings();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Global Edit Modal Logic
function openEditModal(product) {
  document.getElementById('edit-product-id').value = product.id;
  document.getElementById('edit-title').value = product.title;
  document.getElementById('edit-price').value = product.price;
  document.getElementById('edit-condition').value = product.condition;
  document.getElementById('edit-location').value = product.location;
  document.getElementById('edit-description').value = product.description;

  const catSelect = document.getElementById('edit-category');
  catSelect.innerHTML = state.categories.map(c => `
    <option value="${c.name}" ${c.name === product.category ? 'selected' : ''}>${c.name}</option>
  `).join('');

  document.getElementById('edit-listing-modal').style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('edit-listing-modal').style.display = 'none';
}

async function submitEditListing() {
  const id = document.getElementById('edit-product-id').value;
  const title = document.getElementById('edit-title').value.trim();
  const price = document.getElementById('edit-price').value;
  const category = document.getElementById('edit-category').value;
  const condition = document.getElementById('edit-condition').value;
  const location = document.getElementById('edit-location').value.trim();
  const description = document.getElementById('edit-description').value.trim();

  if (!title || !price || !category || !condition || !location || !description) {
    showToast('Please fill all required fields.', 'error');
    return;
  }

  try {
    await api.updateProduct(id, {
      title,
      price: parseFloat(price),
      category,
      condition,
      location,
      description
    });

    showToast('Listing updated successfully!', 'success');
    closeEditModal();

    // Re-render current view if on my-listings or product details
    if (window.location.hash.startsWith('#/my-listings')) {
      fetchMyListings();
    } else if (window.location.hash.startsWith('#/product/')) {
      renderProductDetailsView(id);
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}
