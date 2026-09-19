/**
 * User Controller
 * Administrative and self-management operations with role filtering and pagination.
 */

const User = require('../models/User');
const { ApiResponse } = require('../utils/ApiResponse');
const { HTTP_STATUS, ROLES } = require('../config/constants');

/**
 * @desc    Get all users with filtering, search, and pagination
 * @route   GET /api/users
 * @access  Private (SuperAdmin, BranchManager, HRManager)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, branch, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const query = {};

    // Filter by role if specified
    if (role) {
      query.role = role;
    }

    // Filter by branch if specified (or branch managers restricted to their branch unless SuperAdmin)
    if (branch) {
      query.branch = branch;
    } else if (req.user.role === ROLES.BRANCH_MANAGER && req.user.branch) {
      query.branch = req.user.branch;
    }

    // Search query for name or email
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { companyName: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalUsers / limitNum);

    return ApiResponse.success(
      res,
      'Users list retrieved successfully.',
      users,
      HTTP_STATUS.OK,
      {
        total: totalUsers,
        page: pageNum,
        totalPages,
        limit: limitNum,
        hasMore: pageNum < totalPages,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Private (SuperAdmin, BranchManager, HRManager, or Self)
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if requesting own data or has managerial privilege
    const isSelf = req.user.id.toString() === id.toString();
    const isElevated = [ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.HR_MANAGER].includes(
      req.user.role
    );

    if (!isSelf && !isElevated) {
      return ApiResponse.error(
        res,
        'Forbidden: You are only authorized to access your own user profile.',
        HTTP_STATUS.FORBIDDEN
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return ApiResponse.error(res, 'User with specified ID was not found.', HTTP_STATUS.NOT_FOUND);
    }

    return ApiResponse.success(res, 'User retrieved successfully.', user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile or details
 * @route   PATCH /api/users/:id
 * @access  Private (Self or SuperAdmin/HRManager)
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, companyName, branch, role, isActive, profileImage } = req.body;

    const isSelf = req.user.id.toString() === id.toString();
    const isSuperAdmin = req.user.role === ROLES.SUPER_ADMIN;
    const isHR = req.user.role === ROLES.HR_MANAGER;

    if (!isSelf && !isSuperAdmin && !isHR) {
      return ApiResponse.error(
        res,
        'Forbidden: You do not have permission to modify this user account.',
        HTTP_STATUS.FORBIDDEN
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return ApiResponse.error(res, 'User to update was not found.', HTTP_STATUS.NOT_FOUND);
    }

    // Build update object
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (companyName) user.companyName = companyName;
    if (branch) user.branch = branch;
    if (profileImage !== undefined) user.profileImage = profileImage;

    // Only SuperAdmin or HRManager can change role or isActive status
    if (isSuperAdmin || isHR) {
      if (role && Object.values(ROLES).includes(role)) {
        user.role = role;
      }
      if (isActive !== undefined) {
        user.isActive = Boolean(isActive);
      }
    }

    await user.save();

    return ApiResponse.success(res, 'User record updated successfully.', user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user account (Soft or Hard Delete)
 * @route   DELETE /api/users/:id
 * @access  Private (SuperAdmin only)
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deleting own account
    if (req.user.id.toString() === id.toString()) {
      return ApiResponse.error(
        res,
        'Safety Constraint: You cannot delete your own SuperAdmin account.',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return ApiResponse.error(res, 'User to delete was not found.', HTTP_STATUS.NOT_FOUND);
    }

    return ApiResponse.success(res, `User '${user.email}' deleted successfully.`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
