const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'BizCore Nexus Global Wholesale',
    },
    defaultCurrency: {
      type: String,
      default: 'USD',
    },
    defaultTaxRate: {
      type: Number,
      default: 4.0,
    },
    lowStockThreshold: {
      type: Number,
      default: 15,
    },
    sessionTimeoutMinutes: {
      type: Number,
      default: 120,
    },
    enforceStrongPasswords: {
      type: Boolean,
      default: true,
    },
    enableAuditLogging: {
      type: Boolean,
      default: true,
    },
    allowedIPs: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SystemConfig', systemConfigSchema);
