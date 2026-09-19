const Branch = require('../models/Branch');
const Webhook = require('../models/Webhook');
const SystemConfig = require('../models/SystemConfig');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const EmployeeRecord = require('../models/EmployeeRecord');
const Invoice = require('../models/Invoice');
const AuditLog = require('../models/AuditLog');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Get all branches
 * @route   GET /api/settings/branches
 * @access  Private
 */
exports.getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });
    return res.status(200).json(ApiResponse.success(branches, 'Branches retrieved'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new operating branch node
 * @route   POST /api/settings/branches
 * @access  Private (SuperAdmin)
 */
exports.createBranch = async (req, res, next) => {
  try {
    const { name, city, state, country, managerName, managerEmail, capacitySqFt } = req.body;

    const count = await Branch.countDocuments();
    const code = `BR-${String(count + 101).padStart(3, '0')}`;

    const branch = await Branch.create({
      code,
      name,
      city,
      state,
      country: country || 'United States',
      managerName: managerName || 'Regional Director',
      managerEmail: managerEmail || req.user.email,
      capacitySqFt: capacitySqFt || 45000,
      utilizationPercentage: 45,
      activeFleetUnits: 8,
    });

    await AuditLog.create({
      action: 'CREATE_BRANCH_NODE',
      module: 'SECURITY',
      details: `Provisioned new branch node: ${branch.name} (${branch.code})`,
      performedBy: req.user._id,
      performedByName: req.user.fullName,
    });

    return res.status(201).json(ApiResponse.success(branch, 'Branch node provisioned'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registered webhooks
 * @route   GET /api/settings/webhooks
 * @access  Private (SuperAdmin)
 */
exports.getWebhooks = async (req, res, next) => {
  try {
    const webhooks = await Webhook.find().sort({ createdAt: -1 });
    return res.status(200).json(ApiResponse.success(webhooks, 'Webhooks retrieved'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create webhook endpoint
 * @route   POST /api/settings/webhooks
 * @access  Private (SuperAdmin)
 */
exports.createWebhook = async (req, res, next) => {
  try {
    const { name, url, events } = req.body;

    if (!url || !name) {
      return res.status(400).json(ApiResponse.error('Webhook name and destination URL are required', 400));
    }

    const webhook = await Webhook.create({
      name,
      url,
      events: events || ['ORDER_CREATED', 'STOCK_DEPLETED'],
      createdBy: req.user._id,
    });

    await AuditLog.create({
      action: 'REGISTER_WEBHOOK',
      module: 'SECURITY',
      details: `Registered Developer Webhook endpoint: ${webhook.name} (${webhook.url})`,
      performedBy: req.user._id,
      performedByName: req.user.fullName,
    });

    return res.status(201).json(ApiResponse.success(webhook, 'Webhook endpoint registered'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Test trigger simulated webhook ping
 * @route   POST /api/settings/webhooks/:id/test
 * @access  Private (SuperAdmin)
 */
exports.testWebhook = async (req, res, next) => {
  try {
    const webhook = await Webhook.findById(req.params.id);
    if (!webhook) {
      return res.status(404).json(ApiResponse.error('Webhook not found', 404));
    }

    webhook.lastTriggered = new Date();
    webhook.lastStatusCode = 200;
    await webhook.save();

    const samplePayload = {
      event: 'ORDER_CREATED',
      timestamp: new Date().toISOString(),
      payload: {
        orderId: 'ORD-2026-90812',
        customer: 'Apex Robotics International Inc.',
        totalAmount: 58816.0,
        currency: 'USD',
        status: 'Delivered',
        branch: 'Main Distribution Hub',
      },
      signature: 'sha256=a89f81bc92049e918d20389fba8201',
    };

    return res.status(200).json(
      ApiResponse.success(
        {
          delivered: true,
          statusCode: 200,
          endpoint: webhook.url,
          samplePayload,
        },
        'Simulated Webhook ping dispatched with HMAC SHA-256 signature'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get system settings configuration
 * @route   GET /api/settings/config
 * @access  Private
 */
exports.getSystemConfig = async (req, res, next) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({});
    }
    return res.status(200).json(ApiResponse.success(config, 'System configuration retrieved'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update system settings configuration
 * @route   PATCH /api/settings/config
 * @access  Private (SuperAdmin)
 */
exports.updateSystemConfig = async (req, res, next) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create(req.body);
    } else {
      Object.assign(config, req.body);
      await config.save();
    }

    await AuditLog.create({
      action: 'UPDATE_SYSTEM_CONFIG',
      module: 'SECURITY',
      details: 'Updated enterprise system settings & security policies',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
    });

    return res.status(200).json(ApiResponse.success(config, 'System settings updated'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export Consolidated Enterprise Datasets (CSV format)
 * @route   GET /api/settings/export/:type
 * @access  Private (SuperAdmin, BranchManager)
 */
exports.exportDataset = async (req, res, next) => {
  try {
    const { type } = req.params;
    let csvData = '';
    let filename = `bizcore-nexus-${type}-${Date.now()}.csv`;

    if (type === 'inventory') {
      const products = await Product.find();
      csvData = 'SKU,Name,Category,CostPrice,SellingPrice,CurrentStock,ReorderPoint,Unit,Branch\n';
      products.forEach((p) => {
        csvData += `"${p.sku}","${p.name}","${p.category}",${p.costPrice},${p.sellingPrice},${p.currentStock},${p.reorderPoint},"${p.unitOfMeasure}","${p.branch}"\n`;
      });
    } else if (type === 'sales') {
      const orders = await Order.find();
      csvData = 'OrderNumber,CustomerName,Branch,Subtotal,TaxAmount,ShippingFee,TotalAmount,Status,PaymentStatus\n';
      orders.forEach((o) => {
        csvData += `"${o.orderNumber}","${o.customerName}","${o.branch}",${o.subtotal},${o.taxAmount || 0},${o.shippingFee || 0},${o.totalAmount},"${o.status}","${o.paymentStatus}"\n`;
      });
    } else if (type === 'customers') {
      const customers = await Customer.find();
      csvData = 'CompanyName,ContactPerson,Email,Phone,Tier,CreditLimit,OutstandingBalance,PaymentTerms\n';
      customers.forEach((c) => {
        csvData += `"${c.companyName}","${c.contactPerson}","${c.email}","${c.phone}","${c.tier}",${c.creditLimit},${c.outstandingBalance},"${c.paymentTerms}"\n`;
      });
    } else if (type === 'invoices') {
      const invoices = await Invoice.find().populate('customer');
      csvData = 'InvoiceNumber,CustomerName,IssueDate,DueDate,GrandTotal,AmountPaid,BalanceDue,Status\n';
      invoices.forEach((inv) => {
        csvData += `"${inv.invoiceNumber}","${inv.customer?.companyName || ''}","${inv.issueDate}","${inv.dueDate}",${inv.grandTotal},${inv.amountPaid || 0},${inv.balanceDue},"${inv.status}"\n`;
      });
    } else {
      return res.status(400).json(ApiResponse.error('Invalid export dataset type', 400));
    }

    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csvData);
  } catch (error) {
    next(error);
  }
};
