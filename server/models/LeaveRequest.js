/**
 * Leave Request Model
 * Handles employee leave application workflow with manager approval.
 */

const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmployeeRecord',
      required: true,
      index: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['Annual Leave', 'Casual Leave', 'Sick Leave', 'Maternity/Paternity', 'Unpaid Leave'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      required: [true, 'Please state reason for leave'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewerNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
module.exports = LeaveRequest;
