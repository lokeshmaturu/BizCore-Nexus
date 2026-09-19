/**
 * Human Resources Management Routes
 */

const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
} = require('../controllers/hrController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

router.use(protect);

// Employee Management
router.get('/employees', getEmployees);
router.get('/employees/:id', getEmployeeById);
router.post(
  '/employees',
  authorize(ROLES.SUPER_ADMIN, ROLES.HR_MANAGER),
  createEmployee
);
router.patch(
  '/employees/:id',
  authorize(ROLES.SUPER_ADMIN, ROLES.HR_MANAGER),
  updateEmployee
);

// Leave Requests
router.get('/leaves', getLeaveRequests);
router.post('/leaves', createLeaveRequest);
router.patch(
  '/leaves/:id/status',
  authorize(ROLES.SUPER_ADMIN, ROLES.HR_MANAGER, ROLES.BRANCH_MANAGER),
  updateLeaveStatus
);

module.exports = router;
