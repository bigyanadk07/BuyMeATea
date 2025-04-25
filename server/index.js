const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
// const donationRoutes = require('./routes/donationRoutes');
const { connectDB } = require('./config/db');
const activityRoutes = require('./routes/activityRoutes');
// const newsletterRoutes = require('./routes/newsletterRoutes');
// const subscriberRoutes = require('./routes/subscriberRoutes');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
// app.use('/api', donationRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/activities', require('./routes/activityRoutes'));
// app.use('/api/newsletters', newsletterRoutes);
// app.use('/api/subscribers', subscriberRoutes);





// Base route
app.get('/', (req, res) => {
  res.send('Welcome to Buymeatea API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;