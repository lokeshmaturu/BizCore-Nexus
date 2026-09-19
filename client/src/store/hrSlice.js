import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hrService } from '../services/hrService';

export const fetchEmployees = createAsyncThunk(
  'hr/fetchEmployees',
  async (params, { rejectWithValue }) => {
    try {
      return await hrService.getEmployees(params);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to fetch employee roster');
    }
  }
);

export const addEmployee = createAsyncThunk(
  'hr/addEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      return await hrService.createEmployee(employeeData);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to add employee');
    }
  }
);

export const fetchLeaves = createAsyncThunk(
  'hr/fetchLeaves',
  async (params, { rejectWithValue }) => {
    try {
      return await hrService.getLeaves(params);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to fetch leave requests');
    }
  }
);

export const addLeaveRequest = createAsyncThunk(
  'hr/addLeaveRequest',
  async (leaveData, { rejectWithValue }) => {
    try {
      return await hrService.createLeave(leaveData);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to submit leave');
    }
  }
);

export const reviewLeaveRequest = createAsyncThunk(
  'hr/reviewLeaveRequest',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      return await hrService.updateLeaveStatus(id, statusData);
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to review leave application');
    }
  }
);

const hrSlice = createSlice({
  name: 'hr',
  initialState: {
    employees: [],
    leaves: [],
    meta: { total: 0, page: 1, totalPages: 1 },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearHRError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload.data || [];
        state.meta = action.payload.meta || state.meta;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.unshift(action.payload);
      })
      // Leaves
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.leaves = action.payload.data || [];
      })
      .addCase(addLeaveRequest.fulfilled, (state, action) => {
        state.leaves.unshift(action.payload);
      })
      .addCase(reviewLeaveRequest.fulfilled, (state, action) => {
        state.leaves = state.leaves.map((l) =>
          l._id === action.payload._id ? action.payload : l
        );
      });
  },
});

export const { clearHRError } = hrSlice.actions;
export default hrSlice.reducer;
