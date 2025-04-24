const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  buildingType: {
    type: String,
    required: [true, 'Please specify building type'],
    enum: ['residential', 'commercial', 'industrial', 'institutional', 'other']
  },
  stylePreferences: {
    type: [String],
    required: true
  },
  vibeDescription: {
    type: String,
    required: [true, 'Please describe the vibe you want']
  },
  budgetRange: {
    type: String,
    required: true
  },
  timeline: {
    type: String,
    required: true
  },
  files: {
    type: [String]
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'completed'],
    default: 'new'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Submission', SubmissionSchema);