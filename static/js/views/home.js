/**
 * CampusMart — Home Page View
 */

async function renderHomeView() {
  const appView = document.getElementById('app-view');
  appView.innerHTML = `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-glow-badge">
          <span>🎓 Verified College Marketplace</span>
        </div>
        <h1 class="hero-title">
          Buy and Sell Within <br>
          <span class="hero-gradient-text">Your Campus</span>
        </h1>
        <p class="hero-subtitle">
          Find affordable college essentials or sell the things you no longer need.
        </p>

        <!-- Big Hero Search Card -->
        <div class="hero-search-card">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#94a3b8" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="hero-search-input" class="hero-search-input" placeholder="Search textbooks, Casio fx-991EX, lab coat, drawing board..." />
          <button id="hero-search-btn" class="btn btn-primary hero-search-btn">Search Campus</button>
        </div>

        <!-- Quick Chips -->
        <div class="hero-quick-chips">
          <span class="chips-label">Popular on campus:</span>
          <button class="quick-chip" onclick="searchByTerm('Data Structures')">📚 Data Structures</button>
          <button class="quick-chip" onclick="searchByTerm('Calculator')">🧮 Calculator</button>
          <button class="quick-chip" onclick="searchByTerm('Lab Coat')">🥼 Lab Coat</button>
          <button class="quick-chip" onclick="searchByTerm('Arduino')">⚡ Arduino Kit</button>
          <button class="quick-chip" onclick="searchByTerm('Hostel')">🛏️ Hostel Essentials</button>
        </div>

        <!-- Trust Stats Row -->
        <div class="trust-metrics-grid">
          <div class="trust-card">
            <div class="trust-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div class="trust-title">College Verified</div>
              <div class="trust-desc">Only students with university emails can buy & sell.</div>
            </div>
          </div>

          <div class="trust-card">
            <div class="trust-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            </div>
            <div>
              <div class="trust-title">Zero Commission</div>
              <div class="trust-desc">100% peer-to-peer student transactions. No middlemen.</div>
            </div>
          </div>

          <div class="trust-card">
            <div class="trust-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg>
            </div>
            <div>
              <div class="trust-title">On-Campus Meetups</div>
              <div class="trust-desc">Meet directly at the library, canteen or dorms. Zero shipping wait.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div class="section-title-wrap">
            <span class="section-tag">Campus Departments</span>
            <h2 class="section-title">Explore by Category</h2>
          </div>
          <a href="#/browse" class="btn btn-outline btn-sm">View All Listings &rarr;</a>
        </div>

        <div class="categories-grid" id="home-categories-grid">
          <div class="spinner"></div>
        </div>
      </div>
    </section>

    <!-- Featured / Latest Listings Section -->
    <section class="section" style="background: rgba(15, 23, 42, 0.4);">
      <div class="container">
        <div class="section-header">
          <div class="section-title-wrap">
            <span class="section-tag">Freshly Listed</span>
            <h2 class="section-title">Latest Campus Essentials</h2>
          </div>
          <a href="#/browse" class="btn btn-primary btn-sm">Explore All Items</a>
        </div>

        <div class="products-grid" id="home-products-grid">
          <div class="view-loading"><div class="spinner"></div><p>Fetching campus listings...</p></div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="section">
      <div class="container">
        <div class="section-header" style="text-align: center; justify-content: center; margin-bottom: 48px;">
          <div class="section-title-wrap" style="text-align: center;">
            <span class="section-tag">Simple & Safe</span>
            <h2 class="section-title">How CampusMart Works</h2>
            <p style="max-width: 540px; margin: 8px auto 0;">Made specifically for university students to exchange books, equipment, and gear without leaving campus.</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          <div class="trust-card" style="flex-direction: column; align-items: flex-start; padding: 28px;">
            <div class="trust-icon" style="background: rgba(99, 102, 241, 0.15); color: #818cf8; width: 54px; height: 54px; font-size: 1.4rem; font-weight: 800;">
              01
            </div>
            <h3 style="font-size: 1.25rem; margin: 16px 0 8px;">List in 60 Seconds</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted);">Snap a photo, choose your college department category, set your price in ₹, and pick your favorite campus meetup spot.</p>
          </div>

          <div class="trust-card" style="flex-direction: column; align-items: flex-start; padding: 28px;">
            <div class="trust-icon" style="background: rgba(16, 185, 129, 0.15); color: #34d399; width: 54px; height: 54px; font-size: 1.4rem; font-weight: 800;">
              02
            </div>
            <h3 style="font-size: 1.25rem; margin: 16px 0 8px;">Chat with Peers</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted);">Use built-in CampusMart messaging to discuss the item's condition, negotiate price, or agree on a pickup time.</p>
          </div>

          <div class="trust-card" style="flex-direction: column; align-items: flex-start; padding: 28px;">
            <div class="trust-icon" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; width: 54px; height: 54px; font-size: 1.4rem; font-weight: 800;">
              03
            </div>
            <h3 style="font-size: 1.25rem; margin: 16px 0 8px;">Meet &amp; Exchange</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted);">Hand over the book or equipment right outside the Central Library, Canteen, or Hostel quad. Instant and trustworthy.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="brand-logo" style="margin-bottom: 12px;">
              <div class="brand-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <span class="brand-text">Campus<span class="brand-highlight">Mart</span></span>
            </div>
            <p class="footer-desc">
              The premier college-only marketplace empowering students to buy and sell textbooks, calculators, electronics, uniforms, and hostel essentials sustainably.
            </p>
          </div>

          <div>
            <h4 class="footer-col-title">Marketplace</h4>
            <ul class="footer-links">
              <li><a href="#/browse" class="footer-link">All Products</a></li>
              <li><a href="#/browse?category=Books" class="footer-link">Textbooks &amp; Guides</a></li>
              <li><a href="#/browse?category=Calculators" class="footer-link">Scientific Calculators</a></li>
              <li><a href="#/browse?category=Lab+Equipment" class="footer-link">Lab Equipment</a></li>
              <li><a href="#/browse?category=Hostel+Items" class="footer-link">Hostel &amp; Dorm Items</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-col-title">Student Hub</h4>
            <ul class="footer-links">
              <li><a href="#/sell" class="footer-link">Sell an Item</a></li>
              <li><a href="#/my-listings" class="footer-link">My Listings</a></li>
              <li><a href="#/wishlist" class="footer-link">Saved Wishlist</a></li>
              <li><a href="#/messages" class="footer-link">Campus Messages</a></li>
              <li><a href="#/profile" class="footer-link">Student Profile</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-col-title">Safety &amp; Rules</h4>
            <ul class="footer-links">
              <li><a href="javascript:void(0)" onclick="showToast('Always meet in public campus zones like the Library or Cafeteria.', 'info')" class="footer-link">Campus Safety Guidelines</a></li>
              <li><a href="javascript:void(0)" onclick="showToast('Prohibited items include exam materials, hazardous chemicals, and non-student goods.', 'info')" class="footer-link">Prohibited Items</a></li>
              <li><a href="#/login" class="footer-link">Student Login</a></li>
              <li><a href="#/admin/login" class="footer-link" style="color:#fca5a5;">Admin / Moderator Portal &rarr;</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div>&copy; 2026 CampusMart. Designed exclusively for university campuses.</div>
          <div>Built with Python Flask, SQLite, and Modern Vanilla Web Stack.</div>
        </div>
      </div>
    </footer>
  `;

  // Attach search listeners
  const searchInput = document.getElementById('hero-search-input');
  const searchBtn = document.getElementById('hero-search-btn');

  const triggerSearch = () => {
    const q = searchInput.value.trim();
    window.location.hash = `#/browse?q=${encodeURIComponent(q)}`;
  };

  if (searchBtn) searchBtn.addEventListener('click', triggerSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerSearch();
    });
  }

  // Load Categories
  loadHomeCategories();

  // Load Latest Listings
  loadHomeProducts();
}

async function loadHomeCategories() {
  const container = document.getElementById('home-categories-grid');
  if (!container) return;

  try {
    const categories = await api.getCategories();
    container.innerHTML = categories.map(cat => {
      const slug = cat.name.toLowerCase().replace(/ & /g, '_and_').replace(/ /g, '_');
      return `
        <a href="#/browse?category=${encodeURIComponent(cat.name)}" class="category-card">
          <div class="category-icon-box">
            <img src="/static/images/categories/${slug}.svg" alt="${cat.name}" onerror="this.src='/static/images/categories/other.svg'">
          </div>
          <div class="category-name">${cat.name}</div>
          <div class="category-count">${cat.count} ${cat.count === 1 ? 'item' : 'items'}</div>
        </a>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = `<p style="color:var(--rose);">Could not load categories.</p>`;
  }
}

async function loadHomeProducts() {
  const container = document.getElementById('home-products-grid');
  if (!container) return;

  try {
    const products = await api.getProducts({ limit: 8 });
    if (products.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3 class="empty-title">No listings yet</h3>
          <p class="empty-subtitle">Be the first student to list an item on CampusMart!</p>
          <a href="#/sell" class="btn btn-primary">Sell an Item</a>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(product => renderProductCardHtml(product)).join('');
  } catch (err) {
    container.innerHTML = `<p style="color:var(--rose);">Failed to load products: ${err.message}</p>`;
  }
}

function searchByTerm(term) {
  window.location.hash = `#/browse?q=${encodeURIComponent(term)}`;
}
