import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';
import Spinner from '../components/ui/Spinner';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isInitializing, role } = useAuth();
  const location = useLocation();

  // Show full-screen loader while verifying session token on page reload
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="brand" label="Authenticating BizCore Nexus Session..." />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // If specific roles are required, verify RBAC permissions
  if (allowedRoles && allowedRoles.length > 0) {
    const isSuperAdmin = role === ROLES.SUPER_ADMIN;
    const isAuthorized = isSuperAdmin || allowedRoles.includes(role);

    if (!isAuthorized) {
      return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
