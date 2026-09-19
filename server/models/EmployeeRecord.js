/**
 * Employee Record Model
 * HR personnel profile details, department allocations, shift schedules, and tenure.
 */

const mongoose = require('mongoose');

const employeeRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      enum: [
        'Executive Management',
        'Supply Chain & Logistics',
        'Warehouse Operations',
        'Wholesale Sales & CRM',
        'Human Resources',
        'Finance & Accounts',
        'Quality Assurance',
        'IT & Infrastructure',
      ],
      default: 'Warehouse Operations',
      index: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      default: 'Main Distribution Hub',
      index: true,
    },
    employmentType: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Intern'],
      default: 'Full-Time',
    },
    shift: {
      type: String,
      enum: ['Morning Shift (08:00 - 16:30)', 'Evening Shift (16:00 - 00:30)', 'Night Shift (00:00 - 08:30)', 'Flexible'],
      default: 'Morning Shift (08:00 - 16:30)',
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
    monthlySalary: {
      type: Number,
      default: 5500,
    },
    leaveBalance: {
      annual: { type: Number, default: 18 },
      casual: { type: Number, default: 10 },
      sick: { type: Number, default: 8 },
    },
    emergencyContact: {
      name: { type: String, default: '' },
      relationship: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Probation', 'Terminated'],
      default: 'Active',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

employeeRecordSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

const EmployeeRecord = mongoose.model('EmployeeRecord', employeeRecordSchema);
module.exports = EmployeeRecord;
