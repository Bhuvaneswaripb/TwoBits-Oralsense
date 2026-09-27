const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    dbConnected: mongoose.connection.readyState === 1,
    message: 'OralSense backend is running',
  });
});

// Database Readiness Middleware
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable',
    });
  }
  next();
});

// API Routes
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/screenings', require('./routes/screeningRoutes'));
app.use('/api/providers', require('./routes/providerRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/health-updates', require('./routes/healthRoutes'));
app.use('/api/insurance', require('./routes/insuranceRoutes'));
app.use('/api/claims', require('./routes/claimRoutes'));
app.use('/api/dental-habits', require('./routes/dentalHabitsRoutes'));

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[OralSense Backend Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[OralSense Backend] Server running on http://localhost:${PORT}`);
});
