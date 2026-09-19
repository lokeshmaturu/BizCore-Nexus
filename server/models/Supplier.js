const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Supplier code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Supplier company name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Supplier category is required'],
      enum: [
        'Electronics & Hardware',
        'Raw Materials & Metals',
        'Packaging & Cargo',
        'Industrial Machinery',
        'Chemicals & Solvents',
        'Apparel & Textiles',
        'General Logistics',
      ],
      default: 'Electronics & Hardware',
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: 'United States' },
      postalCode: String,
    },
    leadTimeDays: {
      type: Number,
      default: 7,
      min: 1,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    paymentTerms: {
      type: String,
      enum: ['Net 15', 'Net 30', 'Net 60', 'Due on Receipt', 'Advance'],
      default: 'Net 30',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Supplier', supplierSchema);
