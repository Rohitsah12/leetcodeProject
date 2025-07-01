const mongoose = require('mongoose');
const axios = require('axios');
const { Schema } = mongoose;

// Helper functions for Judge0 API
const getLanguageById = (language) => {
  const languageMap = {
    'C++': 54,
    'Java': 62,
    'JavaScript': 63
  };
  return languageMap[language] || 63; // Default to JavaScript
};

const submitBatch = async (submissions) => {
  const response = await axios.post('http://localhost:2358/submissions/batch', {
    submissions
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};
const submitToken = async (tokens) => {
  const response = await axios.get(`http://localhost:2358/submissions/batch?tokens=${tokens.join(',')}`);
  return response.data.submissions;
};

// Sub-schema for test cases
const testCaseSchema = new Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  }
}, { _id: false });

// Sub-schema for visible test cases with explanation
const visibleTestCaseSchema = new Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  explanation: {  // Fixed typo: explaination → explanation
    type: String,
    required: true,
  }
}, { _id: false });

// Sub-schema for start code
const startCodeSchema = new Schema({
  language: {
    type: String,
    required: true,
  },
  initialCode: {
    type: String,
    required: true,
  }
}, { _id: false });

// Sub-schema for reference solutions
const referenceSolutionSchema = new Schema({
  language: {
    type: String,
    required: true,
  },
  completeCode: {
    type: String,
    required: true,
  }
}, { _id: false });

// Final problem schema
const problemSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  companies: { 
    type: [String],
    default: []
  },
  hints: {
    type: [String],
    default: []
  },
  constraints: {
    type: [String],
    default: []
  },
  visibleTestCases: [visibleTestCaseSchema],
  hiddenTestCases: [testCaseSchema],
  startCode: [startCodeSchema],
  referenceSolution: [referenceSolutionSchema],
  problemCreator: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

const Problem = mongoose.model('problem', problemSchema);
module.exports = Problem;
