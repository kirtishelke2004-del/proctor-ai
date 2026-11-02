import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="text-blue-500 animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Initializing workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
      {/* Top Header Navigation */}
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Page Layout Wrapper */}
      <div className="flex flex-1 relative">
        {/* Sidebar Nav */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Dynamic Content Frame */}
        <main className="flex-1 flex flex-col min-w-0 p-6 overflow-y-auto max-h-[calc(100vh-73px)]">
          <div className="flex-1 max-w-7xl w-full mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="h-full flex flex-col"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
