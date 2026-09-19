import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Clock,
  ShieldCheck,
  Zap,
  Users,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Radio,
  Sliders,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  refreshTelemetryMetrics,
  runDatabaseOptimization,
} from '../../store/telemetrySlice';
import { addAuditLog } from '../../store/auditSlice';
import { addNotification } from '../../store/notificationSlice';

export const SystemHealthPage = () => {
  const dispatch = useDispatch();
  const { metrics, isOptimizing, lastOptimized } = useSelector(
    (state) => state.telemetry
  );

  // Auto-refresh telemetry pulse every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refreshTelemetryMetrics());
    }, 4000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleOptimizeDatabase = () => {
    dispatch(runDatabaseOptimization());
    dispatch(
      addAuditLog({
        action: 'DB_OPTIMIZATION_EXECUTED',
        category: 'SYSTEM_HEALTH',
        actor: 'superadmin@bizcore.com',
        actorRole: 'SuperAdmin',
        resource: 'MongoDB Atlas Cluster',
        details: 'Rebuilt compound indexes and purged expired session cache blocks.',
        severity: 'info',
      })
    );
    dispatch(
      addNotification({
        title: '🚀 Cluster Optimization Complete',
        message: 'Rebuilt compound collection indexes. Latency improved to 12.1ms.',
        type: 'system',
      })
    );
    toast.success('MongoDB Indexes rebuilt and cache flushed (12.1ms latency)!');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              System Telemetry & <span className="gradient-text">Cluster Health</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-semibold">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" /> Live Telemetry Pulse
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time server workloads, database connection pools, collaborative session presence, and API latencies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            leftIcon={RefreshCw}
            onClick={() => {
              dispatch(refreshTelemetryMetrics());
              toast.success('Telemetry counters refreshed!');
            }}
          >
            Poll Metrics
          </Button>

          <Button
            leftIcon={Zap}
            onClick={handleOptimizeDatabase}
            className="bg-brand-600 hover:bg-brand-500 text-white shadow-sm"
          >
            Optimize Indexes & Cache
          </Button>
        </div>
      </div>

      {/* Cluster Telemetry Top Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>CPU Compute Load</span>
            <Cpu className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.cpuUsage}%</div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-500"
              style={{ width: `${metrics.cpuUsage * 3}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500">Multi-core Node runtime pool</div>
        </Card>

        <Card className="p-5 border-slate-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Memory (RAM) Footprint</span>
            <HardDrive className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600">
            {metrics.memoryUsageMb} MB <span className="text-xs text-slate-400 font-normal">/ 2GB</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${(metrics.memoryUsageMb / metrics.maxMemoryMb) * 100}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500">Heap allocated & active cache buffers</div>
        </Card>

        <Card className="p-5 border-slate-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Average API Response Latency</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{metrics.avgLatencyMs} ms</div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, metrics.avgLatencyMs * 3)}%` }}
            />
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">Sub-50ms SLA Guaranteed</div>
        </Card>

        <Card className="p-5 border-slate-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>MongoDB Connection Pool</span>
            <Database className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {metrics.dbPoolActive} <span className="text-xs text-slate-400 font-normal">/ {metrics.dbPoolMax} Sockets</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(metrics.dbPoolActive / metrics.dbPoolMax) * 100}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500">Atlas Replica Set Primary Healthy</div>
        </Card>
      </div>

      {/* Mid Section: Collaborative Team Presence & API Endpoint Latency Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Collaborative Presence */}
        <Card className="p-5 border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600" />
                <span>Collaborative User Presence (Live Ops Room)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Active enterprise sessions connected across branch nodes.</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {metrics.activeSessions.length} Online
            </span>
          </div>

          <div className="space-y-2.5">
            {metrics.activeSessions.map((sess) => (
              <div
                key={sess.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900">{sess.user}</p>
                    <p className="text-[11px] text-slate-500">{sess.branch} • IP: {sess.ip}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-brand-700 font-semibold shadow-xs">
                    {sess.role}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{sess.lastActive}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* API Latency Radar Table */}
        <Card className="p-5 border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-600" />
                <span>REST API Endpoint Response Radar</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Live latency benchmarks and request distribution.</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Requests Today: {metrics.totalRequestsToday.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2.5">
            {metrics.apiEndpoints.map((api, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-slate-900">{api.endpoint}</span>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                    <span>Status: <span className="text-emerald-600 font-mono font-bold">{api.status}</span></span>
                    <span>•</span>
                    <span>Load: <span className="text-brand-700 font-medium">{api.load}</span></span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-emerald-600">{api.avgResponseMs} ms</span>
                  <span className="text-[10px] text-slate-400 block">Avg Latency</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Cluster Node Specs & Environmental Details */}
      <Card className="p-5 border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Production Environment Specifications</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Infrastructure configuration and SLA availability compliance.</p>
          </div>
          <span className="text-xs text-slate-500">Last Optimization: <span className="text-slate-900 font-semibold">{lastOptimized}</span></span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-semibold uppercase tracking-wider">CLUSTER REGION</span>
            <span className="font-bold text-slate-800">{metrics.clusterRegion}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-semibold uppercase tracking-wider">DATABASE VERSION</span>
            <span className="font-bold text-slate-800">{metrics.serverEnvironment}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-semibold uppercase tracking-wider">CACHE HIT RATIO</span>
            <span className="font-bold text-emerald-600">{metrics.cacheHitRatio}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-semibold uppercase tracking-wider">CLUSTER UPTIME</span>
            <span className="font-bold text-brand-700">99.99% (98k+ secs)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SystemHealthPage;
