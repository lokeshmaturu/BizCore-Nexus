import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Plus,
  Search,
  Printer,
  ChevronRight,
  ShieldCheck,
  Send,
  Navigation,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchShipments,
  createShipment,
  updateShipmentStatus,
  fetchCarriers,
} from '../../store/logisticsSlice';
import { fetchOrders } from '../../store/salesSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { formatDate } from '../../utils/formatters';

export const LogisticsPage = () => {
  const dispatch = useDispatch();
  const { shipments, carriers, isLoading } = useSelector((state) => state.logistics);
  const { orders } = useSelector((state) => state.sales);

  const [searchTerm, setSearchTerm] = useState('');
  const [carrierFilter, setCarrierFilter] = useState('All');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedWaybill, setSelectedWaybill] = useState(null);

  // New Shipment Form
  const [dispatchForm, setDispatchForm] = useState({
    orderId: '',
    carrier: 'Nexus Fleet Transit',
    serviceLevel: 'Standard Ground',
    driverName: 'Robert Vance',
    vehicleNumber: 'NX-TRANSIT-804',
    totalWeightKg: 45,
    estimatedDeliveryDays: 3,
    waybillNotes: 'Consignment packaged with anti-static foam wrap.',
  });

  useEffect(() => {
    dispatch(fetchShipments());
    dispatch(fetchCarriers());
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleCreateDispatchSubmit = async (e) => {
    e.preventDefault();
    if (!dispatchForm.orderId) {
      toast.error('Please select an approved wholesale order to dispatch.');
      return;
    }

    try {
      await dispatch(createShipment(dispatchForm)).unwrap();
      toast.success('Shipment dispatched and tracking code generated!');
      setIsDispatchModalOpen(false);
    } catch (err) {
      toast.error(err || 'Failed to dispatch shipment');
    }
  };

  const handleAdvanceStatus = async (shipmentId, nextStatus) => {
    try {
      await dispatch(
        updateShipmentStatus({
          id: shipmentId,
          statusData: {
            status: nextStatus,
            checkpointNotes: `Transit milestone: ${nextStatus}`,
          },
        })
      ).unwrap();
      toast.success(`Shipment updated to ${nextStatus}!`);
    } catch (err) {
      toast.error(err || 'Failed to update shipment status');
    }
  };

  const handlePrintWaybill = () => {
    window.print();
  };

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customer?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.driverName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCarrier = carrierFilter === 'All' || s.carrier === carrierFilter;
    return matchesSearch && matchesCarrier;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Logistics, Freight & <span className="gradient-text">Dispatch Console</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time fleet tracking, carrier routes, and automatic waybill generation.
          </p>
        </div>

        <Button leftIcon={Plus} onClick={() => setIsDispatchModalOpen(true)}>
          New Shipment Dispatch
        </Button>
      </div>

      {/* Carrier Fleet Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {carriers.map((carrier, idx) => (
          <Card key={idx} className="p-4 space-y-2 border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate">{carrier.name}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-slate-400">{carrier.type}</div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">On-Time Rate:</span>
              <span className="font-bold text-emerald-400">{carrier.onTimeRate}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <select
            value={carrierFilter}
            onChange={(e) => setCarrierFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Freight Carriers</option>
            <option value="Nexus Fleet Transit">Nexus Fleet Transit</option>
            <option value="FedEx Enterprise">FedEx Enterprise</option>
            <option value="DHL Global Express">DHL Global Express</option>
            <option value="Union Freight Rail">Union Freight Rail</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tracking code or customer..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Active Shipments Pipeline */}
      <div className="space-y-4">
        {filteredShipments.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No active shipments match the current filters.
          </div>
        ) : (
          filteredShipments.map((shipment) => (
            <Card
              key={shipment._id}
              className="p-5 space-y-4 border-slate-800 hover:border-slate-700 transition-all bg-slate-900/70"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-brand-400">
                        {shipment.trackingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          shipment.status === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : shipment.status === 'In Transit'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Client: <span className="text-white font-semibold">{shipment.customer?.companyName || 'Enterprise Account'}</span> • Order: <span className="font-mono text-slate-400">{shipment.order?.orderNumber}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={Printer}
                    onClick={() => setSelectedWaybill(shipment)}
                  >
                    View Waybill
                  </Button>

                  {shipment.status === 'Preparing' && (
                    <Button
                      size="sm"
                      onClick={() => handleAdvanceStatus(shipment._id, 'In Transit')}
                    >
                      Depart Depot
                    </Button>
                  )}
                  {shipment.status === 'In Transit' && (
                    <Button
                      size="sm"
                      onClick={() => handleAdvanceStatus(shipment._id, 'Out for Delivery')}
                    >
                      Out for Delivery
                    </Button>
                  )}
                  {shipment.status === 'Out for Delivery' && (
                    <Button
                      size="sm"
                      leftIcon={CheckCircle2}
                      onClick={() => handleAdvanceStatus(shipment._id, 'Delivered')}
                    >
                      Confirm Delivery
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="pt-2">
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold text-slate-400">
                  <div className={`p-1.5 rounded-lg border ${shipment.status !== 'Draft' ? 'bg-brand-500/10 border-brand-500/30 text-brand-300' : 'border-slate-800'}`}>
                    1. Preparing
                  </div>
                  <div className={`p-1.5 rounded-lg border ${['In Transit', 'Out for Delivery', 'Delivered'].includes(shipment.status) ? 'bg-brand-500/10 border-brand-500/30 text-brand-300' : 'border-slate-800'}`}>
                    2. In Transit
                  </div>
                  <div className={`p-1.5 rounded-lg border ${['Out for Delivery', 'Delivered'].includes(shipment.status) ? 'bg-brand-500/10 border-brand-500/30 text-brand-300' : 'border-slate-800'}`}>
                    3. Out for Delivery
                  </div>
                  <div className={`p-1.5 rounded-lg border ${shipment.status === 'Delivered' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'border-slate-800'}`}>
                    4. Delivered
                  </div>
                </div>
              </div>

              {/* Freight Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-850 text-xs text-slate-400">
                <div>
                  <span className="text-[10px] text-slate-500 block">Carrier Route:</span>
                  <span className="text-slate-200 font-medium">{shipment.carrier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Driver & Vehicle:</span>
                  <span className="text-slate-200 font-medium">{shipment.driverName} ({shipment.vehicleNumber})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Weight & Cargo:</span>
                  <span className="text-slate-200 font-medium">{shipment.totalWeightKg} kg ({shipment.totalPackages} pkgs)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Estimated Arrival:</span>
                  <span className="text-slate-200 font-medium">{formatDate(shipment.estimatedDelivery)}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* New Shipment Dispatch Modal */}
      <Modal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        title="Dispatch Consignment Freight"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateDispatchSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Approved Wholesale Order
            </label>
            <select
              value={dispatchForm.orderId}
              onChange={(e) => setDispatchForm({ ...dispatchForm, orderId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              required
            >
              <option value="">-- Choose Order to Dispatch --</option>
              {orders.map((ord) => (
                <option key={ord._id} value={ord._id}>
                  {ord.orderNumber} - {ord.customerName} (${ord.totalAmount?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Carrier</label>
              <select
                value={dispatchForm.carrier}
                onChange={(e) => setDispatchForm({ ...dispatchForm, carrier: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Nexus Fleet Transit">Nexus Fleet Transit</option>
                <option value="FedEx Enterprise">FedEx Enterprise</option>
                <option value="DHL Global Express">DHL Global Express</option>
                <option value="Union Freight Rail">Union Freight Rail</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Service Tier</label>
              <select
                value={dispatchForm.serviceLevel}
                onChange={(e) => setDispatchForm({ ...dispatchForm, serviceLevel: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Standard Ground">Standard Ground</option>
                <option value="Next-Day Air">Next-Day Air</option>
                <option value="Priority Freight">Priority Freight</option>
                <option value="Bulk Rail">Bulk Rail</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Assigned Driver"
              value={dispatchForm.driverName}
              onChange={(e) => setDispatchForm({ ...dispatchForm, driverName: e.target.value })}
              required
            />
            <Input
              label="Vehicle Reg No."
              value={dispatchForm.vehicleNumber}
              onChange={(e) => setDispatchForm({ ...dispatchForm, vehicleNumber: e.target.value })}
              required
            />
          </div>

          <Input
            label="Consignment Waybill Notes"
            value={dispatchForm.waybillNotes}
            onChange={(e) => setDispatchForm({ ...dispatchForm, waybillNotes: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setIsDispatchModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Dispatch Freight</Button>
          </div>
        </form>
      </Modal>

      {/* Printable Waybill Modal */}
      <Modal
        isOpen={!!selectedWaybill}
        onClose={() => setSelectedWaybill(null)}
        title="Enterprise Freight Waybill Document"
        maxWidth="max-w-2xl"
      >
        {selectedWaybill && (
          <div className="space-y-6 text-slate-200">
            {/* Printable Waybill Card */}
            <div className="p-6 rounded-2xl bg-white text-slate-900 space-y-6 font-sans">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900">
                    BIZCORE NEXUS FREIGHT WAYBILL
                  </h2>
                  <p className="text-xs text-slate-600">Enterprise Logistics Dispatch Manifest</p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-slate-500">TRACKING NUMBER</div>
                  <div className="text-base font-black text-slate-900">{selectedWaybill.trackingNumber}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">ORIGIN DEPOT:</div>
                  <div className="font-bold text-slate-900">{selectedWaybill.originBranch}</div>
                  <div className="text-slate-600">Central Warehouse Loading Bay 4</div>
                </div>
                <div>
                  <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">CONSIGNEE:</div>
                  <div className="font-bold text-slate-900">{selectedWaybill.customer?.companyName}</div>
                  <div className="text-slate-600">{selectedWaybill.destinationAddress?.street || 'Commercial Delivery Gate'}</div>
                  <div className="text-slate-600">
                    {selectedWaybill.destinationAddress?.city}, {selectedWaybill.destinationAddress?.state} {selectedWaybill.destinationAddress?.postalCode}
                  </div>
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg p-3 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">CARRIER:</span>
                  <span className="font-bold">{selectedWaybill.carrier}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">SERVICE LEVEL:</span>
                  <span className="font-bold">{selectedWaybill.serviceLevel}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">GROSS WEIGHT:</span>
                  <span className="font-bold">{selectedWaybill.totalWeightKg} KG</span>
                </div>
              </div>

              <div className="text-xs border-t border-slate-200 pt-3">
                <span className="font-bold text-slate-700">SPECIAL HANDLING: </span>
                <span className="text-slate-600">{selectedWaybill.waybillNotes || 'Standard pallet cargo.'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setSelectedWaybill(null)}>
                Close
              </Button>
              <Button leftIcon={Printer} onClick={handlePrintWaybill}>
                Print Waybill
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LogisticsPage;
