const express = require('express');
const { readData } = require('../models/dataStore');
const { authenticateToken } = require('../middleware/auth');
const { generatePredictions } = require('../ai/predictor');

const router = express.Router();

// GET /api/predictions — AI-powered waste/energy predictions
router.get('/', authenticateToken, (req, res) => {
  try {
    const db = readData('logs.json');
    const userLogs = (db.logs || []).filter(l => l.userId === req.user.id);
    
    const sorted = [...userLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
    const predictions = generatePredictions(sorted);

    res.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
