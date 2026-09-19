import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Briefcase,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Building2,
  DollarSign,
  Truck,
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
  ShieldCheck,
  FileText,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchCustomers,
  addCustomer,
  fetchOrders,
  addOrder,
  changeOrderStatus,
} from '../../store/salesSlice';
import { fetchProducts } from '../../store/inventorySlice';
import { PageTitle } from '../../components/common/PageTitle';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/SkeletonLoader';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const SalesPage = () => {
  const dispatch = useDispatch();
  const { customers, orders, isLoading } = useSelector((state) => state.sales);
  const { products } = useSelector((state) => state.inventory);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'customers'
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // New Customer State
  const [newCustomer, setNewCustomer] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    tier: 'Silver',
    creditLimit: '75000',
    paymentTerms: 'Net 30',
    discountPercentage: '0',
    branch: 'Main Distribution Hub',
  });

  // New Order Builder State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState([
    { productId: '', quantity: 1, unitPrice: 0, discountPercentage: 0 },
  ]);
  const [shippingFee, setShippingFee] = useState('500');

  const loadData = () => {
    dispatch(fetchCustomers({ search: searchTerm || undefined }));
    dispatch(fetchOrders({ search: searchTerm || undefined }));
    dispatch(fetchProducts({ limit: 100 }));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        addCustomer({
          ...newCustomer,
          creditLimit: parseFloat(newCustomer.creditLimit),
          discountPercentage: parseFloat(newCustomer.discountPercentage || 0),
        })
      ).unwrap();

      toast.success(`Wholesale client ${newCustomer.companyName} onboarded!`);
      setIsCustomerModalOpen(false);
      setNewCustomer({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        tier: 'Silver',
        creditLimit: '75000',
        paymentTerms: 'Net 30',
        discountPercentage: '0',
        branch: 'Main Distribution Hub',
      });
      dispatch(fetchCustomers());
    } catch (err) {
      toast.error(err || 'Failed to onboard customer');
    }
  };

  const handleAddLineItem = () => {
    setOrderItems([
      ...orderItems,
      { productId: '', quantity: 1, unitPrice: 0, discountPercentage: 0 },
    ]);
  };

  const handleRemoveLineItem = (index) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, idx) => idx !== index));
    }
  };

  const handleItemProductChange = (index, prodId) => {
    const foundProduct = products.find((p) => p._id === prodId);
    const updated = [...orderItems];
    updated[index].productId = prodId;
    updated[index].unitPrice = foundProduct ? foundProduct.sellingPrice : 0;
    setOrderItems(updated);
  };

  const handleItemQtyChange = (index, qty) => {
    const updated = [...orderItems];
    updated[index].quantity = parseInt(qty, 10) || 1;
    setOrderItems(updated);
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((acc, item) => {
      return acc + (item.quantity || 1) * (item.unitPrice || 0);
    }, 0);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      toast.error('Please select an enterprise customer.');
      return;
    }
    const validItems = orderItems.filter((i) => i.productId && i.quantity > 0);
    if (validItems.length === 0) {
      toast.error('Please select at least one valid product SKU.');
      return;
    }

    try {
      await dispatch(
        addOrder({
          customerId: selectedCustomerId,
          items: validItems,
          shippingFee: parseFloat(shippingFee) || 0,
        })
      ).unwrap();

      toast.success('Wholesale requisition created and inventory reserved!');
      setIsOrderModalOpen(false);
      setSelectedCustomerId('');
      setOrderItems([{ productId: '', quantity: 1, unitPrice: 0, discountPercentage: 0 }]);
      dispatch(fetchOrders());
      dispatch(fetchProducts());
    } catch (err) {
      toast.error(err || 'Failed to create order');
    }
  };

  const handleAdvanceStatus = async (orderId, currentStatus) => {
    let nextStatus = 'Approved';
    if (currentStatus === 'Processing' || currentStatus === 'Approved') nextStatus = 'Shipped';
    if (currentStatus === 'Shipped') nextStatus = 'Delivered';

    try {
      await dispatch(
        changeOrderStatus({
          id: orderId,
          statusData: { status: nextStatus },
        })
      ).unwrap();
      toast.success(`Order advanced to '${nextStatus}'!`);
    } catch (err) {
      toast.error(err || 'Failed to update status');
    }
  };

  const subtotal = calculateSubtotal();
  const grandTotal = subtotal + (parseFloat(shippingFee) || 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle
        title="Sales, Wholesale Pipeline & B2B CRM"
        subtitle="Manage corporate accounts, wholesale requisitions, and dispatch pipelines."
        breadcrumbs={['Nexus', 'Operations', 'Sales & CRM']}
        action={
          <div className="flex gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={Building2}
              onClick={() => setIsCustomerModalOpen(true)}
            >
              Onboard Client
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={Plus}
              onClick={() => {
                if (customers.length > 0 && !selectedCustomerId) {
                  setSelectedCustomerId(customers[0]._id);
                }
                setIsOrderModalOpen(true);
              }}
            >
              New Wholesale Order
            </Button>
          </div>
        }
      />

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-3 rounded-2xl border border-slate-800">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800/80 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Wholesale Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'customers'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>B2B Accounts ({customers.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={RefreshCw}
            isLoading={isLoading}
            onClick={loadData}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Tab 1: Orders Pipeline View */}
      {activeTab === 'orders' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-800/40">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Truck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No wholesale orders recorded</p>
              <p className="text-xs">Requisition an order using the 'New Wholesale Order' button.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 bg-slate-950/40 border-b border-slate-800/80">
                    <th className="py-3 px-6 font-semibold">Order ID & Date</th>
                    <th className="py-3 px-6 font-semibold">Client Enterprise</th>
                    <th className="py-3 px-6 font-semibold">Consignment Total</th>
                    <th className="py-3 px-6 font-semibold">Line Items</th>
                    <th className="py-3 px-6 font-semibold">Status</th>
                    <th className="py-3 px-6 font-semibold text-right">Pipeline Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-200">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-6">
                        <span className="font-mono font-bold text-brand-300">
                          {o.orderNumber}
                        </span>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {formatDate(o.createdAt)}
                        </p>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="font-semibold text-white">{o.customerName}</div>
                        <div className="text-[10px] text-slate-400">{o.branch}</div>
                      </td>
                      <td className="py-3.5 px-6 font-mono font-bold text-emerald-400">
                        {formatCurrency(o.totalAmount)}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
                          {o.items?.length || 1} SKUs
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <Badge
                          variant={
                            o.status === 'Delivered'
                              ? 'success'
                              : o.status === 'Shipped'
                              ? 'brand'
                              : o.status === 'Cancelled'
                              ? 'danger'
                              : 'warning'
                          }
                          size="sm"
                          dot
                        >
                          {o.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        {o.status !== 'Delivered' && o.status !== 'Cancelled' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleAdvanceStatus(o._id, o.status)}
                          >
                            {o.status === 'Processing'
                              ? 'Ship Order'
                              : o.status === 'Shipped'
                              ? 'Mark Delivered'
                              : 'Advance Pipeline'}
                          </Button>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-mono font-medium">
                            Completed ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: B2B Customer Directory */}
      {activeTab === 'customers' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 bg-slate-950/40 border-b border-slate-800/80">
                  <th className="py-3 px-6 font-semibold">Company & Contact</th>
                  <th className="py-3 px-6 font-semibold">Tier</th>
                  <th className="py-3 px-6 font-semibold">Credit Limit</th>
                  <th className="py-3 px-6 font-semibold">Outstanding Balance</th>
                  <th className="py-3 px-6 font-semibold">Payment Terms</th>
                  <th className="py-3 px-6 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-200">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-white">{c.companyName}</div>
                      <div className="text-[11px] text-slate-400">
                        {c.contactPerson} ({c.email})
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          c.tier === 'Platinum'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : c.tier === 'Gold'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {c.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-200">
                      {formatCurrency(c.creditLimit)}
                    </td>
                    <td className="py-3.5 px-6 font-mono font-bold text-amber-400">
                      {formatCurrency(c.outstandingBalance)}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-300">{c.paymentTerms}</td>
                    <td className="py-3.5 px-6 text-right">
                      <Badge variant={c.status === 'Active' ? 'success' : 'danger'} size="sm">
                        {c.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Onboard Client */}
      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title="Onboard Wholesale B2B Client"
        subtitle="Establish enterprise credit facility, terms, and billing identity."
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <Input
            label="Corporate Entity Name"
            placeholder="e.g. Sterling Industrial Wholesale"
            value={newCustomer.companyName}
            onChange={(e) => setNewCustomer({ ...newCustomer, companyName: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Primary Contact Person"
              placeholder="e.g. David Sterling"
              value={newCustomer.contactPerson}
              onChange={(e) => setNewCustomer({ ...newCustomer, contactPerson: e.target.value })}
              required
            />
            <Input
              label="Official Contact Email"
              type="email"
              placeholder="david@sterling.com"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Wholesale Tier
              </label>
              <select
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-slate-100"
                value={newCustomer.tier}
                onChange={(e) => setNewCustomer({ ...newCustomer, tier: e.target.value })}
              >
                <option value="Platinum">Platinum (Enterprise Tier)</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Payment Terms
              </label>
              <select
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-slate-100"
                value={newCustomer.paymentTerms}
                onChange={(e) => setNewCustomer({ ...newCustomer, paymentTerms: e.target.value })}
              >
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Credit Facility Limit ($ USD)"
              type="number"
              placeholder="e.g. 150000"
              value={newCustomer.creditLimit}
              onChange={(e) => setNewCustomer({ ...newCustomer, creditLimit: e.target.value })}
              required
            />
            <Input
              label="Discount Rate (%)"
              type="number"
              placeholder="e.g. 5"
              value={newCustomer.discountPercentage}
              onChange={(e) => setNewCustomer({ ...newCustomer, discountPercentage: e.target.value })}
            />
          </div>

          <div className="pt-3 flex justify-end gap-2.5">
            <Button variant="secondary" size="sm" onClick={() => setIsCustomerModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Onboard Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Wholesale Order / RFQ */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Requisition Wholesale Consignment"
        subtitle="Select client, configure line items, and reserve warehouse inventory."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Wholesale Client Entity
            </label>
            <select
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-slate-100"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              required
            >
              <option value="">Select B2B Customer Account...</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.companyName} ({c.tier} Tier - {c.paymentTerms})
                </option>
              ))}
            </select>
          </div>

          {/* Line Items Builder */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Consignment Line Items
              </span>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
              >
                + Add Another Line Item
              </button>
            </div>

            {orderItems.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 items-center"
              >
                <div className="col-span-7">
                  <select
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-2 text-xs text-slate-100"
                    value={item.productId}
                    onChange={(e) => handleItemProductChange(idx, e.target.value)}
                    required
                  >
                    <option value="">Select Product SKU...</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.sku} – {p.name} ({formatCurrency(p.sellingPrice)}) [Stock: {p.currentStock}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-2 text-xs text-slate-100 font-mono text-center"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemQtyChange(idx, e.target.value)}
                    required
                  />
                </div>

                <div className="col-span-2 text-right font-mono font-bold text-xs text-emerald-400">
                  {formatCurrency((item.quantity || 1) * (item.unitPrice || 0))}
                </div>

                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveLineItem(idx)}
                    className="text-slate-500 hover:text-rose-400 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Calculation Summary */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="text-white">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400 items-center">
              <span>Freight / Shipping:</span>
              <input
                type="number"
                className="w-24 bg-slate-950 border border-slate-700 px-2 py-1 rounded text-right text-xs"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
              />
            </div>
            <div className="flex justify-between text-sm font-bold text-emerald-400 pt-2 border-t border-slate-800">
              <span>Grand Total:</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2.5">
            <Button variant="secondary" size="sm" onClick={() => setIsOrderModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm & Requisition Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SalesPage;
