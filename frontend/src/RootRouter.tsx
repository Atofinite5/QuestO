import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Public pages
import { App } from './App';
import { LoginPage } from './pages/auth/LoginPage';

// Protected layout
import { DashboardLayout } from './layouts/DashboardLayout';

// Internal app pages
import { DashboardHome } from './pages/app/DashboardHome';
import { StandupsPage } from './pages/app/StandupsPage';
import { TasksPage } from './pages/app/TasksPage';
import { RoadmapsPage } from './pages/app/RoadmapsPage';
import { TeamPage } from './pages/app/TeamPage';
import { TalentPage } from './pages/app/TalentPage';
import { LeavesPage } from './pages/app/LeavesPage';
import { MeetingsPage } from './pages/app/MeetingsPage';
import { AnalyticsPage } from './pages/app/AnalyticsPage';
import { AppSettingsPage } from './pages/app/AppSettingsPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export const RootRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Internal Dashboard */}
      <Route
        path="/app"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="standups" element={<StandupsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="roadmaps" element={<RoadmapsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="talent" element={<TalentPage />} />
        <Route path="leaves" element={<LeavesPage />} />
        <Route path="meetings" element={<MeetingsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<AppSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

