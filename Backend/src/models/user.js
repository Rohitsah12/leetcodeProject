const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: function () { return !this.googleId; },
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
        sparse: true
    },
    password: {
        type: String,
        required: function () { return !this.googleId; } 
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
    problemSolved: [{
    type: Schema.Types.ObjectId,
    ref: 'problem'
}],
    
    // ✅ New fields for profile support
    profileImage: {
        type: String, // Cloudinary image URL
        default: ''   // Optional default avatar
    },
    streak: {
    count: { type: Number, default: 0 },
    lastStreakDate: { type: String } // Store as 'YYYY-MM-DD' in user's timezone
},
    // In userSchema
    heatmapData: {
    type: Map,
    of: Number,
    default: {}
    },
    timezone: {
    type: String,
    default: Intl.DateTimeFormat().resolvedOptions().timeZone
    }

}, {
    timestamps: true
});

const User = mongoose.model("user", userSchema);
module.exports = User;
