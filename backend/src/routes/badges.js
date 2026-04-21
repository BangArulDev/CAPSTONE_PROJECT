const express = require('express');
const { readData } = require('../models/dataStore');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/badges — all badges and user's earned badges
router.get('/', authenticateToken, (req, res) => {
  try {
    const allBadges = readData('badges.json').badges || [];
    
    const userDb = readData('users.json');
    const user = (userDb.users || []).find(u => u.id === req.user.id);
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
