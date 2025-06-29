const College = require('../models/college');
const Student = require('../models/student');
const addStudent = async (req, res) => {
  try {
    const collegeId = req.result._id;
    let { doocode, github, year } = req.body;

    if (!doocode || !year) {
      return res.status(400).json({ success: false, message: "doocode and year are required." });
    }

    const match = doocode.match(/myprofile\/([a-fA-F0-9]+)/);
    if (match) {
      doocode = match[1];
    }
    const existingStudent = await Student.findOne({ doocode, college: collegeId });
    if (existingStudent) {
      return res.status(409).json({ success: false, message: "Student already exists." });
    }
    const newStudent = await Student.create({
      doocode,
      github: github || null,
      year,
      college: collegeId
    });

    await College.findByIdAndUpdate(collegeId, {
      $push: { studentProfiles: newStudent._id }
    });

    return res.status(201).json({ success: true, message: "Student added.", data: newStudent });
  } catch (error) {
    console.error("Error in addStudent:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};


const deleteStudent = async (req, res) => {
  try {
    const collegeId = req.result._id; 
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    if (!student || student.college.toString() !== collegeId.toString()) {
      return res.status(404).json({ success: false, message: "Student not found or does not belong to this college." });
    }

    await Student.findByIdAndDelete(studentId);

    await College.findByIdAndUpdate(collegeId, {
      $pull: { studentProfiles: studentId }
    });

    return res.status(200).json({ success: true, message: "Student deleted successfully." });
  } catch (error) {
    console.error("Error in deleteStudent:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
const updateStudent = async (req, res) => {
  try {
    const collegeId = req.result._id; // From middleware
    const studentId = req.params.id;
    const { doocode, github, year } = req.body;

    const student = await Student.findById(studentId);
    if (!student || student.college.toString() !== collegeId.toString()) {
      return res.status(404).json({ success: false, message: "Student not found or doesn't belong to this college." });
    }

    let updatedDoocode = doocode;
    if (doocode) {
      const match = doocode.match(/myprofile\/([a-fA-F0-9]+)/);
      if (match) updatedDoocode = match[1];
    }

    if (updatedDoocode) student.doocode = updatedDoocode;
    if (github !== undefined) student.github = github;
    if (year) student.year = year;

    await student.save();

    return res.status(200).json({ success: true, message: "Student updated successfully.", data: student });
  } catch (error) {
    console.error("Error in updateStudent:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const collegeId = req.result._id; // from middleware
    const { year } = req.params;

    if (!year) {
      return res.status(400).json({ success: false, message: "Year parameter is required." });
    }

    const students = await Student.find({
      college: collegeId,
      year: year
    });

    return res.status(200).json({
      success: true,
      message: `Students found for ${year}`,
      data: students
    });
  } catch (error) {
    console.error("Error in getAllStudents:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
module.exports = { addStudent ,deleteStudent,updateStudent,getAllStudents};
