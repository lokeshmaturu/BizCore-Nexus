/**
 * Central Redux Toolkit Store
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import inventoryReducer from './inventorySlice';
import salesReducer from './salesSlice';
import hrReducer from './hrSlice';
import analyticsReducer from './analyticsSlice';
import procurementReducer from './procurementSlice';
import logisticsReducer from './logisticsSlice';
import financeReducer from './financeSlice';
import aiReducer from './aiSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    inventory: inventoryReducer,
    sales: salesReducer,
    hr: hrReducer,
    analytics: analyticsReducer,
    procurement: procurementReducer,
    logistics: logisticsReducer,
    finance: financeReducer,
    ai: aiReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
