import api from './api';

export const aiService = {
  queryCopilot: async (prompt) => {
    const response = await api.post('/ai/copilot', { prompt });
    return response.data.data;
  },

  getRecommendations: async () => {
    const response = await api.get('/ai/recommendations');
    return response.data.data;
  },
};

export default aiService;
