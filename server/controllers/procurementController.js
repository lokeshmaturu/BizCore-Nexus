const Supplier = require('../models/Supplier');
const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const AuditLog = require('../models/AuditLog');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Get all suppliers
 * @route   GET /api/procurement/suppliers
 * @access  Private (SuperAdmin, BranchManager, InventoryManager)
 */
exports.getSuppliers = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Supplier.countDocuments(query);
    const suppliers = await Supplier.find(query)
      .sort({ rating: -1, name: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

    return res.status(200).json(
      ApiResponse.success(
        {
          suppliers,
          pagination: {
            total,
            page: parseInt(page, 10),
            pages: Math.ceil(total / limit),
          },
        },
        'Suppliers retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new supplier
 * @route   POST /api/procurement/suppliers
 * @access  Private (SuperAdmin, InventoryManager)
 */
exports.createSupplier = async (req, res, next) => {
  try {
    const { name, category, contactPerson, email, phone, address, leadTimeDays, paymentTerms, rating, notes } = req.body;

    const count = await Supplier.countDocuments();
    const code = `SUP-${String(count + 101).padStart(4, '0')}`;

    const supplier = await Supplier.create({
      code,
      name,
      category,
      contactPerson,
      email,
      phone,
      address,
      leadTimeDays: leadTimeDays || 7,
      paymentTerms: paymentTerms || 'Net 30',
      rating: rating || 4.5,
      notes,
    });

    await AuditLog.create({
      action: 'CREATE_SUPPLIER',
      module: 'PROCUREMENT',
      details: `Onboarded new supplier: ${supplier.name} (${supplier.code})`,
      performedBy: req.user._id,
      performedByName: req.user.fullName,
    });

    return res.status(201).json(ApiResponse.success(supplier, 'Supplier onboarded successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all purchase orders
 * @route   GET /api/procurement/orders
 * @access  Private (SuperAdmin, BranchManager, InventoryManager)
 */
exports.getPurchaseOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.poNumber = { $regex: search, $options: 'i' };
    }

    const total = await PurchaseOrder.countDocuments(query);
    const orders = await PurchaseOrder.find(query)
      .populate('supplier', 'name code category rating leadTimeDays email')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

    return res.status(200).json(
      ApiResponse.success(
        {
          orders,
          pagination: {
            total,
            page: parseInt(page, 10),
            pages: Math.ceil(total / limit),
          },
        },
        'Purchase orders retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create manual Purchase Order
 * @route   POST /api/procurement/orders
 * @access  Private (SuperAdmin, InventoryManager)
 */
exports.createPurchaseOrder = async (req, res, next) => {
  try {
    const { supplierId, items, destinationBranch, expectedDeliveryDays, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json(ApiResponse.error('Items array cannot be empty', 400));
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json(ApiResponse.error('Supplier not found', 404));
    }

    const count = await PurchaseOrder.countDocuments();
    const poNumber = `PO-${new Date().getFullYear()}-${String(count + 1001).padStart(5, '0')}`;

    const lineItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const qty = parseInt(item.quantity, 10);
      const unitCost = Number(item.unitCost || product.pricing.costPrice);
      const lineTotal = qty * unitCost;

      lineItems.push({
        product: product._id,
        sku: product.sku,
        name: product.name,
        unitCost,
        quantity: qty,
        total: lineTotal,
      });

      totalAmount += lineTotal;
    }

    const leadTime = expectedDeliveryDays || supplier.leadTimeDays || 7;
    const expectedDeliveryDate = new Date(Date.now() + leadTime * 24 * 60 * 60 * 1000);

    const po = await PurchaseOrder.create({
      poNumber,
      supplier: supplier._id,
      destinationBranch: destinationBranch || 'Main Distribution Hub',
      items: lineItems,
      totalAmount,
      status: 'Issued',
      expectedDeliveryDate,
      notes,
      createdBy: req.user._id,
    });

    await AuditLog.create({
      action: 'ISSUE_PURCHASE_ORDER',
      module: 'PROCUREMENT',
      details: `Issued Purchase Order ${po.poNumber} to ${supplier.name} for $${totalAmount.toLocaleString()}`,
      performedBy: req.user._id,
      performedByName: req.user.fullName,
    });

    const populated = await PurchaseOrder.findById(po._id).populate('supplier');

    return res.status(201).json(ApiResponse.success(populated, 'Purchase order issued successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    AI 1-Click Automated Reorder Engine
 * @route   POST /api/procurement/auto-reorder
 * @access  Private (SuperAdmin, InventoryManager)
 */
exports.generateAutoReorder = async (req, res, next) => {
  try {
    // Find all products where current stock <= reorder point
    const criticalProducts = await Product.find({
      $expr: { $lte: ['$stock.currentStock', '$stock.minReorderPoint'] },
      isActive: true,
    });

    if (criticalProducts.length === 0) {
      return res.status(200).json(
        ApiResponse.success(
          { createdOrders: [], message: 'All warehouse stock levels are healthy! No replenishment needed.' },
          'Stock levels optimal'
        )
      );
    }

    // Get active suppliers
    const suppliers = await Supplier.find({ isActive: true });
    if (suppliers.length === 0) {
      return res.status(400).json(ApiResponse.error('No active suppliers registered in system', 400));
    }

    // Group items by best matching supplier category or fallback to top rated
    const supplierMap = {};
    for (const prod of criticalProducts) {
      // Find matching category supplier or top rated
      let matchedSupplier = suppliers.find((s) => s.category.toLowerCase().includes(prod.category.toLowerCase())) || suppliers[0];

      if (!supplierMap[matchedSupplier._id]) {
        supplierMap[matchedSupplier._id] = {
          supplier: matchedSupplier,
          items: [],
        };
      }

      // Calculate economic reorder quantity (e.g. maxStock - currentStock, or 3x minReorderPoint)
      const shortfall = (prod.stock.maxStock || prod.stock.minReorderPoint * 3) - prod.stock.currentStock;
      const reorderQty = Math.max(shortfall, 25);
      const unitCost = prod.pricing.costPrice || 50;

      supplierMap[matchedSupplier._id].items.push({
        product: prod._id,
        sku: prod.sku,
        name: prod.name,
        unitCost,
        quantity: reorderQty,
        total: reorderQty * unitCost,
      });
    }

    const createdPOs = [];
    let counter = await PurchaseOrder.countDocuments();

    for (const suppId in supplierMap) {
      const group = supplierMap[suppId];
      if (group.items.length === 0) continue;

      counter++;
      const poNumber = `PO-${new Date().getFullYear()}-${String(counter + 1000).padStart(5, '0')}`;
      const totalAmount = group.items.reduce((acc, item) => acc + item.total, 0);
      const expectedDeliveryDate = new Date(Date.now() + (group.supplier.leadTimeDays || 7) * 24 * 60 * 60 * 1000);

      const po = await PurchaseOrder.create({
        poNumber,
        supplier: group.supplier._id,
        destinationBranch: 'Main Distribution Hub',
        items: group.items,
        totalAmount,
        status: 'Issued',
        isAutoGenerated: true,
        expectedDeliveryDate,
        notes: `AI Automated Replenishment triggered for ${group.items.length} low-stock SKUs.`,
        createdBy: req.user._id,
      });

      const populated = await PurchaseOrder.findById(po._id).populate('supplier');
      createdPOs.push(populated);
    }

    await AuditLog.create({
      action: 'AI_AUTO_REPLENISHMENT',
      module: 'PROCUREMENT',
      details: `AI Auto-Reorder generated ${createdPOs.length} Purchase Orders for ${criticalProducts.length} depleted SKUs`,
      performedBy: req.user._id,
      performedByName: req.user.fullName,
    });

    return res.status(201).json(
      ApiResponse.success(
        {
          createdOrders: createdPOs,
          affectedSkusCount: criticalProducts.length,
          totalValue: createdPOs.reduce((acc, po) => acc + po.totalAmount, 0),
        },
        `Successfully generated ${createdPOs.length} replenishment Purchase Orders via AI Replenishment Engine`
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Purchase Order status (e.g. Mark Received and increment inventory)
 * @route   PATCH /api/procurement/orders/:id/status
 * @access  Private (SuperAdmin, InventoryManager)
 */
exports.updatePOStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const po = await PurchaseOrder.findById(req.params.id);

    if (!po) {
      return res.status(404).json(ApiResponse.error('Purchase order not found', 404));
    }

    const previousStatus = po.status;
    po.status = status;

    // If marked as Received, automatically increment stock for each product SKU!
    if (status === 'Received' && previousStatus !== 'Received') {
      po.receivedDate = new Date();

      for (const item of po.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const previousStock = product.stock.currentStock;
          product.stock.currentStock += item.quantity;
          if (product.stock.currentStock > product.stock.minReorderPoint) {
            product.status = 'In Stock';
          }
          await product.save();

          await StockMovement.create({
            product: product._id,
            sku: product.sku,
            movementType: 'INBOUND_PURCHASE',
            quantity: item.quantity,
            previousStock,
            newStock: product.stock.currentStock,
            destinationBranch: po.destinationBranch,
            referenceNumber: po.poNumber,
            unitCost: item.unitCost,
            totalValue: item.total,
            performedBy: req.user._id,
            performedByName: req.user.fullName,
            notes: `Received from supplier via PO ${po.poNumber}`,
          });
        }
      }
    }

    await po.save();
    const updated = await PurchaseOrder.findById(po._id).populate('supplier').populate('createdBy');

    await AuditLog.create({
      action: 'UPDATE_PO_STATUS',
      module: 'PROCUREMENT',
      details: `Updated ${po.poNumber} status to ${status}`,
      performedBy: req.user._id,
      performedByName: req.user.fullName,
    });

    return res.status(200).json(ApiResponse.success(updated, `Purchase order updated to ${status}`));
  } catch (error) {
    next(error);
  }
};
