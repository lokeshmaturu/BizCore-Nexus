const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // If null, represents broadcast to eligible roles
    },
    targetRoles: [
      {
        type: String,
      },
    ],
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['INFO', 'WARNING', 'SUCCESS', 'CRITICAL'],
      default: 'INFO',
    },
    category: {
      type: String,
      enum: ['INVENTORY', 'SALES', 'PROCUREMENT', 'LOGISTICS', 'FINANCE', 'SYSTEM'],
      default: 'SYSTEM',
    },
    link: String,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
