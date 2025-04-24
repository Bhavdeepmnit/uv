const Submission = require('../models/Submission');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create submission
// @route   POST /api/v1/submissions
// @access  Private
exports.createSubmission = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const submission = await Submission.create(req.body);

  res.status(201).json({
    success: true,
    data: submission
  });
});

// @desc    Get all submissions
// @route   GET /api/v1/submissions
// @access  Private/Admin
exports.getSubmissions = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single submission
// @route   GET /api/v1/submissions/:id
// @access  Private
exports.getSubmission = asyncHandler(async (req, res, next) => {
  const submission = await Submission.findById(req.params.id).populate({
    path: 'user',
    select: 'name email'
  });

  if (!submission) {
    return next(
      new ErrorResponse(`No submission found with the id of ${req.params.id}`, 404)
    );
  }

  if (submission.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this submission`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: submission
  });
});