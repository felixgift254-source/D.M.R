const path = require('path');
// Ensure environment variables are loaded regardless of execution working directory
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// === Startup Validation ===
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not set.');
  process.exit(1);
}
if (!process.env.ENCRYPTION_KEY || Buffer.from(process.env.ENCRYPTION_KEY, 'utf-8').length !== 32) {
  console.error('FATAL ERROR: ENCRYPTION_KEY must be set and exactly 32 bytes (UTF-8 encoded).');
  process.exit(1);
}

const app = express();

// Enable trust proxy for reverse proxies (Nginx, Docker port-forwarding, dev proxies)
// Resolves ERR_ERL_UNEXPECTED_X_FORWARDED_FOR in express-rate-limit
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet({
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost',
  'http://localhost:80',
  'http://127.0.0.1',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// HTTPS enforcement in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// General rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});
app.use('/api/', limiter);

// Stricter rate limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

// Logging and parsing
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Middleware
const authMiddleware = require('./middleware/authMiddleware');
const authorizeRole = require('./middleware/authorizeRole');
const validate = require('./middleware/validate');

// Validators
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('./validators/auth');
const { submitLogSchema } = require('./validators/logs');
const { createPostSchema } = require('./validators/community');
const { updateProfileSchema } = require('./validators/profile');
const { updatePhaseSchema } = require('./validators/doctor');

// Controllers
const authController = require('./controllers/authController');
const educationController = require('./controllers/educationController');
const gardenController = require('./controllers/gardenController');
const communityController = require('./controllers/communityController');
const mealPlanController = require('./controllers/mealPlanController');
const logController = require('./controllers/logController');
const userController = require('./controllers/userController');
const hba1cController = require('./controllers/hba1cController');
const doctorController = require('./controllers/doctorController');
const adminController = require('./controllers/adminController');

// === Auth Routes ===
app.post('/api/auth/register', authLimiter, validate(registerSchema), authController.register);
app.post('/api/auth/login', authLimiter, validate(loginSchema), authController.login);
app.post('/api/auth/refresh', authController.refresh);
app.post('/api/auth/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
app.post('/api/auth/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);
app.get('/api/auth/me', authMiddleware, authController.getMe);

// === Content & Garden Routes ===
app.get('/api/education', educationController.getEducationalContent);
app.get('/api/garden', gardenController.getGardenGuides);
app.get('/api/garden/my-crops', authMiddleware.optionalAuth, gardenController.getMyCrops);
app.post('/api/garden/plant', authMiddleware, gardenController.plantCrop);

// === Community Routes (authenticated) ===
app.get('/api/community/posts', authMiddleware, communityController.getPosts);
app.post('/api/community/posts', authMiddleware, validate(createPostSchema), communityController.createPost);

// === Meal Plan Routes (supports authenticated patients and guest previews) ===
app.get('/api/meal-plan', authMiddleware.optionalAuth, mealPlanController.getWeeklyMealPlan);
app.post('/api/meal-plan/generate', authMiddleware.optionalAuth, mealPlanController.generateMealPlan);
app.get('/api/meal-plan/:userId', authMiddleware.optionalAuth, mealPlanController.getWeeklyMealPlan);
app.post('/api/meal-plan/:userId/generate', authMiddleware.optionalAuth, mealPlanController.generateMealPlan);

// === Health Log Routes ===
app.post('/api/logs', authMiddleware, validate(submitLogSchema), logController.submitLog);
app.get('/api/logs/history', authMiddleware, logController.getLogHistory);

// === User Routes ===
app.get('/api/user/status', authMiddleware, userController.getStatus);
app.get('/api/user/profile', authMiddleware, userController.getProfile);
app.put('/api/user/profile', authMiddleware, validate(updateProfileSchema), userController.updateProfile);
app.get('/api/user/hba1c', authMiddleware, hba1cController.getHba1c);
app.get('/api/user/export', authMiddleware, userController.exportData);

// === Doctor Routes (authenticated + DOCTOR role required) ===
app.get('/api/doctor/patients', authMiddleware, authorizeRole('DOCTOR'), doctorController.getPatients);
app.get('/api/doctor/patients/:patientId/logs', authMiddleware, authorizeRole('DOCTOR'), doctorController.getPatientLogs);
app.post('/api/doctor/patients/:patientId/phase', authMiddleware, authorizeRole('DOCTOR'), validate(updatePhaseSchema), doctorController.updatePatientPhase);
app.post('/api/doctor/patients/:patientId/approve-phase', authMiddleware, authorizeRole('DOCTOR'), doctorController.approvePhaseAdvancement);
app.get('/api/doctor/alerts', authMiddleware, authorizeRole('DOCTOR'), doctorController.getAlerts);
app.put('/api/doctor/alerts/:alertId/acknowledge', authMiddleware, authorizeRole('DOCTOR'), doctorController.acknowledgeAlert);

// === Admin Routes (authenticated + ADMIN role required) ===
app.get('/api/admin/users', authMiddleware, authorizeRole('ADMIN'), adminController.listUsers);
app.put('/api/admin/users/:userId/role', authMiddleware, authorizeRole('ADMIN'), adminController.updateUserRole);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
