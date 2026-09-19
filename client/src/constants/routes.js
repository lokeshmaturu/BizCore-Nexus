/**
 * Application Route Paths
 */

export const ROUTES = {
  // Public
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Protected Core
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  USERS: '/users',
  
  // Enterprise Modules
  INVENTORY: '/inventory',
  SALES: '/sales',
  PROCUREMENT: '/procurement',
  LOGISTICS: '/logistics',
  FINANCE: '/finance',
  HR: '/hr',
  SETTINGS: '/settings',
  AUTOMATION: '/automation',
  SYSTEM_HEALTH: '/system-health',

  // Error Pages
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
};
