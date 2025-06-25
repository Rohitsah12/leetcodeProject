
const mongoose = require('mongoose');
const { Schema } = mongoose;
const submissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'c++', 'java'] 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong', 'error'],
    default: 'pending'
  },
  runtime: {
    type: Number,
    default: 0
  },
  memory: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  testCasesTotal: {
    type: Number,
    default: 0
  },

  // ✅ Explicit timestamp for easy sorting
  submittedAt: {
    type: Date,
    default: Date.now
  }

}, { 
  timestamps: true
});
submissionSchema.index({ userId: 1, createdAt: -1 });
submissionSchema.index({ problemId: 1, status: 1 });

const Submission = mongoose.model('submission', submissionSchema);
module.exports = Submission;