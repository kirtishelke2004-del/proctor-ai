import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card max-w-md w-full p-8 rounded-3xl text-center flex flex-col items-center border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900"
      >
        <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center text-indigo-500 mb-6">
          <ShieldAlert size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          404
        </h1>
        <h2 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-3">
          Assessment Endpoint Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 max-w-xs leading-relaxed">
          The page or test you are looking for does not exist or has been relocated.
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all duration-200 transform active:scale-95 text-xs"
        >
          <Home size={15} />
          Return to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
