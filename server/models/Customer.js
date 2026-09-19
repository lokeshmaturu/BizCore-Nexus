/**
 * B2B Wholesale Customer Model
 * Represents corporate wholesale accounts, credit facilities, terms, and purchase pipelines.
 */

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Enterprise client name is required'],
      trim: true,
      index: true,
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    tier: {
      type: String,
      enum: ['Platinum', 'Gold', 'Silver', 'Standard'],
      default: 'Silver',
      index: true,
    },
    creditLimit: {
      type: Number,
      default: 50000,
      min: [0, 'Credit limit cannot be negative'],
    },
    outstandingBalance: {
      type: Number,
      default: 0,
      min: [0, 'Outstanding balance cannot be negative'],
    },
    paymentTerms: {
      type: String,
      enum: ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Net 90', 'Due on Receipt', 'Advance Payment'],
      default: 'Net 30',
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    shippingAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'USA' },
    },
    taxNumber: {
      type: String,
      trim: true,
      default: '',
    },
    branch: {
      type: String,
      default: 'Main Distribution Hub',
      index: true,
    },
    status: {
      type: String,
      enum: ['Active', 'On Hold', 'Credit Suspended', 'Inactive'],
      default: 'Active',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Available Credit
customerSchema.virtual('availableCredit').get(function () {
  return Math.max(0, (this.creditLimit || 0) - (this.outstandingBalance || 0));
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
