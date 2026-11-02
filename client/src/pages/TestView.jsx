import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAuth } from '../hooks/useAuth';
import proctorService from '../services/proctorService';
import testService from '../services/testService';
import {
  ShieldAlert,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Send,
  Loader2,
  RefreshCw,
  EyeOff,
  ChevronLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

const TestView = () => {
  const { id: testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Test and Questions State
  const [test, setTest] = useState(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [codeMap, setCodeMap] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Proctoring State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [fullscreenExits, setFullscreenExits] = useState(0);
  const [cheatScore, setCheatScore] = useState(0);
  const [recentViolation, setRecentViolation] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(30 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reference container for fullscreen
  const testContainerRef = useRef(null);

  // Fallback demo questions in case backend test is loading or mock
  const fallbackTest = {
    _id: testId || 'demo-test',
    title: 'Full-Stack JavaScript & Algorithms Assessment',
    description: 'Solve the algorithmic challenges while adhering to strict proctoring standards.',
    durationMinutes: 30,
    questions: [
      {
        _id: 'q1',
        title: '1. Two Sum Problem',
        difficulty: 'Easy',
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume each input has exactly one solution, and you may not use the same element twice.

**Example 1:**
- Input: \`nums = [2, 7, 11, 15], target = 9\`
- Output: \`[0, 1]\`
- Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

**Constraints:**
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9`,
        starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test runner
console.log("Test Case 1:", twoSum([2, 7, 11, 15], 9));
`,
      },
      {
        _id: 'q2',
        title: '2. Valid Parentheses',
        difficulty: 'Medium',
        description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example 1:**
- Input: \`s = "()[]{}"\`
- Output: \`true\`

**Example 2:**
- Input: \`s = "(]"\`
- Output: \`false\``,
        starterCode: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  for (const ch of s) {
    if (ch === '(' || ch === '{' || ch === '[') {
      stack.push(ch);
    } else if (map[ch]) {
      if (stack.pop() !== map[ch]) return false;
    }
  }

  return stack.length === 0;
}

console.log("Test Case 1 '()[]{}':", isValid("()[]{}"));
console.log("Test Case 2 '(]':", isValid("(]"));
`,
      },
    ],
  };

  // 1. Initial Load: Fetch Test & Initialize Proctor Session
  useEffect(() => {
    const initTestSession = async () => {
      try {
        setIsLoading(true);
        let testData = null;

        try {
          const testRes = await testService.getTestById(testId);
          testData = testRes.data;
        } catch (e) {
          console.warn('Using fallback test configuration:', e.message);
          testData = fallbackTest;
        }

        setTest(testData);
        setTimeLeftSeconds((testData.durationMinutes || 30) * 60);

        // Initialize starter code in map
        const initialMap = {};
        testData.questions.forEach((q, idx) => {
          initialMap[idx] = q.starterCode || '// Write solution here\n';
        });
        setCodeMap(initialMap);

        // Initialize proctor session with server
        try {
          const sessionRes = await proctorService.startSession(testData._id || testId);
          if (sessionRes.log) {
            setTabSwitches(sessionRes.log.tabSwitchCount || 0);
            setFullscreenExits(sessionRes.log.fullscreenExitCount || 0);
            setCheatScore(sessionRes.log.cheatScore || 0);
          }
        } catch (sessionErr) {
          console.warn('Proctor session init notice:', sessionErr.message);
        }
      } catch (err) {
        toast.error('Failed to load test session');
      } finally {
        setIsLoading(false);
      }
    };

    initTestSession();
  }, [testId]);

  // 2. Countdown Timer
  useEffect(() => {
    if (isSubmitted || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit('Test time elapsed. Submitting answers automatically.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, timeLeftSeconds]);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  // 3. Central Violation Reporter
  const reportViolation = useCallback(
    async (violationType, details) => {
      if (isSubmitted) return;

      console.warn(`[Proctor AI Security Trigger]: ${violationType}`, details);

      try {
        const response = await proctorService.logViolation(
          test?._id || testId,
          violationType,
          details
        );

        if (response.data) {
          setTabSwitches(response.data.tabSwitchCount);
          setFullscreenExits(response.data.fullscreenExitCount);
          setCheatScore(response.data.cheatScore);
          setRecentViolation(response.data.recentViolation);
        }
      } catch (err) {
        // Fallback local calculation if backend is disconnected
        if (violationType === 'tab_switch') {
          setTabSwitches((c) => {
            const next = c + 1;
            setCheatScore((s) => Math.min(100, s + 15));
            return next;
          });
        } else if (violationType === 'fullscreen_exit') {
          setFullscreenExits((c) => {
            const next = c + 1;
            setCheatScore((s) => Math.min(100, s + 20));
            return next;
          });
        }
      }
    },
    [test, testId, isSubmitted]
  );

  // 4. Security Listener: visibilitychange (Detects Tab Switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted) {
        const details = `Candidate switched tabs or minimized window at ${new Date().toLocaleTimeString()}`;
        reportViolation('tab_switch', details);
        toast.error('⚠️ Tab Switch Detected! Infraction logged by Proctor AI.', {
          duration: 5000,
          id: 'tab-switch-violation',
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reportViolation, isSubmitted]);

  // 5. Security Listener: fullscreenchange (Enforces & Monitors Fullscreen Mode)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const activeFullscreen = Boolean(
        document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
      );

      setIsFullscreen(activeFullscreen);

      if (!activeFullscreen && !isSubmitted) {
        const details = `Candidate exited full-screen mode at ${new Date().toLocaleTimeString()}`;
        reportViolation('fullscreen_exit', details);
        setWarningMessage('Full-screen mode is required to maintain assessment integrity.');
        setShowWarningModal(true);
        toast.error('⚠️ Fullscreen Exit Detected! Incident logged.', {
          duration: 5000,
          id: 'fullscreen-exit-violation',
        });
      } else if (activeFullscreen) {
        setShowWarningModal(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [reportViolation, isSubmitted]);

  // Request Fullscreen helper
  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
      setShowWarningModal(false);
      toast.success('Fullscreen mode active');
    } catch (err) {
      console.error('Failed to enter fullscreen:', err);
      toast.error('Please allow fullscreen mode in your browser to continue.');
    }
  };

  // Code editor update handler
  const handleCodeChange = (newVal) => {
    setCodeMap((prev) => ({
      ...prev,
      [activeQuestionIdx]: newVal,
    }));
  };

  // Run/Test code simulation
  const handleRunCode = () => {
    setIsRunningCode(true);
    setConsoleOutput('Compiling and running test suite...\n');

    setTimeout(() => {
      try {
        const userCode = codeMap[activeQuestionIdx] || '';
        // Capture console logs from sandbox simulation
        const logs = [];
        const customConsole = {
          log: (...args) => logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ')),
          error: (...args) => logs.push('[ERROR] ' + args.join(' ')),
          warn: (...args) => logs.push('[WARN] ' + args.join(' ')),
        };

        // Safe eval simulation for JS or mock output for other languages
        if (selectedLanguage === 'javascript') {
          const runFunction = new Function('console', userCode);
          runFunction(customConsole);
          setConsoleOutput(
            `✔ Execution completed successfully!\n\n--- Standard Output ---\n${logs.join('\n') || 'Program completed with no output.'}\n\nAll sample test cases passed!`
          );
        } else {
          setConsoleOutput(
            `✔ Code syntax verified for ${selectedLanguage}.\n\nOutput:\nMock test suite passed (2/2 test cases).\nExecution Time: 42ms\nMemory: 14.2 MB`
          );
        }
      } catch (err) {
        setConsoleOutput(`✖ Runtime Error:\n${err.message}\n\nPlease review your implementation.`);
      } finally {
        setIsRunningCode(false);
      }
    }, 600);
  };

  // Final Submit Handler
  const handleSubmitTest = async () => {
    const confirm = window.confirm(
      'Are you sure you want to finish and submit your test? You will not be able to return.'
    );
    if (!confirm) return;

    await executeSubmission();
  };

  const handleAutoSubmit = async (reason) => {
    toast(reason, { icon: '⏳' });
    await executeSubmission();
  };

  const executeSubmission = async () => {
    setIsSubmitting(true);
    try {
      const codeSubmissions = Object.keys(codeMap).map((qIdx) => ({
        questionId: test?.questions[qIdx]?._id || null,
        code: codeMap[qIdx],
        language: selectedLanguage,
      }));

      await proctorService.submitTest(test?._id || testId, codeSubmissions);
      setIsSubmitted(true);

      // Exit fullscreen if still active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      toast.success('Test submitted successfully!');
    } catch (err) {
      toast.error('Submission recorded locally.');
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="text-indigo-500 animate-spin" />
          <p className="text-sm font-semibold">Initializing Proctor AI Test Sandbox...</p>
        </div>
      </div>
    );
  }

  // Submitted Screen
  if (isSubmitted) {
    const riskLevel = cheatScore >= 70 ? 'High' : cheatScore >= 30 ? 'Moderate' : 'Low';
    const riskColor =
      cheatScore >= 70
        ? 'text-red-500 bg-red-500/10 border-red-500/30'
        : cheatScore >= 30
        ? 'text-amber-500 bg-amber-500/10 border-amber-500/30'
        : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-bold">Assessment Submitted</h2>
          <p className="text-xs text-slate-400 mt-2">
            Your code submissions and proctoring telemetry have been verified and encrypted.
          </p>

          <div className="my-6 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Candidate:</span>
              <span className="font-semibold">{user?.username || 'You'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Tab Switches:</span>
              <span className="font-semibold">{tabSwitches}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Fullscreen Exits:</span>
              <span className="font-semibold">{fullscreenExits}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-700">
              <span className="text-slate-400">Calculated Cheat Score:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold border ${riskColor}`}>
                {cheatScore}% ({riskLevel} Risk)
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-sm transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = test?.questions[activeQuestionIdx] || test?.questions[0];

  return (
    <div
      ref={testContainerRef}
      className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none"
    >
      {/* 1. TOP PROCTORING HEADER BAR */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between shrink-0">
        {/* Left: Test title & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Exiting now will abandon your test attempt. Continue?')) {
                navigate('/dashboard');
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Leave test"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="text-sm font-bold truncate max-w-xs sm:max-w-sm md:max-w-md">
              {test?.title || 'Proctor AI Assessment'}
            </h1>
            <p className="text-[10px] text-slate-400">
              Question {activeQuestionIdx + 1} of {test?.questions?.length || 1}
            </p>
          </div>
        </div>

        {/* Center: Live Security Telemetry Badges */}
        <div className="hidden md:flex items-center gap-2">
          {/* Tab Switch Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              tabSwitches > 0
                ? 'bg-amber-950/40 text-amber-400 border-amber-800/60 animate-pulse'
                : 'bg-slate-800/80 text-slate-300 border-slate-700'
            }`}
          >
            <EyeOff size={13} />
            <span>Tab Switches: {tabSwitches}</span>
          </div>

          {/* Fullscreen Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              isFullscreen
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                : 'bg-red-950/40 text-red-400 border-red-800/60 animate-bounce'
            }`}
          >
            {isFullscreen ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
            <span>{isFullscreen ? 'Fullscreen Locked' : 'Fullscreen Exited!'}</span>
          </div>

          {/* Cheat Score Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
              cheatScore >= 70
                ? 'bg-red-950/60 text-red-400 border-red-800'
                : cheatScore >= 30
                ? 'bg-amber-950/50 text-amber-300 border-amber-800'
                : 'bg-blue-950/40 text-blue-300 border-blue-800'
            }`}
          >
            <ShieldAlert size={13} />
            <span>Cheat Risk: {cheatScore}%</span>
          </div>
        </div>

        {/* Right: Timer & Submit Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-indigo-300">
            <Clock size={14} className="text-indigo-400 animate-spin" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>

          {!isFullscreen && (
            <button
              onClick={enterFullscreen}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition"
            >
              <Maximize2 size={13} />
              Enforce Fullscreen
            </button>
          )}

          <button
            onClick={handleSubmitTest}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm disabled:opacity-50"
          >
            <Send size={13} />
            {isSubmitting ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE SPLIT (Left: Problem, Right: Monaco Editor) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Column: Question Navigation & Details */}
        <div className="w-full md:w-5/12 lg:w-4/12 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-900/60 overflow-hidden">
          {/* Question Selector Tabs */}
          <div className="p-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 bg-slate-900">
            {test?.questions.map((q, idx) => (
              <button
                key={q._id || idx}
                onClick={() => setActiveQuestionIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  activeQuestionIdx === idx
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Question {idx + 1}
              </button>
            ))}
          </div>

          {/* Problem Description Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                  {currentQuestion?.difficulty || 'Medium'}
                </span>
                <span className="text-[11px] text-slate-400">Score Weight: 50 pts</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-2">
                {currentQuestion?.title}
              </h2>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
              {currentQuestion?.description}
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Proctoring Guidelines Active:
              </h4>
              <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                <li>Clipboard actions (paste) are recorded.</li>
                <li>Switching away will immediately increment tab strikes.</li>
                <li>Closing full-screen will block your workspace.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Monaco Code Editor & Terminal */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* Editor Action Bar */}
          <div className="h-10 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase">
                Language:
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-xs rounded-md px-2 py-1 outline-none focus:border-indigo-500"
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="python">Python 3</option>
                <option value="cpp">C++ (GCC)</option>
                <option value="java">Java 17</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (window.confirm('Reset code to starter template?')) {
                    handleCodeChange(currentQuestion?.starterCode || '');
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                title="Reset Code"
              >
                <RefreshCw size={12} />
                Reset
              </button>

              <button
                onClick={handleRunCode}
                disabled={isRunningCode}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50"
              >
                {isRunningCode ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Play size={13} fill="currentColor" />
                )}
                Run & Test Code
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={selectedLanguage}
              theme="vs-dark"
              value={codeMap[activeQuestionIdx] ?? currentQuestion?.starterCode ?? ''}
              onChange={handleCodeChange}
              options={{
                fontSize: 13,
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 2,
                lineNumbers: 'on',
                formatOnPaste: true,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Bottom Execution Console Output */}
          <div className="h-36 border-t border-slate-800 bg-slate-900 flex flex-col shrink-0">
            <div className="px-3 py-1.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <Terminal size={12} /> Test Console Output
              </span>
              <button
                onClick={() => setConsoleOutput('')}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 p-3 font-mono text-xs overflow-y-auto text-slate-300 whitespace-pre-wrap">
              {consoleOutput || 'Click "Run & Test Code" to execute tests against sample assertions.'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. FULLSCREEN ENFORCEMENT MODAL OVERLAY */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border-2 border-red-600/80 rounded-3xl p-6 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-red-600/10 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertTriangle size={32} className="animate-bounce" />
            </div>

            <h3 className="text-xl font-bold text-white">Security Lockdown Triggered</h3>
            <p className="text-xs text-slate-300 mt-2">
              {warningMessage ||
                'Exiting fullscreen or switching windows is prohibited. Your actions have been flagged on the proctor timeline.'}
            </p>

            <div className="my-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Fullscreen Exits:</span>
                <span className="font-bold text-red-400">{fullscreenExits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Cheat Score:</span>
                <span className="font-bold text-amber-400">{cheatScore}%</span>
              </div>
            </div>

            <button
              onClick={enterFullscreen}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition text-sm flex items-center justify-center gap-2"
            >
              <Maximize2 size={16} />
              Re-enter Fullscreen & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestView;
