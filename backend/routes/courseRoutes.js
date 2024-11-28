const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Create a new course
router.post('/', async (req, res) => {
  try {
    const { name, courseID } = req.body;

    // Validate request body
    if (!name || !courseID) {
      return res.status(400).send({ error: 'Name and courseID are required' });
    }

    const course = new Course({ name, courseID });
    await course.save();
    res.status(201).send(course);
  } catch (error) {
    res.status(500).send({ error: 'Failed to create course', details: error.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).send(courses);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch courses', details: error.message });
  }
});

module.exports = router;
