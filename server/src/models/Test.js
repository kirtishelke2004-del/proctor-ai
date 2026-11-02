const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  language: {
    type: String,
    default: 'javascript',
  },
  starterCode: {
    type: String,
    default: '// Write your solution here\nfunction solution() {\n  \n}\n',
  },
  testCases: [
    {
      input: String,
      expectedOutput: String,
      isSample: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

const TestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a test title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a test description'],
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Please specify test duration in minutes'],
      min: [1, 'Duration must be at least 1 minute'],
      default: 45,
    },
    questions: [QuestionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Test', TestSchema);
