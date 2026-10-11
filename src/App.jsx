import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import Layout from './components/common/Layout.jsx';

// Pages
import DashboardPage from './pages/DashboardPage.jsx';
import MyDayPage from './pages/MyDayPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import GoalsPage from './pages/GoalsPage.jsx';
import HabitsPage from './pages/HabitsPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import FocusStudioPage from './pages/FocusStudioPage.jsx';
import LearningPage from './pages/LearningPage.jsx';
import FinancePage from './pages/FinancePage.jsx';
import JournalPage from './pages/JournalPage.jsx';
import InsightsPage from './pages/InsightsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public standalone pages */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Dashboard and Core OS pages enclosed in Layout */}
            <Route
              path="/"
              element={
                <Layout>
                  <DashboardPage />
                </Layout>
              }
            />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route
              path="/my-day"
              element={
                <Layout>
                  <MyDayPage />
                </Layout>
              }
            />
            <Route
              path="/tasks"
              element={
                <Layout>
                  <TasksPage />
                </Layout>
              }
            />
            <Route
              path="/goals"
              element={
                <Layout>
                  <GoalsPage />
                </Layout>
              }
            />
            <Route
              path="/habits"
              element={
                <Layout>
                  <HabitsPage />
                </Layout>
              }
            />
            <Route
              path="/calendar"
              element={
                <Layout>
                  <CalendarPage />
                </Layout>
              }
            />
            <Route
              path="/focus"
              element={
                <Layout>
                  <FocusStudioPage />
                </Layout>
              }
            />
            <Route
              path="/learning"
              element={
                <Layout>
                  <LearningPage />
                </Layout>
              }
            />
            <Route
              path="/finance"
              element={
                <Layout>
                  <FinancePage />
                </Layout>
              }
            />
            <Route
              path="/journal"
              element={
                <Layout>
                  <JournalPage />
                </Layout>
              }
            />
            <Route
              path="/insights"
              element={
                <Layout>
                  <InsightsPage />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <SettingsPage />
                </Layout>
              }
            />

            {/* 404 Not Found Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
