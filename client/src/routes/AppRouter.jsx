import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Core Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProfilePage from '../pages/profile/ProfilePage';
import UsersPage from '../pages/users/UsersPage';

// Phase 2 Enterprise Module Pages
import InventoryPage from '../pages/inventory/InventoryPage';
import SalesPage from '../pages/sales/SalesPage';
import HRPage from '../pages/hr/HRPage';
import SettingsPage from '../pages/settings/SettingsPage';

// Error Handlers
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';
import NotFoundPage from '../pages/errors/NotFoundPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Authentication Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          </Route>
        </Route>

        {/* 2. Core Protected Enterprise Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />

            {/* Role-Restricted Enterprise Directory */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    ROLES.SUPER_ADMIN,
                    ROLES.BRANCH_MANAGER,
                    ROLES.HR_MANAGER,
                  ]}
                />
              }
            >
              <Route path={ROUTES.USERS} element={<UsersPage />} />
            </Route>

            {/* Phase 2 Operational Enterprise Modules */}
            <Route path={ROUTES.INVENTORY} element={<InventoryPage />} />
            <Route path={ROUTES.SALES} element={<SalesPage />} />
            <Route path={ROUTES.HR} element={<HRPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />

            {/* Error Handlers Inside Layout */}
            <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
          </Route>
        </Route>

        {/* 3. Global Redirects & Catch-All */}
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
