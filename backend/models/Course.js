// models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courseID: { type: Number, unique: true, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  materials: [
    {
      type: { type: String },  // Type of material, e.g., 'video', 'document'
      content: { type: String },  // The actual content (URL, file path, etc.)
      description: { type: String },  // Optional description of the material
    }
  ],
  enrolledStudents: [
    {
      studentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // Student reference
      progress: { type: Number, min: 0, max: 100, default: 0 }, // Track progress for each student
      grade: { type: Number, min: 0, max: 100 }, // Store grade for each student
    }
  ]
});

module.exports = mongoose.model('Course', CourseSchema);
