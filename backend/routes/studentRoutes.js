const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Create a new student
router.post('/', async (req, res) => {
  try {
    const { name, studentID, numOfCourses, grades, progress } = req.body;

    // Validate request body
    if (!name || !studentID) {
      return res.status(400).send({ error: 'Name and studentID are required' });
    }

    const student = new Student({ name, studentID, numOfCourses, grades, progress });
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(500).send({ error: 'Failed to create student', details: error.message });
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch students', details: error.message });
  }
});

module.exports = router;
