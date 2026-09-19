import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Shield,
  Building2,
  Database,
  Key,
  Globe,
  Lock,
  Save,
  CheckCircle2,
  Server,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '../../components/common/PageTitle';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';

export const SettingsPage = () => {
  const { user, companyName, branch } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('general');

  const [companySettings, setCompanySettings] = useState({
    companyName: companyName || 'Apex Wholesale Corp',
    taxId: 'US-TAX-8921448',
    defaultCurrency: 'USD ($)',
    timezone: 'UTC-5 (Eastern Time)',
    autoReorder: true,
    webhookURL: 'https://api.nexus.enterprise/v2/events',
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Enterprise configuration committed across active nodes.');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <PageTitle
        title="Enterprise System Settings"
        subtitle="Global tenant settings, distribution node registry, and security policies."
        breadcrumbs={['Nexus', 'Management', 'Settings']}
      />

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-2xl border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveSubTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'general'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          General & Tenant
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'security'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Security & RBAC
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('database')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'database'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Database & Telemetry
        </button>
      </div>

      {activeSubTab === 'general' && (
        <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-400" />
              <span>Enterprise Identity Configuration</span>
            </h3>
            <p className="text-xs text-slate-400">
              Primary entity metadata utilized across wholesale consignment invoices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Operating Company Name"
              value={companySettings.companyName}
              onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
            />
            <Input
              label="Enterprise Federal Tax / VAT ID"
              value={companySettings.taxId}
              onChange={(e) => setCompanySettings({ ...companySettings, taxId: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary Ledger Currency"
              value={companySettings.defaultCurrency}
              disabled
              className="bg-slate-950 opacity-70"
            />
            <Input
              label="System Operational Timezone"
              value={companySettings.timezone}
              onChange={(e) => setCompanySettings({ ...companySettings, timezone: e.target.value })}
            />
          </div>

          <Input
            label="Real-time Webhook Event Dispatcher"
            value={companySettings.webhookURL}
            onChange={(e) => setCompanySettings({ ...companySettings, webhookURL: e.target.value })}
          />

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" leftIcon={Save}>
              Save Settings
            </Button>
          </div>
        </form>
      )}

      {activeSubTab === 'security' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>RBAC Policy & Security Enforcement</span>
            </h3>
            <p className="text-xs text-slate-400">
              Granular access control policies enforcing tenant isolation.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <p className="font-bold text-white">HttpOnly Cookie Encryption</p>
                <p className="text-slate-400">Tokens are protected from XSS scripts via strict cookies.</p>
              </div>
              <Badge variant="success" size="sm">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <p className="font-bold text-white">Bcrypt 12-Salt Hashing</p>
                <p className="text-slate-400">Passwords hashed with high-entropy cryptographic salts.</p>
              </div>
              <Badge variant="success" size="sm">Enforced</Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <p className="font-bold text-white">Brute-Force Rate Limiting</p>
                <p className="text-slate-400">DDoS and auth attack mitigation active on all endpoints.</p>
              </div>
              <Badge variant="success" size="sm">300 req / 15m</Badge>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'database' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-400" />
              <span>Cluster Telemetry & Health</span>
            </h3>
            <p className="text-xs text-slate-400">Live connectivity parameters for MongoDB Atlas.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <p className="text-slate-400">Cluster Host</p>
              <p className="text-white font-bold truncate">cluster0.zsumsne.mongodb.net</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <p className="text-slate-400">Database Name</p>
              <p className="text-emerald-400 font-bold">bizcore_nexus</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <p className="text-slate-400">API Protocol</p>
              <p className="text-brand-300 font-bold">RESTful JSON (Express v4)</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <p className="text-slate-400">Operational Phase</p>
              <p className="text-purple-400 font-bold">Phase 2 – Advanced Core</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
