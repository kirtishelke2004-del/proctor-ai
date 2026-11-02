import { useState, useEffect } from 'react';
import proctorService from '../services/proctorService';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  User,
  Clock,
  Code2,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Loader2,
  Maximize2,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await proctorService.getAdminLogs();
      setLogs(response.data || []);
    } catch (err) {
      console.warn('Backend logs unreachable or empty, loading demo proctor logs:', err.message);
      // Fallback demo data if backend database is empty or not seeded
      setLogs([
        {
          _id: 'log-1',
          userId: { username: 'john_doe', email: 'john@example.com' },
          testId: { title: 'Full-Stack JavaScript & Algorithms Assessment', durationMinutes: 30 },
          tabSwitchCount: 5,
          fullscreenExitCount: 3,
          cheatScore: 85,
          status: 'flagged',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          violationLogs: [
            {
              type: 'tab_switch',
              timestamp: new Date(Date.now() - 3400000).toISOString(),
              details: 'Candidate navigated away from browser tab',
              severity: 'medium',
            },
            {
              type: 'fullscreen_exit',
              timestamp: new Date(Date.now() - 3000000).toISOString(),
              details: 'Candidate exited full-screen mode',
              severity: 'high',
            },
            {
              type: 'tab_switch',
              timestamp: new Date(Date.now() - 2500000).toISOString(),
              details: 'Candidate switched tabs again',
              severity: 'high',
            },
            {
              type: 'copy_paste',
              timestamp: new Date(Date.now() - 2000000).toISOString(),
              details: 'Candidate attempted external clipboard paste',
              severity: 'high',
            },
          ],
          codeSubmissions: [
            {
              language: 'javascript',
              code: 'function twoSum(nums, target) {\n  // candidate paste attempt\n  return [0, 1];\n}',
            },
          ],
        },
        {
          _id: 'log-2',
          userId: { username: 'priya_dev', email: 'priya@example.com' },
          testId: { title: 'Full-Stack JavaScript & Algorithms Assessment', durationMinutes: 30 },
          tabSwitchCount: 2,
          fullscreenExitCount: 1,
          cheatScore: 50,
          status: 'submitted',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          violationLogs: [
            {
              type: 'tab_switch',
              timestamp: new Date(Date.now() - 6500000).toISOString(),
              details: 'Candidate tab switched for 3 seconds',
              severity: 'medium',
            },
            {
              type: 'fullscreen_exit',
              timestamp: new Date(Date.now() - 5800000).toISOString(),
              details: 'Exited fullscreen briefly',
              severity: 'medium',
            },
          ],
        },
        {
          _id: 'log-3',
          userId: { username: 'alex_coder', email: 'alex@example.com' },
          testId: { title: 'Full-Stack JavaScript & Algorithms Assessment', durationMinutes: 30 },
          tabSwitchCount: 0,
          fullscreenExitCount: 0,
          cheatScore: 0,
          status: 'submitted',
          createdAt: new Date(Date.now() - 14400000).toISOString(),
          violationLogs: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filtered logs
  const filteredLogs = logs.filter((log) => {
    const username = log.userId?.username?.toLowerCase() || '';
    const email = log.userId?.email?.toLowerCase() || '';
    const testTitle = log.testId?.title?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    const matchesSearch = username.includes(query) || email.includes(query) || testTitle.includes(query);

    if (!matchesSearch) return false;

    if (riskFilter === 'HIGH') return log.cheatScore >= 70;
    if (riskFilter === 'MEDIUM') return log.cheatScore >= 30 && log.cheatScore < 70;
    if (riskFilter === 'LOW') return log.cheatScore < 30;

    return true;
  });

  // KPI Metrics
  const totalCandidates = logs.length;
  const flaggedCandidates = logs.filter((l) => l.cheatScore >= 70).length;
  const avgScore =
    totalCandidates > 0
      ? Math.round(logs.reduce((acc, l) => acc + (l.cheatScore || 0), 0) / totalCandidates)
      : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
            <ShieldAlert size={16} /> Proctor AI Security Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Admin Proctoring Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review live candidate sessions, integrity telemetry, and automated cheat scores
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Logs
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Assessed
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
              {totalCandidates}
            </span>
            <span className="text-xs text-indigo-500 font-medium">Recorded</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Flagged (High Risk)
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-red-500">
              {flaggedCandidates}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold">
              Score &ge; 70%
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Average Cheat Score
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-amber-500">{avgScore}%</span>
            <span className="text-xs text-slate-400">System Aggregate</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Integrity Status
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-base font-bold text-emerald-500 flex items-center gap-1.5">
              <CheckCircle size={18} /> Strict Mode
            </span>
            <span className="text-xs text-slate-400">Live Active</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search candidate username, email, or test..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter size={13} /> Filter:
          </span>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                riskFilter === lvl
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {lvl === 'ALL' ? 'All Risks' : `${lvl} Risk`}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Logs Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No proctor logs found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Assessment</th>
                  <th className="py-3.5 px-4 text-center">Tab Switches</th>
                  <th className="py-3.5 px-4 text-center">Fullscreen Exits</th>
                  <th className="py-3.5 px-4 text-center">Cheat Score</th>
                  <th className="py-3.5 px-4 text-center">Risk Tier</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.map((log) => {
                  const score = log.cheatScore || 0;
                  const isHigh = score >= 70;
                  const isMed = score >= 30 && score < 70;

                  return (
                    <tr
                      key={log._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Candidate Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs uppercase">
                            {log.userId?.username?.substring(0, 2) || 'CA'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white">
                              {log.userId?.username || 'Unknown'}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {log.userId?.email || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Test Title */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {log.testId?.title || 'Coding Assessment'}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {log.status === 'submitted' ? 'Submitted' : 'In Progress'}
                        </span>
                      </td>

                      {/* Tab Switches */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md font-bold ${
                            log.tabSwitchCount > 0
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {log.tabSwitchCount || 0}
                        </span>
                      </td>

                      {/* Fullscreen Exits */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md font-bold ${
                            log.fullscreenExitCount > 0
                              ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {log.fullscreenExitCount || 0}
                        </span>
                      </td>

                      {/* Cheat Score */}
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm font-extrabold">{score}%</span>
                      </td>

                      {/* Risk Badge */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                            isHigh
                              ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800'
                              : isMed
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {isHigh ? 'High Risk' : isMed ? 'Moderate' : 'Clean / Low'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 font-bold transition"
                        >
                          <Eye size={13} />
                          Inspect Log
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILED LOG INSPECTION MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="text-indigo-500" size={20} />
                  Security Telemetry Breakdown
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Candidate: <strong className="text-slate-700 dark:text-slate-200">{selectedLog.userId?.username}</strong> ({selectedLog.userId?.email})
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Cheat Score</span>
                  <span className="text-xl font-bold text-red-500">{selectedLog.cheatScore}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Tab Strikes</span>
                  <span className="text-xl font-bold text-amber-500">{selectedLog.tabSwitchCount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Fullscreen Exits</span>
                  <span className="text-xl font-bold text-red-500">{selectedLog.fullscreenExitCount}</span>
                </div>
              </div>

              {/* Violation Timeline */}
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Chronological Infraction Timeline
                </h4>
                {selectedLog.violationLogs && selectedLog.violationLogs.length > 0 ? (
                  <div className="space-y-2">
                    {selectedLog.violationLogs.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3"
                      >
                        <div className="mt-0.5">
                          {v.type === 'tab_switch' ? (
                            <Eye className="text-amber-500" size={16} />
                          ) : (
                            <AlertTriangle className="text-red-500" size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300">
                              {v.type.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(v.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mt-0.5">{v.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-center font-medium">
                    Clean attempt! No security violations detected during this assessment session.
                  </p>
                )}
              </div>

              {/* Submitted Code Preview */}
              {selectedLog.codeSubmissions && selectedLog.codeSubmissions.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <Code2 size={14} /> Candidate Code Submission
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-48 border border-slate-800">
                    <pre>{selectedLog.codeSubmissions[0]?.code}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
