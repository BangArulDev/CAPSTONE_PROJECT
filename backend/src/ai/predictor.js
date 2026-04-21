/**
 * AI Predictor — Pure JavaScript Linear Regression
 * Predicts future waste/energy trends based on user's historical logs
 */

/**
 * Simple Linear Regression: y = mx + b
 */
const linearRegression = (xValues, yValues) => {
  const n = xValues.length;
  if (n < 2) return { slope: 0, intercept: yValues[0] || 0 };

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

/**
 * Predict next N days based on regression model
 */
const predictNextDays = (historicalValues, n = 7) => {
  const x = historicalValues.map((_, i) => i);
  const y = historicalValues;

  const { slope, intercept } = linearRegression(x, y);

  const predictions = [];
  for (let i = historicalValues.length; i < historicalValues.length + n; i++) {
    const predicted = slope * i + intercept;
    predictions.push(Math.max(0, parseFloat(predicted.toFixed(2))));
  }

  return { slope, intercept, predictions };
};

/**
 * Calculate trend direction
 */
const getTrend = (slope) => {
  if (slope > 0.05) return 'increasing';
  if (slope < -0.05) return 'decreasing';
  return 'stable';
};

/**
 * Main prediction function for a user's logs
 */
const generatePredictions = (logs) => {
  if (!logs || logs.length === 0) {
    return {
      waste: { trend: 'stable', predictions: [1.5, 1.4, 1.3, 1.3, 1.2, 1.2, 1.1], slope: -0.05 },
      energy: { trend: 'stable', predictions: [8, 7.8, 7.5, 7.5, 7.2, 7.0, 6.8], slope: -0.15 },
      water: { trend: 'stable', predictions: [150, 148, 145, 145, 142, 140, 138], slope: -1.5 },
      message: 'Start logging daily data to get personalized AI predictions!',
      confidence: 0
    };
  }

  // Sort logs by date
  const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));

  const wasteValues = sorted.map(l => l.wasteKg);
  const energyValues = sorted.map(l => l.energyKwh);
  const waterValues = sorted.map(l => l.waterLiters);

  const wasteModel = predictNextDays(wasteValues, 7);
  const energyModel = predictNextDays(energyValues, 7);
  const waterModel = predictNextDays(waterValues, 7);

  const confidence = Math.min(100, Math.round((logs.length / 30) * 100));

  const wasteTrend = getTrend(wasteModel.slope);
  const energyTrend = getTrend(energyModel.slope);

  let message = '';
  if (wasteTrend === 'decreasing' && energyTrend === 'decreasing') {
    message = '🎉 Excellent! Your waste and energy consumption are both trending down. Keep it up!';
  } else if (wasteTrend === 'increasing') {
    message = '⚠️ Your waste generation is increasing. Consider reducing packaging and composting more.';
  } else if (energyTrend === 'increasing') {
    message = '⚡ Your energy consumption is trending up. Try switching off unused appliances.';
  } else {
    message = '📊 Your eco-habits are stable. Small consistent improvements lead to big impacts!';
  }

  return {
    waste: {
      trend: wasteTrend,
      historical: wasteValues,
      predictions: wasteModel.predictions,
      slope: parseFloat(wasteModel.slope.toFixed(4))
    },
    energy: {
      trend: energyTrend,
      historical: energyValues,
      predictions: energyModel.predictions,
      slope: parseFloat(energyModel.slope.toFixed(4))
    },
    water: {
      trend: getTrend(waterModel.slope),
      historical: waterValues,
      predictions: waterModel.predictions,
      slope: parseFloat(waterModel.slope.toFixed(4))
    },
    confidence,
    message,
    dataPoints: logs.length
  };
};

module.exports = { generatePredictions, linearRegression, predictNextDays };
