const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Course = require('../models/Course');  // Import Course model

// Create a new student
router.post('/registerstudent', async (req, res) => {
  try {
    const { name, studentID, email, password, numOfCourses, grades, progress } = req.body;

    // Validate required fields
    if (!name || !studentID || !email || !password) {
      return res.status(400).json({ error: 'Name, studentID, email, and password are required' });
    }

    // Check for duplicate email or studentID
    const existingStudent = await Student.findOne({ $or: [{ email }, { studentID }] });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student ID or email already exists' });
    }

    const student = new Student({ name, studentID, email, password, numOfCourses, grades, progress });
    await student.save();

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register student', details: error.message });
  }
});

// Get all students
// Get all students
router.get('/getstudents', async (req, res) => {
  try {
    const students = await Student.find(); // Fetch all students
    res.status(200).json(students); // Return student data
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students', details: error.message });
  }
});

// Enroll a student in a course
router.post('/:studentId/enroll', async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the student by ID
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Check if the student is already enrolled
    if (student.courses.includes(courseId)) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Enroll the student in the course (update the student's courses array)
    student.courses.push(courseId); // Add the course to the student's courses array
    student.numOfCourses = student.courses.length; // Update the number of enrolled courses

    await student.save();  // Save the student document

    // Return the updated student or a success message
    res.status(200).json({ message: 'Enrolled in the course successfully', student });
  } catch (error) {
    res.status(500).json({ error: 'Enrollment failed', details: error.message });
  }
});


// Get enrolled courses for a student by studentID
// Get enrolled courses for a student by studentID
router.get('/:studentId/courses', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).populate('courses');
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Return only the course IDs or necessary fields (like name)
    const courseData = student.courses.map(course => ({
      _id: course._id,
      name: course.name,
    }));
    
    res.status(200).json(courseData); // Return simplified course data
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrolled courses', details: error.message });
  }
});




module.exports = router;
