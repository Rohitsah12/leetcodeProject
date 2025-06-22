const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: function () { return !this.googleId; }, // MODIFIED
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 20,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // ADDED
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    age: {
        type: Number,
        min: 6,
        max: 80,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    problemSolved: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'problem',
            unique: true
        }],

    },
    password: {
        type: String,
        required: function () { return !this.googleId; } 
    }
}, {
    timestamps: true
})

const User = mongoose.model("user", userSchema);
module.exports = User;