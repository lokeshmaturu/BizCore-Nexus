import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

export const PublicRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  // If already authenticated and not in initial loading, redirect to Dashboard
  if (isAuthenticated && !isInitializing) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
