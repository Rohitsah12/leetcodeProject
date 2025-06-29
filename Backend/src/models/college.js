const mongoose = require('mongoose');
const { Schema } = mongoose;

const collegeSchema = new Schema({
  collegeName: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    immutable: true,
  },
  password: {
    type: String,
    required: true,
  },
  studentProfiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "student"
  }]
}, {
  timestamps: true
});

const College = mongoose.model("college", collegeSchema);
module.exports = College;
