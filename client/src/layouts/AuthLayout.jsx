import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Zap, BarChart3, Cpu, Sparkles } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex bg-[#070b14] text-slate-100 overflow-hidden relative">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left Panel: Enterprise Branding & Value Proposition (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 border-r border-slate-800/80">
        {/* Brand Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 p-0.5 shadow-lg shadow-brand-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Layers className="w-6 h-6 text-brand-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              BizCore <span className="gradient-text">Nexus</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-full">
                AI OS
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Enterprise Operating System for Distribution & Wholesale
            </p>
          </div>
        </div>

        {/* Center Hero Visual / Features */}
        <div className="my-auto py-8 z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-brand-300">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Next-Gen Enterprise Architecture</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Autonomous Intelligence for Modern Supply Chains.
            </h2>
            <p className="text-slate-400 text-sm xl:text-base leading-relaxed max-w-lg">
              Streamline multi-branch wholesale operations, unify CRM pipelines, and orchestrate inventory with real-time AI decision models.
            </p>
          </motion.div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-slate-200">Role-Based Access</h4>
              <p className="text-xs text-slate-400">Strict granular security across 6 organizational tiers.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <BarChart3 className="w-5 h-5 text-brand-400" />
              <h4 className="text-sm font-semibold text-slate-200">Real-time Telemetry</h4>
              <p className="text-xs text-slate-400">Live KPIs, turnover ratios, and revenue insights.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-semibold text-slate-200">Instant Sync</h4>
              <p className="text-xs text-slate-400">Sub-second state synchronization across branches.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h4 className="text-sm font-semibold text-slate-200">AI Forecasting</h4>
              <p className="text-xs text-slate-400">Predictive demand planning and restock automation.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-500 z-10 pt-4 border-t border-slate-800/60">
          <span>© 2026 BizCore Nexus Inc.</span>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#security" className="hover:text-slate-400 transition-colors">Security</a>
          </div>
        </div>
      </div>

      {/* Right Panel: Interactive Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10">
        <div className="w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              BizCore <span className="gradient-text">Nexus</span>
            </span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
