/**
 * BizCore Nexus - Enterprise Constants
 */

const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  BRANCH_MANAGER: 'BranchManager',
  HR_MANAGER: 'HRManager',
  INVENTORY_MANAGER: 'InventoryManager',
  SALES_EXECUTIVE: 'SalesExecutive',
  EMPLOYEE: 'Employee',
};

const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    name: 'Super Administrator',
    description: 'Full enterprise-wide access, user management, and system configuration.',
    level: 100,
  },
  [ROLES.BRANCH_MANAGER]: {
    name: 'Branch Manager',
    description: 'Full branch operations, team oversight, local inventory, and branch reporting.',
    level: 80,
  },
  [ROLES.HR_MANAGER]: {
    name: 'HR Manager',
    description: 'Personnel records, employee onboarding, attendance, and payroll access.',
    level: 60,
  },
  [ROLES.INVENTORY_MANAGER]: {
    name: 'Inventory Manager',
    description: 'Warehouse logistics, stock movements, purchase orders, and supplier catalogs.',
    level: 50,
  },
  [ROLES.SALES_EXECUTIVE]: {
    name: 'Sales Executive',
    description: 'B2B CRM, customer accounts, order processing, and wholesale quotations.',
    level: 40,
  },
  [ROLES.EMPLOYEE]: {
    name: 'Employee',
    description: 'Standard access to personal profile, assigned tasks, and company directory.',
    level: 10,
  },
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  ROLES,
  ROLE_PERMISSIONS,
  HTTP_STATUS,
};
