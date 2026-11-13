const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authController = require('./controllers/authController');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// Security Middleware (Crucial for handling sensitive health data)
app.use(helmet()); // Sets secure HTTP headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
})); // Restricts cross-origin requests to the configured frontend
app.use(express.json()); // Parses incoming JSON payloads

// Rate Limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});
app.use(limiter);

// Auth Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Placeholder Engine Route
app.get('/api/engine/status', (req, res) => {
  res.json({ message: "Reversal Engine is active and ready." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Digital Metabolic Reversal API is running on port ${PORT}`);
});
