/**
 * Request Validation Rules & Express-Validator Middleware
 */

const { body, validationResult } = require('express-validator');
const { ROLES, HTTP_STATUS } = require('../config/constants');
const { ApiResponse } = require('../utils/ApiResponse');

/**
 * Middleware to check validation results and return formatted 400 response
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return ApiResponse.error(
      res,
      'Validation failed for submitted data.',
      HTTP_STATUS.BAD_REQUEST,
      formattedErrors
    );
  }
  next();
};

/**
 * Registration Validation Rules
 */
const registerValidationRules = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),

  body('role')
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),

  body('branch')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Branch name cannot exceed 100 characters'),
];

/**
 * Login Validation Rules
 */
const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * User Update Validation Rules
 */
const updateUserValidationRules = [
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),

  body('companyName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty'),

  body('branch')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Branch name cannot exceed 100 characters'),

  body('role')
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
];

module.exports = {
  validate,
  registerValidationRules,
  loginValidationRules,
  updateUserValidationRules,
};
