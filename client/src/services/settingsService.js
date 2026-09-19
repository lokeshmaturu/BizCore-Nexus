import api from './api';

export const settingsService = {
  getBranches: async () => {
    const response = await api.get('/settings/branches');
    return response.data.data;
  },

  createBranch: async (branchData) => {
    const response = await api.post('/settings/branches', branchData);
    return response.data.data;
  },

  getWebhooks: async () => {
    const response = await api.get('/settings/webhooks');
    return response.data.data;
  },

  createWebhook: async (webhookData) => {
    const response = await api.post('/settings/webhooks', webhookData);
    return response.data.data;
  },

  testWebhook: async (id) => {
    const response = await api.post(`/settings/webhooks/${id}/test`);
    return response.data.data;
  },

  getSystemConfig: async () => {
    const response = await api.get('/settings/config');
    return response.data.data;
  },

  updateSystemConfig: async (configData) => {
    const response = await api.patch('/settings/config', configData);
    return response.data.data;
  },

  exportDatasetUrl: (type) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${baseURL}/settings/export/${type}`;
  },
};

export default settingsService;
