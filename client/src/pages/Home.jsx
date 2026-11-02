import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, ShieldCheck, Eye, Maximize2, Code2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const features = [
    {
      title: 'Monaco Code Sandbox',
      description: 'Industry-standard VS Code editor inside browser with multi-language syntax support and execution feedback.',
      icon: <Code2 className="text-indigo-500" size={24} />,
    },
    {
      title: 'Tab Switch Detection',
      description: 'Real-time visibility listeners track window blurs and tab switching, automatically escalating infractions.',
      icon: <Eye className="text-amber-500" size={24} />,
    },
    {
      title: 'Fullscreen Enforcement',
      description: 'Zero-distraction fullscreen lock. Leaving fullscreen triggers immediate security intervention modals.',
      icon: <Maximize2 className="text-red-500" size={24} />,
    },
    {
      title: 'Automated Cheat Score',
      description: 'Algorithmic assessment of infractions generates a normalized 0-100% cheat risk rating for recruiters and admins.',
      icon: <ShieldAlert className="text-purple-500" size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-6 py-16 z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2 border border-indigo-200 dark:border-indigo-800"
          >
            <ShieldCheck size={16} />
            Next-Gen Full-Stack AI Proctoring Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight"
          >
            Intelligent Remote Coding{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Assessment Proctoring
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            Empower technical assessments with client-side security event detection, tab tracking, fullscreen lockdown, and in-browser Monaco coding sandboxes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/register'}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 text-sm"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl font-bold transition text-sm shadow-sm"
            >
              Candidate / Admin Login
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 w-full">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * idx }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
