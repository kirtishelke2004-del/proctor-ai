import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
        <Loader2 size={36} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorative Blur Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="max-w-md w-full z-10"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
