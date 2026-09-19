import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Boxes,
  TrendingUp,
  UserCheck,
  Settings,
  Sparkles,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { PageTitle } from '../../components/common/PageTitle';

const moduleConfigs = {
  [ROUTES.INVENTORY]: {
    title: 'Inventory Control & Warehouse Logistics',
    subtitle: 'Centralized SKU catalog, warehouse bin locations, and stock replenishment automation.',
    icon: Boxes,
    phase: 'Phase 2 Architecture',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    stats: [
      { label: 'Active SKUs Tracked', value: '86,420' },
      { label: 'Warehouse Nodes', value: '4 Hubs' },
      { label: 'Stock Turnover Index', value: '94.2%' },
    ],
  },
  [ROUTES.SALES]: {
    title: 'Sales, CRM & Wholesale Quotations',
    subtitle: 'B2B Wholesale account pipelines, RFQ quote generation, and bulk order fulfillment.',
    icon: TrendingUp,
    phase: 'Phase 2 Architecture',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    stats: [
      { label: 'Wholesale Accounts', value: '3,890' },
      { label: 'Active Quotations', value: '$1.4M' },
      { label: 'Fulfillment Rate', value: '99.1%' },
    ],
  },
  [ROUTES.HR]: {
    title: 'HR, Personnel & Department Allocations',
    subtitle: 'Employee records, attendance telemetry, shift schedules, and branch staffing.',
    icon: UserCheck,
    phase: 'Phase 2 Architecture',
    color: 'text-pink-400',
    borderColor: 'border-pink-500/30',
    bgColor: 'bg-pink-500/10',
    stats: [
      { label: 'Total Enterprise Staff', value: '1,248' },
      { label: 'Branch Allocations', value: '14 Facilities' },
      { label: 'Compliance Score', value: '100%' },
    ],
  },
  [ROUTES.SETTINGS]: {
    title: 'Enterprise System Settings',
    subtitle: 'Global company configurations, webhook integrations, and telemetry parameters.',
    icon: Settings,
    phase: 'Phase 2 Architecture',
    color: 'text-brand-400',
    borderColor: 'border-brand-500/30',
    bgColor: 'bg-brand-500/10',
    stats: [
      { label: 'Database Cluster', value: 'MongoDB Atlas' },
      { label: 'Security Standard', value: 'SOC-2' },
      { label: 'Uptime SLA', value: '99.99%' },
    ],
  },
};

export const ModulePlaceholderPage = () => {
  const location = useLocation();
  const config = moduleConfigs[location.pathname] || {
    title: 'Enterprise Operating Module',
    subtitle: 'This advanced subsystem is scheduled in the operational roadmap.',
    icon: Layers,
    phase: 'Phase 2 Architecture',
    color: 'text-brand-400',
    borderColor: 'border-brand-500/30',
    bgColor: 'bg-brand-500/10',
    stats: [
      { label: 'System Tier', value: 'Enterprise' },
      { label: 'API Protocol', value: 'REST JSON' },
      { label: 'Status', value: 'Ready' },
    ],
  };

  const Icon = config.icon;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <PageTitle
        title={config.title}
        subtitle={config.subtitle}
        breadcrumbs={['Nexus', 'Modules', config.title.split(' ')[0]]}
      />

      <div className="glass-panel bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div
            className={`w-16 h-16 mx-auto rounded-2xl ${config.bgColor} border ${config.borderColor} ${config.color} flex items-center justify-center shadow-xl`}
          >
            <Icon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-300">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>{config.phase}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {config.title}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              The foundational RBAC schema, data models, and API bridges for this module are established in Phase 1. Complete operational workflows will expand in Phase 2.
            </p>
          </div>

          {/* Key Metrics Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {config.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-left space-y-1"
              >
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  {stat.label}
                </p>
                <p className="text-lg font-bold text-white font-mono">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 flex flex-wrap gap-3 justify-center">
            <Link to={ROUTES.DASHBOARD}>
              <Button variant="primary" size="md" leftIcon={ArrowLeft}>
                Back to Operations Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePlaceholderPage;
