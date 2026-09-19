/**
 * Real-Time WebSocket & Event Simulation Engine (Phase 5)
 * Dispatches simulated live multi-user and telemetry events across Redux slices.
 */

import { addNotification } from '../store/notificationSlice';
import { addAuditLog } from '../store/auditSlice';
import { addPurchaseOrder } from '../store/procurementSlice';
import { addDispatch } from '../store/logisticsSlice';
import { updateInvoiceStatus } from '../store/financeSlice';

export const SIMULATION_EVENTS = [
  {
    id: 'EVENT_WHOLESALE_ORDER',
    title: 'Incoming $48,000 Wholesale PO',
    category: 'SALES',
    description: 'Simulates a real-time incoming bulk purchase order from an enterprise client.',
    trigger: (dispatch, user) => {
      dispatch(
        addNotification({
          title: '🚨 New High-Value Wholesale Order',
          message: 'Horizon Tech Corp submitted bulk order for 250 units ($48,500). Immediate allocation required.',
          type: 'sales',
        })
      );
      dispatch(
        addAuditLog({
          action: 'BULK_ORDER_PLACED',
          category: 'SALES',
          actor: 'edi-gateway@horizontech.com',
          actorRole: 'Client EDI',
          resource: 'ORD-2026-8812',
          details: 'Real-time B2B wholesale order placed for $48,500 across 250 SKUs.',
          severity: 'info',
        })
      );
    },
  },
  {
    id: 'EVENT_LOW_STOCK_ALARM',
    title: 'Warehouse Low-Stock Alarm & Auto-PO',
    category: 'INVENTORY',
    description: 'Simulates SKU stock dropping below critical buffer threshold and triggering auto-reorder.',
    trigger: (dispatch, user) => {
      const newPO = {
        id: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
        vendor: 'Silicon Precision Logistics',
        item: 'High-Density RAM Modules 32GB',
        sku: 'SKU-RAM-3200',
        quantity: 300,
        totalAmount: 21000,
        status: 'Pending Approval',
        priority: 'High',
        expectedDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      };

      dispatch(addPurchaseOrder(newPO));
      dispatch(
        addNotification({
          title: '⚠️ Critical Stock Buffer Alarm',
          message: 'SKU-RAM-3200 dropped to 14 units. Autonomous PO draft created ($21,000).',
          type: 'inventory',
        })
      );
      dispatch(
        addAuditLog({
          action: 'INVENTORY_STOCK_DEPLETION',
          category: 'INVENTORY',
          actor: 'system-telemetry@nexus.internal',
          actorRole: 'AI Agent',
          resource: 'SKU-RAM-3200',
          details: 'Stock depleted below minimum buffer (14 units). Created PO-Draft for 300 units.',
          severity: 'warning',
        })
      );
    },
  },
  {
    id: 'EVENT_WAYBILL_DELIVERED',
    title: 'Live Fleet Delivery Waybill Confirmation',
    category: 'LOGISTICS',
    description: 'Simulates a fleet delivery driver signing off on a completed regional shipment.',
    trigger: (dispatch, user) => {
      dispatch(
        addNotification({
          title: '📦 Waybill Delivery Confirmed',
          message: 'Waybill WB-99021 delivered safely to Beta Regional Hub. Customer sign-off archived.',
          type: 'logistics',
        })
      );
      dispatch(
        addAuditLog({
          action: 'WAYBILL_DELIVERY_CONFIRMED',
          category: 'LOGISTICS',
          actor: 'driver_unit402@nexusfleet.com',
          actorRole: 'Fleet Driver',
          resource: 'WB-99021',
          details: '12 pallets verified and signed by Receiving Bay Manager at Regional Hub Beta.',
          severity: 'info',
        })
      );
    },
  },
  {
    id: 'EVENT_PAYMENT_RECONCILED',
    title: 'Wire Transfer Payment Reconciled',
    category: 'FINANCE',
    description: 'Simulates an automated bank feed matching a pending $24,500 invoice.',
    trigger: (dispatch, user) => {
      dispatch(updateInvoiceStatus({ id: 'INV-2026-001', status: 'Paid' }));
      dispatch(
        addNotification({
          title: '💳 Payment Reconciled ($24,500)',
          message: 'Fedwire transfer received for Invoice INV-2026-001. AR ledger updated.',
          type: 'finance',
        })
      );
      dispatch(
        addAuditLog({
          action: 'PAYMENT_WIRE_RECONCILED',
          category: 'FINANCE',
          actor: 'banking-gateway@treasury.nexus',
          actorRole: 'Banking API',
          resource: 'INV-2026-001',
          details: 'Matched Fedwire reference REF-994102 for $24,500. Marked invoice as Paid.',
          severity: 'info',
        })
      );
    },
  },
];
