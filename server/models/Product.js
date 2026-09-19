/**
 * Product & SKU Model
 * Represents enterprise inventory stock units, pricing tiers, and warehouse bin locations.
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, 'SKU code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: [
        'Wholesale Electronics',
        'Industrial Hardware',
        'Bulk Consumer Goods',
        'Automation Components',
        'Packaging Materials',
        'Raw Materials',
        'General Merchandise',
      ],
      default: 'General Merchandise',
      index: true,
    },
    barcode: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    costPrice: {
      type: Number,
      required: [true, 'Cost price is required'],
      min: [0, 'Cost price cannot be negative'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative'],
    },
    currentStock: {
      type: Number,
      required: [true, 'Current stock quantity is required'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    reservedStock: {
      type: Number,
      default: 0,
      min: [0, 'Reserved stock cannot be negative'],
    },
    reorderPoint: {
      type: Number,
      default: 20,
      min: [0, 'Reorder threshold cannot be negative'],
    },
    unitOfMeasure: {
      type: String,
      enum: ['PCS', 'BOX', 'PALLET', 'KG', 'LITER', 'METERS', 'CARTON'],
      default: 'PCS',
    },
    warehouseBin: {
      type: String,
      trim: true,
      default: 'Zone A - Bin 01',
    },
    branch: {
      type: String,
      trim: true,
      default: 'Main Distribution Hub',
      index: true,
    },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock', 'Discontinued'],
      default: 'In Stock',
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Available Stock (Current - Reserved)
productSchema.virtual('availableStock').get(function () {
  return Math.max(0, (this.currentStock || 0) - (this.reservedStock || 0));
});

// Auto-update status hook before saving
productSchema.pre('save', function (next) {
  if (this.currentStock === 0) {
    this.status = 'Out of Stock';
  } else if (this.currentStock <= this.reorderPoint) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
