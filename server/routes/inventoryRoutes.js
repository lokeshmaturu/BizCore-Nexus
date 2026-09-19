/**
 * Inventory Management Routes
 */

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  transferStock,
  getStockMovements,
  getLowStockAlerts,
} = require('../controllers/inventoryController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

router.use(protect);

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post(
  '/products',
  authorize(ROLES.SUPER_ADMIN, ROLES.INVENTORY_MANAGER, ROLES.BRANCH_MANAGER),
  createProduct
);
router.patch(
  '/products/:id',
  authorize(ROLES.SUPER_ADMIN, ROLES.INVENTORY_MANAGER),
  updateProduct
);
router.delete(
  '/products/:id',
  authorize(ROLES.SUPER_ADMIN),
  deleteProduct
);

router.post(
  '/adjust',
  authorize(ROLES.SUPER_ADMIN, ROLES.INVENTORY_MANAGER),
  adjustStock
);

router.post(
  '/transfers',
  authorize(ROLES.SUPER_ADMIN, ROLES.INVENTORY_MANAGER, ROLES.BRANCH_MANAGER),
  transferStock
);

router.get('/movements', getStockMovements);
router.get('/low-stock', getLowStockAlerts);

module.exports = router;
