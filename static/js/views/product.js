/**
 * CampusMart — Product Details View
 */

let activeProductData = null;

async function renderProductDetailsView(productId) {
  const appView = document.getElementById('app-view');
  appView.innerHTML = `
    <div class="container product-detail-view">
      <div class="view-loading"><div class="spinner"></div><p>Loading item details...</p></div>
    </div>
  `;

  try {
    const product = await api.getProduct(productId);
    activeProductData = product;

    const isOwner = state.currentUser && (state.currentUser.id === product.seller_id);
    const isAdmin = state.currentUser && (state.currentUser.role === 'admin');
    const isSold = product.status === 'sold';
    const isWishlisted = state.wishlistIds.has(product.id) || product.is_wishlisted;
    const formattedPrice = Number(product.price).toLocaleString('en-IN');
    const sellerInitial = (product.seller_name || 'S')[0].toUpperCase();

    appView.innerHTML = `
      <div class="container product-detail-view">
        <!-- Breadcrumbs -->
        <div style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:var(--text-muted); margin-bottom:24px;">
          <a href="#/" style="color:var(--text-muted);">Home</a>
          <span>/</span>
          <a href="#/browse" style="color:var(--text-muted);">Marketplace</a>
          <span>/</span>
          <a href="#/browse?category=${encodeURIComponent(product.category)}" style="color:var(--text-muted);">${product.category}</a>
          <span>/</span>
          <span style="color:var(--text-primary); font-weight:600;">${escapeHtml(product.title)}</span>
        </div>

        <div class="detail-grid">
          <!-- Left: Large Image Gallery -->
          <div class="detail-gallery">
            <img src="${product.image_url}" alt="${escapeHtml(product.title)}" class="detail-main-img" 
                 onerror="this.src='/static/images/categories/other.svg'" />
            
            ${isSold ? `
              <div class="card-sold-overlay">
                <span class="badge-sold" style="font-size:1.4rem; padding:8px 24px;">SOLD ITEM</span>
              </div>
            ` : ''}
          </div>

          <!-- Right: Details, Pricing, Actions -->
          <div class="detail-info">
            <div class="detail-badges-row">
              <span class="badge ${product.condition === 'Brand New' ? 'badge-emerald' : 'badge-primary'}">${product.condition}</span>
              <span class="badge badge-secondary" style="background:var(--bg-surface); color:var(--text-secondary); border:1px solid var(--border-card);">${product.category}</span>
              ${isSold ? '<span class="badge badge-sold">SOLD</span>' : '<span class="badge badge-emerald">ACTIVE LISTING</span>'}
            </div>

            <h1 class="detail-title">${escapeHtml(product.title)}</h1>

            <div class="detail-price-box">
              <div>
                <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Student Asking Price</div>
                <div class="detail-price-val">₹${formattedPrice}</div>
              </div>
              <div style="text-align:right; font-size:0.85rem; color:var(--text-muted);">
                Posted: <strong>${formatRelativeDate(product.created_at)}</strong>
              </div>
            </div>

            <!-- Primary Actions -->
            <div class="detail-actions-row">
              ${!isOwner ? `
                <button class="btn btn-primary btn-contact-seller" onclick="openContactSellerModal()">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  ${isSold ? 'Message Seller (Item Sold)' : 'Contact Seller'}
                </button>

                <button class="btn btn-secondary" onclick="toggleDetailWishlist(${product.id}, this)">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="${isWishlisted ? '#f43f5e' : 'none'}" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>${isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button class="btn btn-outline btn-sm" onclick="openReportModal(${product.id})" title="Report suspicious listing">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
                  </svg>
                  Report
                </button>
              ` : `
                <!-- Owner Management Controls -->
                <button class="btn ${isSold ? 'btn-success' : 'btn-secondary'}" onclick="toggleOwnerSoldStatus(${product.id}, '${isSold ? 'active' : 'sold'}')">
                  ${isSold ? '✓ Reactivate Listing' : 'Mark as Sold'}
                </button>
                <button class="btn btn-primary" onclick="openEditModalFromDetail()">
                  Edit Listing
                </button>
                <button class="btn btn-danger" onclick="deleteOwnerListing(${product.id})">
                  Delete
                </button>
              `}
            </div>

            <!-- Description Block -->
            <div class="detail-section-block">
              <h3 class="detail-section-title">Item Description</h3>
              <p class="detail-description">${escapeHtml(product.description).replace(/\n/g, '<br>')}</p>
              ${product.brand ? `
                <div style="margin-top:14px; font-size:0.88rem; color:var(--text-muted);">
                  Brand / Publisher: <strong style="color:var(--text-primary);">${escapeHtml(product.brand)}</strong>
                </div>
              ` : ''}
            </div>

            <!-- Campus Pickup Point -->
            <div class="detail-section-block" style="border-left: 4px solid var(--sky);">
              <div style="display:flex; align-items:center; gap:10px;">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--sky)" stroke-width="2">
                  <circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/>
                </svg>
                <div>
                  <h3 class="detail-section-title" style="margin-bottom:2px;">Campus Handover Spot</h3>
                  <div style="font-weight:700; color:var(--text-primary); font-size:1.05rem;">${escapeHtml(product.location)}</div>
                  <div style="font-size:0.82rem; color:var(--text-muted); margin-top:2px;">Preferred contact channel: <strong>${escapeHtml(product.contact_pref || 'Chat')}</strong></div>
                </div>
              </div>
            </div>

            <!-- Seller Information Card -->
            <div class="detail-section-block">
              <h3 class="detail-section-title">Student Seller Profile</h3>
              <div class="seller-profile-card">
                <div class="seller-avatar-mini" style="width:50px; height:50px; font-size:1.2rem;">${sellerInitial}</div>
                <div style="flex:1;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div class="seller-name-large">${escapeHtml(product.seller_name)}</div>
                    <span class="seller-badge-pill">Verified Student</span>
                  </div>
                  <div style="font-size:0.85rem; color:var(--text-muted);">
                    ${escapeHtml(product.seller_department)} • ${escapeHtml(product.seller_year)}
                  </div>
                  <div class="seller-stats-pills">
                    <span>Active Listings: <strong>${product.seller_stats?.total_listings || 1}</strong></span>
                    <span>•</span>
                    <span>Sold: <strong>${product.seller_stats?.sold_listings || 0}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Campus Safety Reminder -->
            <div class="safety-tip-banner">
              <svg class="safety-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div class="safety-text">
                <strong>Campus Safe Exchange Tip:</strong> Always meet in public, well-lit campus spaces like the Central Library steps, student union lounge, or departmental cafeteria during daytime.
              </div>
            </div>
          </div>
        </div>

        <!-- Similar Listings in same category -->
        ${product.similar_products && product.similar_products.length > 0 ? `
          <div style="margin-top:60px;">
            <div class="section-header">
              <div class="section-title-wrap">
                <span class="section-tag">Related</span>
                <h2 class="section-title">More in ${product.category}</h2>
              </div>
            </div>
            <div class="products-grid">
              ${product.similar_products.map(sim => renderProductCardHtml(sim)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  } catch (err) {
    appView.innerHTML = `
      <div class="container" style="padding:80px 24px; text-align:center;">
        <h2 style="color:var(--rose); margin-bottom:12px;">Product Listing Not Found</h2>
        <p style="margin-bottom:24px;">The item you are looking for may have been removed or does not exist.</p>
        <a href="#/browse" class="btn btn-primary">Back to Marketplace</a>
      </div>
    `;
  }
}

// Open Contact Seller Modal
function openContactSellerModal() {
  if (!state.currentUser) {
    showToast('Please log in to contact this seller.', 'info');
    window.location.hash = '#/login';
    return;
  }

  if (activeProductData.seller_id === state.currentUser.id) {
    showToast('You are the seller of this item.', 'info');
    return;
  }

  const modal = document.getElementById('contact-modal');
  const info = document.getElementById('contact-item-info');
  const sellerCard = document.getElementById('contact-seller-card');
  const msgInput = document.getElementById('contact-message-input');

  info.textContent = `Item: ${activeProductData.title} (₹${activeProductData.price})`;
  sellerCard.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px; background:var(--bg-surface); padding:10px 14px; border-radius:var(--radius-md);">
      <div class="seller-avatar-mini">${(activeProductData.seller_name || 'S')[0].toUpperCase()}</div>
      <div>
        <div style="font-weight:700; font-size:0.92rem;">${activeProductData.seller_name}</div>
        <div style="font-size:0.78rem; color:var(--text-muted);">${activeProductData.seller_department} • ${activeProductData.seller_year}</div>
      </div>
      <div style="margin-left:auto; font-size:0.8rem; color:var(--sky);">
        Pickup: ${activeProductData.location}
      </div>
    </div>
  `;

  msgInput.value = `Hi ${activeProductData.seller_name.split(' ')[0]}! I'm interested in "${activeProductData.title}". Is it still available to meet at ${activeProductData.location}?`;
  modal.style.display = 'flex';
}

function closeContactModal() {
  document.getElementById('contact-modal').style.display = 'none';
}

function setContactPrompt(text) {
  const input = document.getElementById('contact-message-input');
  if (input) input.value = text;
}

async function submitContactMessage() {
  const input = document.getElementById('contact-message-input');
  const content = input.value.trim();

  if (!content) {
    showToast('Please type a message before sending.', 'error');
    return;
  }

  const sendBtn = document.getElementById('btn-send-contact-msg');
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  try {
    await api.sendMessage(activeProductData.seller_id, activeProductData.id, content);
    showToast('Message sent to seller! Opening your messages...', 'success');
    closeContactModal();
    // Redirect to messages
    window.location.hash = '#/messages';
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    sendBtn.disabled = false;
    sendBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
      Send Message
    `;
  }
}

// Report Modal Handling
let reportTargetProductId = null;
function openReportModal(productId) {
  if (!state.currentUser) {
    showToast('Please log in to report a listing.', 'info');
    window.location.hash = '#/login';
    return;
  }
  reportTargetProductId = productId;
  document.getElementById('report-reason-select').value = '';
  document.getElementById('report-details-input').value = '';
  document.getElementById('report-modal').style.display = 'flex';
}

function closeReportModal() {
  document.getElementById('report-modal').style.display = 'none';
}

async function submitReport() {
  const reason = document.getElementById('report-reason-select').value;
  const details = document.getElementById('report-details-input').value.trim();

  if (!reason) {
    showToast('Please choose a reason for your report.', 'error');
    return;
  }

  try {
    await api.submitReport(reportTargetProductId, reason, details);
    showToast('Report submitted. Campus moderators will investigate.', 'success');
    closeReportModal();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Toggle Wishlist on Detail page
async function toggleDetailWishlist(productId, btn) {
  await toggleWishlistClick(productId, btn);
  const isWishlisted = state.wishlistIds.has(productId);
  const span = btn.querySelector('span');
  if (span) span.textContent = isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist';
}

// Toggle Sold Status
async function toggleOwnerSoldStatus(productId, newStatus) {
  try {
    await api.updateProductStatus(productId, newStatus);
    showToast(`Listing marked as ${newStatus}!`, 'success');
    renderProductDetailsView(productId);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Delete Listing
async function deleteOwnerListing(productId) {
  if (!confirm('Are you sure you want to permanently delete this listing?')) return;
  try {
    await api.deleteProduct(productId);
    showToast('Listing deleted successfully.', 'info');
    window.location.hash = '#/my-listings';
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Edit Modal Opening from Detail View
function openEditModalFromDetail() {
  openEditModal(activeProductData);
}
