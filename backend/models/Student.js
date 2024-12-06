// models/Student.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the Student Schema
const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentID: { type: Number, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  numOfCourses: { type: Number, default: 0 },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // New field for storing courses the student is enrolled in
  grades: [
    {
      courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Reference to the Course model
      grade: { type: Number, min: 0, max: 100 }, // Store grade for each course
    },
  ],
  progress: [
    {
      courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Reference to the Course model
      completion: { type: Number, min: 0, max: 100 }, // Track course completion percentage
    },
  ],
});

// Hash password before saving
StudentSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password for login
StudentSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Student', StudentSchema);
