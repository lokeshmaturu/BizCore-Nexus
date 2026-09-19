import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Building,
  FileText,
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Star,
  Zap,
  Boxes,
  AlertTriangle,
  RefreshCw,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchSuppliers,
  createSupplier,
  fetchPurchaseOrders,
  createPurchaseOrder,
  triggerAutoReorder,
  updatePOStatus,
} from '../../store/procurementSlice';
import { fetchProducts } from '../../store/inventorySlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { generatePurchaseOrderPDF } from '../../services/pdfService';

export const ProcurementPage = () => {
  const dispatch = useDispatch();
  const { suppliers, orders, isLoading, isReordering } = useSelector((state) => state.procurement);
  const { products } = useSelector((state) => state.inventory);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'suppliers'
  const [searchTerm, setSearchTerm] = useState('');
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  // New PO Form State
  const [poForm, setPoForm] = useState({
    supplierId: '',
    productId: '',
    quantity: 20,
    unitCost: 100,
    notes: '',
  });

  // New Supplier Form State
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    category: 'Electronics & Hardware',
    contactPerson: '',
    email: '',
    phone: '',
    leadTimeDays: 5,
    paymentTerms: 'Net 30',
  });

  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(fetchPurchaseOrders());
    dispatch(fetchProducts({ limit: 50 }));
  }, [dispatch]);

  const handleCreatePOSubmit = async (e) => {
    e.preventDefault();
    if (!poForm.supplierId || !poForm.productId) {
      toast.error('Please select both a supplier and a product.');
      return;
    }

    try {
      await dispatch(
        createPurchaseOrder({
          supplierId: poForm.supplierId,
          items: [
            {
              productId: poForm.productId,
              quantity: poForm.quantity,
              unitCost: poForm.unitCost,
            },
          ],
          notes: poForm.notes,
        })
      ).unwrap();
      toast.success('Purchase Order issued successfully!');
      setIsPOModalOpen(false);
    } catch (err) {
      toast.error(err || 'Failed to issue Purchase Order');
    }
  };

  const handleCreateSupplierSubmit = async (e) => {
    e.preventDefault();
    if (!supplierForm.name || !supplierForm.contactPerson || !supplierForm.email) {
      toast.error('Please fill in required supplier details.');
      return;
    }

    try {
      await dispatch(createSupplier(supplierForm)).unwrap();
      toast.success('Supplier onboarded successfully!');
      setIsSupplierModalOpen(false);
    } catch (err) {
      toast.error(err || 'Failed to onboard supplier');
    }
  };

  const handleAIAutoReorder = async () => {
    try {
      const res = await dispatch(triggerAutoReorder()).unwrap();
      toast.success(res.message || 'AI Auto-Reorder executed successfully!');
    } catch (err) {
      toast.error(err || 'Auto-reorder failed');
    }
  };

  const handleStatusChange = async (poId, nextStatus) => {
    try {
      await dispatch(updatePOStatus({ id: poId, status: nextStatus })).unwrap();
      toast.success(`Purchase Order marked as ${nextStatus}!`);
    } catch (err) {
      toast.error(err || 'Failed to update status');
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter((s) =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Procurement & <span className="gradient-text">Supply Operations</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3 text-brand-400" /> AI Replenishment
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Vendor matrix, automated PO generation, and inbound freight delivery pipelines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            leftIcon={RefreshCw}
            isLoading={isReordering}
            onClick={handleAIAutoReorder}
            className="bg-brand-500/10 border-brand-500/30 text-brand-300 hover:bg-brand-500/20"
          >
            1-Click AI Auto Reorder
          </Button>

          {activeTab === 'orders' ? (
            <Button leftIcon={Plus} onClick={() => setIsPOModalOpen(true)}>
              Issue Purchase Order
            </Button>
          ) : (
            <Button leftIcon={Plus} onClick={() => setIsSupplierModalOpen(true)}>
              Onboard Vendor
            </Button>
          )}
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Purchase Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'suppliers'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vendors Directory ({suppliers.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === 'orders' ? 'Search PO number...' : 'Search vendor name...'}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'orders' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map((po) => (
              <Card key={po._id} className="p-5 space-y-4 border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-brand-400">{po.poNumber}</span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      po.status === 'Received'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : po.status === 'In Transit'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {po.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white truncate">
                    {po.supplier?.name || 'Primary Vendor'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Destination: {po.destinationBranch}
                  </p>
                </div>

                <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-850">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Items ({po.items?.length || 0}):</span>
                    <span className="font-semibold text-white">
                      {po.items?.map((i) => i.name).join(', ') || 'Wholesale SKUs'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Total Amount:</span>
                    <span className="font-bold text-emerald-400">{formatCurrency(po.totalAmount)}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Expected Date:</span>
                    <span className="text-slate-300">{formatDate(po.expectedDeliveryDate)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={Download}
                    onClick={() => {
                      generatePurchaseOrderPDF({
                        poNumber: po.poNumber,
                        vendor: po.supplier?.name || 'Approved OEM Vendor',
                        item: po.items?.map(i => i.name).join(', ') || 'Wholesale Part',
                        quantity: po.items?.reduce((acc, i) => acc + (i.quantity || 0), 0) || 100,
                        totalAmount: po.totalAmount,
                        expectedDate: formatDate(po.expectedDeliveryDate),
                      });
                      toast.success(`Exported ${po.poNumber} as official PDF!`);
                    }}
                  >
                    PO PDF
                  </Button>
                  {po.status === 'Issued' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleStatusChange(po._id, 'In Transit')}
                    >
                      Mark Dispatched
                    </Button>
                  )}
                  {po.status === 'In Transit' && (
                    <Button
                      size="sm"
                      leftIcon={CheckCircle2}
                      onClick={() => handleStatusChange(po._id, 'Received')}
                    >
                      Receive & Restock
                    </Button>
                  )}
                  {po.status === 'Received' && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Inventory Restocked
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSuppliers.map((supp) => (
            <Card key={supp._id} className="p-5 space-y-4 border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">{supp.code}</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Star className="w-3 h-3 fill-amber-400" /> {supp.rating}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{supp.name}</h3>
                <span className="text-xs text-brand-400 font-medium">{supp.category}</span>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div>Contact: <span className="text-slate-200">{supp.contactPerson}</span></div>
                <div>Email: <span className="text-slate-200">{supp.email}</span></div>
                <div>Lead Time: <span className="text-slate-200">{supp.leadTimeDays} Days</span></div>
                <div>Terms: <span className="text-slate-200">{supp.paymentTerms}</span></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Issue Purchase Order Modal */}
      <Modal
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        title="Issue Enterprise Purchase Order"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreatePOSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Vendor / Supplier
            </label>
            <select
              value={poForm.supplierId}
              onChange={(e) => setPoForm({ ...poForm, supplierId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              required
            >
              <option value="">-- Choose Approved Vendor --</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.code}) - {s.category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Product SKU to Reorder
            </label>
            <select
              value={poForm.productId}
              onChange={(e) => {
                const p = products.find((prod) => prod._id === e.target.value);
                setPoForm({
                  ...poForm,
                  productId: e.target.value,
                  unitCost: p ? p.costPrice : 100,
                });
              }}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              required
            >
              <option value="">-- Choose Product SKU --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.sku} - {p.name} (Current: {p.currentStock} {p.unitOfMeasure})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Reorder Quantity"
              type="number"
              min="1"
              value={poForm.quantity}
              onChange={(e) => setPoForm({ ...poForm, quantity: parseInt(e.target.value, 10) || 1 })}
              required
            />
            <Input
              label="Agreed Unit Cost ($)"
              type="number"
              min="0"
              value={poForm.unitCost}
              onChange={(e) => setPoForm({ ...poForm, unitCost: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <Input
            label="Procurement Notes"
            placeholder="e.g. Standard freight consignment delivery."
            value={poForm.notes}
            onChange={(e) => setPoForm({ ...poForm, notes: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setIsPOModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Issue Purchase Order</Button>
          </div>
        </form>
      </Modal>

      {/* Onboard Vendor Modal */}
      <Modal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        title="Onboard Enterprise Vendor"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateSupplierSubmit} className="space-y-4">
          <Input
            label="Vendor Company Name"
            placeholder="e.g. Acme Industrial Semiconductors"
            value={supplierForm.name}
            onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={supplierForm.category}
              onChange={(e) => setSupplierForm({ ...supplierForm, category: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="Electronics & Hardware">Electronics & Hardware</option>
              <option value="Raw Materials & Metals">Raw Materials & Metals</option>
              <option value="Packaging & Cargo">Packaging & Cargo</option>
              <option value="Industrial Machinery">Industrial Machinery</option>
              <option value="Chemicals & Solvents">Chemicals & Solvents</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Contact Person"
              placeholder="e.g. John Doe"
              value={supplierForm.contactPerson}
              onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="vendor@company.com"
              value={supplierForm.email}
              onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone"
              placeholder="+1 (555) 000-0000"
              value={supplierForm.phone}
              onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
              required
            />
            <Input
              label="Lead Time (Days)"
              type="number"
              min="1"
              value={supplierForm.leadTimeDays}
              onChange={(e) => setSupplierForm({ ...supplierForm, leadTimeDays: parseInt(e.target.value, 10) || 5 })}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setIsSupplierModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Onboard Vendor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProcurementPage;
