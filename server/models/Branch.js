const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      default: 'United States',
    },
    managerName: {
      type: String,
      required: true,
      default: 'Regional Lead',
    },
    managerEmail: {
      type: String,
      required: true,
    },
    capacitySqFt: {
      type: Number,
      default: 50000,
    },
    utilizationPercentage: {
      type: Number,
      default: 68,
      min: 0,
      max: 100,
    },
    activeFleetUnits: {
      type: Number,
      default: 12,
    },
    isOperational: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Branch', branchSchema);
