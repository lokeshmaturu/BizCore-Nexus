/**
 * Inventory & Warehouse Service
 */

import api from './api';

export const inventoryService = {
  async getProducts(params = {}) {
    const response = await api.get('/inventory/products', { params });
    return response.data;
  },

  async getProductById(id) {
    const response = await api.get(`/inventory/products/${id}`);
    return response.data?.data;
  },

  async createProduct(productData) {
    const response = await api.post('/inventory/products', productData);
    return response.data?.data;
  },

  async updateProduct(id, productData) {
    const response = await api.patch(`/inventory/products/${id}`, productData);
    return response.data?.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/inventory/products/${id}`);
    return response.data;
  },

  async adjustStock(payload) {
    const response = await api.post('/inventory/adjust', payload);
    return response.data?.data;
  },

  async transferStock(payload) {
    const response = await api.post('/inventory/transfers', payload);
    return response.data?.data;
  },

  async getMovements(params = {}) {
    const response = await api.get('/inventory/movements', { params });
    return response.data;
  },

  async getLowStockAlerts() {
    const response = await api.get('/inventory/low-stock');
    return response.data?.data;
  },
};
