/**
 * CampusMart API Client
 * Provides promise-based HTTP communication with the Flask backend.
 */

const API_BASE = '/api';

class ApiClient {
  constructor() {
    this.token = sessionStorage.getItem('campusmart_admin_token') || localStorage.getItem('campusmart_token') || null;
  }

  setToken(token) {
    this.token = token;
    sessionStorage.removeItem('campusmart_admin_token');
    if (token) {
      localStorage.setItem('campusmart_token', token);
    } else {
      localStorage.removeItem('campusmart_token');
    }
  }

  setAdminToken(token) {
    this.token = token;
    localStorage.removeItem('campusmart_token');
    if (token) {
      sessionStorage.setItem('campusmart_admin_token', token);
    } else {
      sessionStorage.removeItem('campusmart_admin_token');
    }
  }

  clearTokens() {
    this.token = null;
    localStorage.removeItem('campusmart_token');
    sessionStorage.removeItem('campusmart_admin_token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = options.isFormData ? (this.token ? { 'Authorization': `Bearer ${this.token}` } : {}) : this.getHeaders();

    const config = {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      return data;
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  }

  // ----------------- Auth API -----------------
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.token);
    return data;
  }

  async adminLogin(loginId, password) {
    const data = await this.request('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ login_id: loginId, password })
    });
    this.setAdminToken(data.token);
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    this.setToken(data.token);
    return data;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore logout errors
    }
    this.setToken(null);
  }

  async getMe() {
    if (!this.token) return null;
    try {
      return await this.request('/auth/me');
    } catch (err) {
      this.setToken(null);
      return null;
    }
  }

  async updateProfile(profileData) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async getDemoUsers() {
    return await this.request('/auth/demo-users');
  }

  // ----------------- Categories API -----------------
  async getCategories() {
    return await this.request('/categories');
  }

  // ----------------- Products API -----------------
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    }
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await this.request(`/products${queryString}`);
  }

  async getProduct(id) {
    return await this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id, productData) {
    return await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id) {
    return await this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  async updateProductStatus(id, status) {
    return await this.request(`/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // ----------------- Wishlist API -----------------
  async getWishlist() {
    return await this.request('/wishlist');
  }

  async toggleWishlist(productId) {
    return await this.request(`/wishlist/${productId}`, {
      method: 'POST'
    });
  }

  // ----------------- Reports API -----------------
  async submitReport(productId, reason, details) {
    return await this.request('/reports', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, reason, details })
    });
  }

  // ----------------- Messaging API -----------------
  async getConversations() {
    return await this.request('/conversations');
  }

  async getMessages(otherUserId, productId) {
    return await this.request(`/messages/${otherUserId}/${productId}`);
  }

  async sendMessage(receiverId, productId, content) {
    return await this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({
        receiver_id: receiverId,
        product_id: productId,
        content
      })
    });
  }

  // ----------------- Admin API -----------------
  async getAdminStats() {
    return await this.request('/admin/stats');
  }

  async getAdminReports() {
    return await this.request('/admin/reports');
  }

  async resolveAdminReport(reportId, action) {
    return await this.request(`/admin/reports/${reportId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action })
    });
  }

  async getAdminUsers(query = '') {
    const q = query ? `?q=${encodeURIComponent(query)}` : '';
    return await this.request(`/admin/users${q}`);
  }

  async updateUserStatus(userId, status) {
    return await this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  async getAdminListings() {
    return await this.request('/admin/listings');
  }

  // ----------------- Upload API -----------------
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return await this.request('/upload', {
      method: 'POST',
      body: formData,
      isFormData: true
    });
  }
}

// Global API instance
const api = new ApiClient();
