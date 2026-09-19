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

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    inventory: inventoryReducer,
    sales: salesReducer,
    hr: hrReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
