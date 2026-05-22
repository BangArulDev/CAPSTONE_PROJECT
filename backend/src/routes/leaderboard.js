const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/leaderboard — global rankings by eco-points
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, "ecoPoints", streak, badges')
      .order('"ecoPoints"', { ascending: false });

    if (error) throw error;

    const leaderboard = (users || [])
      .map((u, index) => ({
        id: u.id,
        name: u.name,
        ecoPoints: u.ecoPoints || 0,
        streak: u.streak || 0,
        badges: (u.badges || []).length,
        isCurrentUser: u.id === req.user.id,
        rank: index + 1
      }));

    const currentUserRank = leaderboard.find(u => u.isCurrentUser);

    res.json({
      success: true,
      data: {
        leaderboard: leaderboard.slice(0, 50),
        currentUserRank: currentUserRank || null,
        totalUsers: users?.length || 0
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
