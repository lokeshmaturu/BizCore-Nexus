import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { salesService } from '../services/salesService';

export const fetchCustomers = createAsyncThunk(
  'sales/fetchCustomers',
  async (params, { rejectWithValue }) => {
    try {
      return await salesService.getCustomers(params);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to fetch B2B customers');
    }
  }
);

export const addCustomer = createAsyncThunk(
  'sales/addCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      return await salesService.createCustomer(customerData);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to create customer');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'sales/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      return await salesService.getOrders(params);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to fetch wholesale orders');
    }
  }
);

export const addOrder = createAsyncThunk(
  'sales/addOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      return await salesService.createOrder(orderData);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to create wholesale order');
    }
  }
);

export const changeOrderStatus = createAsyncThunk(
  'sales/changeOrderStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      return await salesService.updateOrderStatus(id, statusData);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to update order status');
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    customers: [],
    orders: [],
    customerMeta: { total: 0, page: 1, totalPages: 1 },
    orderMeta: { total: 0, page: 1, totalPages: 1 },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearSalesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload.data || [];
        state.customerMeta = action.payload.meta || state.customerMeta;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.customers.unshift(action.payload);
      })
      // Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data || [];
        state.orderMeta = action.payload.meta || state.orderMeta;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        state.orders = state.orders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
      });
  },
});

export const { clearSalesError } = salesSlice.actions;
export default salesSlice.reducer;
