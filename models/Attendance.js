const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  courseName: {
    type: String,
    required: true
  },
  courseCode: {
    type: String
  },
  delivered: {
    type: Number,
    default: 0
  },
  attended: {
    type: Number,
    default: 0
  },
  dl: {
    type: Number,
    default: 0
  },
  ml: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
