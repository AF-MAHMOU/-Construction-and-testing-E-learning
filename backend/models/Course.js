const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: String,
  courseID: Number,
});

module.exports = mongoose.model('Course', CourseSchema);
