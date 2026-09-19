import { createSlice } from '@reduxjs/toolkit';

const initialSystemMetrics = {
  cpuUsage: 14.2,
  memoryUsageMb: 412,
  maxMemoryMb: 2048,
  avgLatencyMs: 18.4,
  dbPoolActive: 12,
  dbPoolMax: 50,
  cacheHitRatio: 96.8,
  uptimeSeconds: 98420,
  serverEnvironment: 'Production Atlas Cluster (v7.0.12)',
  clusterRegion: 'aws-us-east-1 (N. Virginia)',
  totalRequestsToday: 148920,
  errorRate: 0.01,
  activeSessions: [
    { id: 'sess-1', user: 'admin@bizcore.com', role: 'SuperAdmin', branch: 'Main HQ', ip: '192.168.1.104', lastActive: 'Active now' },
    { id: 'sess-2', user: 'manager.west@bizcore.com', role: 'BranchManager', branch: 'West Depot', ip: '10.0.4.12', lastActive: '1 min ago' },
    { id: 'sess-3', user: 'inventory@bizcore.com', role: 'InventoryManager', branch: 'Central Warehouse', ip: '10.0.4.19', lastActive: 'Active now' },
    { id: 'sess-4', user: 'sales.exec@bizcore.com', role: 'SalesExecutive', branch: 'Main HQ', ip: '192.168.1.88', lastActive: '3 mins ago' },
  ],
  apiEndpoints: [
    { endpoint: 'POST /api/auth/login', avgResponseMs: 42, status: '200 OK', load: 'High' },
    { endpoint: 'GET /api/inventory', avgResponseMs: 16, status: '200 OK', load: 'Heavy' },
    { endpoint: 'GET /api/analytics/dashboard', avgResponseMs: 24, status: '200 OK', load: 'Heavy' },
    { endpoint: 'POST /api/sales/orders', avgResponseMs: 38, status: '200 OK', load: 'Moderate' },
    { endpoint: 'POST /api/procurement/auto-reorder', avgResponseMs: 85, status: '200 OK', load: 'Moderate' },
  ],
};

const initialState = {
  metrics: initialSystemMetrics,
  isOptimizing: false,
  lastOptimized: 'Never',
};

export const telemetrySlice = createSlice({
  name: 'telemetry',
  initialState,
  reducers: {
    refreshTelemetryMetrics: (state) => {
      // Simulate minor live fluctuating telemetry
      state.metrics.cpuUsage = +(12 + Math.random() * 8).toFixed(1);
      state.metrics.avgLatencyMs = +(14 + Math.random() * 10).toFixed(1);
      state.metrics.dbPoolActive = Math.floor(10 + Math.random() * 8);
      state.metrics.totalRequestsToday += Math.floor(1 + Math.random() * 5);
    },
    runDatabaseOptimization: (state) => {
      state.isOptimizing = false;
      state.lastOptimized = new Date().toLocaleTimeString();
      state.metrics.cacheHitRatio = 99.2;
      state.metrics.avgLatencyMs = 12.1;
    },
  },
});

export const { refreshTelemetryMetrics, runDatabaseOptimization } = telemetrySlice.actions;
export default telemetrySlice.reducer;
