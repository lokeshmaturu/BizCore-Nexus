import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '../services/aiService';

export const queryCopilot = createAsyncThunk(
  'ai/queryCopilot',
  async (prompt, { rejectWithValue }) => {
    try {
      return await aiService.queryCopilot(prompt);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'AI Copilot query failed');
    }
  }
);

export const fetchAIRecommendations = createAsyncThunk(
  'ai/fetchAIRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      return await aiService.getRecommendations();
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch AI recommendations');
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    isOpen: false,
    history: [],
    currentResponse: null,
    recommendations: [],
    isQuerying: false,
    error: null,
  },
  reducers: {
    toggleCopilot: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCopilotOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    clearCopilotHistory: (state) => {
      state.history = [];
      state.currentResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(queryCopilot.pending, (state, action) => {
        state.isQuerying = true;
        state.error = null;
        state.history.push({
          role: 'user',
          prompt: action.meta.arg,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(queryCopilot.fulfilled, (state, action) => {
        state.isQuerying = false;
        state.currentResponse = action.payload;
        state.history.push({
          role: 'assistant',
          response: action.payload,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(queryCopilot.rejected, (state, action) => {
        state.isQuerying = false;
        state.error = action.payload;
      })
      .addCase(fetchAIRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      });
  },
});

export const { toggleCopilot, setCopilotOpen, clearCopilotHistory } = aiSlice.actions;
export default aiSlice.reducer;
