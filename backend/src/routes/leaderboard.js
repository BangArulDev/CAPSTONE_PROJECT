const express = require('express');
const { readData } = require('../models/dataStore');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/leaderboard — global rankings by eco-points
router.get('/', authenticateToken, (req, res) => {
  try {
    const db = readData('users.json');
    const users = db.users || [];

    const leaderboard = users
      .map(u => ({
        id: u.id,
        name: u.name,
        ecoPoints: u.ecoPoints || 0,
        streak: u.streak || 0,
        badges: (u.badges || []).length,
        isCurrentUser: u.id === req.user.id
      }))
      .sort((a, b) => b.ecoPoints - a.ecoPoints)
      .map((user, index) => ({ ...user, rank: index + 1 }));

    const currentUserRank = leaderboard.find(u => u.isCurrentUser);

    res.json({
      success: true,
      data: {
        leaderboard: leaderboard.slice(0, 50),
        currentUserRank: currentUserRank || null,
        totalUsers: users.length
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
