const express = require('express');
const router = express.Router();
const {
  getInvoices,
  createInvoice,
  recordPayment,
  getFinanceAnalytics,
} = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

router.use(protect);

router
  .route('/invoices')
  .get(getInvoices)
  .post(
    authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.SALES_EXECUTIVE),
    createInvoice
  );

router.post(
  '/payments',
  authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.SALES_EXECUTIVE),
  recordPayment
);

router.get('/analytics', getFinanceAnalytics);

module.exports = router;
