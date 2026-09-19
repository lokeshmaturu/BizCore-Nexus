/**
 * Authentication Middleware
 * Validates JWT from HTTP-only cookie or Authorization Bearer header.
 */

const User = require('../models/User');
const { verifyToken } = require('../services/tokenService');
const { HTTP_STATUS } = require('../config/constants');
const { ApiResponse } = require('../utils/ApiResponse');

const protect = async (req, res, next) => {
  let token;

  // 1. Check Cookies first (most secure for web clients)
  if (req.cookies && req.cookies.token && req.cookies.token !== 'none') {
    token = req.cookies.token;
  }
  // 2. Fallback to Authorization Header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.error(
      res,
      'Access denied. No authentication token provided. Please log in.',
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  try {
    const decoded = verifyToken(token);

    // Fetch user from DB and verify account is active
    const user = await User.findById(decoded.id);

    if (!user) {
      return ApiResponse.error(
        res,
        'The user belonging to this token no longer exists.',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (!user.isActive) {
      return ApiResponse.error(
        res,
        'Your user account has been deactivated. Please contact your administrator.',
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Attach authenticated user object to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.error(
        res,
        'Authentication session expired. Please log in again.',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    return ApiResponse.error(
      res,
      'Invalid authentication token.',
      HTTP_STATUS.UNAUTHORIZED
    );
  }
};

module.exports = { protect };
