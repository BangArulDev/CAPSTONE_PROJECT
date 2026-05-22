const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const { generatePredictions } = require('../ai/predictor');

const router = express.Router();

// GET /api/predictions — AI-powered waste/energy predictions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: userLogs, error } = await supabase
      .from('logs')
      .select('*')
      .eq('userId', req.user.id)
      .order('date', { ascending: true });

    if (error) throw error;
    
    const predictions = generatePredictions(userLogs || []);

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
