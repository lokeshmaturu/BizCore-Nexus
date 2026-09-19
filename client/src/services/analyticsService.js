/**
 * Operational Telemetry & AI Forecasting Service
 */

import api from './api';

export const analyticsService = {
  async getDashboardMetrics() {
    const response = await api.get('/analytics/dashboard');
    return response.data?.data;
  },

  async getAIForecast() {
    const response = await api.get('/analytics/ai-forecast');
    return response.data?.data;
  },
};
