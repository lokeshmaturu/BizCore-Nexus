/**
 * User Management Routes (RBAC Protected)
 */

const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');
const { validate, updateUserValidationRules } = require('../validators/authValidators');

// All user routes require authentication
router.use(protect);

// GET /api/users - List users (SuperAdmin, BranchManager, HRManager)
router.get(
  '/',
  authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.HR_MANAGER),
  getAllUsers
);

// GET /api/users/:id - Get single user (Self or Elevated Roles)
router.get('/:id', getUserById);

// PATCH /api/users/:id - Update user (Self or SuperAdmin/HRManager)
router.patch('/:id', updateUserValidationRules, validate, updateUser);

// DELETE /api/users/:id - Delete user (SuperAdmin only)
router.delete('/:id', authorize(ROLES.SUPER_ADMIN), deleteUser);

module.exports = router;
