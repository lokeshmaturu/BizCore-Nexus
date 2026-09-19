const express = require('express');
const router = express.Router();
const {
  getBranches,
  createBranch,
  getWebhooks,
  createWebhook,
  testWebhook,
  getSystemConfig,
  updateSystemConfig,
  exportDataset,
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

router.use(protect);

// Branches
router
  .route('/branches')
  .get(getBranches)
  .post(authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER), createBranch);

// Webhooks
router
  .route('/webhooks')
  .get(authorize(ROLES.SUPER_ADMIN), getWebhooks)
  .post(authorize(ROLES.SUPER_ADMIN), createWebhook);

router.post('/webhooks/:id/test', authorize(ROLES.SUPER_ADMIN), testWebhook);

// System Settings Config
router
  .route('/config')
  .get(getSystemConfig)
  .patch(authorize(ROLES.SUPER_ADMIN), updateSystemConfig);

// Consolidated Data Exporter
router.get(
  '/export/:type',
  authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.HR_MANAGER),
  exportDataset
);

module.exports = router;
