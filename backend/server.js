require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth');
const logsRoutes = require('./src/routes/logs');
const predictionsRoutes = require('./src/routes/predictions');
const recommendationsRoutes = require('./src/routes/recommendations');
const leaderboardRoutes = require('./src/routes/leaderboard');
const badgesRoutes = require('./src/routes/badges');

const app = express();
const PORT = process.env.PORT || 5000;

// ──────────────── Middleware ────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ──────────────── API Routes ────────────────
app.use('/api/auth', authRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/badges', badgesRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'EcoWise API is running 🌱',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ──────────────── Start ────────────────
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║   🌱 EcoWise API Server Running!     ║
║   Port: ${PORT}                           ║
║   Env:  ${process.env.NODE_ENV || 'development'}              ║
╚══════════════════════════════════════╝
  `);
});

module.exports = app;
