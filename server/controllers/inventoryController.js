/**
 * Inventory & Warehouse Controller
 * Manages SKU catalog, stock transfers, inventory adjustments, and movement audit ledger.
 */

const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const { ApiResponse } = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../config/constants');

/**
 * @desc    Get all inventory products with filtering and pagination
 * @route   GET /api/inventory/products
 * @access  Private
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      status,
      branch,
      search,
      lowStockOnly,
      page = 1,
      limit = 12,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (branch) query.branch = branch;

    if (lowStockOnly === 'true') {
      query.$expr = { $lte: ['$currentStock', '$reorderPoint'] };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { barcode: searchRegex },
        { category: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return ApiResponse.success(
      res,
      'Inventory catalog retrieved successfully.',
      products,
      HTTP_STATUS.OK,
      {
        total,
        page: pageNum,
        totalPages,
        limit: limitNum,
        hasMore: pageNum < totalPages,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product details
 * @route   GET /api/inventory/products/:id
 * @access  Private
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return ApiResponse.error(res, 'SKU not found in inventory catalog.', HTTP_STATUS.NOT_FOUND);
    }
    return ApiResponse.success(res, 'Product details retrieved.', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new SKU / Product
 * @route   POST /api/inventory/products
 * @access  Private (InventoryManager, BranchManager, SuperAdmin)
 */
const createProduct = async (req, res, next) => {
  try {
    const { sku, name, category, barcode, costPrice, sellingPrice, currentStock, reorderPoint, unitOfMeasure, warehouseBin, branch, description } = req.body;

    const existingSKU = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingSKU) {
      return ApiResponse.error(res, `SKU Code '${sku}' already exists in the catalog.`, HTTP_STATUS.CONFLICT);
    }

    const product = await Product.create({
      sku: sku.toUpperCase(),
      name,
      category,
      barcode,
      costPrice,
      sellingPrice,
      currentStock: currentStock || 0,
      reorderPoint: reorderPoint || 20,
      unitOfMeasure: unitOfMeasure || 'PCS',
      warehouseBin: warehouseBin || 'Zone A - Bin 01',
      branch: branch || req.user.branch || 'Main Distribution Hub',
      description,
    });

    // Log initial stock creation audit
    if (currentStock && currentStock > 0) {
      await StockMovement.create({
        product: product._id,
        sku: product.sku,
        productName: product.name,
        type: 'INBOUND_PURCHASE',
        quantity: currentStock,
        previousStock: 0,
        newStock: currentStock,
        toBranch: product.branch,
        reason: 'Initial SKU inventory provisioning',
        performedBy: req.user.id,
        performedByName: req.user.fullName || 'Inventory Admin',
      });
    }

    return ApiResponse.created(res, 'New SKU catalog entry created.', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product details
 * @route   PATCH /api/inventory/products/:id
 * @access  Private (InventoryManager, SuperAdmin)
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return ApiResponse.error(res, 'SKU to update was not found.', HTTP_STATUS.NOT_FOUND);
    }

    return ApiResponse.success(res, 'Product record updated successfully.', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete SKU
 * @route   DELETE /api/inventory/products/:id
 * @access  Private (SuperAdmin)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return ApiResponse.error(res, 'SKU to delete was not found.', HTTP_STATUS.NOT_FOUND);
    }
    return ApiResponse.success(res, `SKU '${product.sku}' removed from active catalog.`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Execute quick inventory adjustment (count sync/damage)
 * @route   POST /api/inventory/adjust
 * @access  Private (InventoryManager, SuperAdmin)
 */
const adjustStock = async (req, res, next) => {
  try {
    const { productId, newStock, reason, type = 'STOCK_ADJUSTMENT' } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return ApiResponse.error(res, 'Target SKU not found.', HTTP_STATUS.NOT_FOUND);
    }

    const previousStock = product.currentStock;
    const diff = newStock - previousStock;

    product.currentStock = newStock;
    await product.save();

    // Log movement ledger
    const movement = await StockMovement.create({
      product: product._id,
      sku: product.sku,
      productName: product.name,
      type,
      quantity: diff,
      previousStock,
      newStock,
      toBranch: product.branch,
      reason: reason || 'Physical inventory audit adjustment',
      performedBy: req.user.id,
      performedByName: req.user.fullName || 'Inventory Auditor',
    });

    return ApiResponse.success(res, `Stock for ${product.sku} adjusted to ${newStock} ${product.unitOfMeasure}.`, {
      product,
      movement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Inter-branch inventory stock transfer
 * @route   POST /api/inventory/transfers
 * @access  Private (InventoryManager, BranchManager, SuperAdmin)
 */
const transferStock = async (req, res, next) => {
  try {
    const { productId, fromBranch, toBranch, quantity, reason } = req.body;

    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) {
      return ApiResponse.error(res, 'Valid transfer quantity is required.', HTTP_STATUS.BAD_REQUEST);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return ApiResponse.error(res, 'Target SKU not found.', HTTP_STATUS.NOT_FOUND);
    }

    if (product.currentStock < qty) {
      return ApiResponse.error(
        res,
        `Insufficient available stock for transfer. Current on-hand: ${product.currentStock}`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Record transfer log
    const movement = await StockMovement.create({
      product: product._id,
      sku: product.sku,
      productName: product.name,
      type: 'BRANCH_TRANSFER',
      quantity: -qty,
      previousStock: product.currentStock,
      newStock: product.currentStock, // In single-record mode, logs node transit
      fromBranch: fromBranch || product.branch,
      toBranch,
      reason: reason || 'Inter-facility logistics rebalance',
      performedBy: req.user.id,
      performedByName: req.user.fullName || 'Logistics Coordinator',
    });

    return ApiResponse.success(
      res,
      `Transfer manifest generated for ${qty} ${product.unitOfMeasure} of ${product.sku} to ${toBranch}.`,
      movement
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get stock movement audit ledger
 * @route   GET /api/inventory/movements
 * @access  Private
 */
const getStockMovements = async (req, res, next) => {
  try {
    const { sku, type, page = 1, limit = 15 } = req.query;
    const query = {};

    if (sku) query.sku = new RegExp(sku, 'i');
    if (type) query.type = type;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const [movements, total] = await Promise.all([
      StockMovement.find(query).sort('-createdAt').skip(skip).limit(limitNum),
      StockMovement.countDocuments(query),
    ]);

    return ApiResponse.success(res, 'Stock movement ledger retrieved.', movements, HTTP_STATUS.OK, {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get low stock items exceeding reorder thresholds
 * @route   GET /api/inventory/low-stock
 * @access  Private
 */
const getLowStockAlerts = async (req, res, next) => {
  try {
    const lowStockItems = await Product.find({
      $expr: { $lte: ['$currentStock', '$reorderPoint'] },
    }).sort('currentStock');

    return ApiResponse.success(res, 'Low stock threshold items retrieved.', lowStockItems);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  transferStock,
  getStockMovements,
  getLowStockAlerts,
};
