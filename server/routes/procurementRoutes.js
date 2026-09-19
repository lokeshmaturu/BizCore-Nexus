const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  createSupplier,
  getPurchaseOrders,
  createPurchaseOrder,
  generateAutoReorder,
  updatePOStatus,
} = require('../controllers/procurementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

// All procurement routes require authentication
router.use(protect);

// Suppliers
router
  .route('/suppliers')
  .get(getSuppliers)
  .post(
    authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.INVENTORY_MANAGER),
    createSupplier
  );

// Purchase Orders
router
  .route('/orders')
  .get(getPurchaseOrders)
  .post(
    authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.INVENTORY_MANAGER),
    createPurchaseOrder
  );

// 1-Click AI Automated Reorder
router.post(
  '/auto-reorder',
  authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.INVENTORY_MANAGER),
  generateAutoReorder
);

// PO Status updates
router.patch(
  '/orders/:id/status',
  authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.INVENTORY_MANAGER),
  updatePOStatus
);

module.exports = router;
