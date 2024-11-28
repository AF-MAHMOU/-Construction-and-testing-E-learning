const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: String,
  studentID: Number,
  numOfCourses: Number,
  grades: Number,
  progress: Number,
});

module.exports = mongoose.model('Student', StudentSchema);
