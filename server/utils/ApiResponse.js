/**
 * Standardized API Response and Error Classes
 */

const { HTTP_STATUS } = require('../config/constants');

class ApiResponse {
  static success(res, message = 'Success', data = null, statusCode = HTTP_STATUS.OK, meta = null) {
    const payload = {
      success: true,
      message,
      data,
    };

    if (meta) {
      payload.meta = meta;
    }

    return res.status(statusCode).json(payload);
  }

  static created(res, message = 'Resource created successfully', data = null) {
    return this.success(res, message, data, HTTP_STATUS.CREATED);
  }

  static error(res, message = 'An error occurred', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    const payload = {
      success: false,
      message,
    };

    if (errors) {
      payload.errors = errors;
    }

    return res.status(statusCode).json(payload);
  }
}

class ApiError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  ApiResponse,
  ApiError,
};
