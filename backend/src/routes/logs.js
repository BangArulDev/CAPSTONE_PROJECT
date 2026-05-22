const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Get badges statically
const badgesDataPath = path.join(__dirname, '../../data/badges.json');
const getBadgesDefinition = () => {
  try {
    return JSON.parse(fs.readFileSync(badgesDataPath, 'utf8')).badges || [];
  } catch {
    return [];
  }
};

// Helper: calculate eco points from a log entry
const calculatePoints = (log) => {
  let points = 50; // base points
  if (log.wasteKg < 1) points += 30;
  else if (log.wasteKg < 2) points += 15;
  if (log.energyKwh < 5) points += 25;
  else if (log.energyKwh < 10) points += 10;
  if (log.transportMode === 'bicycle' || log.transportMode === 'walking') points += 30;
  else if (log.transportMode === 'public_transport') points += 15;
  if (log.waterLiters < 100) points += 20;
  else if (log.waterLiters < 150) points += 10;
  return points;
};

// Helper: update streak
const getUpdatedStreak = (user) => {
  const today = new Date().toISOString().split('T')[0];
  const lastLog = user.lastLogDate;
  let newStreak = user.streak || 0;

  if (!lastLog) {
    newStreak = 1;
  } else {
    const last = new Date(lastLog);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }
  return { streak: newStreak, lastLogDate: today };
};

// Helper: check and award badges
const checkBadges = (user, userLogs) => {
  const allBadges = getBadgesDefinition();
  const earnedIds = [...(user.badges || [])];

  allBadges.forEach(badge => {
    if (earnedIds.includes(badge.id)) return;

    const { type, value } = badge.requirement;
    let earned = false;

    if (type === 'log_count' && userLogs.length >= value) earned = true;
    if (type === 'streak' && user.streak >= value) earned = true;
    if (type === 'points' && user.ecoPoints >= value) earned = true;
    if (type === 'low_waste_days') {
      const lowWasteDays = userLogs.filter(l => l.wasteKg < 1).length;
      if (lowWasteDays >= value) earned = true;
    }
    if (type === 'low_energy_days') {
      const lowEnergyDays = userLogs.filter(l => l.energyKwh < 5).length;
      if (lowEnergyDays >= value) earned = true;
    }

    if (earned) earnedIds.push(badge.id);
  });

  return earnedIds;
};

// GET /api/logs — get user's logs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: logs, error } = await supabase
      .from('logs')
      .select('*')
      .eq('userId', req.user.id)
      .order('date', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: { logs, total: logs.length }
    });
  } catch (error) {
    console.error('Fetch logs error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/logs — submit a new log
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { wasteKg, energyKwh, transportMode, waterLiters, notes } = req.body;

    if (wasteKg === undefined || energyKwh === undefined || !transportMode || waterLiters === undefined) {
      return res.status(400).json({
        success: false,
        message: 'wasteKg, energyKwh, transportMode, and waterLiters are required'
      });
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Check if already logged today
    const { data: existingToday, error: checkError } = await supabase
      .from('logs')
      .select('id')
      .eq('userId', req.user.id)
      .eq('date', today)
      .maybeSingle();

    if (existingToday) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted a log for today'
      });
    }

    const points = calculatePoints({ wasteKg, energyKwh, transportMode, waterLiters });

    // Insert new log
    const { data: newLog, error: insertError } = await supabase
      .from('logs')
      .insert([
        {
          userId: req.user.id,
          date: today,
          wasteKg: parseFloat(wasteKg),
          energyKwh: parseFloat(energyKwh),
          transportMode,
          waterLiters: parseFloat(waterLiters),
          notes: notes || '',
          points
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // Get user and all logs to update stats and badges
    const { data: user } = await supabase.from('users').select('*').eq('id', req.user.id).single();
    const { data: allUserLogs } = await supabase.from('logs').select('*').eq('userId', req.user.id);

    if (user) {
      const { streak, lastLogDate } = getUpdatedStreak(user);
      const newEcoPoints = (user.ecoPoints || 0) + points;
      
      const tempUser = { ...user, streak, ecoPoints: newEcoPoints };
      const newBadges = checkBadges(tempUser, allUserLogs || []);

      // Update user
      await supabase
        .from('users')
        .update({
          streak,
          lastLogDate,
          ecoPoints: newEcoPoints,
          badges: newBadges
        })
        .eq('id', user.id);
    }

    res.status(201).json({
      success: true,
      message: 'Log submitted successfully',
      data: { log: newLog, pointsEarned: points }
    });
  } catch (error) {
    console.error('Log error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/logs/:id — get a specific log
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: log, error } = await supabase
      .from('logs')
      .select('*')
      .eq('id', req.params.id)
      .eq('userId', req.user.id)
      .single();
    
    if (error || !log) {
      return res.status(404).json({ success: false, message: 'Log not found' });
    }
    
    res.json({ success: true, data: { log } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
