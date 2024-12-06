const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = 5000;

// Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const instructorRoutes = require('./routes/InstructorRoutes'); // Updated route name

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define the routes with the correct paths
app.use('/api/auth', authRoutes);  // Correct route path for auth
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/instructors', instructorRoutes);  // Corrected the name of instructor routes

// MongoDB Connection with updated options
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection failed:', err.message));

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
