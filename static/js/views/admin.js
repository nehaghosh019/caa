/**
 * CampusMart — Admin Dashboard View
 */

let activeAdminTab = 'reports';

async function renderAdminView() {
  if (!state.currentUser || state.currentUser.role !== 'admin') {
    showToast('Please log in with administrator credentials.', 'info');
    window.location.hash = '#/admin/login';
    return;
  }

  const appView = document.getElementById('app-view');
  appView.innerHTML = `
    <div class="container admin-view">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:32px; flex-wrap:wrap; gap:16px;">
        <div>
          <span class="badge badge-rose" style="margin-bottom:6px;">Campus Moderation Panel</span>
          <h1 style="font-size: 2.2rem;">Marketplace Administration</h1>
          <p style="color:var(--text-muted);">Manage campus community safety, resolve student reports, and audit marketplace items.</p>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span class="badge badge-emerald" style="padding:6px 12px; font-size:0.85rem;">Admin Session Active</span>
          <button class="btn btn-outline btn-sm" onclick="handleAdminLogout()" style="border-color:var(--rose); color:#fca5a5;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Admin Logout
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="admin-stats-grid" id="admin-stats-container">
        <div class="spinner"></div>
      </div>

      <!-- Navigation Tabs -->
      <div class="admin-tabs">
        <button class="admin-tab-btn ${activeAdminTab === 'reports' ? 'active' : ''}" onclick="switchAdminTab('reports')">
          Reported Listings Queue
        </button>
        <button class="admin-tab-btn ${activeAdminTab === 'listings' ? 'active' : ''}" onclick="switchAdminTab('listings')">
          All Marketplace Listings
        </button>
        <button class="admin-tab-btn ${activeAdminTab === 'users' ? 'active' : ''}" onclick="switchAdminTab('users')">
          Registered Students &amp; Users
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="admin-tab-content">
        <div class="view-loading"><div class="spinner"></div><p>Loading moderation data...</p></div>
      </div>
    </div>
  `;

  loadAdminStats();
  loadAdminTabContent();
}

function switchAdminTab(tab) {
  activeAdminTab = tab;
  renderAdminView();
}

async function loadAdminStats() {
  const container = document.getElementById('admin-stats-container');
  if (!container) return;

  try {
    const stats = await api.getAdminStats();
    container.innerHTML = `
      <div class="stat-card stat-users">
        <div class="stat-icon" style="color:var(--primary-light);">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <div class="stat-val">${stats.total_users}</div>
          <div class="stat-name">Registered Students</div>
        </div>
      </div>

      <div class="stat-card stat-listings">
        <div class="stat-icon" style="color:var(--sky);">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
        </div>
        <div>
          <div class="stat-val">${stats.total_listings}</div>
          <div class="stat-name">Total Listings</div>
        </div>
      </div>

      <div class="stat-card stat-active">
        <div class="stat-icon" style="color:var(--emerald);">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
        </div>
        <div>
          <div class="stat-val">${stats.active_listings}</div>
          <div class="stat-name">Active Listings</div>
        </div>
      </div>

      <div class="stat-card stat-sold">
        <div class="stat-icon" style="color:var(--amber);">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <div class="stat-val">${stats.sold_listings}</div>
          <div class="stat-name">Sold Items</div>
        </div>
      </div>

      <div class="stat-card stat-reported">
        <div class="stat-icon" style="color:var(--rose);">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
        </div>
        <div>
          <div class="stat-val">${stats.reported_listings}</div>
          <div class="stat-name">Pending Reports</div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error('Stats load error', err);
  }
}

async function loadAdminTabContent() {
  const contentEl = document.getElementById('admin-tab-content');
  if (!contentEl) return;

  if (activeAdminTab === 'reports') {
    await renderReportsTab(contentEl);
  } else if (activeAdminTab === 'listings') {
    await renderListingsTab(contentEl);
  } else if (activeAdminTab === 'users') {
    await renderUsersTab(contentEl);
  }
}

// 1. Reports Moderation Tab
async function renderReportsTab(container) {
  try {
    const reports = await api.getAdminReports();

    if (reports.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          <h3 class="empty-title">All Clear! No Reported Listings</h3>
          <p class="empty-subtitle">Campus marketplace is clean and in accordance with guidelines.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="data-table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Reported Item</th>
              <th>Reason &amp; Details</th>
              <th>Reporter</th>
              <th>Seller</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${reports.map(r => `
              <tr>
                <td>
                  <span class="badge ${r.status === 'pending' ? 'badge-rose' : (r.status === 'resolved' ? 'badge-emerald' : 'badge-primary')}">
                    ${r.status}
                  </span>
                </td>
                <td>
                  <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${r.product_image}" style="width:36px; height:36px; border-radius:4px; object-fit:cover;" onerror="this.src='/static/images/categories/other.svg'">
                    <div>
                      <a href="#/product/${r.product_id}" style="font-weight:700; color:var(--text-primary);">${escapeHtml(r.product_title)}</a>
                      <div style="font-size:0.75rem; color:#38bdf8;">₹${r.product_price} • ${r.product_status}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style="font-weight:600; color:var(--rose);">${escapeHtml(r.reason)}</div>
                  <div style="font-size:0.8rem; color:var(--text-muted); max-width:260px;">${escapeHtml(r.details || 'No additional text')}</div>
                </td>
                <td>
                  <div style="font-weight:600;">${escapeHtml(r.reporter_name)}</div>
                  <div style="font-size:0.75rem; color:var(--text-dim);">${escapeHtml(r.reporter_email)}</div>
                </td>
                <td>
                  <div style="font-weight:600;">${escapeHtml(r.seller_name)}</div>
                  <div style="font-size:0.75rem; color:var(--text-dim);">${escapeHtml(r.seller_email)}</div>
                </td>
                <td style="font-size:0.8rem;">${formatRelativeDate(r.created_at)}</td>
                <td>
                  ${r.status === 'pending' ? `
                    <div style="display:flex; gap:6px;">
                      <button class="btn btn-secondary btn-sm" onclick="handleReportAction(${r.id}, 'dismiss')" title="Ignore report">
                        Dismiss
                      </button>
                      <button class="btn btn-danger btn-sm" onclick="handleReportAction(${r.id}, 'resolve_remove')" title="Remove item from marketplace">
                        Remove Item
                      </button>
                    </div>
                  ` : `
                    <span style="font-size:0.78rem; color:var(--text-dim);">Processed</span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div style="color:var(--rose); padding:20px;">Failed to load reports: ${err.message}</div>`;
  }
}

async function handleReportAction(reportId, action) {
  try {
    const res = await api.resolveAdminReport(reportId, action);
    showToast(res.message, 'success');
    loadAdminStats();
    loadAdminTabContent();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// 2. All Listings Moderation Tab
async function renderListingsTab(container) {
  try {
    const listings = await api.getAdminListings();

    container.innerHTML = `
      <div class="data-table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Condition</th>
              <th>Seller</th>
              <th>Status</th>
              <th>Reports</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${listings.map(p => `
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${p.image_url}" style="width:36px; height:36px; border-radius:4px; object-fit:cover;" onerror="this.src='/static/images/categories/other.svg'">
                    <div>
                      <a href="#/product/${p.id}" style="font-weight:700; color:var(--text-primary);">${escapeHtml(p.title)}</a>
                      <div style="font-size:0.75rem; color:var(--text-dim);">${escapeHtml(p.location)}</div>
                    </div>
                  </div>
                </td>
                <td><span class="category-tag">${p.category}</span></td>
                <td style="font-weight:700; color:#38bdf8;">₹${p.price}</td>
                <td><span class="badge badge-primary">${p.condition}</span></td>
                <td>
                  <div style="font-weight:600;">${escapeHtml(p.seller_name)}</div>
                  <div style="font-size:0.75rem; color:var(--text-dim);">${escapeHtml(p.seller_email)}</div>
                </td>
                <td>
                  <span class="badge ${p.status === 'active' ? 'badge-emerald' : (p.status === 'sold' ? 'badge-sold' : 'badge-rose')}">
                    ${p.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  ${p.reports_count > 0 ? `<span class="badge badge-rose">${p.reports_count} reports</span>` : '<span style="color:var(--text-dim); font-size:0.8rem;">0</span>'}
                </td>
                <td>
                  <button class="btn btn-danger btn-sm" onclick="adminDeleteProduct(${p.id})">
                    Remove
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div style="color:var(--rose); padding:20px;">Failed to load listings: ${err.message}</div>`;
  }
}

async function adminDeleteProduct(productId) {
  if (!confirm('Are you sure you want to remove this product as an administrator?')) return;
  try {
    await api.deleteProduct(productId);
    showToast('Listing removed by moderator.', 'info');
    loadAdminStats();
    loadAdminTabContent();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// 3. User Management Tab
async function renderUsersTab(container) {
  try {
    const users = await api.getAdminUsers();

    container.innerHTML = `
      <div class="data-table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>College Email</th>
              <th>Department / Branch</th>
              <th>Year</th>
              <th>Role</th>
              <th>Listings (Sold)</th>
              <th>Account Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>
                  <div style="font-weight:700; color:var(--text-primary);">${escapeHtml(u.name)}</div>
                </td>
                <td>${escapeHtml(u.email)}</td>
                <td>${escapeHtml(u.department)}</td>
                <td>${escapeHtml(u.year)}</td>
                <td>
                  <span class="badge ${u.role === 'admin' ? 'badge-rose' : 'badge-primary'}">${u.role}</span>
                </td>
                <td>
                  <strong>${u.total_listings}</strong> total (${u.sold_listings} sold)
                </td>
                <td>
                  <span class="badge ${u.status === 'active' ? 'badge-emerald' : 'badge-rose'}">
                    ${u.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  ${u.role !== 'admin' ? `
                    <button class="btn ${u.status === 'active' ? 'btn-danger' : 'btn-success'} btn-sm" 
                            onclick="toggleUserSuspension(${u.id}, '${u.status === 'active' ? 'suspended' : 'active'}')">
                      ${u.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  ` : `
                    <span style="font-size:0.75rem; color:var(--text-dim);">Protected Admin</span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div style="color:var(--rose); padding:20px;">Failed to load users: ${err.message}</div>`;
  }
}

async function toggleUserSuspension(userId, newStatus) {
  const actionName = newStatus === 'suspended' ? 'suspend' : 'activate';
  if (!confirm(`Are you sure you want to ${actionName} this student account?`)) return;

  try {
    const res = await api.updateUserStatus(userId, newStatus);
    showToast(res.message, 'info');
    loadAdminStats();
    loadAdminTabContent();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleAdminLogout() {
  try {
    await api.logout();
  } catch (e) {
    // Ignore error
  }
  sessionStorage.removeItem('campusmart_admin_token');
  localStorage.removeItem('campusmart_token');
  api.setToken(null);
  state.setCurrentUser(null);
  showToast('Logged out of Admin Console.', 'info');
  window.location.hash = '#/admin/login';
}
