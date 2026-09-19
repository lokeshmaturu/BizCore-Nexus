import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  BrainCircuit,
  Bot,
  User,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Boxes,
  DollarSign,
  Truck,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { queryCopilot, toggleCopilot, setCopilotOpen, clearCopilotHistory } from '../../store/aiSlice';
import { Button } from '../ui/Button';

const QUICK_PROMPTS = [
  {
    icon: Boxes,
    label: 'Inventory Depletion Scan',
    prompt: 'Which SKUs are currently low in stock or nearing depletion?',
  },
  {
    icon: DollarSign,
    label: 'Revenue & Gross Volume',
    prompt: 'Analyze our wholesale revenue growth and consignment fulfillment velocity.',
  },
  {
    icon: Truck,
    label: 'Supplier Lead Times',
    prompt: 'Evaluate supplier delivery lead times and top vendor ratings.',
  },
  {
    icon: TrendingUp,
    label: 'Accounts Receivable Risk',
    prompt: 'Review B2B customer credit status and outstanding invoices.',
  },
];

export const NexusCopilotDrawer = () => {
  const dispatch = useDispatch();
  const { isOpen, history, currentResponse, isQuerying } = useSelector((state) => state.ai);
  const [inputPrompt, setInputPrompt] = useState('');
  const chatBottomRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isQuerying]);

  // Keyboard shortcut: Ctrl + J or Cmd + J
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        dispatch(toggleCopilot());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isQuerying) return;

    dispatch(queryCopilot(inputPrompt.trim()));
    setInputPrompt('');
  };

  const handleQuickPrompt = (prompt) => {
    if (isQuerying) return;
    dispatch(queryCopilot(prompt));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setCopilotOpen(false))}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          />

          {/* Copilot Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 p-0.5 shadow-md shadow-brand-500/20">
                  <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-brand-600" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      Nexus <span className="gradient-text">AI Copilot</span>
                    </h2>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-brand-600" /> Live OS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Enterprise natural language intelligence engine (Ctrl+J)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {history.length > 0 && (
                  <button
                    onClick={() => dispatch(clearCopilotHistory())}
                    title="Reset chat"
                    className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => dispatch(setCopilotOpen(false))}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conversation Flow Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
              {history.length === 0 ? (
                <div className="space-y-6 pt-4">
                  {/* Hero Greeting */}
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shadow-sm">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Ask Nexus AI Anything
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Instant queries over your MongoDB inventory stockouts, wholesale order pipelines, supplier lead-times, and accounts receivables.
                    </p>
                  </div>

                  {/* Suggested Prompts Grid */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Strategic Quick Queries
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {QUICK_PROMPTS.map((qp, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickPrompt(qp.prompt)}
                          className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-brand-300 text-left transition-all shadow-xs group"
                        >
                          <div className="flex items-center gap-3">
                            <qp.icon className="w-4 h-4 text-brand-600" />
                            <div>
                              <div className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                                {qp.label}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[280px]">
                                {qp.prompt}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                history.map((msg, index) => (
                  <div key={index} className="space-y-2">
                    {msg.role === 'user' ? (
                      <div className="flex items-start gap-2.5 justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-brand-600 text-white p-3.5 text-xs sm:text-sm font-medium shadow-sm leading-relaxed">
                          {msg.prompt}
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 text-slate-700">
                          <User className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0 text-brand-600">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="max-w-[90%] rounded-2xl rounded-tl-none bg-white border border-slate-200 text-slate-800 p-4 text-xs sm:text-sm space-y-3 leading-relaxed shadow-sm">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                            <Zap className="w-3.5 h-3.5 text-brand-600" />
                            {msg.response?.title || 'Nexus Intelligence Response'}
                          </div>

                          <p className="text-slate-700 leading-relaxed">
                            {msg.response?.answer}
                          </p>

                          {/* Key Telemetry Metrics */}
                          {msg.response?.keyMetrics && msg.response.keyMetrics.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                              {msg.response.keyMetrics.map((km, i) => (
                                <div
                                  key={i}
                                  className="p-2 rounded-lg bg-slate-50 border border-slate-200"
                                >
                                  <div className="text-[10px] text-slate-500 truncate font-semibold">{km.label}</div>
                                  <div className="text-xs font-bold text-slate-900 mt-0.5">{km.value}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Actionable Recommendations */}
                          {msg.response?.recommendations && msg.response.recommendations.length > 0 && (
                            <div className="space-y-1.5 pt-1 border-t border-slate-100">
                              <span className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider block">
                                Recommended Operations:
                              </span>
                              {msg.response.recommendations.map((rec, i) => (
                                <div
                                  key={i}
                                  className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                                  <div>
                                    <span className="font-semibold text-slate-900">
                                      {rec.sku ? `${rec.sku} - ${rec.name}: ` : rec.title ? `${rec.title}: ` : ''}
                                    </span>
                                    <span className="text-slate-600">
                                      {rec.recommendedOrder ? `Restock ${rec.recommendedOrder} units (${rec.priority})` : rec.detail}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Loading Indicator */}
              {isQuerying && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0 text-brand-600 animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl rounded-tl-none bg-white border border-slate-200 text-slate-500 text-xs flex items-center gap-2 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
                    <span>Aggregating enterprise cluster metrics & telemetry...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-white">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Ask about SKUs, cashflow, suppliers, or shipments..."
                  disabled={isQuerying}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-600 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isQuerying}
                  className="absolute right-2 p-2 rounded-lg bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default NexusCopilotDrawer;
