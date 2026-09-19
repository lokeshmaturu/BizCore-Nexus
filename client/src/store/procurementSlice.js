import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import procurementService from '../services/procurementService';

export const fetchSuppliers = createAsyncThunk(
  'procurement/fetchSuppliers',
  async (params, { rejectWithValue }) => {
    try {
      return await procurementService.getSuppliers(params);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch suppliers');
    }
  }
);

export const createSupplier = createAsyncThunk(
  'procurement/createSupplier',
  async (data, { rejectWithValue }) => {
    try {
      return await procurementService.createSupplier(data);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to create supplier');
    }
  }
);

export const fetchPurchaseOrders = createAsyncThunk(
  'procurement/fetchPurchaseOrders',
  async (params, { rejectWithValue }) => {
    try {
      return await procurementService.getPurchaseOrders(params);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch purchase orders');
    }
  }
);

export const createPurchaseOrder = createAsyncThunk(
  'procurement/createPurchaseOrder',
  async (data, { rejectWithValue }) => {
    try {
      return await procurementService.createPurchaseOrder(data);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to create purchase order');
    }
  }
);

export const triggerAutoReorder = createAsyncThunk(
  'procurement/triggerAutoReorder',
  async (_, { rejectWithValue }) => {
    try {
      return await procurementService.triggerAutoReorder();
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to trigger AI auto-reorder');
    }
  }
);

export const updatePOStatus = createAsyncThunk(
  'procurement/updatePOStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await procurementService.updatePOStatus(id, status);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to update PO status');
    }
  }
);

const procurementSlice = createSlice({
  name: 'procurement',
  initialState: {
    suppliers: [],
    orders: [],
    pagination: { total: 0, page: 1, pages: 1 },
    isLoading: false,
    isReordering: false,
    error: null,
  },
  reducers: {
    clearProcurementError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Suppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suppliers = action.payload.suppliers;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.suppliers.unshift(action.payload);
      })
      // Purchase Orders
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      // 1-Click Auto Reorder
      .addCase(triggerAutoReorder.pending, (state) => {
        state.isReordering = true;
      })
      .addCase(triggerAutoReorder.fulfilled, (state, action) => {
        state.isReordering = false;
        if (action.payload.createdOrders && action.payload.createdOrders.length > 0) {
          state.orders = [...action.payload.createdOrders, ...state.orders];
        }
      })
      .addCase(triggerAutoReorder.rejected, (state, action) => {
        state.isReordering = false;
        state.error = action.payload;
      })
      // Update PO Status
      .addCase(updatePOStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export const { clearProcurementError } = procurementSlice.actions;
export default procurementSlice.reducer;
