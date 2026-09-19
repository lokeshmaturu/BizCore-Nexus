import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import logisticsService from '../services/logisticsService';

export const fetchShipments = createAsyncThunk(
  'logistics/fetchShipments',
  async (params, { rejectWithValue }) => {
    try {
      return await logisticsService.getShipments(params);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch shipments');
    }
  }
);

export const createShipment = createAsyncThunk(
  'logistics/createShipment',
  async (data, { rejectWithValue }) => {
    try {
      return await logisticsService.createShipment(data);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to dispatch shipment');
    }
  }
);

export const updateShipmentStatus = createAsyncThunk(
  'logistics/updateShipmentStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      return await logisticsService.updateShipmentStatus(id, statusData);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to update shipment');
    }
  }
);

export const fetchCarriers = createAsyncThunk(
  'logistics/fetchCarriers',
  async (_, { rejectWithValue }) => {
    try {
      return await logisticsService.getCarriers();
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch carriers');
    }
  }
);

const logisticsSlice = createSlice({
  name: 'logistics',
  initialState: {
    shipments: [],
    carriers: [],
    pagination: { total: 0, page: 1, pages: 1 },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearLogisticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Shipments
      .addCase(fetchShipments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shipments = action.payload.shipments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.shipments.unshift(action.payload);
      })
      .addCase(updateShipmentStatus.fulfilled, (state, action) => {
        const index = state.shipments.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.shipments[index] = action.payload;
        }
      })
      // Carriers
      .addCase(fetchCarriers.fulfilled, (state, action) => {
        state.carriers = action.payload;
      });
  },
});

export const { clearLogisticsError } = logisticsSlice.actions;
export default logisticsSlice.reducer;
