import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Boxes,
  Truck,
  DollarSign,
  Users,
  Activity,
  Zap,
  CheckCircle2,
  Lock,
  Globe,
  ChevronRight,
  Building2,
  BarChart3,
  Receipt,
  Server,
  FileCode2,
  Star,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';

const ENTERPRISE_ROLES = [
  {
    role: 'SuperAdmin',
    email: 'admin@bizcorenexus.com',
    desc: 'Full global ownership, branch provisioning, and system settings.',
    badge: 'Level 100 👑',
    color: 'from-brand-500 to-indigo-600',
  },
  {
    role: 'BranchManager',
    email: 'manager@bizcorenexus.com',
    desc: 'Regional hub oversight, local warehouse stock, and branch KPIs.',
    badge: 'Level 80 🏢',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    role: 'InventoryManager',
    email: 'inventory@bizcorenexus.com',
    desc: 'SKU catalog control, PO issuance, and safety stock replenishment.',
    badge: 'Level 50 📦',
    color: 'from-amber-500 to-orange-600',
  },
  {
    role: 'SalesExecutive',
    email: 'sales@bizcorenexus.com',
    desc: 'B2B client quotes, wholesale orders ledger, and Net-30 billing.',
    badge: 'Level 40 💼',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    role: 'HRManager',
    email: 'hr@bizcorenexus.com',
    desc: 'Personnel directory, leave authorizations, and staff allocations.',
    badge: 'Level 60 👥',
    color: 'from-purple-500 to-pink-600',
  },
];

const PREVIEW_TABS = [
  {
    id: 'copilot',
    label: 'Nexus AI Copilot',
    icon: BrainCircuit,
    title: 'Natural Language Enterprise Intelligence',
    description: 'Query live MongoDB Atlas collections for instant stockout predictions, margin optimization, and strategic recommendations via keyboard shortcut (Ctrl + J).',
    metrics: [
      { label: 'Query Latency', value: '< 180ms' },
      { label: 'Depleted SKUs Flagged', value: '2 Items' },
      { label: 'Forecast Accuracy', value: '98.4%' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory Control',
    icon: Boxes,
    title: 'Automated Multi-Zone Warehouse Catalog',
    description: 'Track multi-tier pricing, reorder points, bin allocations, and instant stock movement ledgers across all enterprise distribution nodes.',
    metrics: [
      { label: 'Active Catalog SKUs', value: '86,420' },
      { label: 'Asset Valuation', value: '$3.42M' },
      { label: 'Sync Status', value: 'Real-Time' },
    ],
  },
  {
    id: 'logistics',
    label: 'Freight Dispatch',
    icon: Truck,
    title: 'Live Carrier Transit & Waybill Generation',
    description: 'Monitor FedEx Enterprise, DHL Global, and internal Nexus Fleet shipments with visual milestone progress meters and printable freight waybills.',
    metrics: [
      { label: 'Active Routes', value: '4 Carriers' },
      { label: 'On-Time Dispatch', value: '98.8%' },
      { label: 'Waybills Generated', value: '1,420+' },
    ],
  },
  {
    id: 'finance',
    label: 'Invoicing & AR',
    icon: Receipt,
    title: 'Accounts Receivable Aging & Payments Ledger',
    description: 'Instantly generate commercial tax invoices from wholesale orders and balance customer credit ledgers with 30/60/90-day overdue aging matrices.',
    metrics: [
      { label: 'Billed Volume', value: '$4.82M' },
      { label: 'Collection Rate', value: '94.2%' },
      { label: 'Ledger Audit', value: 'SOC-2 Balanced' },
    ],
  },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activePreview, setActivePreview] = useState('copilot');

  const selectedPreview = PREVIEW_TABS.find((t) => t.id === activePreview) || PREVIEW_TABS[0];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 overflow-x-hidden selection:bg-brand-500 selection:text-white font-sans">
      {/* Dynamic Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-brand-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 p-0.5 shadow-lg shadow-brand-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                BizCore <span className="gradient-text">Nexus</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Enterprise AI OS
              </span>
            </div>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-brand-400 transition-colors">
              Platform Features
            </a>
            <a href="#preview" className="hover:text-brand-400 transition-colors">
              Live Console
            </a>
            <a href="#roles" className="hover:text-brand-400 transition-colors">
              RBAC Matrix
            </a>
            <a href="#architecture" className="hover:text-brand-400 transition-colors">
              Architecture
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cluster Online</span>
            </div>

            {isAuthenticated ? (
              <Link to={ROUTES.DASHBOARD}>
                <Button variant="primary" size="sm" rightIcon={ArrowRight}>
                  Open Console
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="secondary" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="primary" size="sm" rightIcon={ArrowRight}>
                    Launch App
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        {/* Animated Beacon Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-xs font-semibold text-brand-300 shadow-xl shadow-brand-500/10"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-spin-slow" />
          <span>Next-Gen Enterprise Business Operating System</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">All 4 Phases Live & Operational</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto"
        >
          AI-Powered Business OS for{' '}
          <span className="gradient-text">Wholesale & Distribution</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          Unify multi-branch warehouse inventory, autonomous supplier procurement, live freight carrier dispatching, and Net-30 commercial invoicing with real-time natural language intelligence.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link to={ROUTES.LOGIN} className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-brand-600/30 hover:shadow-brand-600/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              <span>Launch Enterprise Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>

          <a href="#roles" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700/80 text-slate-200 font-semibold text-sm hover:border-brand-500/40 transition-all flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Explore Role-Based Access</span>
            </button>
          </a>
        </motion.div>

        {/* Telemetry Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto"
        >
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl font-black text-white">$4.82M+</div>
            <div className="text-xs text-slate-400 mt-0.5">Monthly Volume</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl font-black text-emerald-400">99.99%</div>
            <div className="text-xs text-slate-400 mt-0.5">Uptime SLA</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl font-black text-brand-400">&lt; 50ms</div>
            <div className="text-xs text-slate-400 mt-0.5">API Latency</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl font-black text-purple-400">14 Hubs</div>
            <div className="text-xs text-slate-400 mt-0.5">Regional Nodes</div>
          </div>
        </motion.div>
      </section>

      {/* 3. Interactive Live Console Preview */}
      <section id="preview" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest">Interactive Command Center</h2>
          <p className="text-3xl font-black text-white tracking-tight">Explore the Operational Modules</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {PREVIEW_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePreview === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePreview(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/20 scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Preview Frame */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6 mb-6">
            <div className="space-y-1 max-w-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <selectedPreview.icon className="w-5 h-5 text-brand-400" />
                {selectedPreview.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedPreview.description}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {selectedPreview.metrics.map((m, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 text-center min-w-[110px]">
                  <div className="text-[10px] text-slate-400">{m.label}</div>
                  <div className="text-sm font-bold text-brand-300 mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Module Live Action Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Real-time WebSocket & REST Telemetry Connected</span>
            </div>

            <Link to={ROUTES.LOGIN}>
              <Button size="sm" variant="secondary" rightIcon={ArrowRight}>
                Launch {selectedPreview.label}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Instant Role-Based Access Credentials Card */}
      <section id="roles" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest">Enterprise Security Matrix</h2>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Role-Based Access Control (RBAC)
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Test any of the pre-configured enterprise personnel profiles. Each role unlocks specific modules according to strict corporate governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ENTERPRISE_ROLES.map((r, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">{r.role}</span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                  {r.badge}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">{r.desc}</p>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 space-y-1 text-xs font-mono">
                <div className="text-slate-400 flex justify-between">
                  <span>Email:</span>
                  <span className="text-brand-300">{r.email}</span>
                </div>
                <div className="text-slate-400 flex justify-between">
                  <span>Password:</span>
                  <span className="text-slate-200">Admin@12345</span>
                </div>
              </div>

              <Link to={ROUTES.LOGIN} className="block pt-2">
                <Button size="sm" variant="secondary" className="w-full" rightIcon={ChevronRight}>
                  Sign in as {r.role}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Enterprise Feature Pillars Grid */}
      <section id="features" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest">Comprehensive Capability</h2>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Six Engines in One Operating System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-brand-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Nexus AI Copilot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time conversational assistant analyzing stockout risk, client credit ceilings, and pricing adjustments.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-brand-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Procurement & Auto Reorder</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              1-Click AI automated purchase order issuance to replenish safety stocks across all regional facilities.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-brand-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Freight Logistics Dispatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-carrier tracking with printable manifests, vehicle numbers, and visual transit milestones.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-brand-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Accounts Receivable Aging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Commercial Net-30/60 invoicing, automatic tax calculations, and wire remittance reconciliation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-brand-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multi-Branch Node Tenancy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Spatial warehouse capacity utilization, fleet tracking, and regional management isolation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-brand-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Webhooks & Data Exporters</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cryptographic HMAC event dispatchers and 1-click consolidated CSV downloads for audits.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="relative z-10 border-t border-slate-850 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Layers className="w-4 h-4 text-brand-400" />
              </div>
            </div>
            <span className="font-bold text-white">BizCore Nexus Enterprise v4.0.0</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <span>SOC-2 Type II Certified</span>
            <span>•</span>
            <span>ISO 27001 Compliant</span>
            <span>•</span>
            <span>MongoDB Atlas Secured</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} BizCore Nexus Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
