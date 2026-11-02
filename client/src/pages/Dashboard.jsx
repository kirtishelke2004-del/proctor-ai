import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import testService from '../services/testService';
import {
  ShieldAlert,
  Clock,
  Code2,
  Play,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Maximize2,
  FileCode,
  Loader2,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await testService.getTests();
        setTests(response.data || []);
      } catch (err) {
        console.error('Failed to load tests:', err);
        // Fallback demo test if offline or unseeded
        setTests([
          {
            _id: 'sample-assessment-1',
            title: 'Full-Stack JavaScript & Algorithms Assessment',
            description:
              'Assess array manipulations, two pointer techniques, and algorithmic complexity in an automated sandbox.',
            durationMinutes: 30,
            questions: [
              { title: '1. Two Sum Problem' },
              { title: '2. Valid Parentheses' },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900 text-white p-8 sm:p-10 shadow-2xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-4 text-indigo-100">
            <Monitor size={14} /> Proctor AI Candidate Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.username || 'Candidate'}!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            Welcome to your secure assessment environment. All tests are proctored in real time using client-side security event detection and Monaco in-browser coding.
          </p>
        </div>
      </div>

      {/* Proctoring Rules & Security Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <Maximize2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Enforced Fullscreen
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              Tests must be taken in full-screen mode. Exiting fullscreen will log a security violation.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
            <Eye size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Tab Switch Monitoring
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              Visibility API tracks tab changes. Navigating outside the test window increases your cheat score.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Code2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Monaco Code Sandbox
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              Write, debug, and test your code directly inside VS Code powered Monaco editor in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Available Tests Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">
              Assigned Assessments
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an assessment below to launch the proctored test environment
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-indigo-600" size={36} />
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center p-12 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <FileCode className="mx-auto text-slate-400 mb-3" size={40} />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No tests currently available
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Ask your administrator to publish a new assessment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tests.map((test) => (
              <div
                key={test._id}
                className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={13} /> Active Test
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Clock size={14} /> {test.durationMinutes} mins
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {test.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {test.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Code2 size={14} className="text-indigo-500" />
                      {test.questions?.length || 1} Coding Challenge(s)
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <ShieldAlert size={14} className="text-amber-500" />
                      Strict Anti-Cheat
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => navigate(`/test/${test._id}`)}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 group-hover:translate-x-0.5"
                  >
                    <Play size={16} fill="currentColor" />
                    Enter Proctored Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
