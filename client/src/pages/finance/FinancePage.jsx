import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  DollarSign,
  CreditCard,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Printer,
  FileCheck,
  ShieldCheck,
  ArrowUpRight,
  Send,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchInvoices,
  createInvoice,
  recordPayment,
  fetchFinanceAnalytics,
} from '../../store/financeSlice';
import { fetchOrders } from '../../store/salesSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { generateInvoicePDF } from '../../services/pdfService';

export const FinancePage = () => {
  const dispatch = useDispatch();
  const { invoices, analytics, isLoading } = useSelector((state) => state.finance);
  const { orders } = useSelector((state) => state.sales);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [selectedPrintInvoice, setSelectedPrintInvoice] = useState(null);

  // New Invoice Form
  const [invoiceForm, setInvoiceForm] = useState({
    orderId: '',
    dueDateDays: 30,
    paymentTerms: 'Net 30',
    notes: 'Payment payable via commercial wire transfer.',
  });

  // Payment Recording Form
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'Bank Wire',
    referenceNumber: '',
    notes: 'Wire remittance settled via Chase Commercial account.',
  });

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchFinanceAnalytics());
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleCreateInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceForm.orderId) {
      toast.error('Please select an order to invoice.');
      return;
    }

    try {
      await dispatch(createInvoice(invoiceForm)).unwrap();
      toast.success('Invoice generated and customer AR ledger updated!');
      setIsInvoiceModalOpen(false);
      dispatch(fetchFinanceAnalytics());
    } catch (err) {
      toast.error(err || 'Failed to generate invoice');
    }
  };

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment || !paymentForm.amount) {
      toast.error('Please specify payment amount.');
      return;
    }

    try {
      await dispatch(
        recordPayment({
          invoiceId: selectedInvoiceForPayment._id,
          amount: parseFloat(paymentForm.amount),
          paymentMethod: paymentForm.paymentMethod,
          referenceNumber: paymentForm.referenceNumber,
          notes: paymentForm.notes,
        })
      ).unwrap();
      toast.success('Payment recorded and ledger reconciled successfully!');
      setSelectedInvoiceForPayment(null);
      dispatch(fetchFinanceAnalytics());
    } catch (err) {
      toast.error(err || 'Failed to record payment');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Finance & <span className="gradient-text">Accounts Receivable</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Invoicing engine, accounts receivable aging, and corporate wire remittance ledger.
          </p>
        </div>

        <Button leftIcon={Plus} onClick={() => setIsInvoiceModalOpen(true)}>
          Generate New Invoice
        </Button>
      </div>

      {/* Financial AR Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/70 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Invoiced</span>
            <DollarSign className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {formatCurrency(analytics?.summary?.totalInvoiced || 131876)}
          </div>
          <div className="text-[11px] text-slate-400">Consolidated gross billed volume</div>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/70 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Collected</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">
            {formatCurrency(analytics?.summary?.totalCollected || 58816)}
          </div>
          <div className="text-[11px] text-emerald-400/80 font-medium">
            Collection Rate: {analytics?.summary?.collectionRate || '44.6%'}
          </div>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/70 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Outstanding AR Balance</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400">
            {formatCurrency(analytics?.summary?.totalOutstanding || 73060)}
          </div>
          <div className="text-[11px] text-slate-400">Receivables in Net-30/60 pipeline</div>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/70 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Overdue Exposure</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400">
            {formatCurrency(analytics?.summary?.overdueTotal || 0)}
          </div>
          <div className="text-[11px] text-slate-400">Past agreed payment grace period</div>
        </Card>
      </div>

      {/* AR Aging Breakdown */}
      {analytics?.aging && (
        <Card className="p-4 bg-slate-950/60 border-slate-850">
          <div className="text-xs font-bold text-slate-300 mb-3 flex items-center justify-between">
            <span>Accounts Receivable Aging Analysis</span>
            <span className="text-[10px] text-brand-400 font-normal">Real-time credit risk ledger</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">Current (0-30 Days)</div>
              <div className="text-sm font-bold text-emerald-400 mt-1">
                {formatCurrency(analytics.aging.current)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">31 - 60 Days</div>
              <div className="text-sm font-bold text-blue-400 mt-1">
                {formatCurrency(analytics.aging.thirtyToSixty)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">61 - 90 Days</div>
              <div className="text-sm font-bold text-amber-400 mt-1">
                {formatCurrency(analytics.aging.sixtyToNinety)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">90+ Days (High Risk)</div>
              <div className="text-sm font-bold text-rose-400 mt-1">
                {formatCurrency(analytics.aging.overNinety)}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Invoices</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice number or client..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No invoices found matching criteria.
          </div>
        ) : (
          filteredInvoices.map((inv) => (
            <Card
              key={inv._id}
              className="p-5 border-slate-800 hover:border-slate-700 transition-all bg-slate-900/60"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">
                        {inv.invoiceNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : inv.status === 'Partially Paid'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : inv.status === 'Overdue'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      Client: <span className="text-white font-semibold">{inv.customer?.companyName}</span> • Due Date: {formatDate(inv.dueDate)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Grand Total:</div>
                    <div className="text-sm font-bold text-white">{formatCurrency(inv.grandTotal)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Balance Due:</div>
                    <div className="text-sm font-bold text-amber-400">{formatCurrency(inv.balanceDue)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={Download}
                      onClick={() => {
                        generateInvoicePDF({
                          invoiceNumber: inv.invoiceNumber,
                          customer: inv.customer?.companyName || 'Enterprise Client',
                          amount: inv.grandTotal,
                          date: formatDate(inv.issueDate),
                          dueDate: formatDate(inv.dueDate),
                          status: inv.status,
                          items: inv.items?.map(i => ({ name: i.name || i.sku, qty: i.quantity, rate: i.unitPrice, total: i.total })),
                        });
                        toast.success(`Exported ${inv.invoiceNumber} as official PDF!`);
                      }}
                    >
                      Export PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={Printer}
                      onClick={() => setSelectedPrintInvoice(inv)}
                    >
                      Print
                    </Button>
                    {inv.balanceDue > 0 && (
                      <Button
                        size="sm"
                        leftIcon={CreditCard}
                        onClick={() => {
                          setSelectedInvoiceForPayment(inv);
                          setPaymentForm({
                            ...paymentForm,
                            amount: inv.balanceDue,
                            referenceNumber: `WIRE-${Date.now().toString().slice(-6)}`,
                          });
                        }}
                      >
                        Record Payment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Generate B2B Invoice from Order"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Wholesale Order
            </label>
            <select
              value={invoiceForm.orderId}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, orderId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              required
            >
              <option value="">-- Choose Order to Bill --</option>
              {orders.map((ord) => (
                <option key={ord._id} value={ord._id}>
                  {ord.orderNumber} - {ord.customerName} (${ord.totalAmount?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Payment Terms"
              value={invoiceForm.paymentTerms}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, paymentTerms: e.target.value })}
            />
            <Input
              label="Due Date Grace (Days)"
              type="number"
              min="1"
              value={invoiceForm.dueDateDays}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDateDays: parseInt(e.target.value, 10) || 30 })}
            />
          </div>

          <Input
            label="Remittance Notes"
            value={invoiceForm.notes}
            onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setIsInvoiceModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Generate Invoice</Button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={!!selectedInvoiceForPayment}
        onClose={() => setSelectedInvoiceForPayment(null)}
        title={`Record Payment for ${selectedInvoiceForPayment?.invoiceNumber}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 text-xs space-y-1">
            <div className="text-slate-400">
              Customer: <span className="text-white font-semibold">{selectedInvoiceForPayment?.customer?.companyName}</span>
            </div>
            <div className="text-slate-400">
              Outstanding Balance: <span className="text-amber-400 font-bold">{formatCurrency(selectedInvoiceForPayment?.balanceDue)}</span>
            </div>
          </div>

          <Input
            label="Remittance Amount ($)"
            type="number"
            min="1"
            max={selectedInvoiceForPayment?.balanceDue}
            value={paymentForm.amount}
            onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Payment Method
            </label>
            <select
              value={paymentForm.paymentMethod}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="Bank Wire">Bank Wire</option>
              <option value="Corporate Card">Corporate Card</option>
              <option value="ACH Transfer">ACH Transfer</option>
              <option value="Check">Check</option>
            </select>
          </div>

          <Input
            label="Transaction Reference Number"
            value={paymentForm.referenceNumber}
            onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setSelectedInvoiceForPayment(null)}>
              Cancel
            </Button>
            <Button type="submit">Settle Payment</Button>
          </div>
        </form>
      </Modal>

      {/* Printable Invoice Modal */}
      <Modal
        isOpen={!!selectedPrintInvoice}
        onClose={() => setSelectedPrintInvoice(null)}
        title="B2B Commercial Tax Invoice"
        maxWidth="max-w-2xl"
      >
        {selectedPrintInvoice && (
          <div className="space-y-6">
            <div className="p-8 rounded-2xl bg-white text-slate-900 space-y-6 font-sans">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    BIZCORE NEXUS ENTERPRISE
                  </h2>
                  <p className="text-xs text-slate-600">Distribution & Wholesale Logistics Operating System</p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-slate-500">INVOICE NO</div>
                  <div className="text-lg font-black text-slate-900">{selectedPrintInvoice.invoiceNumber}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">BILLED TO:</div>
                  <div className="font-bold text-slate-900">{selectedPrintInvoice.customer?.companyName}</div>
                  <div className="text-slate-600">{selectedPrintInvoice.customer?.email}</div>
                  <div className="text-slate-600">Payment Terms: {selectedPrintInvoice.paymentTerms}</div>
                </div>
                <div className="text-right">
                  <div><span className="font-bold">Date of Issue:</span> {formatDate(selectedPrintInvoice.issueDate)}</div>
                  <div><span className="font-bold">Payment Due Date:</span> {formatDate(selectedPrintInvoice.dueDate)}</div>
                  <div className="mt-2 font-bold uppercase text-slate-700">STATUS: {selectedPrintInvoice.status}</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedPrintInvoice.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium">{item.name || item.sku}</td>
                      <td className="p-2.5 text-center">{item.quantity}</td>
                      <td className="p-2.5 text-right">${item.unitPrice?.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-bold">${item.total?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end text-xs">
                <div className="w-56 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>${selectedPrintInvoice.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax:</span>
                    <span>${selectedPrintInvoice.taxAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm border-t border-slate-900 pt-2 text-slate-900">
                    <span>Grand Total:</span>
                    <span>${selectedPrintInvoice.grandTotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs text-amber-600">
                    <span>Balance Due:</span>
                    <span>${selectedPrintInvoice.balanceDue?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setSelectedPrintInvoice(null)}>
                Close
              </Button>
              <Button leftIcon={Printer} onClick={handlePrint}>
                Print Invoice
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FinancePage;
