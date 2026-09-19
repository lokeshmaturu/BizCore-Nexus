/**
 * Custom Hook: usePermission
 * Evaluates role-based permissions and hierarchical privileges.
 */

import { useAuth } from './useAuth';
import { ROLES } from '../constants/roles';

export const usePermission = () => {
  const { role } = useAuth();

  const isSuperAdmin = role === ROLES.SUPER_ADMIN;
  const isBranchManager = role === ROLES.BRANCH_MANAGER;
  const isHRManager = role === ROLES.HR_MANAGER;
  const isInventoryManager = role === ROLES.INVENTORY_MANAGER;
  const isSalesExecutive = role === ROLES.SALES_EXECUTIVE;
  const isEmployee = role === ROLES.EMPLOYEE;

  /**
   * Check if current user has any of the specified roles
   * SuperAdmin has bypass for all checks
   */
  const hasRole = (...allowedRoles) => {
    if (!role) return false;
    if (isSuperAdmin) return true;
    return allowedRoles.includes(role);
  };

  /**
   * Specific domain permission checks
   */
  const canManageUsers = hasRole(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.HR_MANAGER);
  const canManageInventory = hasRole(ROLES.SUPER_ADMIN, ROLES.INVENTORY_MANAGER, ROLES.BRANCH_MANAGER);
  const canManageSales = hasRole(ROLES.SUPER_ADMIN, ROLES.SALES_EXECUTIVE, ROLES.BRANCH_MANAGER);
  const canManageHR = hasRole(ROLES.SUPER_ADMIN, ROLES.HR_MANAGER);
  const canManageProcurement = hasRole(ROLES.SUPER_ADMIN, ROLES.INVENTORY_MANAGER, ROLES.BRANCH_MANAGER);
  const canManageLogistics = hasRole(ROLES.SUPER_ADMIN, ROLES.INVENTORY_MANAGER, ROLES.BRANCH_MANAGER, ROLES.SALES_EXECUTIVE);
  const canManageFinance = hasRole(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.SALES_EXECUTIVE);
  const canManageSettings = hasRole(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER);

  return {
    role,
    hasRole,
    isSuperAdmin,
    isBranchManager,
    isHRManager,
    isInventoryManager,
    isSalesExecutive,
    isEmployee,
    canManageUsers,
    canManageInventory,
    canManageSales,
    canManageHR,
    canManageProcurement,
    canManageLogistics,
    canManageFinance,
    canManageSettings,
  };
};

export default usePermission;
