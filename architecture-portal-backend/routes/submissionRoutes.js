const express = require('express');
const {
  getSubmissions,
  getSubmission,
  createSubmission,
  updateSubmission,
  deleteSubmission,
} = require('../controllers/submissionController');

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getSubmissions)
  .post(protect, createSubmission);

router
  .route('/:id')
  .get(protect, getSubmission)
  .put(protect, updateSubmission)
  .delete(protect, deleteSubmission);

module.exports = router;