/**
 * Sales & Wholesale CRM Service
 */

import api from './api';

export const salesService = {
  async getCustomers(params = {}) {
    const response = await api.get('/sales/customers', { params });
    return response.data;
  },

  async createCustomer(customerData) {
    const response = await api.post('/sales/customers', customerData);
    return response.data?.data;
  },

  async updateCustomer(id, customerData) {
    const response = await api.patch(`/sales/customers/${id}`, customerData);
    return response.data?.data;
  },

  async getOrders(params = {}) {
    const response = await api.get('/sales/orders', { params });
    return response.data;
  },

  async createOrder(orderData) {
    const response = await api.post('/sales/orders', orderData);
    return response.data?.data;
  },

  async updateOrderStatus(id, statusData) {
    const response = await api.patch(`/sales/orders/${id}/status`, statusData);
    return response.data?.data;
  },
};
