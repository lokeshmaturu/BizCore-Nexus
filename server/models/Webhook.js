const mongoose = require('mongoose');
const crypto = require('crypto');

const webhookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    secret: {
      type: String,
      default: () => `whsec_${crypto.randomBytes(24).toString('hex')}`,
    },
    events: [
      {
        type: String,
        enum: [
          'ORDER_CREATED',
          'ORDER_SHIPPED',
          'STOCK_DEPLETED',
          'INVOICE_GENERATED',
          'PAYMENT_RECEIVED',
          'PO_ISSUED',
        ],
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Failing'],
      default: 'Active',
    },
    lastTriggered: Date,
    lastStatusCode: Number,
    failureCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Webhook', webhookSchema);
