import { Routes, Route, Navigate } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../layouts/MainLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Members } from '../pages/Members';
import { Groups } from '../pages/Groups';
import { Events } from '../pages/Events';
import { Unauthorized } from '../pages/Unauthorized';
import { NotFound } from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/events" element={<Events />} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
