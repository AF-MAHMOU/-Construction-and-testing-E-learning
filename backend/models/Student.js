const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentID: { type: Number, unique: true, required: true },
  numOfCourses: { type: Number, default: 0 },
  grades: { type: Number, min: 0, max: 100 },
  progress: [
    {
      courseID: Number,
      completion: { type: Number, min: 0, max: 100 },
    },
  ],
});


module.exports = mongoose.model('Student', StudentSchema);
