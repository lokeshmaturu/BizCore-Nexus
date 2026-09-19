/**
 * Sales & Wholesale CRM Routes
 */

const express = require('express');
const router = express.Router();
const {
  getCustomers,
  createCustomer,
  updateCustomer,
  getOrders,
  createOrder,
  updateOrderStatus,
} = require('../controllers/salesController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

router.use(protect);

// Customer Management
router.get('/customers', getCustomers);
router.post(
  '/customers',
  authorize(ROLES.SUPER_ADMIN, ROLES.SALES_EXECUTIVE, ROLES.BRANCH_MANAGER),
  createCustomer
);
router.patch(
  '/customers/:id',
  authorize(ROLES.SUPER_ADMIN, ROLES.SALES_EXECUTIVE),
  updateCustomer
);

// Orders & Quotations
router.get('/orders', getOrders);
router.post(
  '/orders',
  authorize(ROLES.SUPER_ADMIN, ROLES.SALES_EXECUTIVE, ROLES.BRANCH_MANAGER),
  createOrder
);
router.patch(
  '/orders/:id/status',
  authorize(ROLES.SUPER_ADMIN, ROLES.SALES_EXECUTIVE, ROLES.BRANCH_MANAGER),
  updateOrderStatus
);

module.exports = router;
