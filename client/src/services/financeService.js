import api from './api';

export const financeService = {
  getInvoices: async (params = {}) => {
    const response = await api.get('/finance/invoices', { params });
    return response.data.data;
  },

  createInvoice: async (invoiceData) => {
    const response = await api.post('/finance/invoices', invoiceData);
    return response.data.data;
  },

  recordPayment: async (paymentData) => {
    const response = await api.post('/finance/payments', paymentData);
    return response.data.data;
  },

  getFinanceAnalytics: async () => {
    const response = await api.get('/finance/analytics');
    return response.data.data;
  },
};

export default financeService;
