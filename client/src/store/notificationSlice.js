import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../services/notificationService';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.getNotifications();
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markNotificationRead',
  async (id, { rejectWithValue }) => {
    try {
      return await notificationService.markAsRead(id);
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllNotificationsRead',
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.markAllAsRead();
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to mark all as read');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    isOpen: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    toggleNotificationDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },
    setNotificationDrawerOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    addNotification: (state, action) => {
      const newNotif = {
        _id: `notif-${Date.now()}`,
        title: action.payload.title || 'System Notification',
        message: action.payload.message || '',
        type: action.payload.type || 'system',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(newNotif);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const { toggleNotificationDrawer, setNotificationDrawerOpen, addNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
