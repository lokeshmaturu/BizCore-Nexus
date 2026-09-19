import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-6 text-slate-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full glass-panel bg-slate-900/90 border border-slate-700/80 rounded-3xl p-8 sm:p-10 text-center shadow-2xl space-y-6"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/10">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-brand-400 font-bold bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Endpoint Not Found
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The requested operating route does not exist or has been relocated to another distribution node.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="primary" size="md" leftIcon={Home}>
              Back to Operating Console
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
