const express = require('express');
const {
  getSubmissions,
  getSubmission,
  createSubmission
} = require('../controllers/submissionController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getSubmissions)
  .post(protect, createSubmission);

router
  .route('/:id')
  .get(protect, getSubmission);

module.exports = router;