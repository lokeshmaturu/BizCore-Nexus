const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    carrier: {
      type: String,
      required: true,
      enum: [
        'Nexus Fleet Transit',
        'FedEx Enterprise',
        'DHL Global Express',
        'Union Freight Rail',
        'BlueDart Freight',
      ],
      default: 'Nexus Fleet Transit',
    },
    serviceLevel: {
      type: String,
      enum: ['Next-Day Air', 'Standard Ground', 'Priority Freight', 'Bulk Rail'],
      default: 'Standard Ground',
    },
    originBranch: {
      type: String,
      required: true,
      default: 'Main Distribution Hub',
    },
    destinationAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'United States' },
    },
    status: {
      type: String,
      enum: ['Preparing', 'In Transit', 'Out for Delivery', 'Delivered', 'Delayed', 'Returned'],
      default: 'Preparing',
      index: true,
    },
    dispatchDate: {
      type: Date,
      default: Date.now,
    },
    estimatedDelivery: {
      type: Date,
    },
    actualDelivery: {
      type: Date,
    },
    totalWeightKg: {
      type: Number,
      default: 25,
    },
    totalPackages: {
      type: Number,
      default: 1,
    },
    checkpoints: [
      {
        location: String,
        statusDescription: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    driverName: String,
    driverPhone: String,
    vehicleNumber: String,
    waybillNotes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Shipment', shipmentSchema);
