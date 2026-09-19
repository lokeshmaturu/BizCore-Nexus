import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Boxes,
  Search,
  Plus,
  AlertTriangle,
  ArrowUpDown,
  RefreshCw,
  Barcode,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchProducts,
  addProduct,
  executeStockAdjustment,
  fetchLowStockAlerts,
} from '../../store/inventorySlice';
import { PageTitle } from '../../components/common/PageTitle';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/SkeletonLoader';
import { formatCurrency } from '../../utils/formatters';

export const InventoryPage = () => {
  const dispatch = useDispatch();
  const { products, meta, lowStockAlerts, isLoading } = useSelector(
    (state) => state.inventory
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('Routine cycle count adjustment');

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    category: 'Wholesale Electronics',
    barcode: '',
    costPrice: '',
    sellingPrice: '',
    currentStock: '',
    reorderPoint: '20',
    unitOfMeasure: 'PCS',
    warehouseBin: 'Zone A - Bin 01',
    branch: 'Main Distribution Hub',
  });

  const loadData = () => {
    dispatch(
      fetchProducts({
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
      })
    );
    dispatch(fetchLowStockAlerts());
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        addProduct({
          ...newProduct,
          costPrice: parseFloat(newProduct.costPrice),
          sellingPrice: parseFloat(newProduct.sellingPrice),
          currentStock: parseInt(newProduct.currentStock, 10) || 0,
          reorderPoint: parseInt(newProduct.reorderPoint, 10) || 20,
        })
      ).unwrap();

      toast.success(`SKU ${newProduct.sku.toUpperCase()} provisioned into inventory catalog!`);
      setIsAddModalOpen(false);
      setNewProduct({
        sku: '',
        name: '',
        category: 'Wholesale Electronics',
        barcode: '',
        costPrice: '',
        sellingPrice: '',
        currentStock: '',
        reorderPoint: '20',
        unitOfMeasure: 'PCS',
        warehouseBin: 'Zone A - Bin 01',
        branch: 'Main Distribution Hub',
      });
      loadData();
    } catch (err) {
      toast.error(err || 'Failed to register product SKU');
    }
  };

  const openAdjustModal = (product) => {
    setSelectedProductForAdjust(product);
    setAdjustQty(product.currentStock.toString());
    setIsAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductForAdjust) return;

    try {
      await dispatch(
        executeStockAdjustment({
          productId: selectedProductForAdjust._id,
          newQuantity: parseInt(adjustQty, 10),
          reason: adjustReason,
        })
      ).unwrap();

      toast.success(`Stock level for ${selectedProductForAdjust.sku} updated.`);
      setIsAdjustModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err || 'Failed to adjust stock');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-900">
      {/* Header and Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageTitle
          title="Enterprise Inventory & Catalog"
          subtitle="Manage product SKUs, multi-location stock levels, reorder thresholds, and bin audits."
        />

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            leftIcon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            New Product SKU
          </Button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any items triggered */}
      {lowStockAlerts && lowStockAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span>Critical Depletion Alert:</span>
                <span className="font-mono underline">
                  {lowStockAlerts.length} SKU(s) Low or Out of Stock
                </span>
              </h4>
              <p className="text-xs text-amber-700">
                Items have reached or fallen below minimum automated reorder points.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedCategory('');
              setSearchTerm('');
              dispatch(fetchProducts({ lowStockOnly: 'true' }));
            }}
          >
            Filter Low Stock
          </Button>
        </div>
      )}

      {/* Search and Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by SKU, item name, barcode..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-600 focus:bg-white transition-all"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-56 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-600 font-medium"
          >
            <option value="">All Categories</option>
            <option value="Wholesale Electronics">Wholesale Electronics</option>
            <option value="Industrial Hardware">Industrial Hardware</option>
            <option value="Bulk Consumer Goods">Bulk Consumer Goods</option>
            <option value="Automation Components">Automation Components</option>
            <option value="Packaging Materials">Packaging Materials</option>
          </select>

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

      {/* Products Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Boxes className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-bold text-slate-800">No matching SKUs located</p>
            <p className="text-xs">Adjust your search parameters or category filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 bg-slate-50 border-b border-slate-200/80">
                  <th className="py-3 px-6 font-bold uppercase tracking-wider text-[11px]">SKU & Item Details</th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider text-[11px]">Category</th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider text-[11px]">Pricing (Cost / Sell)</th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider text-[11px]">On-Hand Stock</th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider text-[11px]">Bin Location</th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider text-[11px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-brand-700">
                            {item.sku}
                          </span>
                          <Badge
                            variant={
                              item.status === 'In Stock'
                                ? 'success'
                                : item.status === 'Low Stock'
                                ? 'warning'
                                : 'danger'
                            }
                            size="sm"
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <p className="font-bold text-slate-900 mt-0.5">{item.name}</p>
                        {item.barcode && (
                          <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Barcode className="w-3 h-3 text-slate-400" />
                            {item.barcode}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono">
                      <div>
                        <span className="text-slate-400 line-through mr-1.5 text-[11px]">
                          {formatCurrency(item.costPrice)}
                        </span>
                        <span className="text-emerald-700 font-bold">
                          {formatCurrency(item.sellingPrice)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900 text-sm">
                        {item.currentStock}{' '}
                        <span className="text-[10px] text-slate-500 font-normal">
                          {item.unitOfMeasure}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Min Reorder: {item.reorderPoint}
                      </p>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="text-slate-800 font-medium">{item.warehouseBin}</div>
                      <div className="text-[10px] text-slate-400">{item.branch}</div>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={ArrowUpDown}
                        onClick={() => openAdjustModal(item)}
                      >
                        Adjust Stock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add New SKU */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision New Inventory SKU"
        subtitle="Register catalog specifications, pricing metrics, and warehouse bins."
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="SKU Identifier"
              placeholder="e.g. ELEC-RTX-5090"
              value={newProduct.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
              required
            />
            <Input
              label="Barcode / UPC"
              placeholder="e.g. 890123456789"
              value={newProduct.barcode}
              onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
            />
          </div>

          <Input
            label="Product Name / Title"
            placeholder="e.g. Dual Xeon 64-Core Compute Node"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Category
              </label>
              <select
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-600"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value="Wholesale Electronics">Wholesale Electronics</option>
                <option value="Industrial Hardware">Industrial Hardware</option>
                <option value="Bulk Consumer Goods">Bulk Consumer Goods</option>
                <option value="Automation Components">Automation Components</option>
                <option value="Packaging Materials">Packaging Materials</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Unit of Measure
              </label>
              <select
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-600"
                value={newProduct.unitOfMeasure}
                onChange={(e) => setNewProduct({ ...newProduct, unitOfMeasure: e.target.value })}
              >
                <option value="PCS">PCS (Pieces)</option>
                <option value="BOX">BOX (Boxes)</option>
                <option value="PALLET">PALLET</option>
                <option value="KG">KG</option>
                <option value="CARTON">CARTON</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Cost Price ($ USD)"
              type="number"
              step="0.01"
              placeholder="e.g. 1200"
              value={newProduct.costPrice}
              onChange={(e) => setNewProduct({ ...newProduct, costPrice: e.target.value })}
              required
            />
            <Input
              label="Selling Price ($ USD)"
              type="number"
              step="0.01"
              placeholder="e.g. 1850"
              value={newProduct.sellingPrice}
              onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Initial Stock Quantity"
              type="number"
              placeholder="e.g. 50"
              value={newProduct.currentStock}
              onChange={(e) => setNewProduct({ ...newProduct, currentStock: e.target.value })}
              required
            />
            <Input
              label="Reorder Threshold Point"
              type="number"
              placeholder="e.g. 15"
              value={newProduct.reorderPoint}
              onChange={(e) => setNewProduct({ ...newProduct, reorderPoint: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Warehouse Bin Location"
              placeholder="Zone A - Bin 01"
              value={newProduct.warehouseBin}
              onChange={(e) => setNewProduct({ ...newProduct, warehouseBin: e.target.value })}
            />
            <Input
              label="Facility / Branch Node"
              placeholder="Main Distribution Hub"
              value={newProduct.branch}
              onChange={(e) => setNewProduct({ ...newProduct, branch: e.target.value })}
            />
          </div>

          <div className="pt-3 flex justify-end gap-2.5">
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save & Provision SKU
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Quick Stock Adjustment */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title={`Adjust Stock: ${selectedProductForAdjust?.sku}`}
        subtitle={`Current recorded quantity: ${selectedProductForAdjust?.currentStock} ${selectedProductForAdjust?.unitOfMeasure}`}
      >
        <form onSubmit={handleAdjustSubmit} className="space-y-4">
          <Input
            label="Verified Physical Count"
            type="number"
            value={adjustQty}
            onChange={(e) => setAdjustQty(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Reason for Adjustment
            </label>
            <select
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-600"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
            >
              <option value="Routine cycle count adjustment">Routine cycle count audit</option>
              <option value="Damaged/defective inventory write-off">Damaged/defective write-off</option>
              <option value="Supplier discrepancy correction">Supplier delivery correction</option>
              <option value="Returned stock restock">Customer RMA restock</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-2.5">
            <Button variant="secondary" size="sm" onClick={() => setIsAdjustModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Commit Adjustment & Log Audit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
