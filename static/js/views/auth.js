/**
 * CampusMart — Authentication Views (Login & Register)
 */

async function renderLoginView() {
  const appView = document.getElementById('app-view');
  appView.innerHTML = `
    <div class="container" style="padding: 60px 0 80px; max-width: 480px;">
      <div style="background:var(--bg-card); border:1px solid var(--border-card); border-radius:var(--radius-lg); padding:36px; box-shadow:var(--shadow-lg);">
        <div style="text-align:center; margin-bottom:28px;">
          <div class="brand-icon" style="margin: 0 auto 14px; width:48px; height:48px;">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <h1 style="font-size: 1.8rem; margin-bottom:6px;">Student Login</h1>
          <p style="color:var(--text-muted); font-size:0.88rem;">Sign in to buy, sell, and chat within your campus marketplace.</p>
        </div>

        <!-- 1-Click Quick Demo Login Box for Students -->
        <div style="background:var(--bg-surface); border:1px dashed var(--border-card); border-radius:var(--radius-md); padding:14px; margin-bottom:24px;">
          <div style="font-size:0.75rem; font-weight:700; color:var(--primary-light); text-transform:uppercase; margin-bottom:8px;">
            ⚡ Quick Student Demo Accounts
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <button class="btn btn-secondary btn-sm" style="text-align:left; justify-content:flex-start;" 
                    onclick="quickLogin('rahul@campusmart.edu', 'student123')">
              👨‍🎓 Rahul Sharma (Student - CS 3rd Year)
            </button>
            <button class="btn btn-secondary btn-sm" style="text-align:left; justify-content:flex-start;" 
                    onclick="quickLogin('priya@campusmart.edu', 'student123')">
              👩‍🎓 Priya Patel (Student - EE 2nd Year)
            </button>
          </div>
        </div>

        <form id="login-form" onsubmit="event.preventDefault(); submitLogin();">
          <div class="form-group">
            <label class="form-label">College Email Address *</label>
            <input type="email" id="login-email" class="form-input" placeholder="e.g. rahul@campusmart.edu" required />
          </div>

          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <label class="form-label">Password *</label>
              <a href="javascript:void(0)" onclick="handleForgotPassword()" style="font-size:0.8rem; color:var(--primary-light);">Forgot password?</a>
            </div>
            <input type="password" id="login-password" class="form-input" placeholder="Enter your password" required />
          </div>

          <button type="submit" id="btn-login-submit" class="btn btn-primary" style="width:100%; margin-top:12px; padding:12px;">
            Sign In as Student
          </button>
        </form>

        <div style="text-align:center; margin-top:24px; font-size:0.88rem; color:var(--text-muted);">
          New to CampusMart? <a href="#/register" style="color:var(--primary-light); font-weight:600;">Create student account</a>
        </div>

        <!-- Separate Admin Portal Access Link -->
        <div style="margin-top:24px; padding-top:18px; border-top:1px solid var(--border-subtle); text-align:center; font-size:0.85rem;">
          <span style="color:var(--text-muted);">Campus Moderator or Administrator?</span><br>
          <a href="#/admin/login" style="color:#fca5a5; font-weight:700; display:inline-flex; align-items:center; gap:6px; margin-top:6px;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Go to Admin Login &rarr;
          </a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Separate Admin Login View
 * Strictly requires Login ID: admin, Password: admin
 */
async function renderAdminLoginView() {
  const appView = document.getElementById('app-view');
  appView.innerHTML = `
    <div class="container" style="padding: 60px 0 80px; max-width: 480px;">
      <div style="background:var(--bg-card); border:1px solid rgba(244, 63, 94, 0.3); border-radius:var(--radius-lg); padding:36px; box-shadow:var(--shadow-lg); position:relative; overflow:hidden;">
        <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:linear-gradient(90deg, #ef4444 0%, #dc2626 100%);"></div>

        <div style="text-align:center; margin-bottom:28px;">
          <div style="width:52px; height:52px; border-radius:14px; background:rgba(220, 38, 38, 0.15); border:1px solid rgba(239, 68, 68, 0.4); color:#fca5a5; display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <span class="badge badge-rose" style="margin-bottom:8px; font-weight:800; letter-spacing:0.06em;">AUTHORIZED PERSONNEL ONLY</span>
          <h1 style="font-size: 1.85rem; margin-bottom:6px; color:#ffffff;">Admin Login</h1>
          <p style="color:var(--text-muted); font-size:0.86rem;">CampusMart college project moderation and administration console.</p>
        </div>

        <!-- Inline Error Message Display -->
        <div id="admin-login-error" style="display:none; background:rgba(244, 63, 94, 0.15); border:1px solid rgba(244, 63, 94, 0.4); color:#fca5a5; padding:12px 16px; border-radius:var(--radius-md); font-size:0.88rem; font-weight:700; margin-bottom:20px; text-align:center;">
          Invalid admin credentials
        </div>

        <form id="admin-login-form" onsubmit="event.preventDefault(); submitAdminLogin();">
          <div class="form-group">
            <label class="form-label" style="color:var(--text-primary);">Login ID *</label>
            <input type="text" id="admin-login-id" class="form-input" placeholder="Enter Admin Login ID" autocomplete="off" required />
          </div>

          <div class="form-group">
            <label class="form-label" style="color:var(--text-primary);">Password *</label>
            <input type="password" id="admin-login-password" class="form-input" placeholder="Enter Admin Password" autocomplete="off" required />
          </div>

          <button type="submit" id="btn-admin-login-submit" class="btn btn-danger" style="width:100%; margin-top:14px; padding:12px; font-size:1rem;">
            Admin Login &rarr;
          </button>
        </form>

        <div style="text-align:center; margin-top:24px; font-size:0.85rem; color:var(--text-muted);">
          Student account? <a href="#/login" style="color:var(--primary-light); font-weight:600;">Return to Student Login</a>
        </div>
      </div>
    </div>
  `;
}

async function submitAdminLogin() {
  const loginId = document.getElementById('admin-login-id').value.trim();
  const password = document.getElementById('admin-login-password').value;
  const errorEl = document.getElementById('admin-login-error');
  const btn = document.getElementById('btn-admin-login-submit');

  errorEl.style.display = 'none';

  if (!loginId || !password) {
    errorEl.textContent = 'Invalid admin credentials';
    errorEl.style.display = 'block';
    showToast('Invalid admin credentials', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Verifying credentials...';

  try {
    const res = await api.adminLogin(loginId, password);
    state.setCurrentUser(res.user);
    showToast('Admin login successful! Redirecting to Dashboard...', 'success');
    // Requirement 5: After successful admin login, redirect the admin to the existing Admin Dashboard
    window.location.hash = '#/admin';
  } catch (err) {
    // Requirement 6: If the admin enters an incorrect login ID or password, display: "Invalid admin credentials"
    const errorMessage = 'Invalid admin credentials';
    errorEl.textContent = errorMessage;
    errorEl.style.display = 'block';
    showToast(errorMessage, 'error');
    btn.disabled = false;
    btn.textContent = 'Admin Login \u2192';
  }
}

async function submitLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showToast('Please enter both email and password.', 'error');
    return;
  }

  const btn = document.getElementById('btn-login-submit');
  btn.disabled = true;
  btn.textContent = 'Signing in...';

  try {
    const res = await api.login(email, password);
    state.setCurrentUser(res.user);
    await state.loadWishlist();
    showToast(`Welcome back, ${res.user.name}!`, 'success');
    window.location.hash = res.user.role === 'admin' ? '#/admin' : '#/browse';
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Sign In to CampusMart';
  }
}

function handleForgotPassword() {
  const email = prompt('Enter your registered college email for password reset:');
  if (email) {
    showToast(`Password reset link sent to ${email} (Demo simulation: password remains student123/admin123).`, 'info');
  }
}

async function renderRegisterView() {
  const appView = document.getElementById('app-view');
  appView.innerHTML = `
    <div class="container" style="padding: 60px 0 80px; max-width: 580px;">
      <div style="background:var(--bg-card); border:1px solid var(--border-card); border-radius:var(--radius-lg); padding:36px; box-shadow:var(--shadow-lg);">
        <div style="text-align:center; margin-bottom:28px;">
          <div class="brand-icon" style="margin: 0 auto 14px; width:48px; height:48px;">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <h1 style="font-size: 1.8rem; margin-bottom:6px;">Student Registration</h1>
          <p style="color:var(--text-muted); font-size:0.88rem;">Create your campus marketplace account to start trading with peers.</p>
        </div>

        <form id="register-form" onsubmit="event.preventDefault(); submitRegister();">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" id="reg-name" class="form-input" placeholder="e.g. Aryan Sharma" required />
          </div>

          <div class="form-group">
            <label class="form-label">College Email Address *</label>
            <input type="email" id="reg-email" class="form-input" placeholder="e.g. aryan@campusmart.edu or student@college.edu" required />
            <span style="font-size:0.75rem; color:var(--text-dim);">Use your college or university domain email</span>
          </div>

          <div class="form-grid" style="gap:14px; margin-bottom:0;">
            <div class="form-group">
              <label class="form-label">Department / Branch *</label>
              <input type="text" id="reg-dept" class="form-input" placeholder="e.g. Computer Science" required />
            </div>

            <div class="form-group">
              <label class="form-label">Year / Semester *</label>
              <select id="reg-year" class="form-input" required>
                <option value="">Select Year...</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Campus Phone / WhatsApp (Optional)</label>
            <input type="text" id="reg-phone" class="form-input" placeholder="+91 98765 00000" />
          </div>

          <div class="form-grid" style="gap:14px; margin-bottom:0;">
            <div class="form-group">
              <label class="form-label">Password * (min 6 chars)</label>
              <input type="password" id="reg-password" class="form-input" placeholder="Choose a password" minlength="6" required />
            </div>

            <div class="form-group">
              <label class="form-label">Confirm Password *</label>
              <input type="password" id="reg-confirm-password" class="form-input" placeholder="Re-enter password" minlength="6" required />
            </div>
          </div>

          <button type="submit" id="btn-register-submit" class="btn btn-primary" style="width:100%; margin-top:16px; padding:12px;">
            Create Student Account
          </button>
        </form>

        <div style="text-align:center; margin-top:24px; font-size:0.88rem; color:var(--text-muted);">
          Already registered? <a href="#/login" style="color:var(--primary-light); font-weight:600;">Sign in here</a>
        </div>
      </div>
    </div>
  `;
}

async function submitRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const department = document.getElementById('reg-dept').value.trim();
  const year = document.getElementById('reg-year').value;
  const phone = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;

  if (!name || !email || !department || !year || !password || !confirmPassword) {
    showToast('Please fill in all mandatory fields.', 'error');
    return;
  }

  if (password.length < 6) {
    showToast('Password must be at least 6 characters long.', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showToast('Passwords do not match.', 'error');
    return;
  }

  const btn = document.getElementById('btn-register-submit');
  btn.disabled = true;
  btn.textContent = 'Registering student...';

  try {
    const res = await api.register({
      name,
      email,
      department,
      year,
      phone,
      password,
      confirm_password: confirmPassword
    });

    state.setCurrentUser(res.user);
    await state.loadWishlist();
    showToast('🎉 Account registered! Welcome to CampusMart.', 'success');
    window.location.hash = '#/browse';
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Create Student Account';
  }
}
