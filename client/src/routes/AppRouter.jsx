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
import LandingPage from '../pages/landing/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProfilePage from '../pages/profile/ProfilePage';
import UsersPage from '../pages/users/UsersPage';

// Phase 2 & 3 Enterprise Module Pages
import InventoryPage from '../pages/inventory/InventoryPage';
import SalesPage from '../pages/sales/SalesPage';
import ProcurementPage from '../pages/procurement/ProcurementPage';
import LogisticsPage from '../pages/logistics/LogisticsPage';
import FinancePage from '../pages/finance/FinancePage';
import HRPage from '../pages/hr/HRPage';
import SettingsPage from '../pages/settings/SettingsPage';
import AutomationPage from '../pages/automation/AutomationPage';
import SystemHealthPage from '../pages/telemetry/SystemHealthPage';

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

            {/* Inventory Control & Warehouse Management */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    ROLES.SUPER_ADMIN,
                    ROLES.BRANCH_MANAGER,
                    ROLES.INVENTORY_MANAGER,
                  ]}
                />
              }
            >
              <Route path={ROUTES.INVENTORY} element={<InventoryPage />} />
            </Route>

            {/* Sales Pipeline & CRM Deals */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    ROLES.SUPER_ADMIN,
                    ROLES.BRANCH_MANAGER,
                    ROLES.SALES_EXECUTIVE,
                  ]}
                />
              }
            >
              <Route path={ROUTES.SALES} element={<SalesPage />} />
            </Route>

            {/* Procurement & Purchase Orders */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    ROLES.SUPER_ADMIN,
                    ROLES.BRANCH_MANAGER,
                    ROLES.INVENTORY_MANAGER,
                  ]}
                />
              }
            >
              <Route path={ROUTES.PROCUREMENT} element={<ProcurementPage />} />
            </Route>

            {/* Logistics & Fleet Dispatch */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    ROLES.SUPER_ADMIN,
                    ROLES.BRANCH_MANAGER,
                    ROLES.INVENTORY_MANAGER,
                    ROLES.SALES_EXECUTIVE,
                  ]}
                />
              }
            >
              <Route path={ROUTES.LOGISTICS} element={<LogisticsPage />} />
            </Route>

            {/* Finance & Invoicing */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    ROLES.SUPER_ADMIN,
                    ROLES.BRANCH_MANAGER,
                    ROLES.SALES_EXECUTIVE,
                  ]}
                />
              }
            >
              <Route path={ROUTES.FINANCE} element={<FinancePage />} />
            </Route>

            {/* HR & Personnel Management */}
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
              <Route path={ROUTES.HR} element={<HRPage />} />
            </Route>

            {/* Enterprise System Configuration */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    ROLES.SUPER_ADMIN,
                    ROLES.BRANCH_MANAGER,
                  ]}
                />
              }
            >
              <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            </Route>

            {/* Autonomous AI Workflows & Intelligence (Phase 6) */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    ROLES.SUPER_ADMIN,
                    ROLES.BRANCH_MANAGER,
                    ROLES.INVENTORY_MANAGER,
                  ]}
                />
              }
            >
              <Route path={ROUTES.AUTOMATION} element={<AutomationPage />} />
            </Route>

            {/* System Telemetry & Cluster Health (Phase 7) */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    ROLES.SUPER_ADMIN,
                    ROLES.BRANCH_MANAGER,
                  ]}
                />
              }
            >
              <Route path={ROUTES.SYSTEM_HEALTH} element={<SystemHealthPage />} />
            </Route>

            {/* Error Handlers Inside Layout */}
            <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
          </Route>
        </Route>

        {/* 3. Global Public Landing Page & Catch-All */}
        <Route path={ROUTES.LANDING} element={<LandingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
