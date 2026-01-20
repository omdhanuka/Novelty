import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category, params) => api.get(`/products/category/${category}`, { params }),
  search: (query) => api.get('/products/search', { params: { q: query } }),
  getBestSellers: () => api.get('/products/bestsellers'),
  getFeatured: () => api.get('/products/featured'),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const paymentAPI = {
  createOrder: (data) => api.post('/payment/create-order', data),
  verifyPayment: (data) => api.post('/payment/verify', data),
};

export const reviewAPI = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Admin API functions
export const adminAPI = {
  // Dashboard
  getDashboardMetrics: () => api.get('/admin/dashboard/metrics'),
  getSalesReport: (period) => api.get(`/admin/dashboard/sales-report?period=${period}`),
  getInventoryReport: () => api.get('/admin/dashboard/inventory-report'),
  
  // Products
  products: {
    getAll: (params) => api.get('/admin/products', { params }),
    getById: (id) => api.get(`/admin/products/${id}`),
    create: (data) => api.post('/admin/products', data),
    update: (id, data) => api.put(`/admin/products/${id}`, data),
    delete: (id) => api.delete(`/admin/products/${id}`),
    updateStock: (id, data) => api.patch(`/admin/products/${id}/stock`, data),
    bulkDelete: (ids) => api.post('/admin/products/bulk-delete', { ids }),
  },
  
  // Categories
  categories: {
    getAll: (params) => api.get('/admin/categories', { params }),
    getById: (id) => api.get(`/admin/categories/${id}`),
    create: (data) => api.post('/admin/categories', data),
    update: (id, data) => api.put(`/admin/categories/${id}`, data),
    delete: (id) => api.delete(`/admin/categories/${id}`),
    toggleStatus: (id) => api.patch(`/admin/categories/${id}/toggle-status`),
    reorder: (categories) => api.patch('/admin/categories/reorder', { categories }),
    bulkDelete: (ids) => api.post('/admin/categories/bulk-delete', { ids }),
  },
  
  // Orders
  orders: {
    getAll: (params) => api.get('/admin/orders', { params }),
    getById: (id) => api.get(`/admin/orders/${id}`),
    updateStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
  },
  
  // Customers
  customers: {
    getAll: (params) => api.get('/admin/customers', { params }),
    getById: (id) => api.get(`/admin/customers/${id}`),
  },
  
  // Coupons
  coupons: {
    getAll: (params) => api.get('/admin/coupons', { params }),
    getById: (id) => api.get(`/admin/coupons/${id}`),
    create: (data) => api.post('/admin/coupons', data),
    update: (id, data) => api.put(`/admin/coupons/${id}`, data),
    delete: (id) => api.delete(`/admin/coupons/${id}`),
    toggleStatus: (id) => api.patch(`/admin/coupons/${id}/toggle`),
  },
  
  // Settings
  settings: {
    get: () => api.get('/admin/settings'),
    update: (data) => api.put('/admin/settings', data),
  },
};
