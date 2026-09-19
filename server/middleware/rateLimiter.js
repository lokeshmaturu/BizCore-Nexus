/**
 * Rate Limiting Middleware
 * Protects against brute-force and DDoS attacks.
 */

const rateLimit = require('express-rate-limit');
const { HTTP_STATUS } = require('../config/constants');
const { ApiResponse } = require('../utils/ApiResponse');

// Global API rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Too many requests from this IP address. Please try again after 15 minutes.',
      HTTP_STATUS.TOO_MANY_REQUESTS
    );
  },
});

// Strict auth rate limit (login/register/password-reset)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Too many authentication attempts. Please try again after 15 minutes.',
      HTTP_STATUS.TOO_MANY_REQUESTS
    );
  },
});

module.exports = {
  globalLimiter,
  authLimiter,
};
