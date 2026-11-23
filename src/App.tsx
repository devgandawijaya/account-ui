import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AuthLayout } from './views/layouts/AuthLayout';
import { MainLayout } from './views/layouts/MainLayout';
import { LoginPage } from './views/pages/auth/LoginPage';
import { RegisterPage } from './views/pages/auth/RegisterPage';
import { DashboardOverviewPage } from './views/pages/dashboard/DashboardOverviewPage';
import { UsersManagementPage } from './views/pages/dashboard/UsersManagementPage';
import { RolesPermissionsPage } from './views/pages/dashboard/RolesPermissionsPage';
import { ActivityAuditPage } from './views/pages/dashboard/ActivityAuditPage';
import { SettingsProfilePage } from './views/pages/dashboard/SettingsProfilePage';
import { NotFoundPage } from './views/pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />

                        <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

                        <Route path="/dashboard" element={<MainLayout />}>
              <Route index element={<DashboardOverviewPage />} />
              <Route path="users" element={<UsersManagementPage />} />
              <Route path="roles" element={<RolesPermissionsPage />} />
              <Route path="activities" element={<ActivityAuditPage />} />
              <Route path="settings" element={<SettingsProfilePage />} />
            </Route>

                        <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
