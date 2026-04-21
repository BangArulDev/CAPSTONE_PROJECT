const express = require('express');
const { readData } = require('../models/dataStore');
const { authenticateToken } = require('../middleware/auth');
const { generateRecommendations } = require('../ai/recommender');

const router = express.Router();

// GET /api/recommendations — personalized eco-tips
router.get('/', authenticateToken, (req, res) => {
  try {
    const db = readData('logs.json');
    const userLogs = (db.logs || []).filter(l => l.userId === req.user.id);
    
    const result = generateRecommendations(userLogs);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
