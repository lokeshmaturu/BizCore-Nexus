/**
 * Users Redux Slice
 * Manages enterprise user directory, team queries, and profile editing.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../services/userService';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await userService.getUsers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await userService.getUserById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to fetch user details');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'users/updateUserProfile',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updated = await userService.updateUser(id, data);
      return updated;
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to update user');
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  'users/deleteUserAccount',
  async (id, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.customMessage || 'Failed to delete user');
    }
  }
);

const initialState = {
  users: [],
  selectedUser: null,
  meta: {
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 10,
    hasMore: false,
  },
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data || [];
        state.meta = action.payload.meta || state.meta;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch User by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update User Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        if (state.selectedUser && state.selectedUser._id === updated._id) {
          state.selectedUser = updated;
        }
        state.users = state.users.map((u) => (u._id === updated._id ? updated : u));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete User
    builder
      .addCase(deleteUserAccount.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
        if (state.meta.total > 0) state.meta.total -= 1;
      });
  },
});

export const { clearUserError, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
