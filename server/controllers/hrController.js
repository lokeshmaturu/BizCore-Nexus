/**
 * Human Resources Controller
 * Handles employee profiles, department allocation rosters, and leave approvals.
 */

const EmployeeRecord = require('../models/EmployeeRecord');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { ApiResponse } = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../config/constants');

/**
 * @desc    Get all employee records with department filters and search
 * @route   GET /api/hr/employees
 * @access  Private
 */
const getEmployees = async (req, res, next) => {
  try {
    const { department, branch, status, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const query = {};

    if (department) query.department = department;
    if (branch) query.branch = branch;
    if (status) query.status = status;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { employeeId: searchRegex },
        { designation: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [employees, total] = await Promise.all([
      EmployeeRecord.find(query).sort(sort).skip(skip).limit(limitNum),
      EmployeeRecord.countDocuments(query),
    ]);

    return ApiResponse.success(res, 'Employee directory retrieved.', employees, HTTP_STATUS.OK, {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single employee record
 * @route   GET /api/hr/employees/:id
 * @access  Private
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await EmployeeRecord.findById(req.params.id);
    if (!employee) {
      return ApiResponse.error(res, 'Employee record not found.', HTTP_STATUS.NOT_FOUND);
    }
    return ApiResponse.success(res, 'Employee details retrieved.', employee);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new employee record
 * @route   POST /api/hr/employees
 * @access  Private (HRManager, SuperAdmin)
 */
const createEmployee = async (req, res, next) => {
  try {
    const { firstName, lastName, email, department, designation, branch, employmentType, shift, monthlySalary } = req.body;

    // Check existing User or create reference
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: 'TemporaryPassword123!',
        companyName: req.user.companyName || 'Apex Wholesale',
        branch: branch || 'Main Distribution Hub',
        role: 'Employee',
      });
    }

    const employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const employee = await EmployeeRecord.create({
      user: user._id,
      employeeId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      department: department || 'Warehouse Operations',
      designation: designation || 'Operations Associate',
      branch: branch || 'Main Distribution Hub',
      employmentType: employmentType || 'Full-Time',
      shift: shift || 'Morning Shift (08:00 - 16:30)',
      monthlySalary: monthlySalary || 5000,
    });

    return ApiResponse.created(res, `Employee ${employee.fullName} (${employeeId}) provisioned.`, employee);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update employee details
 * @route   PATCH /api/hr/employees/:id
 * @access  Private (HRManager, SuperAdmin)
 */
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await EmployeeRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) {
      return ApiResponse.error(res, 'Employee record not found.', HTTP_STATUS.NOT_FOUND);
    }
    return ApiResponse.success(res, 'Employee profile updated.', employee);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get leave requests
 * @route   GET /api/hr/leaves
 * @access  Private
 */
const getLeaveRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [leaves, total] = await Promise.all([
      LeaveRequest.find(query).sort('-createdAt').skip(skip).limit(limitNum),
      LeaveRequest.countDocuments(query),
    ]);

    return ApiResponse.success(res, 'Leave requests retrieved.', leaves, HTTP_STATUS.OK, {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit new leave request
 * @route   POST /api/hr/leaves
 * @access  Private
 */
const createLeaveRequest = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, totalDays, reason, employeeId } = req.body;

    let employee = null;
    if (employeeId) {
      employee = await EmployeeRecord.findById(employeeId);
    }
    if (!employee) {
      employee = await EmployeeRecord.findOne({ user: req.user.id });
    }

    const leave = await LeaveRequest.create({
      employee: employee ? employee._id : req.user.id,
      employeeName: employee ? employee.fullName : req.user.fullName,
      department: employee ? employee.department : 'General Staff',
      leaveType,
      startDate,
      endDate,
      totalDays: totalDays || 1,
      reason,
      status: 'Pending',
    });

    return ApiResponse.created(res, 'Leave application submitted.', leave);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve or reject leave application
 * @route   PATCH /api/hr/leaves/:id/status
 * @access  Private (HRManager, BranchManager, SuperAdmin)
 */
const updateLeaveStatus = async (req, res, next) => {
  try {
    const { status, reviewerNotes } = req.body;
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return ApiResponse.error(res, 'Leave request not found.', HTTP_STATUS.NOT_FOUND);
    }

    leave.status = status;
    leave.reviewedBy = req.user.id;
    if (reviewerNotes) leave.reviewerNotes = reviewerNotes;

    await leave.save();

    return ApiResponse.success(res, `Leave request marked as ${status}.`, leave);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
};
