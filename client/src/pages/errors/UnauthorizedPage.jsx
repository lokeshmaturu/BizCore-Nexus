import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../constants/roles';
import { Button } from '../../components/ui/Button';

export const UnauthorizedPage = () => {
  const { role } = useAuth();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full bg-white border border-rose-200 rounded-3xl p-8 sm:p-10 text-center shadow-xl space-y-6"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-md shadow-rose-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-rose-700 font-bold bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Error 403 – Access Forbidden
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Insufficient RBAC Clearance
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            Your current security role{' '}
            <strong className="text-brand-700 font-semibold">({ROLE_LABELS[role] || role || 'User'})</strong> does
            not possess the required permissions to access this enterprise module.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-1">
          <p className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-rose-600" />
            <span>Access Policy Advisory</span>
          </p>
          <p className="text-[11px] leading-normal">
            If you require access to this department's ledger or inventory node, request permission escalation from your organization's SuperAdmin.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="primary" size="md" leftIcon={Home}>
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
