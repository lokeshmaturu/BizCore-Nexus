/**
 * Authentication Controller
 * Enterprise user registration, login, logout, and current profile retrieval.
 */

const User = require('../models/User');
const { sendTokenResponse, clearTokenCookie } = require('../services/tokenService');
const { ApiResponse } = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../config/constants');

/**
 * @desc    Register a new enterprise user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, companyName, role, branch } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return ApiResponse.error(
        res,
        'An account with this email address already exists. Please log in.',
        HTTP_STATUS.CONFLICT
      );
    }

    // Create user in database
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      companyName,
      role: role || undefined,
      branch: branch || 'Headquarters',
    });

    return sendTokenResponse(user, HTTP_STATUS.CREATED, res, 'Enterprise account registered successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log in user & return JWT token cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return ApiResponse.error(
        res,
        'Invalid credentials. Please verify your email and password.',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Check password match
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ApiResponse.error(
        res,
        'Invalid credentials. Please verify your email and password.',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return ApiResponse.error(
        res,
        'Your account has been deactivated. Please contact your system administrator.',
        HTTP_STATUS.FORBIDDEN
      );
    }

    return sendTokenResponse(user, HTTP_STATUS.OK, res, 'Logged in successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log out current user & clear JWT cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = async (req, res, next) => {
  try {
    clearTokenCookie(res);
    return ApiResponse.success(res, 'User session terminated and logged out successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by authMiddleware)
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return ApiResponse.error(res, 'User profile not found.', HTTP_STATUS.NOT_FOUND);
    }

    return ApiResponse.success(res, 'Current user profile retrieved.', {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      branch: user.branch,
      profileImage: user.profileImage,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Password Reset Request (Stub for Phase 1)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // In Phase 1, UI-only acknowledgment
    return ApiResponse.success(
      res,
      `If an enterprise account exists for ${email}, a password reset link has been dispatched.`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
};
