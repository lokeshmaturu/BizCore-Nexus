const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Bank Wire', 'Corporate Card', 'ACH Transfer', 'Check', 'Letter of Credit'],
      default: 'Bank Wire',
    },
    referenceNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Success', 'Pending', 'Failed', 'Reversed'],
      default: 'Success',
    },
    processedDate: {
      type: Date,
      default: Date.now,
    },
    notes: String,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
