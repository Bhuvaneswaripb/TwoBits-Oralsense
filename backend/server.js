const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'OralSense backend is running',
  });
});

// API Routes
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/screenings', require('./routes/screeningRoutes'));
app.use('/api/providers', require('./routes/providerRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/health-updates', require('./routes/healthRoutes'));

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
