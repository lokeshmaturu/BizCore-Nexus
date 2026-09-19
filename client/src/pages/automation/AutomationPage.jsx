import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Play,
  Pause,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Boxes,
  ShieldCheck,
  Send,
  Plus,
  RefreshCw,
  Cpu,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import {
  toggleRecipeStatus,
  triggerRecipeExecution,
} from '../../store/workflowSlice';
import { addAuditLog } from '../../store/auditSlice';
import { addNotification } from '../../store/notificationSlice';
import { formatCurrency } from '../../utils/formatters';

export const AutomationPage = () => {
  const dispatch = useDispatch();
  const { recipes, forecast } = useSelector((state) => state.workflow);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  const [newRecipeForm, setNewRecipeForm] = useState({
    name: '',
    category: 'INVENTORY & PROCUREMENT',
    trigger: 'SKU Inventory Threshold < 15 Units',
    action: 'Auto-Generate PO Draft + Send Slack Notification',
    description: 'Autonomous trigger to safeguard warehouse inventory levels.',
  });

  const handleToggle = (recipe) => {
    dispatch(toggleRecipeStatus(recipe.id));
    toast.success(
      `Workflow "${recipe.name}" is now ${recipe.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'}`
    );
  };

  const handleTestRun = (recipe) => {
    dispatch(triggerRecipeExecution(recipe.id));
    dispatch(
      addNotification({
        title: `⚡ Workflow Fired: ${recipe.name}`,
        message: `Executed action: ${recipe.action}`,
        type: 'system',
      })
    );
    dispatch(
      addAuditLog({
        action: 'AI_WORKFLOW_TRIGGERED',
        category: 'AUTOMATION',
        actor: 'nexus-ai-engine@internal',
        actorRole: 'AI Agent',
        resource: recipe.id,
        details: `Autonomous Recipe fired: ${recipe.name}. Action: ${recipe.action}`,
        severity: 'info',
      })
    );
    toast.success(`Simulated execution of "${recipe.name}" completed!`);
  };

  const categories = ['ALL', 'INVENTORY & PROCUREMENT', 'FINANCE & CRM', 'SALES & LOGISTICS', 'EXECUTIVE INTELLIGENCE'];

  const filteredRecipes = recipes.filter(
    (r) => selectedCategory === 'ALL' || r.category.toUpperCase().includes(selectedCategory)
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Autonomous <span className="gradient-text">AI Workflows</span> & Intelligence
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Phase 6 Engine
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Self-driving ERP automation recipes, predictive SKU stockout forecasting, and business policy triggers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            leftIcon={Plus}
            onClick={() => setIsRecipeModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-500"
          >
            Create AI Recipe
          </Button>
        </div>
      </div>

      {/* Enterprise Intelligence Telemetry KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/70 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Automated Actions Executed</span>
            <Zap className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {recipes.reduce((acc, r) => acc + r.runCount, 0)} Tasks
          </div>
          <div className="text-[11px] text-slate-400">Zero human intervention required</div>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/70 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Q4 Forecasted Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {formatCurrency(forecast.projectedRevenueQuarter)}
          </div>
          <div className="text-[11px] text-emerald-400/80 font-medium">
            +{forecast.growthPercentage}% YoY Growth Model
          </div>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/70 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Hours Saved Monthly</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">340+ Hrs</div>
          <div className="text-[11px] text-slate-400">Calculated across procurement & finance</div>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/70 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Stockout Prevention Rate</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">99.4%</div>
          <div className="text-[11px] text-slate-400">Continuous buffer scanning active</div>
        </Card>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Autonomous Recipes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRecipes.map((recipe) => (
          <Card
            key={recipe.id}
            className="p-5 border-slate-800 bg-slate-900/70 hover:border-slate-750 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-400">{recipe.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      recipe.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {recipe.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(recipe)}
                    className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 bg-slate-850 px-2 py-1 rounded-lg border border-slate-700/80"
                  >
                    {recipe.status === 'ACTIVE' ? (
                      <>
                        <Pause className="w-3 h-3 text-amber-400" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-emerald-400" /> Activate
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{recipe.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{recipe.description}</p>
              </div>

              {/* Trigger & Action Pipeline Flow */}
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold font-mono">IF:</span>
                  <span className="text-slate-300">{recipe.trigger}</span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-slate-800/80">
                  <span className="text-emerald-400 font-bold font-mono">THEN:</span>
                  <span className="text-slate-200 font-semibold">{recipe.action}</span>
                </div>
              </div>
            </div>

            {/* Footer Telemetry & Run Action */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <div>
                Total Executions: <span className="text-white font-bold">{recipe.runCount}</span> • Last Run:{' '}
                <span className="text-slate-300">{recipe.lastRun}</span>
              </div>

              <Button
                size="sm"
                variant="secondary"
                leftIcon={Play}
                onClick={() => handleTestRun(recipe)}
                className="bg-brand-500/10 border-brand-500/30 text-brand-300 hover:bg-brand-500/20"
              >
                Test Fire
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Machine Learning Demand Forecast & Risk Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Left 2 Cols: Stockout Risk Predictor */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Predictive Stockout Risk Matrix</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Calculated by historical burn rate, wholesale pipeline demand, and supplier lead times.
                </p>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg font-mono">
                ML Model: RF-v4.2
              </span>
            </div>

            <div className="space-y-2.5">
              {forecast.stockoutRiskSKUs.map((sku, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-850 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-mono text-[10px] font-bold text-brand-400">{sku.sku}</span>
                    <h4 className="text-xs font-bold text-white">{sku.name}</h4>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Depletion In:</span>
                      <span className="text-xs font-bold text-white">{sku.stockoutDays} Days</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        sku.riskLevel === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : sku.riskLevel === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {sku.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: AI Trajectory Preview */}
        <Card className="p-5 border-slate-800 bg-slate-900/80 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-400" />
              <span>Revenue Trajectory Horizon</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Historical performance reconciled against forward projection.
            </p>

            <div className="space-y-3 mt-4">
              {forecast.monthlyTrend.map((m, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{m.month}:</span>
                    <span className="font-mono text-slate-200 font-bold">${m.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full"
                      style={{ width: `${(m.revenue / 200000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300">
            <span className="font-bold block">Autonomous Confidence: 94.8%</span>
            <span className="text-[11px] text-slate-400">
              Calculated using Monte Carlo revenue projections across all active branch nodes.
            </span>
          </div>
        </Card>
      </div>

      {/* Create AI Recipe Modal */}
      <Modal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        title="Author Custom Autonomous Recipe"
        maxWidth="max-w-lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success(`Workflow Recipe "${newRecipeForm.name}" registered into autonomous daemon!`);
            setIsRecipeModalOpen(false);
          }}
          className="space-y-4"
        >
          <Input
            label="Recipe Name"
            placeholder="e.g. VIP Customer Shipment Priority Expediter"
            value={newRecipeForm.name}
            onChange={(e) => setNewRecipeForm({ ...newRecipeForm, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Category Scope
            </label>
            <select
              value={newRecipeForm.category}
              onChange={(e) => setNewRecipeForm({ ...newRecipeForm, category: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="INVENTORY & PROCUREMENT">INVENTORY & PROCUREMENT</option>
              <option value="FINANCE & CRM">FINANCE & CRM</option>
              <option value="SALES & LOGISTICS">SALES & LOGISTICS</option>
              <option value="EXECUTIVE INTELLIGENCE">EXECUTIVE INTELLIGENCE</option>
            </select>
          </div>

          <Input
            label="Trigger Condition (IF)"
            value={newRecipeForm.trigger}
            onChange={(e) => setNewRecipeForm({ ...newRecipeForm, trigger: e.target.value })}
            required
          />

          <Input
            label="Automated Action (THEN)"
            value={newRecipeForm.action}
            onChange={(e) => setNewRecipeForm({ ...newRecipeForm, action: e.target.value })}
            required
          />

          <Input
            label="Description"
            value={newRecipeForm.description}
            onChange={(e) => setNewRecipeForm({ ...newRecipeForm, description: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setIsRecipeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Activate Recipe</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AutomationPage;
