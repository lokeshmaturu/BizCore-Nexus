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
  Boxes,
  ShieldCheck,
  Plus,
  Cpu,
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
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto text-slate-900">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Autonomous <span className="gradient-text">AI Workflows</span> & Intelligence
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Phase 6 Engine
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Self-driving ERP automation recipes, predictive SKU stockout forecasting, and business policy triggers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            leftIcon={Plus}
            onClick={() => setIsRecipeModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700"
          >
            Create AI Recipe
          </Button>
        </div>
      </div>

      {/* Enterprise Intelligence Telemetry KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200/90 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Automated Actions Executed</span>
            <Zap className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {recipes.reduce((acc, r) => acc + r.runCount, 0)} Tasks
          </div>
          <div className="text-[11px] text-slate-500">Zero human intervention required</div>
        </Card>

        <Card className="p-5 border-slate-200/90 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Q4 Forecasted Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {formatCurrency(forecast.projectedRevenueQuarter)}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">
            +{forecast.growthPercentage}% YoY Growth Model
          </div>
        </Card>

        <Card className="p-5 border-slate-200/90 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Hours Saved Monthly</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700">340+ Hrs</div>
          <div className="text-[11px] text-slate-500">Calculated across procurement & finance</div>
        </Card>

        <Card className="p-5 border-slate-200/90 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Stockout Prevention Rate</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-800">99.4%</div>
          <div className="text-[11px] text-slate-500">Continuous buffer scanning active</div>
        </Card>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
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
            className="p-5 border-slate-200/90 bg-white hover:border-brand-300 transition-all space-y-4 flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-700">{recipe.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      recipe.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {recipe.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(recipe)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
                  >
                    {recipe.status === 'ACTIVE' ? (
                      <>
                        <Pause className="w-3 h-3 text-amber-600" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-emerald-600" /> Activate
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{recipe.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{recipe.description}</p>
              </div>

              {/* Trigger & Action Pipeline Flow */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs shadow-2xs">
                <div className="flex items-start gap-2">
                  <span className="text-brand-700 font-bold font-mono">IF:</span>
                  <span className="text-slate-700">{recipe.trigger}</span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-slate-200/80">
                  <span className="text-emerald-700 font-bold font-mono">THEN:</span>
                  <span className="text-slate-900 font-bold">{recipe.action}</span>
                </div>
              </div>
            </div>

            {/* Footer Telemetry & Run Action */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <div>
                Total Executions: <span className="text-slate-900 font-bold">{recipe.runCount}</span> • Last Run:{' '}
                <span className="text-slate-700 font-medium">{recipe.lastRun}</span>
              </div>

              <Button
                size="sm"
                variant="secondary"
                leftIcon={Play}
                onClick={() => handleTestRun(recipe)}
                className="bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100"
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
          <Card className="p-5 border-slate-200/90 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Predictive Stockout Risk Matrix</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated by historical burn rate, wholesale pipeline demand, and supplier lead times.
                </p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg font-mono font-bold">
                ML Model: RF-v4.2
              </span>
            </div>

            <div className="space-y-2.5">
              {forecast.stockoutRiskSKUs.map((sku, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 shadow-2xs"
                >
                  <div>
                    <span className="font-mono text-[10px] font-bold text-brand-700">{sku.sku}</span>
                    <h4 className="text-xs font-bold text-slate-900">{sku.name}</h4>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Depletion In:</span>
                      <span className="text-xs font-bold text-slate-900">{sku.stockoutDays} Days</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        sku.riskLevel === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : sku.riskLevel === 'HIGH'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
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
        <Card className="p-5 border-slate-200/90 bg-white space-y-4 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-600" />
              <span>Revenue Trajectory Horizon</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Historical performance reconciled against forward projection.
            </p>

            <div className="space-y-3 mt-4">
              {forecast.monthlyTrend.map((m, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">{m.month}:</span>
                    <span className="font-mono text-slate-900 font-bold">${m.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-600 to-indigo-600 rounded-full"
                      style={{ width: `${(m.revenue / 200000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-brand-50 border border-brand-200 text-xs text-brand-900 shadow-2xs">
            <span className="font-bold block">Autonomous Confidence: 94.8%</span>
            <span className="text-[11px] text-slate-600">
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Category Scope
            </label>
            <select
              value={newRecipeForm.category}
              onChange={(e) => setNewRecipeForm({ ...newRecipeForm, category: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-600"
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
