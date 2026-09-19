import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Boxes,
  TrendingUp,
  UserCheck,
  Settings,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  ShoppingCart,
  Truck,
  Receipt,
  Activity,
} from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import { Badge } from '../components/ui/Badge';
import { ROLES } from '../constants/roles';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const { user, role } = useAuth();
  const {
    canManageUsers,
    canManageInventory,
    canManageSales,
    canManageHR,
    canManageProcurement,
    canManageLogistics,
    canManageFinance,
    canManageSettings,
    canManageAutomation,
    canViewSystemHealth,
  } = usePermission();

  // Navigation Items defined with RBAC permissions
  const navItems = [
    {
      label: 'Dashboard',
      path: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
      allowed: true, // Everyone can view their dashboard
    },
    {
      label: 'Team & Directory',
      path: ROUTES.USERS,
      icon: Users,
      allowed: canManageUsers,
      badge: 'Admin',
    },
    {
      label: 'Inventory Control',
      path: ROUTES.INVENTORY,
      icon: Boxes,
      allowed: canManageInventory,
    },
    {
      label: 'Sales & CRM',
      path: ROUTES.SALES,
      icon: TrendingUp,
      allowed: canManageSales,
    },
    {
      label: 'Procurement & POs',
      path: ROUTES.PROCUREMENT,
      icon: ShoppingCart,
      allowed: canManageProcurement,
      badge: 'AI',
    },
    {
      label: 'Logistics & Dispatch',
      path: ROUTES.LOGISTICS,
      icon: Truck,
      allowed: canManageLogistics,
    },
    {
      label: 'Finance & Billing',
      path: ROUTES.FINANCE,
      icon: Receipt,
      allowed: canManageFinance,
    },
    {
      label: 'HR & Personnel',
      path: ROUTES.HR,
      icon: UserCheck,
      allowed: canManageHR,
    },
    {
      label: 'Autonomous Workflows',
      path: ROUTES.AUTOMATION,
      icon: Sparkles,
      allowed: canManageAutomation,
      badge: 'v6.0',
    },
    {
      label: 'System Telemetry',
      path: ROUTES.SYSTEM_HEALTH,
      icon: Activity,
      allowed: canViewSystemHealth,
      badge: 'Live',
    },
    {
      label: 'System Settings',
      path: ROUTES.SETTINGS,
      icon: Settings,
      allowed: canManageSettings,
    },
    {
      label: 'My Profile',
      path: ROUTES.PROFILE,
      icon: User,
      allowed: true,
    },
  ];

  const filteredNavItems = navItems.filter((item) => item.allowed);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-slate-200 shadow-sm transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <NavLink
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-3 overflow-hidden group"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-600 p-0.5 shadow-md shadow-brand-500/20">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand-600 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-base font-black tracking-tight text-slate-900 flex items-center gap-1.5 truncate">
                  BizCore <span className="gradient-text font-black">Nexus</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                  Enterprise AI OS
                </span>
              </div>
            )}
          </NavLink>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 items-center justify-center transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Role Ribbon */}
        {!isCollapsed && user && (
          <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 shadow-xs">
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{user.companyName}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.branch || 'Main Branch'}</p>
            </div>
            <Badge role={role} size="sm" />
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Active Left Indicator */}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-brand-600 rounded-r-full"
                  />
                )}

                <Icon
                  className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                    isActive ? 'text-brand-600' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 font-bold border border-brand-200">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Telemetry Tag */}
        {!isCollapsed && (
          <div className="p-3 m-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-brand-700 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin" />
              <span>AI Engine Active</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Telemetry connected to MongoDB Atlas cluster.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
