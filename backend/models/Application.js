const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    resumePath: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'hired'],
      default: 'applied'
    }
  },
  { timestamps: true }
);

ApplicationSchema.index(
  { jobId: 1, candidateId: 1 },
  { unique: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);
