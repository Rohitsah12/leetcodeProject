const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
  doocode: {
    type: String,
    required: true,
    trim: true
  },
  github: {
    type: String,
    trim: true,
    default: null
  },
  year: {
    type: String,
    required: true,
    enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"], // or use numbers if preferred
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "college",
    required: true
  }
}, {
  timestamps: true
});

const Student = mongoose.model("student", studentSchema);
module.exports = Student;
