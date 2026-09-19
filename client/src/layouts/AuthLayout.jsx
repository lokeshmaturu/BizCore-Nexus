import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Zap, BarChart3, Cpu, Sparkles } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 text-slate-800 overflow-hidden relative">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Left Panel: Enterprise Branding & Value Proposition (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-white border-r border-slate-200">
        {/* Brand Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-600 p-0.5 shadow-md shadow-brand-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Layers className="w-6 h-6 text-brand-600" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              BizCore <span className="gradient-text">Nexus</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-full font-bold">
                AI OS
              </span>
            </h1>
            <p className="text-xs text-slate-500">
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-700 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Next-Gen Enterprise Architecture</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Autonomous Intelligence for Modern Supply Chains.
            </h2>
            <p className="text-slate-600 text-sm xl:text-base leading-relaxed max-w-lg">
              Streamline multi-branch wholesale operations, unify CRM pipelines, and orchestrate inventory with real-time AI decision models.
            </p>
          </motion.div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900">Role-Based Access</h4>
              <p className="text-xs text-slate-500">Strict granular security across 6 organizational tiers.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <BarChart3 className="w-5 h-5 text-brand-600" />
              <h4 className="text-sm font-bold text-slate-900">Real-time Telemetry</h4>
              <p className="text-xs text-slate-500">Live KPIs, turnover ratios, and revenue insights.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900">Instant Sync</h4>
              <p className="text-xs text-slate-500">Sub-second state synchronization across branches.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <Cpu className="w-5 h-5 text-purple-600" />
              <h4 className="text-sm font-bold text-slate-900">AI Forecasting</h4>
              <p className="text-xs text-slate-500">Predictive demand planning and restock automation.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-400 z-10 pt-4 border-t border-slate-200">
          <span>© 2026 BizCore Nexus Inc.</span>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="#security" className="hover:text-slate-600 transition-colors">Security</a>
          </div>
        </div>
      </div>

      {/* Right Panel: Interactive Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10">
        <div className="w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 p-0.5">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand-600" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
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
