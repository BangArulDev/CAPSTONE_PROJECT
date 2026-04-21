const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../models/dataStore');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

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
const updateStreak = (user) => {
  const today = new Date().toISOString().split('T')[0];
  const lastLog = user.lastLogDate;

  if (!lastLog) {
    user.streak = 1;
  } else {
    const last = new Date(lastLog);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      user.streak += 1;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
  }
  user.lastLogDate = today;
  return user;
};

// Helper: check and award badges
const checkBadges = (user, logs) => {
  const allBadges = readData('badges.json').badges || [];
  const userLogs = logs.filter(l => l.userId === user.id);
  const earnedIds = user.badges || [];

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

  user.badges = earnedIds;
  return user;
};

// GET /api/logs — get user's logs
router.get('/', authenticateToken, (req, res) => {
  try {
    const db = readData('logs.json');
    const logs = (db.logs || []).filter(l => l.userId === req.user.id);
    
    // Sort by date descending
    logs.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: { logs, total: logs.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/logs — submit a new log
router.post('/', authenticateToken, (req, res) => {
  try {
    const { wasteKg, energyKwh, transportMode, waterLiters, notes } = req.body;

    if (wasteKg === undefined || energyKwh === undefined || !transportMode || waterLiters === undefined) {
      return res.status(400).json({
        success: false,
        message: 'wasteKg, energyKwh, transportMode, and waterLiters are required'
      });
    }

    const today = new Date().toISOString().split('T')[0];
    
    const logDb = readData('logs.json');
    const allLogs = logDb.logs || [];
    
    // Check if already logged today
    const existingToday = allLogs.find(l => l.userId === req.user.id && l.date === today);
    if (existingToday) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted a log for today'
      });
    }

    const newLog = {
      id: uuidv4(),
      userId: req.user.id,
      date: today,
      wasteKg: parseFloat(wasteKg),
      energyKwh: parseFloat(energyKwh),
      transportMode,
      waterLiters: parseFloat(waterLiters),
      notes: notes || '',
      points: 0,
      createdAt: new Date().toISOString()
    };

    newLog.points = calculatePoints(newLog);
    allLogs.push(newLog);
    writeData('logs.json', { logs: allLogs });

    // Update user's eco points and streak
    const userDb = readData('users.json');
    const users = userDb.users || [];
    let userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = updateStreak(users[userIndex]);
      users[userIndex].ecoPoints = (users[userIndex].ecoPoints || 0) + newLog.points;
      users[userIndex] = checkBadges(users[userIndex], allLogs);
      writeData('users.json', { users });
    }

    res.status(201).json({
      success: true,
      message: 'Log submitted successfully',
      data: { log: newLog, pointsEarned: newLog.points }
    });
  } catch (error) {
    console.error('Log error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/logs/:id — get a specific log
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const db = readData('logs.json');
    const log = (db.logs || []).find(l => l.id === req.params.id && l.userId === req.user.id);
    
    if (!log) {
      return res.status(404).json({ success: false, message: 'Log not found' });
    }
    
    res.json({ success: true, data: { log } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
