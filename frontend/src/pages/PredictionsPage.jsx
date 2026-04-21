import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiCpu, FiInfo, FiChevronRight } from 'react-icons/fi';
import { predictionsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const TrendBadge = ({ trend }) => {
  const cfg = {
    increasing: { icon: <FiTrendingUp size={11} />, label: 'Increasing', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
    decreasing: { icon: <FiTrendingDown size={11} />, label: 'Decreasing', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)' },
    stable: { icon: <FiMinus size={11} />, label: 'Stable', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
  }[trend] || { icon: <FiMinus size={11} />, label: 'Stable', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' };

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="eco-tooltip" style={{ padding: '10px 14px' }}>
        <p style={{ color: '#64748b', fontSize: 11, marginBottom: 6 }}>{label}</p>
        {payload.filter(p => p.value !== null).map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 600, fontSize: 12 }}>
            {p.name === 'historical' ? 'Actual' : 'Predicted'}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const buildChartData = (historical = [], predictions = []) => [
  ...historical.map((v, i) => ({
    idx: `D${i + 1}`,
    historical: parseFloat(v.toFixed(2)),
    predicted: null,
    type: 'history'
  })),
  ...predictions.map((v, i) => ({
    idx: `+${i + 1}d`,
    historical: null,
    predicted: parseFloat(v.toFixed(2)),
    type: 'prediction'
  }))
];

const PredChart = ({ title, emoji, color, predColor, trend, historical, predictions, unit, index }) => {
  const chartData = buildChartData(historical, predictions);
  const separatorIdx = historical?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card"
      style={{ padding: 0, overflow: 'hidden' }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <div>
            <h3 className="font-semibold text-white text-sm">{title}</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>7-day AI forecast · {unit}</p>
          </div>
        </div>
        <TrendBadge trend={trend} />
      </div>
      <div className="px-4 pb-4 pt-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="idx" tick={{ fill: '#334155', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#334155', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {separatorIdx > 0 && (
              <ReferenceLine
                x={`+1d`}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 4"
                label={{ value: 'Forecast →', position: 'top', fill: '#334155', fontSize: 9 }}
              />
            )}
            <Line
              type="monotone"
              dataKey="historical"
              name="historical"
              stroke={color}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: color, strokeWidth: 2, stroke: 'var(--bg-card)' }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name="predicted"
              stroke={predColor}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={{ r: 3, fill: predColor, fillOpacity: 0.7, strokeWidth: 1, stroke: 'var(--bg-card)' }}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="flex items-center gap-6 justify-center mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-0.5 rounded-full" style={{ background: color }} />
            <span className="text-xs" style={{ color: '#475569' }}>Historical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-0.5 rounded-full" style={{ background: predColor, borderTop: '1px dashed' }} />
            <span className="text-xs" style={{ color: '#475569' }}>Predicted</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PredictionsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await predictionsAPI.get();
        setData(res.data);
      } catch (err) {
        setError(err?.message || 'Failed to load predictions');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="icon-box" style={{ background: 'rgba(129,140,248,0.15)', color: '#818cf8' }}>
              <FiCpu size={20} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
              AI Predictions
            </h1>
          </div>
          <p className="text-sm ml-14" style={{ color: 'var(--text-muted)' }}>
            Linear Regression model — 7-day ecological footprint forecast
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => <div key={i} className="h-72 shimmer rounded-2xl" />)}
          </div>
        ) : error ? (
          <div className="card text-center py-16">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="font-medium text-white mb-1">Failed to load predictions</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{error}</p>
          </div>
        ) : (
          <>
            {/* AI Message Banner */}
            {data?.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-start gap-4 p-5 rounded-2xl"
                style={{
                  background: 'rgba(129,140,248,0.06)',
                  border: '1px solid rgba(129,140,248,0.2)',
                }}
              >
                <div className="icon-box flex-shrink-0" style={{ background: 'rgba(129,140,248,0.12)', color: '#818cf8' }}>
                  <FiInfo size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white text-sm mb-1">{data.message}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      📊 {data.dataPoints || 0} data points analyzed
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="progress-bar" style={{ width: 80 }}>
                        <div className="progress-fill" style={{
                          width: `${data.confidence || 0}%`,
                          background: 'linear-gradient(90deg, #818cf8, #22c55e)'
                        }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: '#818cf8' }}>
                        {data.confidence || 0}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              <PredChart
                index={0}
                title="Waste Prediction"
                emoji="🗑️"
                color="#f87171"
                predColor="#fca5a5"
                trend={data?.waste?.trend}
                historical={data?.waste?.historical}
                predictions={data?.waste?.predictions}
                unit="kg/day"
              />
              <PredChart
                index={1}
                title="Energy Prediction"
                emoji="⚡"
                color="#818cf8"
                predColor="#c4b5fd"
                trend={data?.energy?.trend}
                historical={data?.energy?.historical}
                predictions={data?.energy?.predictions}
                unit="kWh/day"
              />
              <PredChart
                index={2}
                title="Water Prediction"
                emoji="💧"
                color="#22d3ee"
                predColor="#67e8f9"
                trend={data?.water?.trend}
                historical={data?.water?.historical}
                predictions={data?.water?.predictions}
                unit="L/day"
              />

              {/* AI Info Panel */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="card space-y-4"
              >
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <FiCpu size={16} style={{ color: '#818cf8' }} />
                  How the AI Works
                </h3>

                {[
                  {
                    title: 'Linear Regression',
                    body: <>Uses <code>y = mx + b</code> to find the linear trend in your historical data and project it 7 days forward.</>,
                    icon: '📐'
                  },
                  {
                    title: 'Slope Interpretation',
                    body: <div className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <div><span style={{ color: '#4ade80' }}>↓ Negative slope</span> — improving trend</div>
                      <div><span style={{ color: '#f87171' }}>↑ Positive slope</span> — worsening trend</div>
                      <div><span style={{ color: '#fbbf24' }}>→ ~0 slope</span> — stable habits</div>
                    </div>,
                    icon: '📊'
                  },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-sm font-semibold text-slate-300 mb-1.5">{item.icon} {item.title}</p>
                    <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.body}</div>
                  </div>
                ))}

                {/* Slopes display */}
                {data?.waste?.slope !== undefined && (
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-sm font-semibold text-slate-300 mb-3">📈 Your Current Slopes</p>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Waste', slope: data.waste.slope, icon: '🗑️' },
                        { label: 'Energy', slope: data.energy.slope, icon: '⚡' },
                        { label: 'Water', slope: data.water.slope, icon: '💧' },
                      ].map(({ label, slope, icon }) => (
                        <div key={label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{icon}</span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="progress-bar" style={{ width: 60 }}>
                              <div className="progress-fill" style={{
                                width: `${Math.min(100, Math.abs(slope) * 100)}%`,
                                background: slope < 0 ? '#22c55e' : slope > 0 ? '#f87171' : '#fbbf24'
                              }} />
                            </div>
                            <span className="text-xs font-mono font-bold w-14 text-right"
                              style={{ color: slope < 0 ? '#4ade80' : slope > 0 ? '#f87171' : '#fbbf24' }}>
                              {slope > 0 ? '+' : ''}{slope}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PredictionsPage;
