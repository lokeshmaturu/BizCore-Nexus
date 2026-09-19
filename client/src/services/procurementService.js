import api from './api';

export const procurementService = {
  getSuppliers: async (params = {}) => {
    const response = await api.get('/procurement/suppliers', { params });
    return response.data.data;
  },

  createSupplier: async (supplierData) => {
    const response = await api.post('/procurement/suppliers', supplierData);
    return response.data.data;
  },

  getPurchaseOrders: async (params = {}) => {
    const response = await api.get('/procurement/orders', { params });
    return response.data.data;
  },

  createPurchaseOrder: async (orderData) => {
    const response = await api.post('/procurement/orders', orderData);
    return response.data.data;
  },

  triggerAutoReorder: async () => {
    const response = await api.post('/procurement/auto-reorder');
    return response.data.data;
  },

  updatePOStatus: async (id, status) => {
    const response = await api.patch(`/procurement/orders/${id}/status`, { status });
    return response.data.data;
  },
};

export default procurementService;
