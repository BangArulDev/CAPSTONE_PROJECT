import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {
  FiPlus, FiX, FiZap, FiDroplet, FiPackage, FiStar,
  FiCalendar, FiAward, FiTrendingDown, FiTrendingUp, FiMinus,
  FiActivity, FiChevronRight, FiCheck
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { logsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const transportOptions = [
  { value: 'walking', label: '🚶 Walking', eco: 'Excellent', points: '+30' },
  { value: 'bicycle', label: '🚴 Bicycle', eco: 'Excellent', points: '+30' },
  { value: 'public_transport', label: '🚌 Public Transport', eco: 'Good', points: '+15' },
  { value: 'motorcycle', label: '🏍️ Motorcycle', eco: 'Fair', points: '+0' },
  { value: 'car', label: '🚗 Car', eco: 'Poor', points: '+0' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="eco-tooltip">
        <p style={{ color: '#94a3b8', marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeChart, setActiveChart] = useState('waste');
  const [form, setForm] = useState({
    wasteKg: '', energyKwh: '', transportMode: 'bicycle', waterLiters: '', notes: ''
  });

  const fetchLogs = useCallback(async () => {
    try {
      const res = await logsAPI.getAll();
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        wasteKg: parseFloat(form.wasteKg),
        energyKwh: parseFloat(form.energyKwh),
        transportMode: form.transportMode,
        waterLiters: parseFloat(form.waterLiters),
        notes: form.notes
      };
      const res = await logsAPI.submit(payload);
      showToast(`+${res.data.pointsEarned} eco-points earned! Keep it up! 🌿`);
      setShowForm(false);
      setForm({ wasteKg: '', energyKwh: '', transportMode: 'bicycle', waterLiters: '', notes: '' });
      await fetchLogs();
      await refreshUser();
    } catch (err) {
      showToast(err?.message || 'Failed to submit log.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Chart data
  const chartData = [...logs].slice(0, 10).reverse().map((l, i) => ({
    date: l.date.slice(5),
    waste: l.wasteKg,
    energy: l.energyKwh,
    water: l.waterLiters,
    points: l.points,
  }));

  // Stats
  const avgWaste = logs.length ? (logs.reduce((s, l) => s + l.wasteKg, 0) / logs.length) : 0;
  const avgEnergy = logs.length ? (logs.reduce((s, l) => s + l.energyKwh, 0) / logs.length) : 0;
  const avgWater = logs.length ? (logs.reduce((s, l) => s + l.waterLiters, 0) / logs.length) : 0;
  const totalPoints = user?.ecoPoints || 0;
  const streak = user?.streak || 0;
  const badgeCount = user?.badges?.length || 0;

  // Eco score (0-100)
  const ecoScore = Math.min(100, Math.round(
    (avgWaste < 1 ? 30 : avgWaste < 2 ? 15 : 0) +
    (avgEnergy < 5 ? 30 : avgEnergy < 10 ? 15 : 0) +
    (avgWater < 100 ? 20 : avgWater < 150 ? 10 : 0) +
    (streak >= 7 ? 20 : streak >= 3 ? 10 : streak >= 1 ? 5 : 0)
  ));

  // Trend (compare last log vs second last)
  const getTrend = (key) => {
    if (logs.length < 2) return 'stable';
    const diff = logs[0][key] - logs[1][key];
    if (diff < -0.1) return 'down';
    if (diff > 0.1) return 'up';
    return 'stable';
  };

  const trendIcon = (trend, invertGood = false) => {
    const isGood = invertGood ? trend === 'down' : trend === 'up';
    if (trend === 'down') return <FiTrendingDown size={12} className={invertGood ? 'status-good' : 'status-danger'} />;
    if (trend === 'up') return <FiTrendingUp size={12} className={invertGood ? 'status-danger' : 'status-good'} />;
    return <FiMinus size={12} style={{ color: '#64748b' }} />;
  };

  const chartConfig = {
    waste: { key: 'waste', label: 'Waste', unit: 'kg', color: '#f87171', gradId: 'wasteG' },
    energy: { key: 'energy', label: 'Energy', unit: 'kWh', color: '#818cf8', gradId: 'energyG' },
    water: { key: 'water', label: 'Water', unit: 'L', color: '#22d3ee', gradId: 'waterG' },
    points: { key: 'points', label: 'Points', unit: 'pts', color: '#4ade80', gradId: 'pointsG' },
  };
  const cc = chartConfig[activeChart];

  const hasLoggedToday = logs.length > 0 && logs[0].date === new Date().toISOString().split('T')[0];

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Navbar />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -60, x: '-50%' }}
            className="fixed top-20 left-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-medium shadow-2xl flex items-center gap-3"
            style={toast.type === 'error'
              ? { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5', backdropFilter: 'blur(12px)' }
              : { background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', color: '#86efac', backdropFilter: 'blur(12px)' }
            }
          >
            {toast.type !== 'error' && <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34,197,94,0.2)' }}><FiCheck size={12} style={{ color: '#4ade80' }} /></div>}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
              </h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {hasLoggedToday ? '✅ Already logged today — great job!' : '📋 You haven\'t logged today yet.'}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowForm(true)}
            disabled={hasLoggedToday}
            className="btn-primary flex-shrink-0 px-5 py-2.5"
            style={{ opacity: hasLoggedToday ? 0.5 : 1, cursor: hasLoggedToday ? 'not-allowed' : 'pointer' }}
          >
            <FiPlus size={16} />
            {hasLoggedToday ? 'Logged Today' : 'Log Today\'s Data'}
          </motion.button>
        </div>

        {/* ── Top Row: Eco Score + Stat Cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">

          {/* Eco Score Circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glow p-6 flex flex-col items-center justify-center text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Eco Score</p>
            <div className="relative w-28 h-28 mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - ecoScore / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#4ade80" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{logs.length ? ecoScore : '—'}</span>
                {logs.length > 0 && <span className="text-xs text-green-400">/100</span>}
              </div>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
              {ecoScore >= 70 ? '🌟 Excellent' : ecoScore >= 40 ? '📈 Good' : '🌱 Getting Started'}
            </span>
          </motion.div>

          {/* Stats */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Eco Points', value: totalPoints.toLocaleString(), icon: '⭐', unit: 'pts', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)', trend: null },
              { label: 'Current Streak', value: streak, icon: '🔥', unit: 'days', color: '#22c55e', bgColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', trend: null },
              { label: 'Avg Waste', value: avgWaste ? avgWaste.toFixed(1) : '—', icon: '🗑️', unit: 'kg/day', color: '#f87171', bgColor: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.2)', trend: getTrend('wasteKg') },
              { label: 'Avg Energy', value: avgEnergy ? avgEnergy.toFixed(1) : '—', icon: '⚡', unit: 'kWh/day', color: '#818cf8', bgColor: 'rgba(129,140,248,0.08)', borderColor: 'rgba(129,140,248,0.2)', trend: getTrend('energyKwh') },
              { label: 'Avg Water', value: avgWater ? Math.round(avgWater) : '—', icon: '💧', unit: 'L/day', color: '#22d3ee', bgColor: 'rgba(34,211,238,0.08)', borderColor: 'rgba(34,211,238,0.2)', trend: null },
              { label: 'Badges', value: badgeCount, icon: '🏅', unit: 'earned', color: '#a78bfa', bgColor: 'rgba(167,139,250,0.08)', borderColor: 'rgba(167,139,250,0.2)', trend: null },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="stat-card"
                style={{ '--gradient': `linear-gradient(90deg, ${s.color}, transparent)`, background: s.bgColor, border: `1px solid ${s.borderColor}` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  {s.trend && s.trend !== 'stable' && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{
                      background: s.trend === 'down' ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)',
                      color: s.trend === 'down' ? '#4ade80' : '#f87171'
                    }}>
                      {s.trend === 'down' ? '↓' : '↑'}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.unit}</div>
                <div className="text-xs font-medium mt-1" style={{ color: s.color }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Charts ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-6"
          style={{ padding: 0, overflow: 'hidden' }}
        >
          {/* Chart Tabs */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
            <div>
              <h3 className="font-semibold text-white text-base">Activity Trends</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Last {Math.min(logs.length, 10)} entries</p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {Object.entries(chartConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setActiveChart(key)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={activeChart === key
                    ? { background: cfg.color + '20', color: cfg.color, border: `1px solid ${cfg.color}40` }
                    : { color: '#475569' }
                  }
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 pt-4">
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Log data to see your trends</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id={cc.gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={cc.color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={cc.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey={cc.key}
                    name={`${cc.label} (${cc.unit})`}
                    stroke={cc.color}
                    fill={`url(#${cc.gradId})`}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: cc.color, strokeWidth: 2, stroke: 'var(--bg-card)' }}
                    activeDot={{ r: 6, fill: cc.color }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* ── Recent Activity Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
          style={{ padding: 0, overflow: 'hidden' }}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <div>
              <h3 className="font-semibold text-white text-base">Recent Activity</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{logs.length} total entries</p>
            </div>
            {logs.length > 0 && (
              <span className="pill text-xs" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                <FiActivity size={11} /> Live
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-12 shimmer" />)}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                <span className="text-3xl">🌿</span>
              </div>
              <p className="font-medium text-white mb-1">No logs yet</p>
              <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Start tracking your eco-footprint today!</p>
              <button onClick={() => setShowForm(true)} className="btn-primary inline-flex text-sm px-5 py-2.5">
                <FiPlus size={14} /> Log First Entry
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="eco-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Waste</th>
                    <th>Energy</th>
                    <th>Water</th>
                    <th>Transport</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 8).map((log) => (
                    <tr key={log.id}>
                      <td>
                        <span className="font-mono text-xs px-2 py-1 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.04)', color: '#64748b' }}>
                          {log.date}
                        </span>
                      </td>
                      <td>
                        <span className={`font-semibold ${log.wasteKg < 1 ? 'status-good' : log.wasteKg < 2 ? 'status-warning' : 'status-danger'}`}>
                          {log.wasteKg} kg
                        </span>
                      </td>
                      <td>
                        <span className={`font-semibold ${log.energyKwh < 5 ? 'status-good' : log.energyKwh < 10 ? 'status-warning' : 'status-danger'}`}>
                          {log.energyKwh} kWh
                        </span>
                      </td>
                      <td className="text-slate-300">
                        {log.waterLiters} L
                      </td>
                      <td>
                        <span className="capitalize px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                          {log.transportMode.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span className="font-bold text-sm px-2.5 py-1 rounded-lg"
                          style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>
                          +{log.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Log Form Modal ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid rgba(34,197,94,0.2)', boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,197,94,0.1)' }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div>
                  <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                    Log Today&apos;s Eco Data
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <button onClick={() => setShowForm(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Waste */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      🗑️ Waste Generated
                    </label>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>
                      kg · daily total
                    </span>
                  </div>
                  <input type="number" step="0.1" min="0" max="50"
                    value={form.wasteKg}
                    onChange={e => setForm({ ...form, wasteKg: e.target.value })}
                    className="input-field" placeholder="e.g. 1.5" required />
                  <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>🎯 Target: &lt;1 kg/day for max points</p>
                </div>

                {/* Energy */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">⚡ Energy Consumed</label>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(129,140,248,0.1)', color: '#818cf8' }}>
                      kWh · household
                    </span>
                  </div>
                  <input type="number" step="0.1" min="0" max="100"
                    value={form.energyKwh}
                    onChange={e => setForm({ ...form, energyKwh: e.target.value })}
                    className="input-field" placeholder="e.g. 8.5" required />
                  <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>🎯 Target: &lt;5 kWh/day for max points</p>
                </div>

                {/* Water */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">💧 Water Used</label>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee' }}>
                      liters · per day
                    </span>
                  </div>
                  <input type="number" step="1" min="0" max="1000"
                    value={form.waterLiters}
                    onChange={e => setForm({ ...form, waterLiters: e.target.value })}
                    className="input-field" placeholder="e.g. 150" required />
                  <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>🎯 Target: &lt;100 L/day for max points</p>
                </div>

                {/* Transport */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">🚗 Transport Mode</label>
                  <div className="grid grid-cols-1 gap-2">
                    {transportOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, transportMode: opt.value })}
                        className="flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all"
                        style={form.transportMode === opt.value
                          ? { background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.4)', color: '#f1f5f9' }
                          : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }
                        }
                      >
                        <span>{opt.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: form.transportMode === opt.value ? '#4ade80' : '#475569' }}>
                            {opt.points}
                          </span>
                          <span className="text-xs font-medium" style={{
                            color: opt.eco === 'Excellent' ? '#4ade80' : opt.eco === 'Good' ? '#fbbf24' : '#f87171'
                          }}>
                            {opt.eco}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">📝 Notes (optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="input-field resize-none" rows={2}
                    placeholder="Any notes about today's eco activities..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 justify-center">
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary flex-1 justify-center"
                    style={{ opacity: submitting ? 0.75 : 1 }}
                  >
                    {submitting ? (
                      <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Submitting...</>
                    ) : (
                      <><FiCheck size={15} /> Submit Log</>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
