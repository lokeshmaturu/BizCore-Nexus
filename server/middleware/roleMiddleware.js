/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts route access based on user role hierarchy and permissions.
 */

const { ROLES, HTTP_STATUS } = require('../config/constants');
const { ApiResponse } = require('../utils/ApiResponse');

/**
 * Authorize specific roles
 * @param  {...string} allowedRoles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(
        res,
        'User context missing in authorization check.',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // SuperAdmin always has full bypass privilege
    if (req.user.role === ROLES.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `Forbidden: Role '${req.user.role}' does not have permission to access this enterprise resource.`,
        HTTP_STATUS.FORBIDDEN
      );
    }

    next();
  };
};

module.exports = { authorize };
