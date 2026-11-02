import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import { Loader2 } from 'lucide-react';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const TestView = React.lazy(() => import('./pages/TestView'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Fallback spinner component during lazy loading
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={36} className="text-indigo-600 animate-spin" />
      <p className="text-xs text-slate-400">Loading Proctor AI Module...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <AuthProvider>
            <Helmet>
              <title>Proctor AI | Intelligent Automated Assessment Proctoring</title>
              <meta
                name="description"
                content="Next-generation remote assessment proctoring with live tab tracking, fullscreen lockdown, cheat scoring, and Monaco code sandboxes."
              />
            </Helmet>

            <Router>
              <Suspense fallback={<SuspenseFallback />}>
                <Routes>
                  {/* Public / Auth Routes */}
                  <Route element={<AuthLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Route>

                  {/* Authenticated Dashboard Layout Routes */}
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Route>

                  {/* Immersive Distraction-Free Proctored Test Screen */}
                  <Route path="/test/:id" element={<TestView />} />

                  {/* Fallback 404 Route */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Suspense>
            </Router>

            <Toaster
              position="top-right"
              toastOptions={{
                className:
                  'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-semibold rounded-2xl shadow-xl',
                duration: 4000,
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
