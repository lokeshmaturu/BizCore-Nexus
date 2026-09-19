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
} from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import { Badge } from '../components/ui/Badge';
import { ROLES } from '../constants/roles';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const { user, role } = useAuth();
  const { canManageUsers, canManageInventory, canManageSales, canManageHR } = usePermission();

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
      label: 'HR & Personnel',
      path: ROUTES.HR,
      icon: UserCheck,
      allowed: canManageHR,
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
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-slate-950/95 border-r border-slate-800/80 transition-all duration-300 ease-in-out backdrop-blur-xl ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <NavLink
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-3 overflow-hidden group"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 p-0.5 shadow-md shadow-brand-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
                  BizCore <span className="gradient-text font-black">Nexus</span>
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  Enterprise AI OS
                </span>
              </div>
            )}
          </NavLink>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white items-center justify-center transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Role Ribbon */}
        {!isCollapsed && user && (
          <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-2">
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{user.companyName}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.branch || 'Main Branch'}</p>
            </div>
            <Badge role={role} size="sm" />
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600/20 to-brand-500/10 text-brand-300 border border-brand-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Active Left Indicator */}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-brand-500 rounded-r-full shadow-glow"
                  />
                )}

                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Telemetry Tag */}
        {!isCollapsed && (
          <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-brand-950/40 border border-brand-500/20 text-xs">
            <div className="flex items-center gap-2 text-brand-300 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-spin" />
              <span>AI Engine Active</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Telemetry connected to MongoDB Atlas cluster.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
