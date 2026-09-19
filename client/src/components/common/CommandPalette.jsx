import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Boxes,
  TrendingUp,
  ShoppingCart,
  Truck,
  Receipt,
  UserCheck,
  Settings,
  Sparkles,
  BrainCircuit,
  Download,
  DollarSign,
  Radio,
  Zap,
  ArrowRight,
  Command,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ROUTES } from '../../constants/routes';
import { setCommandPaletteOpen } from '../../store/workflowSlice';
import { toggleCopilot } from '../../store/aiSlice';
import { setCurrency } from '../../store/currencySlice';
import { triggerAutoReorder } from '../../store/procurementSlice';
import settingsService from '../../services/settingsService';
import { SIMULATION_EVENTS } from '../../services/socketSimulator';
import { useAuth } from '../../hooks/useAuth';

export const CommandPalette = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isOpen = useSelector((state) => state.workflow?.isCommandPaletteOpen);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Key Listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        dispatch(setCommandPaletteOpen(!isOpen));
      }
      if (e.key === 'Escape' && isOpen) {
        dispatch(setCommandPaletteOpen(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isOpen]);

  // Command Palette Items
  const commandItems = [
    // Navigation
    {
      id: 'nav-dash',
      title: 'Go to Executive Dashboard',
      category: 'NAVIGATION',
      icon: LayoutDashboard,
      action: () => navigate(ROUTES.DASHBOARD),
      shortcut: 'G D',
    },
    {
      id: 'nav-inv',
      title: 'Go to Inventory Control',
      category: 'NAVIGATION',
      icon: Boxes,
      action: () => navigate(ROUTES.INVENTORY),
      shortcut: 'G I',
    },
    {
      id: 'nav-sales',
      title: 'Go to Sales & Wholesale CRM',
      category: 'NAVIGATION',
      icon: TrendingUp,
      action: () => navigate(ROUTES.SALES),
      shortcut: 'G S',
    },
    {
      id: 'nav-procure',
      title: 'Go to Procurement & Re-orders',
      category: 'NAVIGATION',
      icon: ShoppingCart,
      action: () => navigate(ROUTES.PROCUREMENT),
      shortcut: 'G P',
    },
    {
      id: 'nav-logistics',
      title: 'Go to Logistics & Fleet Dispatch',
      category: 'NAVIGATION',
      icon: Truck,
      action: () => navigate(ROUTES.LOGISTICS),
      shortcut: 'G L',
    },
    {
      id: 'nav-finance',
      title: 'Go to Finance & Accounts Receivable',
      category: 'NAVIGATION',
      icon: Receipt,
      action: () => navigate(ROUTES.FINANCE),
      shortcut: 'G F',
    },
    {
      id: 'nav-hr',
      title: 'Go to HR & Personnel Directory',
      category: 'NAVIGATION',
      icon: UserCheck,
      action: () => navigate(ROUTES.HR),
      shortcut: 'G H',
    },
    {
      id: 'nav-automation',
      title: 'Go to Autonomous AI Workflows',
      category: 'NAVIGATION',
      icon: Sparkles,
      action: () => navigate(ROUTES.AUTOMATION),
      shortcut: 'G A',
    },
    {
      id: 'nav-telemetry',
      title: 'Go to System Telemetry & Cluster Health',
      category: 'NAVIGATION',
      icon: Radio,
      action: () => navigate(ROUTES.SYSTEM_HEALTH),
      shortcut: 'G T',
    },
    {
      id: 'nav-settings',
      title: 'Go to System & Branch Settings',
      category: 'NAVIGATION',
      icon: Settings,
      action: () => navigate(ROUTES.SETTINGS),
      shortcut: 'G X',
    },

    // AI & Autonomous Actions
    {
      id: 'act-copilot',
      title: 'Open Nexus AI Copilot Dialog',
      category: 'AI OPERATIONS',
      icon: BrainCircuit,
      action: () => dispatch(toggleCopilot()),
      shortcut: 'Ctrl+J',
    },
    {
      id: 'act-reorder',
      title: 'Trigger 1-Click AI Inventory Replenishment',
      category: 'AI OPERATIONS',
      icon: Zap,
      action: async () => {
        try {
          const res = await dispatch(triggerAutoReorder()).unwrap();
          toast.success(res.message || 'AI Auto-Reorder executed!');
        } catch (err) {
          toast.error('Reorder failed');
        }
      },
    },

    // Fast Data Exporters
    {
      id: 'exp-inv',
      title: 'Export Full Inventory Ledger (CSV)',
      category: 'EXPORTS',
      icon: Download,
      action: () => window.open(settingsService.exportDatasetUrl('inventory'), '_blank'),
    },
    {
      id: 'exp-sales',
      title: 'Export Wholesale Orders Ledger (CSV)',
      category: 'EXPORTS',
      icon: Download,
      action: () => window.open(settingsService.exportDatasetUrl('sales'), '_blank'),
    },
    {
      id: 'exp-fin',
      title: 'Export Invoices & AR Aging (CSV)',
      category: 'EXPORTS',
      icon: Download,
      action: () => window.open(settingsService.exportDatasetUrl('invoices'), '_blank'),
    },

    // Quick Currency Converters
    {
      id: 'cur-usd',
      title: 'Set Currency to US Dollar ($ USD)',
      category: 'CURRENCY',
      icon: DollarSign,
      action: () => {
        dispatch(setCurrency('USD'));
        toast.success('Display Currency set to USD');
      },
    },
    {
      id: 'cur-eur',
      title: 'Set Currency to Euro (€ EUR)',
      category: 'CURRENCY',
      icon: DollarSign,
      action: () => {
        dispatch(setCurrency('EUR'));
        toast.success('Display Currency set to EUR');
      },
    },
    {
      id: 'cur-inr',
      title: 'Set Currency to Indian Rupee (₹ INR)',
      category: 'CURRENCY',
      icon: DollarSign,
      action: () => {
        dispatch(setCurrency('INR'));
        toast.success('Display Currency set to INR');
      },
    },

    // Live Event Simulators
    {
      id: 'sim-order',
      title: 'Simulate Incoming $48,500 Wholesale PO',
      category: 'SIMULATION',
      icon: Radio,
      action: () => {
        SIMULATION_EVENTS[0].trigger(dispatch, user);
        toast.success('Dispatched incoming order simulation!');
      },
    },
  ];

  const filteredItems = commandItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item) => {
    dispatch(setCommandPaletteOpen(false));
    item.action();
  };

  // Keyboard navigation up/down/enter
  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(setCommandPaletteOpen(false))}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-2xl bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden glass-panel z-10"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800/80">
            <Search className="w-5 h-5 text-brand-400 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Type a command, search modules, or fire an action..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-white p-1 rounded-lg mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredItems.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-xs">
                No matching commands found for "{query}".
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/20 text-white border border-brand-500/40 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{item.title}</p>
                        <span className="text-[10px] text-slate-400">{item.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.shortcut && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                          {item.shortcut}
                        </span>
                      )}
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                  ↑
                </kbd>{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                  ↓
                </kbd>{' '}
                to navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                  ↵
                </kbd>{' '}
                to select
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-brand-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Universal Command Center (Phase 6)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
