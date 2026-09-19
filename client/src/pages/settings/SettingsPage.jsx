import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Download,
  Plus,
  Send,
  Zap,
  Layers,
  RefreshCw,
  Code,
  Radio,
  FileCheck2,
  AlertTriangle,
  History,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '../../components/common/PageTitle';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import {
  fetchBranches,
  createBranch,
  fetchWebhooks,
  createWebhook,
  testWebhook,
  fetchSystemConfig,
  updateSystemConfig,
  clearPingResult,
} from '../../store/settingsSlice';
import { setFilterSeverity, setSearchTerm as setAuditSearchTerm, clearAuditLogs } from '../../store/auditSlice';
import { SIMULATION_EVENTS } from '../../services/socketSimulator';
import settingsService from '../../services/settingsService';

export const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user, companyName, branch } = useAuth();
  const { branches, webhooks, config, lastPingResult, isLoading } = useSelector(
    (state) => state.settings
  );
  const { logs: auditLogs, filterSeverity, searchTerm: auditSearch } = useSelector(
    (state) => state.audit || { logs: [], filterSeverity: 'ALL', searchTerm: '' }
  );

  const [activeTab, setActiveTab] = useState('branches'); // 'branches' | 'webhooks' | 'audit' | 'simulation' | 'security' | 'exports'
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  // New Branch Form
  const [branchForm, setBranchForm] = useState({
    name: '',
    city: '',
    state: '',
    country: 'United States',
    managerName: '',
    managerEmail: '',
    capacitySqFt: 50000,
  });

  // New Webhook Form
  const [webhookForm, setWebhookForm] = useState({
    name: '',
    url: '',
    events: ['ORDER_CREATED', 'STOCK_DEPLETED'],
  });

  // Security Policy Form
  const [securityForm, setSecurityForm] = useState({
    sessionTimeoutMinutes: 120,
    enforceStrongPasswords: true,
    enableAuditLogging: true,
    defaultTaxRate: 4.0,
  });

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchWebhooks());
    dispatch(fetchSystemConfig());
  }, [dispatch]);

  useEffect(() => {
    if (config) {
      setSecurityForm({
        sessionTimeoutMinutes: config.sessionTimeoutMinutes || 120,
        enforceStrongPasswords: config.enforceStrongPasswords !== false,
        enableAuditLogging: config.enableAuditLogging !== false,
        defaultTaxRate: config.defaultTaxRate || 4.0,
      });
    }
  }, [config]);

  const handleCreateBranchSubmit = async (e) => {
    e.preventDefault();
    if (!branchForm.name || !branchForm.city || !branchForm.state) {
      toast.error('Please fill in required branch fields.');
      return;
    }

    try {
      await dispatch(createBranch(branchForm)).unwrap();
      toast.success('Operating Branch Node provisioned successfully!');
      setIsBranchModalOpen(false);
    } catch (err) {
      toast.error(err || 'Failed to create branch');
    }
  };

  const handleCreateWebhookSubmit = async (e) => {
    e.preventDefault();
    if (!webhookForm.name || !webhookForm.url) {
      toast.error('Please enter webhook endpoint name and URL.');
      return;
    }

    try {
      await dispatch(createWebhook(webhookForm)).unwrap();
      toast.success('Developer webhook endpoint registered!');
      setIsWebhookModalOpen(false);
    } catch (err) {
      toast.error(err || 'Failed to register webhook');
    }
  };

  const handleTestWebhookPing = async (webhookId) => {
    try {
      const res = await dispatch(testWebhook(webhookId)).unwrap();
      toast.success('Simulated HMAC SHA-256 Webhook ping dispatched!');
    } catch (err) {
      toast.error(err || 'Webhook ping failed');
    }
  };

  const handleSaveSecurityPolicies = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateSystemConfig(securityForm)).unwrap();
      toast.success('Enterprise security policies committed to cluster!');
    } catch (err) {
      toast.error(err || 'Failed to update policies');
    }
  };

  const handleDownloadDataset = (type) => {
    const url = settingsService.exportDatasetUrl(type);
    toast.promise(
      new Promise((resolve) => {
        window.open(url, '_blank');
        setTimeout(resolve, 800);
      }),
      {
        loading: `Compiling consolidated ${type} dataset...`,
        success: `Exported ${type.toUpperCase()} ledger dataset (CSV)!`,
        error: 'Export failed',
      }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Enterprise Command & <span className="gradient-text">Settings Console</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Multi-branch node registry, developer webhooks, security policies, and consolidated data export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Node v4.0 Active
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 w-fit flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('branches')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'branches'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Branch Nodes ({branches.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'webhooks'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Developer Webhooks ({webhooks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'audit'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Security Audit Trail ({auditLogs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('simulation')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'simulation'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Real-Time Event Simulator
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'security'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Security & Policies
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('exports')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'exports'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Data Backup & Exports
        </button>
      </div>

      {/* 1. Branch Operating Nodes Tab */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Regional Distribution Centers</h2>
              <p className="text-xs text-slate-400">Manage multi-branch warehousing, fleet units, and spatial utilization.</p>
            </div>
            <Button leftIcon={Plus} onClick={() => setIsBranchModalOpen(true)}>
              Provision Branch Node
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 text-xs">
                No branch nodes configured.
              </div>
            ) : (
              branches.map((b) => (
                <Card key={b._id} className="p-5 border-slate-800 bg-slate-900/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-400">{b.code}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Operational
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{b.name}</h3>
                    <p className="text-xs text-slate-400">{b.city}, {b.state} • {b.country}</p>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-850 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Director:</span>
                      <span className="text-slate-200 font-medium">{b.managerName}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Warehouse Area:</span>
                      <span className="text-slate-200 font-medium">{b.capacitySqFt?.toLocaleString()} sq.ft</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Fleet Assigned:</span>
                      <span className="text-slate-200 font-medium">{b.activeFleetUnits} Vehicles</span>
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Capacity Utilization:</span>
                      <span className="font-bold text-white">{b.utilizationPercentage || 65}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full"
                        style={{ width: `${b.utilizationPercentage || 65}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. Developer Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Event-Driven Webhooks & APIs</h2>
              <p className="text-xs text-slate-400">Stream live business events with cryptographic HMAC SHA-256 signatures.</p>
            </div>
            <Button leftIcon={Plus} onClick={() => setIsWebhookModalOpen(true)}>
              Register Webhook
            </Button>
          </div>

          <div className="space-y-3">
            {webhooks.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No webhooks configured yet.
              </div>
            ) : (
              webhooks.map((wh) => (
                <Card key={wh._id} className="p-5 border-slate-800 bg-slate-900/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{wh.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                          {wh.status}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-brand-300 mt-1 truncate max-w-lg">{wh.url}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={Send}
                        onClick={() => handleTestWebhookPing(wh._id)}
                      >
                        Test Ping
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Subscribed Events:</span>
                    {wh.events?.map((ev, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-brand-300 font-mono text-[10px]">
                        {ev}
                      </span>
                    ))}
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Test Ping Output Card */}
          {lastPingResult && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-brand-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Webhook Event Dispatch Simulation ({lastPingResult.statusCode} OK)
                </span>
                <button
                  onClick={() => dispatch(clearPingResult())}
                  className="text-slate-500 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900/90 text-brand-300 text-[11px] font-mono overflow-x-auto">
                {JSON.stringify(lastPingResult.samplePayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 3. Security Audit Trail Tab (Phase 5) */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-brand-400" />
                <span>Immutable Security Audit Log</span>
              </h2>
              <p className="text-xs text-slate-400">
                Cryptographic tamper-evident activity ledger tracking all system and role actions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                leftIcon={Download}
                onClick={() => {
                  const headers = 'ID,Timestamp,Actor,Role,Action,Resource,IP,Severity,Details\n';
                  const rows = auditLogs
                    .map(
                      (l) =>
                        `"${l.id}","${l.timestamp}","${l.actor}","${l.actorRole}","${l.action}","${l.resource}","${l.ipAddress}","${l.severity}","${l.details}"`
                    )
                    .join('\n');
                  const blob = new Blob([headers + rows], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `AuditTrail_${Date.now()}.csv`;
                  a.click();
                  toast.success('Downloaded complete Audit Trail CSV!');
                }}
              >
                Export Audit CSV
              </Button>
            </div>
          </div>

          {/* Severity Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              {['ALL', 'INFO', 'WARNING', 'CRITICAL'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => dispatch(setFilterSeverity(sev))}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterSeverity === sev
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white bg-slate-900/60'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={auditSearch}
              onChange={(e) => dispatch(setAuditSearchTerm(e.target.value))}
              placeholder="Search actor, action, or resource..."
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-full sm:w-64"
            />
          </div>

          {/* Audit Logs Table / Stream */}
          <div className="space-y-2.5">
            {auditLogs
              .filter((log) => {
                const matchesSev =
                  filterSeverity === 'ALL' || log.severity?.toUpperCase() === filterSeverity;
                const matchesText =
                  !auditSearch ||
                  log.actor?.toLowerCase().includes(auditSearch.toLowerCase()) ||
                  log.action?.toLowerCase().includes(auditSearch.toLowerCase()) ||
                  log.resource?.toLowerCase().includes(auditSearch.toLowerCase()) ||
                  log.details?.toLowerCase().includes(auditSearch.toLowerCase());
                return matchesSev && matchesText;
              })
              .map((log) => (
                <Card
                  key={log.id}
                  className="p-4 border-slate-850 bg-slate-900/70 hover:border-slate-750 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-slate-400">{log.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          log.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : log.severity === 'warning'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {log.severity}
                      </span>
                      <span className="font-mono text-xs font-bold text-brand-300">
                        {log.action}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleString()} • IP: {log.ipAddress}
                    </div>
                  </div>

                  <p className="text-xs text-slate-200">{log.details}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <div>
                      Actor: <span className="text-slate-200 font-semibold">{log.actor}</span> (
                      <span className="text-brand-400">{log.actorRole}</span>)
                    </div>
                    <div>
                      Resource: <span className="font-mono text-slate-300">{log.resource}</span>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* 4. Real-Time Event Simulation Tab (Phase 5) */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Real-Time WebSocket & Event Dispatch Simulator</span>
            </h2>
            <p className="text-xs text-slate-400">
              Trigger instant multi-client telemetry events across Sales, Inventory, Logistics, and Treasury feeds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SIMULATION_EVENTS.map((sim) => (
              <Card
                key={sim.id}
                className="p-5 border-slate-800 bg-slate-900/70 hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {sim.category}
                    </span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{sim.title}</h3>
                  <p className="text-xs text-slate-400">{sim.description}</p>
                </div>

                <Button
                  size="sm"
                  leftIcon={Send}
                  onClick={() => {
                    sim.trigger(dispatch, user);
                    toast.success(`Dispatched simulated event: "${sim.title}"!`);
                  }}
                  className="w-full bg-brand-600 hover:bg-brand-500"
                >
                  Fire Simulation Event
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 3. Security & Policies Tab */}
      {activeTab === 'security' && (
        <form onSubmit={handleSaveSecurityPolicies} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Enterprise Governance & Security Configuration</span>
            </h3>
            <p className="text-xs text-slate-400">Session lifecycles, authentication policies, and cryptographic audits.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Session Inactivity Timeout (Minutes)"
              type="number"
              value={securityForm.sessionTimeoutMinutes}
              onChange={(e) => setSecurityForm({ ...securityForm, sessionTimeoutMinutes: parseInt(e.target.value, 10) || 60 })}
            />
            <Input
              label="Default Wholesale Consignment Tax Rate (%)"
              type="number"
              step="0.1"
              value={securityForm.defaultTaxRate}
              onChange={(e) => setSecurityForm({ ...securityForm, defaultTaxRate: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={securityForm.enforceStrongPasswords}
                onChange={(e) => setSecurityForm({ ...securityForm, enforceStrongPasswords: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <div className="text-xs">
                <p className="font-bold text-white">Enforce High-Entropy Passwords</p>
                <p className="text-slate-400">Require uppercase, numeric, and special character combinations.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={securityForm.enableAuditLogging}
                onChange={(e) => setSecurityForm({ ...securityForm, enableAuditLogging: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <div className="text-xs">
                <p className="font-bold text-white">Comprehensive Audit Logging (SOC-2)</p>
                <p className="text-slate-400">Log all write actions across inventory, finance, and user provisioning.</p>
              </div>
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" leftIcon={Save}>
              Save Security Policies
            </Button>
          </div>
        </form>
      )}

      {/* 4. Data Backup & Exports Tab */}
      {activeTab === 'exports' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-brand-400" />
              <span>Consolidated Enterprise Dataset Exporters</span>
            </h3>
            <p className="text-xs text-slate-400">
              Download live, structured CSV ledger exports from your MongoDB Atlas database.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Inventory Valuation Ledger</h4>
                <p className="text-xs text-slate-400 mt-1">Complete SKU catalog, cost price, selling price, and warehouse bin allocations.</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={FileSpreadsheet}
                onClick={() => handleDownloadDataset('inventory')}
              >
                Export Inventory CSV
              </Button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Wholesale Orders Ledger</h4>
                <p className="text-xs text-slate-400 mt-1">Consolidated B2B orders with taxes, shipping fees, totals, and payment status.</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={FileSpreadsheet}
                onClick={() => handleDownloadDataset('sales')}
              >
                Export Orders CSV
              </Button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Accounts Receivable Aging</h4>
                <p className="text-xs text-slate-400 mt-1">Commercial tax invoices with due dates, amounts paid, and overdue balances.</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={FileSpreadsheet}
                onClick={() => handleDownloadDataset('invoices')}
              >
                Export Invoices CSV
              </Button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">B2B Customer Portfolios</h4>
                <p className="text-xs text-slate-400 mt-1">Client accounts, credit authorizations, payment terms, and contact profiles.</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={FileSpreadsheet}
                onClick={() => handleDownloadDataset('customers')}
              >
                Export Customers CSV
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Provision Branch Modal */}
      <Modal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        title="Provision Operating Branch Node"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateBranchSubmit} className="space-y-4">
          <Input
            label="Branch Name"
            placeholder="e.g. West Coast Regional Depot"
            value={branchForm.name}
            onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              placeholder="e.g. Los Angeles"
              value={branchForm.city}
              onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
              required
            />
            <Input
              label="State / Province"
              placeholder="e.g. CA"
              value={branchForm.state}
              onChange={(e) => setBranchForm({ ...branchForm, state: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Director Name"
              placeholder="e.g. Sarah Connor"
              value={branchForm.managerName}
              onChange={(e) => setBranchForm({ ...branchForm, managerName: e.target.value })}
              required
            />
            <Input
              label="Director Email"
              type="email"
              placeholder="director@bizcorenexus.com"
              value={branchForm.managerEmail}
              onChange={(e) => setBranchForm({ ...branchForm, managerEmail: e.target.value })}
              required
            />
          </div>

          <Input
            label="Facility Area (Sq. Ft)"
            type="number"
            min="1000"
            value={branchForm.capacitySqFt}
            onChange={(e) => setBranchForm({ ...branchForm, capacitySqFt: parseInt(e.target.value, 10) || 50000 })}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setIsBranchModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Provision Branch</Button>
          </div>
        </form>
      </Modal>

      {/* Register Webhook Modal */}
      <Modal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        title="Register Developer Webhook Endpoint"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateWebhookSubmit} className="space-y-4">
          <Input
            label="Webhook Integration Name"
            placeholder="e.g. ERP Cloud Sync Dispatcher"
            value={webhookForm.name}
            onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
            required
          />

          <Input
            label="Payload Destination URL (HTTPS)"
            placeholder="https://api.yourcompany.com/webhooks/bizcore"
            value={webhookForm.url}
            onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setIsWebhookModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Register Endpoint</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SettingsPage;
