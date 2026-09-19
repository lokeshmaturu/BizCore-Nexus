/**
 * Wholesale Order & Requisition Model
 * Multi-line item wholesale contracts with inventory reservation, taxes, and status pipeline.
 */

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, 'Unit price cannot be negative'],
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer reference is required'],
      index: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        'Draft',
        'Quotation',
        'Approved',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
      ],
      default: 'Processing',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partially Paid', 'Paid', 'Overdue'],
      default: 'Unpaid',
      index: true,
    },
    branch: {
      type: String,
      default: 'Main Distribution Hub',
      index: true,
    },
    shippingMethod: {
      type: String,
      default: 'Freight Express',
    },
    trackingNumber: {
      type: String,
      default: '',
    },
    salesExecutive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    salesExecutiveName: {
      type: String,
      default: 'Direct Portal',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
