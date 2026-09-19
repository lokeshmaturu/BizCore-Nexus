import { createSlice } from '@reduxjs/toolkit';

const initialAuditLogs = [
  {
    id: 'AUD-8801',
    action: 'ROLE_PERMISSION_CHECK',
    category: 'SECURITY',
    actor: 'admin@bizcore.com',
    actorRole: 'SuperAdmin',
    resource: 'RBAC Access Engine',
    details: 'Enforced granular level-based route guards on all enterprise routes',
    ipAddress: '192.168.1.104',
    severity: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'AUD-8802',
    action: 'PURCHASE_ORDER_GENERATED',
    category: 'PROCUREMENT',
    actor: 'inventory@bizcore.com',
    actorRole: 'InventoryManager',
    resource: 'PO-2026-901',
    details: 'Autonomous re-order triggered: 500 units Industrial Microcontrollers ($35,000)',
    ipAddress: '10.0.4.12',
    severity: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'AUD-8803',
    action: 'WAYBILL_DISPATCHED',
    category: 'LOGISTICS',
    actor: 'logistics@bizcore.com',
    actorRole: 'InventoryManager',
    resource: 'WB-99021',
    details: 'Dispatched 12 pallets (1,450 kg) to Regional Hub Beta via Unit #402',
    ipAddress: '10.0.4.19',
    severity: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'AUD-8804',
    action: 'INVOICE_PAID_RECONCILED',
    category: 'FINANCE',
    actor: 'finance@bizcore.com',
    actorRole: 'BranchManager',
    resource: 'INV-2026-001',
    details: 'Wire transfer payment of $24,500 reconciled for Apex Retailers Inc.',
    ipAddress: '192.168.1.88',
    severity: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'AUD-8805',
    action: 'WEBHOOK_CONFIG_UPDATED',
    category: 'INTEGRATIONS',
    actor: 'admin@bizcore.com',
    actorRole: 'SuperAdmin',
    resource: 'ERP Gateway Webhook',
    details: 'Updated test payload endpoint and verified ping response (200 OK)',
    ipAddress: '192.168.1.104',
    severity: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 'AUD-8806',
    action: 'SECURITY_LOGIN_ATTEMPT',
    category: 'AUTH',
    actor: 'unknown_probe@external.net',
    actorRole: 'Unauthorized',
    resource: 'Auth Endpoint',
    details: 'Blocked suspicious rapid login attempt via Express RateLimiter DDoS Shield',
    ipAddress: '185.220.101.5',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
  },
];

const initialState = {
  logs: initialAuditLogs,
  filterSeverity: 'ALL',
  searchTerm: '',
  isLoading: false,
};

export const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    addAuditLog: (state, action) => {
      const newLog = {
        id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        severity: 'info',
        ipAddress: '127.0.0.1 (Local Session)',
        ...action.payload,
      };
      state.logs.unshift(newLog);
    },
    setFilterSeverity: (state, action) => {
      state.filterSeverity = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearAuditLogs: (state) => {
      state.logs = [];
    },
  },
});

export const { addAuditLog, setFilterSeverity, setSearchTerm, clearAuditLogs } =
  auditSlice.actions;

export default auditSlice.reducer;
