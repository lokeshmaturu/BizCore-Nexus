import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import settingsService from '../services/settingsService';

export const fetchBranches = createAsyncThunk(
  'settings/fetchBranches',
  async (_, { rejectWithValue }) => {
    try {
      return await settingsService.getBranches();
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch branches');
    }
  }
);

export const createBranch = createAsyncThunk(
  'settings/createBranch',
  async (data, { rejectWithValue }) => {
    try {
      return await settingsService.createBranch(data);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to provision branch');
    }
  }
);

export const fetchWebhooks = createAsyncThunk(
  'settings/fetchWebhooks',
  async (_, { rejectWithValue }) => {
    try {
      return await settingsService.getWebhooks();
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch webhooks');
    }
  }
);

export const createWebhook = createAsyncThunk(
  'settings/createWebhook',
  async (data, { rejectWithValue }) => {
    try {
      return await settingsService.createWebhook(data);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to create webhook');
    }
  }
);

export const testWebhook = createAsyncThunk(
  'settings/testWebhook',
  async (id, { rejectWithValue }) => {
    try {
      return await settingsService.testWebhook(id);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to test webhook ping');
    }
  }
);

export const fetchSystemConfig = createAsyncThunk(
  'settings/fetchSystemConfig',
  async (_, { rejectWithValue }) => {
    try {
      return await settingsService.getSystemConfig();
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch system config');
    }
  }
);

export const updateSystemConfig = createAsyncThunk(
  'settings/updateSystemConfig',
  async (data, { rejectWithValue }) => {
    try {
      return await settingsService.updateSystemConfig(data);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to update system config');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    branches: [],
    webhooks: [],
    config: null,
    lastPingResult: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
    },
    clearPingResult: (state) => {
      state.lastPingResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.branches = action.payload;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.branches.push(action.payload);
      })
      .addCase(fetchWebhooks.fulfilled, (state, action) => {
        state.webhooks = action.payload;
      })
      .addCase(createWebhook.fulfilled, (state, action) => {
        state.webhooks.unshift(action.payload);
      })
      .addCase(testWebhook.fulfilled, (state, action) => {
        state.lastPingResult = action.payload;
      })
      .addCase(fetchSystemConfig.fulfilled, (state, action) => {
        state.config = action.payload;
      })
      .addCase(updateSystemConfig.fulfilled, (state, action) => {
        state.config = action.payload;
      });
  },
});

export const { clearSettingsError, clearPingResult } = settingsSlice.actions;
export default settingsSlice.reducer;
