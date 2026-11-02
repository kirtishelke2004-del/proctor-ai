const mongoose = require('mongoose');

const ViolationLogSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['tab_switch', 'fullscreen_exit', 'copy_paste', 'devtools_opened', 'window_blur', 'other'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: String,
    default: '',
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
});

const ProctorLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    tabSwitchCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    fullscreenExitCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    cheatScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    violationLogs: [ViolationLogSchema],
    status: {
      type: String,
      enum: ['in_progress', 'submitted', 'flagged', 'auto_terminated'],
      default: 'in_progress',
    },
    codeSubmissions: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        code: String,
        language: String,
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Method to recalculate cheat score based on violations
ProctorLogSchema.methods.calculateCheatScore = function () {
  // Tab switches: 15 points each
  // Fullscreen exits: 20 points each
  // Additional violations: 10 points each
  const tabScore = this.tabSwitchCount * 15;
  const fsScore = this.fullscreenExitCount * 20;
  const otherViolations = this.violationLogs.filter(
    (v) => v.type !== 'tab_switch' && v.type !== 'fullscreen_exit'
  ).length * 10;

  const rawScore = tabScore + fsScore + otherViolations;
  this.cheatScore = Math.min(100, rawScore);

  if (this.cheatScore >= 75 && this.status === 'in_progress') {
    this.status = 'flagged';
  }

  return this.cheatScore;
};

module.exports = mongoose.model('ProctorLog', ProctorLogSchema);
