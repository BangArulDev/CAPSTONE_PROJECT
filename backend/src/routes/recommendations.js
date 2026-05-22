const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const { generateRecommendations } = require('../ai/recommender');

const router = express.Router();

// GET /api/recommendations — personalized eco-tips
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: userLogs, error } = await supabase
      .from('logs')
      .select('*')
      .eq('userId', req.user.id);

    if (error) throw error;
    
    const result = generateRecommendations(userLogs || []);

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
