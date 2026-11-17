/**
 * CampusMart — Hash-Based Single Page App Router
 */

class Router {
  constructor() {
    this.routes = {};
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  parseHash() {
    const rawHash = window.location.hash.slice(1) || '/';
    const [pathWithParams, queryString] = rawHash.split('?');
    const path = pathWithParams.startsWith('/') ? pathWithParams : `/${pathWithParams}`;
    
    const queryParams = {};
    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      for (const [key, val] of searchParams.entries()) {
        queryParams[key] = val;
      }
    }

    return { path, queryParams };
  }

  async handleRoute() {
    const { path, queryParams } = this.parseHash();

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Guard for admin dashboard: strictly redirect to #/admin/login if no authenticated admin session
    if (path === '/admin') {
      if (!state.currentUser || state.currentUser.role !== 'admin') {
        window.location.hash = '#/admin/login';
        return;
      }
    }

    // Match exact routes
    if (this.routes[path]) {
      await this.routes[path](queryParams);
      return;
    }

    // Match parameterized routes like /product/:id
    const productMatch = path.match(/^\/product\/(\d+)$/);
    if (productMatch) {
      const productId = parseInt(productMatch[1], 10);
      await renderProductDetailsView(productId);
      return;
    }

    // Fallback: 404 or redirect to Home
    console.warn(`Route not found: ${path}. Redirecting to /`);
    window.location.hash = '#/';
  }

  init() {
    this.handleRoute();
  }
}

const router = new Router();

// Route definitions
router.register('/', renderHomeView);
router.register('/browse', renderBrowseView);
router.register('/sell', renderSellView);
router.register('/my-listings', renderMyListingsView);
router.register('/wishlist', renderWishlistView);
router.register('/profile', renderProfileView);
router.register('/messages', renderMessagesView);
router.register('/admin', renderAdminView);
router.register('/admin/login', renderAdminLoginView);
router.register('/admin-login', renderAdminLoginView);
router.register('/login', renderLoginView);
router.register('/register', renderRegisterView);
