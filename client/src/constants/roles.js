/**
 * Enterprise Roles and RBAC Permission Constants
 */

export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  BRANCH_MANAGER: 'BranchManager',
  HR_MANAGER: 'HRManager',
  INVENTORY_MANAGER: 'InventoryManager',
  SALES_EXECUTIVE: 'SalesExecutive',
  EMPLOYEE: 'Employee',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Administrator',
  [ROLES.BRANCH_MANAGER]: 'Branch Manager',
  [ROLES.HR_MANAGER]: 'HR Manager',
  [ROLES.INVENTORY_MANAGER]: 'Inventory Manager',
  [ROLES.SALES_EXECUTIVE]: 'Sales Executive',
  [ROLES.EMPLOYEE]: 'Enterprise Staff',
};

export const ROLE_BADGE_STYLES = {
  [ROLES.SUPER_ADMIN]: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  [ROLES.BRANCH_MANAGER]: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  [ROLES.HR_MANAGER]: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  [ROLES.INVENTORY_MANAGER]: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  [ROLES.SALES_EXECUTIVE]: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  [ROLES.EMPLOYEE]: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.SUPER_ADMIN]: 'Full platform ownership, global enterprise settings, and user provisioning.',
  [ROLES.BRANCH_MANAGER]: 'Branch operational oversight, local staff management, and KPI tracking.',
  [ROLES.HR_MANAGER]: 'Human resources, department allocations, and employee status management.',
  [ROLES.INVENTORY_MANAGER]: 'Warehouse inventory, stock audits, supplier orders, and shipments.',
  [ROLES.SALES_EXECUTIVE]: 'Wholesale pipelines, CRM leads, quote generation, and order processing.',
  [ROLES.EMPLOYEE]: 'Standard team collaboration, task completion, and personal profile.',
};
