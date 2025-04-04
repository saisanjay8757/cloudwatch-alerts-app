require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connect, sequelize } = require('./config/database');
const Alert = require('./models/Alert');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Database connection
connect();

// Routes
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/sns', require('./routes/sns'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database: sequelize.authenticate() ? 'CONNECTED' : 'DISCONNECTED'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Sync database models
sequelize.sync({ alter: true }).then(() => {
  console.log('Database models synchronized');
});

module.exports = app;
