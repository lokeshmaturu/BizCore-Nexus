const express = require('express');
const router = express.Router();
const {
  getShipments,
  createShipment,
  updateShipmentStatus,
  getCarriersOverview,
} = require('../controllers/logisticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

router.use(protect);

router
  .route('/shipments')
  .get(getShipments)
  .post(
    authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.INVENTORY_MANAGER, ROLES.SALES_EXECUTIVE),
    createShipment
  );

router.patch(
  '/shipments/:id/status',
  authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.INVENTORY_MANAGER),
  updateShipmentStatus
);

router.get('/carriers', getCarriersOverview);

module.exports = router;
