import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Menu,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Building2,
  ChevronDown,
  Sparkles,
  BrainCircuit,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../store/authSlice';
import { toggleNotificationDrawer } from '../store/notificationSlice';
import { toggleCopilot } from '../store/aiSlice';
import { toggleCommandPalette } from '../store/workflowSlice';
import { ROUTES } from '../constants/routes';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { setCurrency, CURRENCIES } from '../store/currencySlice';

export const Topbar = ({ onOpenMobileSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, fullName, role, email, companyName, branch } = useAuth();
  const { unreadCount } = useSelector((state) => state.notifications);
  const activeCurrency = useSelector((state) => state.currency?.activeCurrency || 'USD');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully. See you soon!');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      toast.error(err || 'Failed to logout');
    }
  };

  return (
    <header className="h-16 sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs">
      {/* Left: Mobile Menu Button & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar (Trigger for Ctrl+K Command Center) */}
        <div
          onClick={() => dispatch(toggleCommandPalette())}
          className="relative w-full hidden sm:flex items-center cursor-pointer group"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors pointer-events-none" />
          <div className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-brand-300 rounded-xl pl-10 pr-4 py-1.5 text-xs text-slate-500 flex items-center justify-between transition-all shadow-xs">
            <span>Search actions, modules, records...</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shadow-2xs">
              Ctrl+K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Copilot Button, Branch Info, Notifications & User Dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Nexus AI Copilot Pill */}
        <button
          type="button"
          onClick={() => dispatch(toggleCopilot())}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 hover:bg-brand-100 text-xs font-semibold shadow-xs transition-all"
          title="Open Nexus AI Copilot (Ctrl + J)"
        >
          <BrainCircuit className="w-3.5 h-3.5 text-brand-600" />
          <span className="hidden sm:inline">Nexus Copilot</span>
          <span className="text-[10px] bg-white px-1.5 py-0.2 rounded border border-brand-200 hidden md:inline font-mono">
            Ctrl+J
          </span>
        </button>

        {/* Multi-Currency Global Switcher */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-brand-700 mr-1.5 hidden sm:inline">FX:</span>
          <select
            value={activeCurrency}
            onChange={(e) => {
              dispatch(setCurrency(e.target.value));
              toast.success(`Display Currency updated to ${e.target.value}`);
            }}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            title="Global Multi-Currency Engine"
          >
            {Object.values(CURRENCIES).map((curr) => (
              <option key={curr.code} value={curr.code} className="bg-white text-slate-900">
                {curr.code} ({curr.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Branch / Company Tag */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 shadow-xs">
          <Building2 className="w-3.5 h-3.5 text-brand-600" />
          <span className="font-semibold text-slate-900">{companyName || 'Enterprise'}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium">{branch || 'HQ'}</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          onClick={() => dispatch(toggleNotificationDrawer())}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[8px] h-2 px-1 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all focus:outline-none"
          >
            <Avatar name={fullName} size="sm" status="online" />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                {fullName || 'User'}
              </span>
              <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-slide-up">
              {/* User Details Header */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900 truncate">{fullName}</p>
                <p className="text-xs text-slate-500 truncate mb-2">{email}</p>
                <Badge role={role} size="sm" />
              </div>

              {/* Menu Links */}
              <div className="py-1">
                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>Profile Settings</span>
                </Link>

                {(role === 'SuperAdmin' || role === 'BranchManager') && (
                  <Link
                    to={ROUTES.SETTINGS}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-brand-600" />
                    <span>System Settings</span>
                  </Link>
                )}

                <div className="px-4 py-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>RBAC Access</span>
                  </span>
                  <span className="text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active</span>
                </div>
              </div>

              {/* Logout Action */}
              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
