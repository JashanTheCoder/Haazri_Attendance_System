const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  courseCode: {
    type: String
  },
  teacherName: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Course", courseSchema);