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
        className="max-w-lg w-full glass-panel bg-slate-900/90 border border-rose-500/30 rounded-3xl p-8 sm:p-10 text-center shadow-2xl space-y-6"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
            Error 403 – Access Forbidden
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Insufficient RBAC Clearance
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            Your current security role{' '}
            <strong className="text-brand-300">({ROLE_LABELS[role] || role || 'User'})</strong> does
            not possess the required permissions to access this enterprise module.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 text-left space-y-1">
          <p className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-rose-400" />
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
