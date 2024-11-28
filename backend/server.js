const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;


const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');



// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);

// MongoDB Connection
mongoose.connect('Mongo URL', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
