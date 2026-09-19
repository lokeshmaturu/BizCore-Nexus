/**
 * Centralized Enterprise Error Handling Middleware
 */

const { HTTP_STATUS } = require('../config/constants');
const { ApiResponse } = require('../utils/ApiResponse');

/**
 * 404 Route Not Found Handler
 */
const notFound = (req, res, next) => {
  return ApiResponse.error(
    res,
    `API endpoint not found: ${req.method} ${req.originalUrl}`,
    HTTP_STATUS.NOT_FOUND
  );
};

/**
 * Global Exception and Error Formatter
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;

  // Log error in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    console.error('💥 [Server Error]:', err);
  }

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    return ApiResponse.error(res, message, HTTP_STATUS.NOT_FOUND);
  }

  // 2. Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    const message = `Duplicate value entered for '${field}'. Please use another value.`;
    return ApiResponse.error(res, message, HTTP_STATUS.CONFLICT);
  }

  // 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    return ApiResponse.error(
      res,
      'Validation failed for one or more fields.',
      HTTP_STATUS.BAD_REQUEST,
      errors
    );
  }

  // 4. JWT Verification Errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(
      res,
      'Invalid authentication token signature.',
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(
      res,
      'Authentication token has expired. Please log in again.',
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  // Default to 500 server error
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.isOperational
    ? err.message
    : process.env.NODE_ENV === 'production'
    ? 'An unexpected server error occurred.'
    : err.message || 'Internal Server Error';

  return ApiResponse.error(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};

module.exports = {
  notFound,
  errorHandler,
};
