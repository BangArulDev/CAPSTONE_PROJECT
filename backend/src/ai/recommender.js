/**
 * AI Recommender — Rule-based Recommendation Engine
 * Analyzes user's eco-log patterns and provides personalized tips
 */

const ALL_RECOMMENDATIONS = [
  // Waste reduction tips
  {
    id: 'compost_organic',
    category: 'waste',
    title: 'Start Composting Organic Waste',
    description: 'Composting food scraps can reduce household waste by up to 30%. Set up a small compost bin at home.',
    impact: 'high',
    difficulty: 'easy',
    icon: '🌿',
    trigger: (stats) => stats.avgWaste > 1.5
  },
  {
    id: 'reusable_bags',
    category: 'waste',
    title: 'Switch to Reusable Shopping Bags',
    description: 'Eliminate single-use plastic bags by keeping reusable bags handy. Each bag can save hundreds of plastic bags per year.',
    impact: 'medium',
    difficulty: 'easy',
    icon: '🛍️',
    trigger: (stats) => stats.avgWaste > 1.0
  },
  {
    id: 'zero_waste_shopping',
    category: 'waste',
    title: 'Try Zero-Waste Shopping',
    description: 'Visit bulk food stores or bring your own containers to reduce packaging waste significantly.',
    impact: 'high',
    difficulty: 'medium',
    icon: '♻️',
    trigger: (stats) => stats.avgWaste > 2.0
  },
  // Energy tips
  {
    id: 'led_bulbs',
    category: 'energy',
    title: 'Switch to LED Lighting',
    description: 'LED bulbs use 75% less energy than traditional bulbs and last 25 times longer.',
    impact: 'medium',
    difficulty: 'easy',
    icon: '💡',
    trigger: (stats) => stats.avgEnergy > 8
  },
  {
    id: 'solar_panels',
    category: 'energy',
    title: 'Consider Solar Energy',
    description: 'Rooftop solar panels can reduce energy bills by 50-90% and significantly cut your carbon footprint.',
    impact: 'very_high',
    difficulty: 'hard',
    icon: '☀️',
    trigger: (stats) => stats.avgEnergy > 15
  },
  {
    id: 'smart_thermostat',
    category: 'energy',
    title: 'Use a Smart Thermostat',
    description: 'Smart thermostats learn your schedule and can reduce heating/cooling energy by up to 20%.',
    impact: 'high',
    difficulty: 'medium',
    icon: '🌡️',
    trigger: (stats) => stats.avgEnergy > 10
  },
  {
    id: 'unplug_devices',
    category: 'energy',
    title: 'Unplug Standby Devices',
    description: 'Electronics in standby mode can account for 10% of home energy use. Unplug chargers and electronics when not in use.',
    impact: 'medium',
    difficulty: 'easy',
    icon: '🔌',
    trigger: (stats) => stats.avgEnergy > 6
  },
  // Transport tips
  {
    id: 'cycle_commute',
    category: 'transport',
    title: 'Cycle to Work Once a Week',
    description: 'Cycling just one day a week instead of driving can save 50kg of CO₂ emissions per year.',
    impact: 'high',
    difficulty: 'medium',
    icon: '🚴',
    trigger: (stats) => ['car', 'motorcycle'].includes(stats.commonTransport)
  },
  {
    id: 'public_transport',
    category: 'transport',
    title: 'Use Public Transportation',
    description: 'Taking the bus or train instead of driving alone reduces per-person emissions by up to 4x.',
    impact: 'very_high',
    difficulty: 'easy',
    icon: '🚌',
    trigger: (stats) => stats.commonTransport === 'car'
  },
  {
    id: 'carpooling',
    category: 'transport',
    title: 'Try Carpooling',
    description: 'Share rides with colleagues or neighbors. Carpooling just twice a week can cut your transport emissions by 40%.',
    impact: 'high',
    difficulty: 'easy',
    icon: '🚗',
    trigger: (stats) => stats.commonTransport === 'car'
  },
  // Water tips
  {
    id: 'shorter_showers',
    category: 'water',
    title: 'Shorten Your Showers',
    description: 'Reducing shower time by 2 minutes saves up to 15 liters of water per shower.',
    impact: 'medium',
    difficulty: 'easy',
    icon: '🚿',
    trigger: (stats) => stats.avgWater > 150
  },
  {
    id: 'rainwater_harvest',
    category: 'water',
    title: 'Collect Rainwater',
    description: 'Use collected rainwater for garden irrigation and can reduce outdoor water use by 50%.',
    impact: 'high',
    difficulty: 'medium',
    icon: '🌧️',
    trigger: (stats) => stats.avgWater > 200
  },
  {
    id: 'fix_leaks',
    category: 'water',
    title: 'Fix Leaky Taps',
    description: 'A dripping tap wastes up to 15 liters per day. Fixing it is often simple and free.',
    impact: 'medium',
    difficulty: 'easy',
    icon: '🔧',
    trigger: (stats) => stats.avgWater > 170
  },
  // General eco tips (always shown)
  {
    id: 'plant_trees',
    category: 'general',
    title: 'Plant Trees or Indoor Plants',
    description: 'Trees absorb CO₂ and improve air quality. Even indoor plants improve air quality in your home.',
    impact: 'high',
    difficulty: 'easy',
    icon: '🌳',
    trigger: () => true
  },
  {
    id: 'eat_less_meat',
    category: 'general',
    title: 'Reduce Meat Consumption',
    description: 'Eating plant-based meals just 3 times a week can reduce your food carbon footprint by 25%.',
    impact: 'very_high',
    difficulty: 'medium',
    icon: '🥗',
    trigger: () => true
  }
];

/**
 * Analyze logs and extract user stats
 */
const analyzeUserStats = (logs) => {
  if (!logs || logs.length === 0) {
    return {
      avgWaste: 2.0,
      avgEnergy: 10.0,
      avgWater: 160,
      commonTransport: 'car',
      totalLogs: 0
    };
  }

  const avgWaste = logs.reduce((s, l) => s + l.wasteKg, 0) / logs.length;
  const avgEnergy = logs.reduce((s, l) => s + l.energyKwh, 0) / logs.length;
  const avgWater = logs.reduce((s, l) => s + l.waterLiters, 0) / logs.length;

  // Find most common transport mode
  const transportCounts = {};
  logs.forEach(l => {
    transportCounts[l.transportMode] = (transportCounts[l.transportMode] || 0) + 1;
  });
  const commonTransport = Object.keys(transportCounts).reduce(
    (a, b) => transportCounts[a] > transportCounts[b] ? a : b,
    'car'
  );

  return { avgWaste, avgEnergy, avgWater, commonTransport, totalLogs: logs.length };
};

/**
 * Generate personalized recommendations
 */
const generateRecommendations = (logs) => {
  const stats = analyzeUserStats(logs);
  
  const applicable = ALL_RECOMMENDATIONS.filter(rec => rec.trigger(stats));
  
  // Score by impact
  const impactScore = { very_high: 4, high: 3, medium: 2, low: 1 };
  applicable.sort((a, b) => impactScore[b.impact] - impactScore[a.impact]);

  return {
    recommendations: applicable.slice(0, 10),
    stats: {
      avgWasteKg: parseFloat(stats.avgWaste.toFixed(2)),
      avgEnergyKwh: parseFloat(stats.avgEnergy.toFixed(2)),
      avgWaterLiters: parseFloat(stats.avgWater.toFixed(2)),
      primaryTransport: stats.commonTransport,
      logsAnalyzed: stats.totalLogs
    }
  };
};

module.exports = { generateRecommendations, analyzeUserStats };
