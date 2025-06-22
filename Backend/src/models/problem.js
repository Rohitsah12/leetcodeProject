const mongoose = require('mongoose');
const { Schema } = mongoose;

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
        type: [String], // changed from String to array of strings
        enum: ['array', 'linkedlist', 'graph','binary search','dynamic programming', 'sliding window','two pointer'],
        required: true,
    },
    visibleTestCases: [
        {
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
        }
    ],
    hiddenTestCases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            }
        }
    ],
    startCode: [
        {
            language: {
                type: String,
                required: true,
            },
            initialCode: {
                type: String,
                required: true,
            }
        }
    ],
    referenceSolution: [
        {
            language: {
                type: String,
                required: true,
            },
            completeCode: {
                type: String,
                required: true,
            }
        }
    ],
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

const Problem = mongoose.model('problem', problemSchema);

module.exports = Problem;
