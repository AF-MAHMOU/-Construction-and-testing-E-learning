const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Course = require('../models/Course');
const Instructor = require('../models/instructor');

// Middleware to verify token and get user info
const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Get token from the header

  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized - Token Invalid or Expired' });
  }
};

// Create a new course (Instructor only)
router.post('/createcourse', verifyToken, async (req, res) => {
  if (req.role !== 'instructor') {
    return res.status(403).json({ error: 'Only instructors can create courses' });
  }

  try {
    const { name, courseID } = req.body;

    // Validate request body
    if (!name || !courseID) {
      return res.status(400).json({ error: 'Name and courseID are required' });
    }

    const course = new Course({ name, courseID, instructor: req.userId });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error creating course', details: error.message });
  }
});

// Add material to a course (Instructor only)
router.post('/:id/material', verifyToken, async (req, res) => {
  if (req.role !== 'instructor') {
    return res.status(403).json({ error: 'Only instructors can add materials' });
  }

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Check if the course belongs to the instructor
    if (course.instructor.toString() !== req.userId) {
      return res.status(403).json({ error: 'You are not authorized to modify this course' });
    }

    const { type, content, description } = req.body.material;

    // Ensure the material has valid fields
    if (!type || !content) {
      return res.status(400).json({ error: 'Material type and content are required' });
    }

    // Add material to the course
    course.materials.push({ type, content, description });
    await course.save();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add material', details: error.message });
  }
});

// Get all courses for the logged-in instructor
router.get('/getcourses', verifyToken, async (req, res) => {
  if (req.role !== 'instructor' || 'admin') {
    return res.status(403).json({ error: 'Only instructors can view their courses' });
  }

  try {
    const courses = await Course.find({ instructor: req.userId });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
  }
});

// Get all courses (for students or public access)
router.get('/allcourses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
  }
});

module.exports = router;
