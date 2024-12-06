// routes/authRoutes.js
const express = require('express');
const mongoose = require('mongoose'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (!role || !['student', 'instructor'].includes(role.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }

  console.log('Login attempt:', { email, role });

  try {
    const Model = role.toLowerCase() === 'student'
      ? mongoose.models.Student || require('../models/Student')
      : mongoose.models.Instructor || require('../models/instructor');

    const user = await Model.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ error: 'User not found' });
    }

    console.log('Found user:', user);

    if (role.toLowerCase() === 'instructor' && !user.isConfirmed) {
      return res.status(400).json({ error: 'Account not confirmed by admin' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, role: role.toLowerCase() },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed, please try again later' });
  }
});

// Route to get user data based on the token (for dashboard)
// Route to get user data based on the token (for dashboard)
router.get('/me', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Get token from the header
  
  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    console.log('Decoded token:', decoded);  // Log decoded token for debugging
    const { userId, role } = decoded;

    // Dynamically require the model based on role, but check if it's already compiled
    let Model;
    if (role === 'student') {
      Model = mongoose.models.Student || require('../models/Student');
    } else if (role === 'instructor') {
      Model = mongoose.models.Instructor || require('../models/instructor');
    }

    const user = await Model.findById(userId);

    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error verifying token or fetching user:', error.message);
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    } else {
      res.status(500).json({ error: 'Server error while verifying token' });
    }
  }
});



module.exports = router;
