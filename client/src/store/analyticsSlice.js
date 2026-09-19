import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from '../services/analyticsService';

export const fetchDashboardTelemetry = createAsyncThunk(
  'analytics/fetchDashboardTelemetry',
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsService.getDashboardMetrics();
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to fetch dashboard telemetry');
    }
  }
);

export const fetchAIPredictions = createAsyncThunk(
  'analytics/fetchAIPredictions',
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsService.getAIForecast();
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to fetch AI forecasts');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    dashboard: null,
    aiForecast: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardTelemetry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardTelemetry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardTelemetry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAIPredictions.fulfilled, (state, action) => {
        state.aiForecast = action.payload;
      });
  },
});

export default analyticsSlice.reducer;
