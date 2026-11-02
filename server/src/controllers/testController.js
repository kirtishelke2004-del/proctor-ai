const Test = require('../models/Test');

// @desc    Get all tests
// @route   GET /api/tests
// @access  Public or Protected
exports.getTests = async (req, res, next) => {
  try {
    const tests = await Test.find({ isActive: true }).select('-questions.testCases');
    res.json({
      success: true,
      count: tests.length,
      data: tests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single test with questions
// @route   GET /api/tests/:id
// @access  Private
exports.getTestById = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ success: false, error: 'Test not found' });
    }
    res.json({
      success: true,
      data: test,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a test (admin)
// @route   POST /api/tests
// @access  Private (Admin)
exports.createTest = async (req, res, next) => {
  try {
    const { title, description, durationMinutes, questions } = req.body;
    const test = await Test.create({
      title,
      description,
      durationMinutes: durationMinutes || 45,
      questions: questions || [],
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: test,
    });
  } catch (error) {
    next(error);
  }
};
