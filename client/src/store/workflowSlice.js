import { createSlice } from '@reduxjs/toolkit';

const initialRecipes = [
  {
    id: 'RECIPE-01',
    name: 'Autonomous High-Demand Buffer Replenishment',
    category: 'INVENTORY & PROCUREMENT',
    description: 'When SKU stock buffer drops below 20 units, auto-generate PO to highest rated OEM supplier.',
    trigger: 'SKU Stock < Buffer Threshold',
    action: 'Generate Purchase Order Draft ($25,000 max) + Slack Ops Ping',
    status: 'ACTIVE',
    runCount: 42,
    lastRun: '12 mins ago',
    badgeColor: 'emerald',
  },
  {
    id: 'RECIPE-02',
    name: 'Overdue Invoice Credit Freeze & AR Escalation',
    category: 'FINANCE & CRM',
    description: 'When invoice is overdue > 15 days, lock client credit line and dispatch SMS/Email remittance notice.',
    trigger: 'Invoice Due Date Exceeded > 15 Days',
    action: 'Freeze Credit Line + Dispatch Automated Remittance Notice',
    status: 'ACTIVE',
    runCount: 18,
    lastRun: '2 hours ago',
    badgeColor: 'amber',
  },
  {
    id: 'RECIPE-03',
    name: 'High-Value Wholesale Logistics Auto-Dispatch',
    category: 'SALES & LOGISTICS',
    description: 'When wholesale order is approved with value > $40,000, immediately reserve priority carrier and create Waybill manifest.',
    trigger: 'Wholesale Order Confirmed > $40k',
    action: 'Create Waybill Manifest + Assign Priority Fleet Driver Unit',
    status: 'ACTIVE',
    runCount: 65,
    lastRun: '35 mins ago',
    badgeColor: 'blue',
  },
  {
    id: 'RECIPE-04',
    name: 'Low-Margin Quote Protection Interceptor',
    category: 'SALES & GOVERNANCE',
    description: 'Intercepts sales quote proposals where gross margin drops below 18% and requires Branch Manager approval.',
    trigger: 'Deal Gross Margin < 18%',
    action: 'Lock Deal + Send Escalation Request to Branch Manager',
    status: 'ACTIVE',
    runCount: 9,
    lastRun: '1 day ago',
    badgeColor: 'rose',
  },
  {
    id: 'RECIPE-05',
    name: 'Weekly Autonomous Multi-Branch PDF Briefing',
    category: 'EXECUTIVE INTELLIGENCE',
    description: 'Compiles full P&L, inventory valuation, and on-time fleet metrics into an executive PDF every Monday at 08:00 AM.',
    trigger: 'Cron Schedule (Every Monday 08:00 UTC)',
    action: 'Generate Consolidated PDF Report + Email SuperAdmin & Stakeholders',
    status: 'ACTIVE',
    runCount: 24,
    lastRun: '5 days ago',
    badgeColor: 'purple',
  },
];

const initialForecastData = {
  projectedRevenueQuarter: 1420000,
  growthPercentage: 18.4,
  stockoutRiskSKUs: [
    { sku: 'SKU-RAM-3200', name: 'High-Density RAM Modules 32GB', stockoutDays: 3, riskLevel: 'CRITICAL' },
    { sku: 'SKU-NVME-2TB', name: 'PCIe Gen4 NVMe SSD 2TB', stockoutDays: 7, riskLevel: 'HIGH' },
    { sku: 'SKU-GPU-4080', name: 'Industrial GPU Accelerator 16GB', stockoutDays: 14, riskLevel: 'MODERATE' },
  ],
  monthlyTrend: [
    { month: 'Apr', revenue: 98000, projected: 95000 },
    { month: 'May', revenue: 112000, projected: 110000 },
    { month: 'Jun', revenue: 128000, projected: 125000 },
    { month: 'Jul', revenue: 145000, projected: 140000 },
    { month: 'Aug', revenue: 162000, projected: 158000 },
    { month: 'Sep', revenue: 185000, projected: 180000 },
  ],
};

const initialState = {
  recipes: initialRecipes,
  forecast: initialForecastData,
  isCommandPaletteOpen: false,
};

export const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    toggleRecipeStatus: (state, action) => {
      const id = action.payload;
      const recipe = state.recipes.find((r) => r.id === id);
      if (recipe) {
        recipe.status = recipe.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      }
    },
    triggerRecipeExecution: (state, action) => {
      const id = action.payload;
      const recipe = state.recipes.find((r) => r.id === id);
      if (recipe) {
        recipe.runCount += 1;
        recipe.lastRun = 'Just now';
      }
    },
    toggleCommandPalette: (state) => {
      state.isCommandPaletteOpen = !state.isCommandPaletteOpen;
    },
    setCommandPaletteOpen: (state, action) => {
      state.isCommandPaletteOpen = action.payload;
    },
  },
});

export const {
  toggleRecipeStatus,
  triggerRecipeExecution,
  toggleCommandPalette,
  setCommandPaletteOpen,
} = workflowSlice.actions;

export default workflowSlice.reducer;
