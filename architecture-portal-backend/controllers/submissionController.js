const Submission = require('../models/Submission');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all submissions
// @route   GET /api/v1/submissions
// @route   GET /api/v1/users/:userId/submissions
// @access  Private/Admin
exports.getSubmissions = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const submissions = await Submission.find({ user: req.params.userId });
    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single submission
// @route   GET /api/v1/submissions/:id
// @access  Private
exports.getSubmission = asyncHandler(async (req, res, next) => {
  const submission = await Submission.findById(req.params.id).populate({
    path: 'user',
    select: 'name email',
  });

  if (!submission) {
    return next(
      new ErrorResponse(`No submission found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is submission owner or admin
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
    data: submission,
  });
});

// @desc    Create submission
// @route   POST /api/v1/submissions
// @access  Private
exports.createSubmission = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const submission = await Submission.create(req.body);

  res.status(201).json({
    success: true,
    data: submission,
  });
});

// @desc    Update submission
// @route   PUT /api/v1/submissions/:id
// @access  Private
exports.updateSubmission = asyncHandler(async (req, res, next) => {
  let submission = await Submission.findById(req.params.id);

  if (!submission) {
    return next(
      new ErrorResponse(`No submission found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is submission owner or admin
  if (submission.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this submission`,
        401
      )
    );
  }

  submission = await Submission.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: submission,
  });
});

// @desc    Delete submission
// @route   DELETE /api/v1/submissions/:id
// @access  Private
exports.deleteSubmission = asyncHandler(async (req, res, next) => {
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    return next(
      new ErrorResponse(`No submission found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is submission owner or admin
  if (submission.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this submission`,
        401
      )
    );
  }

  await submission.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});