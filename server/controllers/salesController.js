/**
 * Sales & Wholesale CRM Controller
 * Handles B2B corporate customer accounts, quotations, and wholesale orders.
 */

const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const { ApiResponse } = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../config/constants');

/**
 * @desc    Get all B2B customers with search and pagination
 * @route   GET /api/sales/customers
 * @access  Private
 */
const getCustomers = async (req, res, next) => {
  try {
    const { search, tier, status, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const query = {};

    if (tier) query.tier = tier;
    if (status) query.status = status;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { companyName: searchRegex },
        { contactPerson: searchRegex },
        { email: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [customers, total] = await Promise.all([
      Customer.find(query).sort(sort).skip(skip).limit(limitNum),
      Customer.countDocuments(query),
    ]);

    return ApiResponse.success(res, 'B2B Customers list retrieved.', customers, HTTP_STATUS.OK, {
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
 * @desc    Create new wholesale B2B customer
 * @route   POST /api/sales/customers
 * @access  Private (SalesExecutive, BranchManager, SuperAdmin)
 */
const createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    return ApiResponse.created(res, 'New wholesale B2B customer onboarded.', customer);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update B2B customer details & credit terms
 * @route   PATCH /api/sales/customers/:id
 * @access  Private (SalesExecutive, SuperAdmin)
 */
const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      return ApiResponse.error(res, 'Customer not found.', HTTP_STATUS.NOT_FOUND);
    }
    return ApiResponse.success(res, 'Customer account updated.', customer);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all wholesale orders
 * @route   GET /api/sales/orders
 * @access  Private
 */
const getOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const query = {};

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { customerName: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query).sort(sort).skip(skip).limit(limitNum),
      Order.countDocuments(query),
    ]);

    return ApiResponse.success(res, 'Wholesale orders ledger retrieved.', orders, HTTP_STATUS.OK, {
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
 * @desc    Create new wholesale order / quotation with inventory decrement
 * @route   POST /api/sales/orders
 * @access  Private (SalesExecutive, BranchManager, SuperAdmin)
 */
const createOrder = async (req, res, next) => {
  try {
    const { customerId, items, shippingFee = 0, taxAmount = 0, notes, branch } = req.body;

    if (!items || items.length === 0) {
      return ApiResponse.error(res, 'Order must contain at least one line item.', HTTP_STATUS.BAD_REQUEST);
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return ApiResponse.error(res, 'Associated wholesale customer not found.', HTTP_STATUS.NOT_FOUND);
    }

    let subtotal = 0;
    const resolvedItems = [];

    // Verify stock availability and build line items
    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        return ApiResponse.error(res, `Product with ID '${item.productId}' not found.`, HTTP_STATUS.NOT_FOUND);
      }

      const quantity = parseInt(item.quantity, 10);
      const unitPrice = parseFloat(item.unitPrice || product.sellingPrice);
      const discount = parseFloat(item.discountPercentage || 0);
      const itemTotal = quantity * unitPrice * (1 - discount / 100);

      subtotal += itemTotal;

      resolvedItems.push({
        product: product._id,
        sku: product.sku,
        name: product.name,
        quantity,
        unitPrice,
        discountPercentage: discount,
        total: itemTotal,
      });

      // Deduct stock and log outbound movement
      if (product.currentStock >= quantity) {
        const prev = product.currentStock;
        product.currentStock -= quantity;
        await product.save();

        await StockMovement.create({
          product: product._id,
          sku: product.sku,
          productName: product.name,
          type: 'OUTBOUND_SALE',
          quantity: -quantity,
          previousStock: prev,
          newStock: product.currentStock,
          toBranch: customer.companyName,
          reason: `Outbound Wholesale Consignment for ${customer.companyName}`,
          performedBy: req.user.id,
          performedByName: req.user.fullName || 'Sales Executive',
        });
      }
    }

    const totalAmount = subtotal + parseFloat(taxAmount || 0) + parseFloat(shippingFee || 0);

    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = await Order.create({
      orderNumber,
      customer: customer._id,
      customerName: customer.companyName,
      items: resolvedItems,
      subtotal,
      taxAmount: parseFloat(taxAmount || 0),
      shippingFee: parseFloat(shippingFee || 0),
      totalAmount,
      status: 'Processing',
      paymentStatus: 'Unpaid',
      branch: branch || req.user.branch || 'Main Distribution Hub',
      salesExecutive: req.user.id,
      salesExecutiveName: req.user.fullName || 'Wholesale Agent',
      notes,
    });

    // Update customer outstanding balance
    customer.outstandingBalance = (customer.outstandingBalance || 0) + totalAmount;
    await customer.save();

    return ApiResponse.created(res, `Wholesale Order ${orderNumber} created successfully.`, order);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (Approve, Ship, Deliver, Cancel)
 * @route   PATCH /api/sales/orders/:id/status
 * @access  Private (SalesExecutive, BranchManager, SuperAdmin)
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return ApiResponse.error(res, 'Order not found.', HTTP_STATUS.NOT_FOUND);
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();

    return ApiResponse.success(res, `Order ${order.orderNumber} status updated to '${order.status}'.`, order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  getOrders,
  createOrder,
  updateOrderStatus,
};
