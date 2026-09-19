import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import financeService from '../services/financeService';

export const fetchInvoices = createAsyncThunk(
  'finance/fetchInvoices',
  async (params, { rejectWithValue }) => {
    try {
      return await financeService.getInvoices(params);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch invoices');
    }
  }
);

export const createInvoice = createAsyncThunk(
  'finance/createInvoice',
  async (data, { rejectWithValue }) => {
    try {
      return await financeService.createInvoice(data);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to create invoice');
    }
  }
);

export const recordPayment = createAsyncThunk(
  'finance/recordPayment',
  async (data, { rejectWithValue }) => {
    try {
      return await financeService.recordPayment(data);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to record payment');
    }
  }
);

export const fetchFinanceAnalytics = createAsyncThunk(
  'finance/fetchFinanceAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      return await financeService.getFinanceAnalytics();
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch finance analytics');
    }
  }
);

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    invoices: [],
    analytics: null,
    pagination: { total: 0, page: 1, pages: 1 },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearFinanceError: (state) => {
      state.error = null;
    },
    updateInvoiceStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.invoices.findIndex((inv) => inv._id === id || inv.invoiceNumber === id);
      if (index !== -1) {
        state.invoices[index].status = status;
        if (status === 'Paid') {
          state.invoices[index].balanceDue = 0;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices = action.payload.invoices;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload);
      })
      .addCase(recordPayment.fulfilled, (state, action) => {
        const { updatedInvoice } = action.payload;
        const index = state.invoices.findIndex((inv) => inv._id === updatedInvoice._id);
        if (index !== -1) {
          state.invoices[index] = updatedInvoice;
        }
      })
      // Analytics
      .addCase(fetchFinanceAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export const { clearFinanceError, updateInvoiceStatus } = financeSlice.actions;
export default financeSlice.reducer;
