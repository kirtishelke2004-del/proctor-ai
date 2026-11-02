const ProctorLog = require('../models/ProctorLog');
const Test = require('../models/Test');

// @desc    Start or resume a test proctoring session
// @route   POST /api/proctor/session/start
// @access  Private (Candidate)
exports.startOrGetSession = async (req, res, next) => {
  try {
    const { testId } = req.body;
    const userId = req.user._id;

    if (!testId) {
      return res.status(400).json({ success: false, error: 'Test ID is required' });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, error: 'Test not found' });
    }

    // Find existing session or create a new one
    let log = await ProctorLog.findOne({ userId, testId });

    if (!log) {
      log = await ProctorLog.create({
        userId,
        testId,
        tabSwitchCount: 0,
        fullscreenExitCount: 0,
        cheatScore: 0,
        violationLogs: [],
        status: 'in_progress',
        startedAt: new Date(),
      });
    }

    res.json({
      success: true,
      log,
      test: {
        id: test._id,
        title: test.title,
        description: test.description,
        durationMinutes: test.durationMinutes,
        questions: test.questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a security/proctor violation
// @route   POST /api/proctor/log-violation
// @access  Private (Candidate)
exports.logViolation = async (req, res, next) => {
  try {
    const { testId, violationType, details } = req.body;
    const userId = req.user._id;

    if (!testId || !violationType) {
      return res.status(400).json({
        success: false,
        error: 'testId and violationType are required',
      });
    }

    // Find or create proctor log
    let log = await ProctorLog.findOne({ userId, testId });

    if (!log) {
      log = new ProctorLog({
        userId,
        testId,
        tabSwitchCount: 0,
        fullscreenExitCount: 0,
        cheatScore: 0,
        violationLogs: [],
        status: 'in_progress',
      });
    }

    // If test is already submitted, ignore new logs
    if (log.status === 'submitted') {
      return res.status(400).json({
        success: false,
        error: 'Test has already been submitted',
      });
    }

    // Determine severity
    let severity = 'medium';
    if (violationType === 'tab_switch') {
      log.tabSwitchCount += 1;
      severity = log.tabSwitchCount > 3 ? 'high' : 'medium';
    } else if (violationType === 'fullscreen_exit') {
      log.fullscreenExitCount += 1;
      severity = log.fullscreenExitCount > 2 ? 'high' : 'medium';
    } else if (violationType === 'copy_paste') {
      severity = 'high';
    }

    // Push new violation entry
    log.violationLogs.push({
      type: violationType,
      timestamp: new Date(),
      details: details || `Candidate triggered ${violationType}`,
      severity,
    });

    // Recalculate cheat score
    const updatedScore = log.calculateCheatScore();

    // Auto flag or warning threshold
    if (updatedScore >= 80) {
      log.status = 'flagged';
    }

    await log.save();

    res.json({
      success: true,
      message: 'Violation recorded',
      data: {
        tabSwitchCount: log.tabSwitchCount,
        fullscreenExitCount: log.fullscreenExitCount,
        cheatScore: log.cheatScore,
        status: log.status,
        recentViolation: log.violationLogs[log.violationLogs.length - 1],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a test and finalize proctor log
// @route   POST /api/proctor/submit
// @access  Private (Candidate)
exports.submitTest = async (req, res, next) => {
  try {
    const { testId, codeSubmissions } = req.body;
    const userId = req.user._id;

    if (!testId) {
      return res.status(400).json({ success: false, error: 'Test ID is required' });
    }

    let log = await ProctorLog.findOne({ userId, testId });

    if (!log) {
      log = new ProctorLog({
        userId,
        testId,
        tabSwitchCount: 0,
        fullscreenExitCount: 0,
        cheatScore: 0,
        violationLogs: [],
      });
    }

    if (codeSubmissions && Array.isArray(codeSubmissions)) {
      log.codeSubmissions = codeSubmissions;
    }

    log.status = 'submitted';
    log.submittedAt = new Date();
    log.calculateCheatScore();

    await log.save();

    res.json({
      success: true,
      message: 'Test submitted successfully',
      data: {
        logId: log._id,
        status: log.status,
        cheatScore: log.cheatScore,
        tabSwitchCount: log.tabSwitchCount,
        fullscreenExitCount: log.fullscreenExitCount,
        submittedAt: log.submittedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's current session for a test
// @route   GET /api/proctor/session/:testId
// @access  Private
exports.getSession = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const userId = req.user._id;

    const log = await ProctorLog.findOne({ userId, testId });
    if (!log) {
      return res.status(404).json({ success: false, error: 'No active session found' });
    }

    res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all candidate logs and cheat scores for Admin Dashboard
// @route   GET /api/proctor/admin/logs
// @access  Private (Admin)
exports.getAdminLogs = async (req, res, next) => {
  try {
    const logs = await ProctorLog.find()
      .populate('userId', 'username email')
      .populate('testId', 'title durationMinutes')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed log by ID for Admin View
// @route   GET /api/proctor/admin/logs/:id
// @access  Private (Admin)
exports.getAdminLogDetail = async (req, res, next) => {
  try {
    const log = await ProctorLog.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('testId', 'title description durationMinutes questions');

    if (!log) {
      return res.status(404).json({ success: false, error: 'Proctor log not found' });
    }

    res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
};
