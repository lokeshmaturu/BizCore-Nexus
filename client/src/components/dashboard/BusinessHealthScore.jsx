import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  TrendingUp,
  Boxes,
  Users,
  Briefcase,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../ui/Card';

export const BusinessHealthScore = ({ score = 87 }) => {
  const radius = 64;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const factors = [
    { name: 'Revenue Growth', score: 92, trend: '+14.8%', icon: TrendingUp, color: 'text-emerald-600', barColor: 'bg-emerald-500' },
    { name: 'Inventory Efficiency', score: 85, trend: '+9.2%', icon: Boxes, color: 'text-brand-600', barColor: 'bg-brand-600' },
    { name: 'Customer Retention', score: 94, trend: '98.4% ARR', icon: Users, color: 'text-blue-600', barColor: 'bg-blue-600' },
    { name: 'Employee Productivity', score: 81, trend: '99.1% SLA', icon: Briefcase, color: 'text-purple-600', barColor: 'bg-purple-600' },
    { name: 'Sales Pipeline Win Rate', score: 88, trend: '64.2% Win', icon: Zap, color: 'text-amber-600', barColor: 'bg-amber-500' },
  ];

  return (
    <Card className="p-6 border-slate-200/90 bg-white relative overflow-hidden shadow-sm space-y-6">
      {/* Glow Effect */}
      <div className="absolute -right-10 -top-10 w-48 h-48 bg-brand-100/50 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Enterprise Business Health Score</span>
            </h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Optimal Tier
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time composite index evaluated across 5 core operational vectors.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500 hidden sm:inline">
          Refreshed: <span className="text-slate-800 font-semibold">Live Real-Time</span>
        </span>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Gauge (4 Cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
              {/* Background Track */}
              <circle
                stroke="#e2e8f0"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Progress Gradient Track */}
              <circle
                stroke="url(#healthGradientLight)"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <defs>
                <linearGradient id="healthGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="50%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score Center Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">
                {score}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                / 100
              </span>
            </div>
          </div>

          <div className="text-center mt-3">
            <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> High Performance
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">Top 5% among wholesale enterprises</p>
          </div>
        </div>

        {/* Right: 5 Breakdown Vectors (8 Cols) */}
        <div className="md:col-span-8 space-y-2.5">
          {factors.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${f.color}`} />
                    <span className="font-semibold text-slate-800">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 font-mono">{f.trend}</span>
                    <span className="font-mono font-bold text-slate-900">{f.score}/100</span>
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.score}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full ${f.barColor} rounded-full`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default BusinessHealthScore;
