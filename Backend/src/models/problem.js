const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    explaination: {
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
        ref: 'user',
        required: true
    }
});

const Problem = mongoose.model('problem', problemSchema);
module.exports = Problem;
