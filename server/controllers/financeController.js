const Invoice = require('../models/Invoice');
const PaymentTransaction = require('../models/PaymentTransaction');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const AuditLog = require('../models/AuditLog');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Get all invoices with payment status and search
 * @route   GET /api/finance/invoices
 * @access  Private (SuperAdmin, BranchManager, SalesExecutive)
 */
exports.getInvoices = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Invoice.countDocuments(query);
    const invoices = await Invoice.find(query)
      .populate('order', 'orderNumber status createdAt')
      .populate('customer', 'companyName contactPerson email phone outstandingBalance creditLimit')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

    return res.status(200).json(
      ApiResponse.success(
        {
          invoices,
          pagination: {
            total,
            page: parseInt(page, 10),
            pages: Math.ceil(total / limit),
          },
        },
        'Invoices retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate Invoice from existing B2B Order
 * @route   POST /api/finance/invoices
 * @access  Private (SuperAdmin, BranchManager, SalesExecutive)
 */
exports.createInvoice = async (req, res, next) => {
  try {
    const { orderId, dueDateDays = 30, paymentTerms = 'Net 30', notes } = req.body;

    const order = await Order.findById(orderId).populate('customer');
    if (!order) {
      return res.status(404).json(ApiResponse.error('Order not found', 404));
    }

    // Check if invoice already exists for this order
    const existing = await Invoice.findOne({ order: order._id });
    if (existing) {
      return res.status(400).json(ApiResponse.error(`Invoice ${existing.invoiceNumber} already exists for this order`, 400));
    }

    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 10001).padStart(6, '0')}`;
    const dueDate = new Date(Date.now() + dueDateDays * 24 * 60 * 60 * 1000);

    const invoice = await Invoice.create({
      invoiceNumber,
      order: order._id,
      customer: order.customer._id,
      dueDate,
      items: order.lineItems,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount || 0,
      shippingFee: order.shippingFee || 0,
      grandTotal: order.grandTotal,
      amountPaid: 0,
      balanceDue: order.grandTotal,
      status: 'Unpaid',
      paymentTerms,
      notes,
      createdBy: req.user._id,
    });

    // Update customer outstanding balance
    const customer = await Customer.findById(order.customer._id);
    if (customer) {
      customer.outstandingBalance = (customer.outstandingBalance || 0) + invoice.grandTotal;
      await customer.save();
    }

    await AuditLog.create({
      action: 'GENERATE_INVOICE',
      module: 'FINANCE',
      details: `Generated Invoice ${invoice.invoiceNumber} for $${invoice.grandTotal.toLocaleString()} (Order: ${order.orderNumber})`,
      performedBy: req.user._id,
      performedByName: req.user.fullName,
    });

    const populated = await Invoice.findById(invoice._id)
      .populate('order')
      .populate('customer');

    return res.status(201).json(ApiResponse.success(populated, 'Invoice generated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Record Payment Transaction against an Invoice
 * @route   POST /api/finance/payments
 * @access  Private (SuperAdmin, BranchManager, SalesExecutive)
 */
exports.recordPayment = async (req, res, next) => {
  try {
    const { invoiceId, amount, paymentMethod, referenceNumber, notes } = req.body;

    const invoice = await Invoice.findById(invoiceId).populate('customer').populate('order');
    if (!invoice) {
      return res.status(404).json(ApiResponse.error('Invoice not found', 404));
    }

    const payAmount = Number(amount);
    if (!payAmount || payAmount <= 0) {
      return res.status(400).json(ApiResponse.error('Payment amount must be greater than 0', 400));
    }

    const count = await PaymentTransaction.countDocuments();
    const transactionId = `TXN-${new Date().getFullYear()}-${String(count + 10001).padStart(6, '0')}`;

    const transaction = await PaymentTransaction.create({
      transactionId,
      invoice: invoice._id,
      customer: invoice.customer._id,
      amount: payAmount,
      paymentMethod: paymentMethod || 'Bank Wire',
      referenceNumber: referenceNumber || `WIRE-REF-${Date.now().toString().slice(-6)}`,
      status: 'Success',
      notes,
      processedBy: req.user._id,
    });

    // Update Invoice balances
    invoice.amountPaid = (invoice.amountPaid || 0) + payAmount;
    invoice.balanceDue = Math.max(0, invoice.grandTotal - invoice.amountPaid);

    if (invoice.balanceDue === 0) {
      invoice.status = 'Paid';
      if (invoice.order) {
        const order = await Order.findById(invoice.order._id || invoice.order);
        if (order) {
          order.paymentStatus = 'Paid';
          await order.save();
        }
      }
    } else {
      invoice.status = 'Partially Paid';
    }

    await invoice.save();

    // Deduct from customer outstanding balance
    const customer = await Customer.findById(invoice.customer._id);
    if (customer) {
      customer.outstandingBalance = Math.max(0, (customer.outstandingBalance || 0) - payAmount);
      await customer.save();
    }

    await AuditLog.create({
      action: 'RECORD_PAYMENT',
      module: 'FINANCE',
      details: `Processed payment ${transaction.transactionId} of $${payAmount.toLocaleString()} for Invoice ${invoice.invoiceNumber}`,
      performedBy: req.user._id,
      performedByName: req.user.fullName,
    });

    return res.status(201).json(
      ApiResponse.success(
        {
          transaction,
          updatedInvoice: invoice,
        },
        'Payment recorded and ledger balanced successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Financial Analytics & Accounts Receivable Aging
 * @route   GET /api/finance/analytics
 * @access  Private
 */
exports.getFinanceAnalytics = async (req, res, next) => {
  try {
    const invoices = await Invoice.find();

    let totalInvoiced = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;
    let overdueTotal = 0;

    const aging = {
      current: 0,     // 0-30 days
      thirtyToSixty: 0, // 31-60 days
      sixtyToNinety: 0, // 61-90 days
      overNinety: 0,   // 90+ days
    };

    const now = new Date();

    invoices.forEach((inv) => {
      totalInvoiced += inv.grandTotal;
      totalCollected += inv.amountPaid || 0;
      totalOutstanding += inv.balanceDue || 0;

      if (inv.balanceDue > 0) {
        const diffDays = Math.floor((now - new Date(inv.dueDate)) / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
          aging.current += inv.balanceDue;
        } else if (diffDays <= 30) {
          aging.thirtyToSixty += inv.balanceDue;
          overdueTotal += inv.balanceDue;
        } else if (diffDays <= 60) {
          aging.sixtyToNinety += inv.balanceDue;
          overdueTotal += inv.balanceDue;
        } else {
          aging.overNinety += inv.balanceDue;
          overdueTotal += inv.balanceDue;
        }
      }
    });

    const recentTransactions = await PaymentTransaction.find()
      .populate('customer', 'companyName')
      .populate('invoice', 'invoiceNumber')
      .sort({ createdAt: -1 })
      .limit(6);

    return res.status(200).json(
      ApiResponse.success(
        {
          summary: {
            totalInvoiced,
            totalCollected,
            totalOutstanding,
            overdueTotal,
            collectionRate: totalInvoiced > 0 ? `${((totalCollected / totalInvoiced) * 100).toFixed(1)}%` : '100%',
          },
          aging,
          recentTransactions,
        },
        'Financial intelligence summary retrieved'
      )
    );
  } catch (error) {
    next(error);
  }
};
