/**
 * Stock Movement & Audit Log Model
 * Tracks physical stock ledger entries (inbound, outbound, transfers, damages, audits).
 */

const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      index: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'INBOUND_PURCHASE',
        'OUTBOUND_SALE',
        'BRANCH_TRANSFER',
        'DAMAGE_WRITE_OFF',
        'INVENTORY_AUDIT',
        'STOCK_ADJUSTMENT',
      ],
      index: true,
    },
    quantity: {
      type: Number,
      required: true, // Can be positive or negative
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    fromBranch: {
      type: String,
      trim: true,
      default: '',
    },
    toBranch: {
      type: String,
      trim: true,
      default: '',
    },
    referenceOrder: {
      type: String,
      trim: true,
      default: '',
    },
    reason: {
      type: String,
      trim: true,
      default: '',
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    performedByName: {
      type: String,
      default: 'System Operator',
    },
  },
  {
    timestamps: true,
  }
);

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);
module.exports = StockMovement;
