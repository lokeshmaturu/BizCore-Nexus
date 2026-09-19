import api from './api';

export const logisticsService = {
  getShipments: async (params = {}) => {
    const response = await api.get('/logistics/shipments', { params });
    return response.data.data;
  },

  createShipment: async (shipmentData) => {
    const response = await api.post('/logistics/shipments', shipmentData);
    return response.data.data;
  },

  updateShipmentStatus: async (id, statusData) => {
    const response = await api.patch(`/logistics/shipments/${id}/status`, statusData);
    return response.data.data;
  },

  getCarriers: async () => {
    const response = await api.get('/logistics/carriers');
    return response.data.data;
  },
};

export default logisticsService;
