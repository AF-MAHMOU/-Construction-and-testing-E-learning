const express = require('express');
const router = express.Router();
const Instructor = require('../models/instructor');  // Correct import path
const Course = require('../models/Course'); // Add this import


// Register an instructor (pending approval)
router.post('/registerinstructor', async (req, res) => {
  const { name, email, password } = req.body;

  // Validate request body
  if (!name || !email || !password) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  try {
    const instructor = new Instructor({ name, email, password });
    await instructor.save();
    res.status(201).send(instructor);
  } catch (error) {
    res.status(500).send({ error: 'Failed to register instructor', details: error.message });
  }
});

router.get('/courses/instructor/:id', async (req, res) => {
  const instructorId = req.params.id;
  console.log('Instructor ID:', instructorId); // Log the ID being passed
  try {
    const courses = await Course.find({ instructor: instructorId })
      .populate('instructor', 'name email')
      .populate('enrolledStudents.studentID', 'name email');

    if (courses.length === 0) {
      return res.status(404).send({ error: 'No courses found for this instructor' });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error.message); // Log the error for debugging
    res.status(500).send({ error: 'Failed to fetch courses', details: error.message });
  }
});



// Get all instructors (admin only)
router.get('/getinstructors', async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.status(200).send(instructors);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch instructors', details: error.message });
  }
});

// Admin approve instructor
router.put('/approve/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).send({ error: 'Instructor not found' });

    instructor.isConfirmed = true;
    await instructor.save();
    res.status(200).send(instructor);
  } catch (error) {
    res.status(500).send({ error: 'Failed to approve instructor', details: error.message });
  }
});

// Admin reject instructor
router.delete('/reject/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).send({ error: 'Instructor not found' });

    await instructor.remove();
    res.status(200).send({ message: 'Instructor rejected and removed' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to reject instructor', details: error.message });
  }
});

module.exports = router;
