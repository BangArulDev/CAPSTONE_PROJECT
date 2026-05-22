const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// GET /api/badges — all badges and user's earned badges
router.get('/', authenticateToken, async (req, res) => {
  try {
    const badgesDataPath = path.join(__dirname, '../../data/badges.json');
    let allBadges = [];
    try {
      allBadges = JSON.parse(fs.readFileSync(badgesDataPath, 'utf8')).badges || [];
    } catch {
      // fallback if file missing
    }
    
    const { data: user, error } = await supabase
      .from('users')
      .select('badges')
      .eq('id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Fetch user badges error:', error);
    }

    const earnedIds = user?.badges || [];

    const badgesWithStatus = allBadges.map(badge => ({
      ...badge,
      earned: earnedIds.includes(badge.id),
      earnedAt: earnedIds.includes(badge.id) ? new Date().toISOString() : null
    }));

    res.json({
      success: true,
      data: {
        badges: badgesWithStatus,
        earned: earnedIds.length,
        total: allBadges.length
      }
    });
  } catch (error) {
    console.error('Badges error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
