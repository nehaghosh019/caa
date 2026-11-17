/**
 * CampusMart — Profile View
 */

async function renderProfileView() {
  if (!state.currentUser) {
    showToast('Please log in to view your profile.', 'info');
    window.location.hash = '#/login';
    return;
  }

  const appView = document.getElementById('app-view');
  appView.innerHTML = `
    <div class="container" style="padding: 40px 0 80px;">
      <div class="view-loading"><div class="spinner"></div><p>Loading profile...</p></div>
    </div>
  `;

  try {
    const user = await api.getMe();
    state.setCurrentUser(user);

    const stats = user.stats || {
      total_listings: 0,
      sold_listings: 0,
      active_listings: 0,
      wishlist_count: 0
    };

    appView.innerHTML = `
      <div class="container" style="padding: 40px 0 80px;">
        <div style="margin-bottom: 32px;">
          <span class="badge badge-primary" style="margin-bottom:6px;">Student Identity</span>
          <h1 style="font-size: 2.2rem;">Student Profile</h1>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 32px;">
          <!-- Left Column: Student ID Card & Stats -->
          <div>
            <div style="background:var(--bg-card); border:1px solid var(--border-card); border-radius:var(--radius-lg); padding:28px; text-align:center; position:relative; overflow:hidden; margin-bottom:24px;">
              <div style="position:absolute; top:0; left:0; width:100%; height:6px; background:linear-gradient(90deg, var(--primary) 0%, var(--sky) 100%);"></div>
              
              <img src="${user.avatar_url || '/static/images/avatars/student.svg'}" 
                   style="width:96px; height:96px; border-radius:50%; border:3px solid var(--border-card); margin-bottom:16px;" 
                   alt="${user.name}" />

              <h2 style="font-size:1.45rem; margin-bottom:4px;">${escapeHtml(user.name)}</h2>
              <div style="display:inline-block; font-size:0.75rem; background:var(--emerald-bg); color:var(--emerald); padding:3px 10px; border-radius:var(--radius-full); font-weight:700; margin-bottom:12px;">
                Verified ${user.role === 'admin' ? 'Campus Admin' : 'Student'}
              </div>

              <div style="text-align:left; background:var(--bg-surface); border-radius:var(--radius-md); padding:16px; margin-top:16px; font-size:0.88rem; display:flex; flex-direction:column; gap:10px;">
                <div><span style="color:var(--text-muted);">College Email:</span> <br><strong>${escapeHtml(user.email)}</strong></div>
                <div><span style="color:var(--text-muted);">Department:</span> <br><strong>${escapeHtml(user.department)}</strong></div>
                <div><span style="color:var(--text-muted);">Year / Class:</span> <br><strong>${escapeHtml(user.year)}</strong></div>
                ${user.phone ? `<div><span style="color:var(--text-muted);">Campus Contact:</span> <br><strong>${escapeHtml(user.phone)}</strong></div>` : ''}
              </div>
            </div>

            <!-- Stats Row -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
              <div style="background:var(--bg-card); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:16px; text-align:center;">
                <div style="font-size:1.8rem; font-weight:800; color:var(--primary-light);">${stats.total_listings}</div>
                <div style="font-size:0.78rem; color:var(--text-muted); font-weight:600;">Total Listings</div>
              </div>
              <div style="background:var(--bg-card); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:16px; text-align:center;">
                <div style="font-size:1.8rem; font-weight:800; color:var(--emerald);">${stats.sold_listings}</div>
                <div style="font-size:0.78rem; color:var(--text-muted); font-weight:600;">Items Sold</div>
              </div>
              <div style="background:var(--bg-card); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:16px; text-align:center;">
                <div style="font-size:1.8rem; font-weight:800; color:var(--sky);">${stats.active_listings}</div>
                <div style="font-size:0.78rem; color:var(--text-muted); font-weight:600;">Active Listings</div>
              </div>
              <div style="background:var(--bg-card); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:16px; text-align:center;">
                <div style="font-size:1.8rem; font-weight:800; color:var(--rose);">${stats.wishlist_count}</div>
                <div style="font-size:0.78rem; color:var(--text-muted); font-weight:600;">Wishlisted</div>
              </div>
            </div>
          </div>

          <!-- Right Column: Edit Profile Form -->
          <div>
            <div style="background:var(--bg-card); border:1px solid var(--border-card); border-radius:var(--radius-lg); padding:32px;">
              <h3 style="font-size:1.3rem; margin-bottom:6px;">Edit Profile Information</h3>
              <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:24px;">Update your academic details or phone contact for campus buyers.</p>

              <form id="edit-profile-form" onsubmit="event.preventDefault(); submitProfileUpdate();">
                <div class="form-group">
                  <label class="form-label">Full Name *</label>
                  <input type="text" id="profile-name" class="form-input" value="${escapeHtml(user.name)}" required />
                </div>

                <div class="form-group">
                  <label class="form-label">Department / Branch *</label>
                  <input type="text" id="profile-dept" class="form-input" value="${escapeHtml(user.department)}" required />
                </div>

                <div class="form-group">
                  <label class="form-label">Year / Semester *</label>
                  <select id="profile-year" class="form-input" required>
                    <option value="1st Year" ${user.year === '1st Year' ? 'selected' : ''}>1st Year</option>
                    <option value="2nd Year" ${user.year === '2nd Year' ? 'selected' : ''}>2nd Year</option>
                    <option value="3rd Year" ${user.year === '3rd Year' ? 'selected' : ''}>3rd Year</option>
                    <option value="4th Year" ${user.year === '4th Year' ? 'selected' : ''}>4th Year</option>
                    <option value="Postgraduate" ${user.year === 'Postgraduate' ? 'selected' : ''}>Postgraduate / Master's</option>
                    <option value="Faculty / Staff" ${user.year === 'Faculty / Staff' ? 'selected' : ''}>Faculty / Staff</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Campus Phone / WhatsApp</label>
                  <input type="text" id="profile-phone" class="form-input" value="${escapeHtml(user.phone || '')}" placeholder="+91 98765 43210" />
                </div>

                <div style="margin-top:28px; display:flex; justify-content:flex-end;">
                  <button type="submit" id="btn-save-profile" class="btn btn-primary">Save Profile Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    appView.innerHTML = `<div class="container" style="padding:60px 0; color:var(--rose);">Error loading profile: ${err.message}</div>`;
  }
}

async function submitProfileUpdate() {
  const name = document.getElementById('profile-name').value.trim();
  const department = document.getElementById('profile-dept').value.trim();
  const year = document.getElementById('profile-year').value;
  const phone = document.getElementById('profile-phone').value.trim();

  if (!name || !department || !year) {
    showToast('Name, department, and year are required.', 'error');
    return;
  }

  const btn = document.getElementById('btn-save-profile');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    const res = await api.updateProfile({ name, department, year, phone });
    state.setCurrentUser(res.user);
    showToast('Profile updated successfully!', 'success');
    renderProfileView();
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Save Profile Changes';
  }
}
