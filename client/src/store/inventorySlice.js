import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryService } from '../services/inventoryService';

export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      return await inventoryService.getProducts(params);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to fetch inventory catalog');
    }
  }
);

export const addProduct = createAsyncThunk(
  'inventory/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      return await inventoryService.createProduct(productData);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to create SKU');
    }
  }
);

export const modifyProduct = createAsyncThunk(
  'inventory/modifyProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await inventoryService.updateProduct(id, data);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to update SKU');
    }
  }
);

export const executeStockAdjustment = createAsyncThunk(
  'inventory/executeStockAdjustment',
  async (payload, { rejectWithValue }) => {
    try {
      return await inventoryService.adjustStock(payload);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to adjust stock');
    }
  }
);

export const fetchLowStockAlerts = createAsyncThunk(
  'inventory/fetchLowStockAlerts',
  async (_, { rejectWithValue }) => {
    try {
      return await inventoryService.getLowStockAlerts();
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to fetch low stock alerts');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    products: [],
    lowStockAlerts: [],
    meta: { total: 0, page: 1, totalPages: 1, limit: 12 },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearInventoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data || [];
        state.meta = action.payload.meta || state.meta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
        state.meta.total += 1;
      })
      .addCase(modifyProduct.fulfilled, (state, action) => {
        state.products = state.products.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(executeStockAdjustment.fulfilled, (state, action) => {
        const updated = action.payload.product;
        state.products = state.products.map((p) =>
          p._id === updated._id ? updated : p
        );
      })
      .addCase(fetchLowStockAlerts.fulfilled, (state, action) => {
        state.lowStockAlerts = action.payload || [];
      });
  },
});

export const { clearInventoryError } = inventorySlice.actions;
export default inventorySlice.reducer;
