/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  validate,
  registerValidationRules,
  loginValidationRules,
} = require('../validators/authValidators');

// Public routes with rate limiting and validation
router.post('/register', authLimiter, registerValidationRules, validate, register);
router.post('/login', authLimiter, loginValidationRules, validate, login);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPassword);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
