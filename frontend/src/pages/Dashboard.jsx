import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { FiPlus, FiX, FiCheck, FiTrendingDown, FiTrendingUp, FiMinus, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { logsAPI } from '../services/api';
import Navbar from '../components/Navbar';

// Kategori jenis limbah dapur
const kitchenWasteTypes = [
  { value: 'sisa_nasi', label: '🍚 Sisa Nasi', desc: 'Nasi yang tersisa dari makan' },
  { value: 'sayuran', label: '🥦 Sayuran/Bumbu', desc: 'Sisa sayur, daun, dan bumbu' },
  { value: 'buah', label: '🍎 Buah-buahan', desc: 'Buah busuk atau kulit buah' },
  { value: 'lauk', label: '🍗 Sisa Lauk', desc: 'Daging, ikan, tempe, tahu sisa' },
  { value: 'kulit_sayur', label: '🥔 Kulit & Batang', desc: 'Kulit kentang, batang brokoli, dll' },
  { value: 'minyak', label: '🫙 Sisa Minyak', desc: 'Minyak bekas goreng' },
  { value: 'lainnya', label: '♻️ Lainnya', desc: 'Jenis limbah dapur lainnya' },
];

// Mode penanganan limbah
const wasteDisposalMethods = [
  { value: 'kompos', label: '♻️ Kompos', points: '+25', color: '#5cb285', desc: 'Jadikan pupuk kompos' },
  { value: 'pakan_ternak', label: '🐄 Pakan Ternak', points: '+20', color: '#45b7a0', desc: 'Berikan ke hewan peliharaan/ternak' },
  { value: 'olah_lagi', label: '👩‍🍳 Olah Lagi', points: '+15', color: '#f7c948', desc: 'Masak ulang menjadi menu baru' },
  { value: 'buang_sampah', label: '🗑️ Buang Biasa', points: '+0', color: '#b08c6e', desc: 'Dibuang ke tempat sampah biasa' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="eco-tooltip">
        <p style={{ color: 'var(--text-muted)', marginBottom: 4, fontSize: 12 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 700 }}>
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
    wasteKg: '',
    energyKwh: '',
    transportMode: 'bicycle',
    waterLiters: '',
    notes: '',
    // Kitchen-specific extras (stored in notes)
    wasteType: 'sisa_nasi',
    disposalMethod: 'kompos',
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
      const kitchenNote = `[Jenis: ${form.wasteType}] [Penanganan: ${form.disposalMethod}] ${form.notes}`.trim();
      const payload = {
        wasteKg: parseFloat(form.wasteKg),
        energyKwh: parseFloat(form.energyKwh) || 0,
        transportMode: form.transportMode,
        waterLiters: parseFloat(form.waterLiters) || 100,
        notes: kitchenNote,
      };
      const res = await logsAPI.submit(payload);
      showToast(`🎉 Hebat! +${res.data.pointsEarned} poin earned! Dapur makin ramah lingkungan! 🌿`);
      setShowForm(false);
      setForm({ wasteKg: '', energyKwh: '', transportMode: 'bicycle', waterLiters: '', notes: '', wasteType: 'sisa_nasi', disposalMethod: 'kompos' });
      await fetchLogs();
      await refreshUser();
    } catch (err) {
      showToast(err?.message || 'Gagal menyimpan catatan. Coba lagi ya!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Chart data
  const chartData = [...logs].slice(0, 10).reverse().map((l) => ({
    date: new Date(l.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
    waste: l.wasteKg,
    energy: l.energyKwh,
    water: l.waterLiters,
    points: l.points,
  }));

  // Stats
  const avgWaste = logs.length ? (logs.reduce((s, l) => s + l.wasteKg, 0) / logs.length) : 0;
  const totalPoints = user?.ecoPoints || 0;
  const streak = user?.streak || 0;
  const badgeCount = user?.badges?.length || 0;
  const totalLogs = logs.length;
  const thisWeekLogs = logs.filter(l => {
    const logDate = new Date(l.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  }).length;

  // Eco score
  const ecoScore = Math.min(100, Math.round(
    (avgWaste < 0.5 ? 40 : avgWaste < 1 ? 25 : avgWaste < 2 ? 12 : 0) +
    (streak >= 7 ? 30 : streak >= 3 ? 18 : streak >= 1 ? 8 : 0) +
    (totalLogs >= 10 ? 30 : totalLogs >= 5 ? 18 : totalLogs >= 1 ? 8 : 0)
  ));

  const scoreLabel = ecoScore >= 80 ? '🌟 Luar Biasa!' : ecoScore >= 60 ? '💪 Bagus Sekali!' : ecoScore >= 30 ? '🌱 Terus Semangat!' : '🌿 Baru Mulai';

  const getTrend = (key) => {
    if (logs.length < 2) return 'stable';
    const diff = logs[0][key] - logs[1][key];
    if (diff < -0.05) return 'down';
    if (diff > 0.05) return 'up';
    return 'stable';
  };

  const chartConfig = {
    waste: { key: 'waste', label: '🗑️ Limbah', unit: 'kg', color: '#e8834a', gradId: 'wasteG' },
    points: { key: 'points', label: '⭐ Poin', unit: 'pts', color: '#f7c948', gradId: 'pointsG' },
  };
  const cc = chartConfig[activeChart];

  const hasLoggedToday = logs.length > 0 && logs[0].date === new Date().toISOString().split('T')[0];

  const statCards = [
    {
      label: 'Total Poin', value: totalPoints.toLocaleString('id-ID'), emoji: '⭐', unit: 'poin terkumpul',
      color: '#f7c948', bg: 'rgba(247,201,72,0.1)', border: 'rgba(247,201,72,0.25)',
      gradient: 'linear-gradient(90deg, #f7c948, #e8834a)',
    },
    {
      label: 'Hari Beruntun', value: streak, emoji: '🔥', unit: 'hari berturut-turut',
      color: '#e8834a', bg: 'rgba(232,131,74,0.1)', border: 'rgba(232,131,74,0.25)',
      gradient: 'linear-gradient(90deg, #e8834a, #f4a76c)',
    },
    {
      label: 'Rata-rata Limbah', value: avgWaste ? `${avgWaste.toFixed(2)} kg` : '—', emoji: '🗑️', unit: 'per hari',
      color: '#45b7a0', bg: 'rgba(69,183,160,0.1)', border: 'rgba(69,183,160,0.25)',
      gradient: 'linear-gradient(90deg, #45b7a0, #5cb285)',
      trend: getTrend('wasteKg'),
    },
    {
      label: 'Catatan Minggu Ini', value: thisWeekLogs, emoji: '📅', unit: 'kali dicatat',
      color: '#9b7fe8', bg: 'rgba(155,127,232,0.1)', border: 'rgba(155,127,232,0.25)',
      gradient: 'linear-gradient(90deg, #9b7fe8, #c4b5fd)',
    },
    {
      label: 'Lencana Diraih', value: badgeCount, emoji: '🏆', unit: 'lencana',
      color: '#5cb285', bg: 'rgba(92,178,133,0.1)', border: 'rgba(92,178,133,0.25)',
      gradient: 'linear-gradient(90deg, #5cb285, #45b7a0)',
    },
    {
      label: 'Total Catatan', value: totalLogs, emoji: '📝', unit: 'catatan tersimpan',
      color: '#f17070', bg: 'rgba(241,112,112,0.1)', border: 'rgba(241,112,112,0.25)',
      gradient: 'linear-gradient(90deg, #f17070, #fca5a5)',
    },
  ];

  // Quick tips based on waste level
  const quickTips = avgWaste > 1.5 ? [
    '💡 Coba masak secukupnya saja — masak lebih sedikit tapi lebih sering!',
    '🥡 Simpan sisa makanan di kulkas, bisa dimakan besok sebagai bekal!',
    '🌱 Sisa sayuran bisa dijadikan kaldu yang lezat untuk sup!',
  ] : avgWaste > 0.5 ? [
    '👍 Bagus! Coba jadikan kulit buah/sayur menjadi pupuk kompos!',
    '🍳 Sisa nasi kemarin? Jadikan nasi goreng yang lezat!',
  ] : [
    '🌟 Luar biasa! Dapur Anda sangat ramah lingkungan!',
    '♻️ Pertahankan kebiasaan baik ini ya, Bu!',
  ];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <Navbar />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -60, x: '-50%' }}
            style={{
              position: 'fixed', top: 80, left: '50%', zIndex: 100,
              padding: '14px 22px', borderRadius: 20, fontSize: 14, fontWeight: 700,
              boxShadow: '0 12px 40px rgba(232,131,74,0.25)',
              display: 'flex', alignItems: 'center', gap: 10,
              ...(toast.type === 'error'
                ? { background: 'rgba(241,112,112,0.12)', border: '1.5px solid rgba(241,112,112,0.4)', color: '#c03a3a', backdropFilter: 'blur(12px)' }
                : { background: 'rgba(255,255,255,0.95)', border: '1.5px solid rgba(232,131,74,0.3)', color: 'var(--text-primary)', backdropFilter: 'blur(12px)' })
            }}
          >
            {toast.type !== 'error' && <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(92,178,133,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiCheck size={13} style={{ color: '#5cb285' }} /></div>}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 16px 40px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
          <div>
            <h1 style={{
              fontFamily: 'Poppins, sans-serif', fontWeight: 900,
              fontSize: 'clamp(22px, 4vw, 30px)', color: 'var(--text-primary)', marginBottom: 6
            }}>
              Selamat datang, <span className="gradient-text">Bu {user?.name?.split(' ')[0]}</span>! 👩‍🍳
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>
              {hasLoggedToday
                ? '✅ Sudah mencatat hari ini — terima kasih sudah peduli lingkungan!'
                : '📋 Belum ada catatan limbah dapur hari ini. Yuk catat sekarang!'}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowForm(true)}
            disabled={hasLoggedToday}
            className="btn-primary"
            style={{
              fontSize: 15, padding: '13px 24px', borderRadius: 18, flexShrink: 0,
              opacity: hasLoggedToday ? 0.5 : 1,
              cursor: hasLoggedToday ? 'not-allowed' : 'pointer',
            }}
          >
            <FiPlus size={18} />
            {hasLoggedToday ? 'Sudah Catat Hari Ini ✅' : '+ Catat Limbah Dapur'}
          </motion.button>
        </div>

        {/* Quick Tip Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="friendly-alert"
          style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 14 }}
        >
          <span style={{ fontSize: 28, flexShrink: 0 }}>💡</span>
          <div>
            <p style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, fontSize: 15 }}>
              Tips Dapur Hari Ini
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {quickTips[Math.floor(Date.now() / 86400000) % quickTips.length]}
            </p>
          </div>
        </motion.div>

        {/* ── Eco Score + Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, marginBottom: 24, alignItems: 'start' }}>

          {/* Eco Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glow"
            style={{ padding: 24, textAlign: 'center', minWidth: 180 }}
          >
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 14 }}>
              Skor Lingkungan
            </p>
            <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 14px' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(232,131,74,0.1)" strokeWidth="9" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - ecoScore / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1.2s ease' }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#e8834a" />
                    <stop offset="100%" stopColor="#f7c948" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 30, fontWeight: 900, fontFamily: 'Poppins, sans-serif', color: 'var(--text-primary)' }}>
                  {logs.length ? ecoScore : '—'}
                </span>
                {logs.length > 0 && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>/100</span>}
              </div>
            </div>
            <span style={{
              fontSize: 12, fontWeight: 800, padding: '6px 14px', borderRadius: 50,
              background: 'rgba(232,131,74,0.1)', color: 'var(--primary)',
              border: '1.5px solid rgba(232,131,74,0.25)', display: 'inline-block'
            }}>
              {scoreLabel}
            </span>
          </motion.div>

          {/* Stat Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {statCards.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="stat-card"
                style={{ '--gradient': s.gradient, background: s.bg, border: `1.5px solid ${s.border}` }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 24 }}>{s.emoji}</span>
                  {s.trend && s.trend !== 'stable' && (
                    <span style={{
                      fontSize: 11, padding: '2px 7px', borderRadius: 50, fontWeight: 700,
                      background: s.trend === 'down' ? 'rgba(92,178,133,0.15)' : 'rgba(241,112,112,0.12)',
                      color: s.trend === 'down' ? '#3d8f61' : '#c03a3a',
                    }}>
                      {s.trend === 'down' ? '↓ Berkurang 👍' : '↑ Bertambah'}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'Poppins, sans-serif', color: s.color, marginBottom: 2 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.unit}</div>
                <div style={{ fontSize: 12, fontWeight: 800, marginTop: 4, color: s.color }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid rgba(232,131,74,0.08)' }}>
            <div>
              <h3 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 16 }}>📊 Grafik Limbah Dapur</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {Math.min(logs.length, 10)} catatan terakhir
              </p>
            </div>
            <div style={{ display: 'flex', gap: 6, padding: '4px', borderRadius: 14, background: 'rgba(232,131,74,0.06)' }}>
              {Object.entries(chartConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setActiveChart(key)}
                  style={{
                    padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', border: 'none', fontFamily: 'Nunito, sans-serif',
                    ...(activeChart === key
                      ? { background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}40` }
                      : { background: 'transparent', color: 'var(--text-muted)' })
                  }}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '20px 24px 24px' }}>
            {chartData.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 180, gap: 12 }}>
                <span style={{ fontSize: 48 }}>📊</span>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>
                  Belum ada data untuk ditampilkan.<br />Mulai catat limbah dapur Anda!
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id={cc.gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={cc.color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={cc.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: '#b08c6e', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#b08c6e', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey={cc.key}
                    name={`${cc.label} (${cc.unit})`}
                    stroke={cc.color}
                    fill={`url(#${cc.gradId})`}
                    strokeWidth={3}
                    dot={{ r: 5, fill: cc.color, strokeWidth: 2, stroke: 'white' }}
                    activeDot={{ r: 7, fill: cc.color }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* ── Recent Logs Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
          style={{ padding: 0, overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(232,131,74,0.08)' }}>
            <div>
              <h3 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 16 }}>📅 Riwayat Catatan Limbah</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{logs.length} total catatan</p>
            </div>
            {logs.length > 0 && (
              <span className="pill" style={{ background: 'rgba(92,178,133,0.12)', color: '#3d8f61', border: '1.5px solid rgba(92,178,133,0.3)', fontSize: 12 }}>
                <FiActivity size={11} /> Aktif
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[...Array(4)].map((_, i) => <div key={i} className="shimmer" style={{ height: 48 }} />)}
            </div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🍃</div>
              <p style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, fontSize: 16 }}>
                Belum ada catatan limbah dapur
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
                Mulai catat limbah dapur hari ini dan bantu jaga lingkungan bersama!
              </p>
              <button onClick={() => setShowForm(true)} className="btn-primary" style={{ fontSize: 14, padding: '12px 24px' }}>
                <FiPlus size={15} /> Catat Pertama Saya
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="eco-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Limbah Dapur</th>
                    <th>Catatan</th>
                    <th>Poin</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 8).map((log) => {
                    const wasteLevel = log.wasteKg < 0.5 ? { label: 'Sedikit 🌟', color: '#3d8f61', bg: 'rgba(92,178,133,0.1)' }
                      : log.wasteKg < 1 ? { label: 'Sedang 👍', color: '#c07a10', bg: 'rgba(247,201,72,0.1)' }
                      : { label: 'Banyak 💪', color: '#c03a3a', bg: 'rgba(241,112,112,0.1)' };

                    return (
                      <tr key={log.id}>
                        <td>
                          <span style={{
                            fontWeight: 700, fontSize: 13,
                            background: 'rgba(232,131,74,0.08)',
                            padding: '4px 10px', borderRadius: 8, color: 'var(--text-secondary)'
                          }}>
                            {new Date(log.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>
                              {log.wasteKg} kg
                            </span>
                            <span style={{
                              fontSize: 11, padding: '3px 9px', borderRadius: 50,
                              background: wasteLevel.bg, color: wasteLevel.color, fontWeight: 700
                            }}>
                              {wasteLevel.label}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: log.notes ? 'normal' : 'italic' }}>
                            {log.notes ? log.notes.substring(0, 40) + (log.notes.length > 40 ? '...' : '') : 'Tidak ada catatan'}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            fontWeight: 800, fontSize: 14, padding: '5px 12px', borderRadius: 50,
                            background: 'rgba(247,201,72,0.12)', color: '#c07a10',
                            border: '1.5px solid rgba(247,201,72,0.3)'
                          }}>
                            +{log.points} ⭐
                          </span>
                        </td>
                      </tr>
                    );
                  })}
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
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
              background: 'rgba(45,28,14,0.6)', backdropFilter: 'blur(8px)'
            }}
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{
                width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
                borderRadius: 24, background: 'white',
                border: '1.5px solid rgba(232,131,74,0.25)',
                boxShadow: '0 32px 80px rgba(45,28,14,0.25)'
              }}
            >
              {/* Modal Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 24px', borderBottom: '1px solid rgba(232,131,74,0.1)',
                background: 'linear-gradient(135deg, rgba(232,131,74,0.06), rgba(247,201,72,0.04))'
              }}>
                <div>
                  <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
                    🍃 Catat Limbah Dapur Hari Ini
                  </h2>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, fontWeight: 600 }}>
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button onClick={() => setShowForm(false)} style={{
                  width: 36, height: 36, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: 'rgba(241,112,112,0.1)', color: '#c03a3a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Jenis Limbah */}
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
                    🗑️ Jenis Limbah Dapur Hari Ini
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {kitchenWasteTypes.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, wasteType: opt.value })}
                        style={{
                          padding: '10px 12px', borderRadius: 14, fontSize: 13,
                          fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
                          textAlign: 'left', transition: 'all 0.18s',
                          ...(form.wasteType === opt.value
                            ? { background: 'rgba(232,131,74,0.12)', border: '1.5px solid rgba(232,131,74,0.45)', color: 'var(--text-primary)', fontWeight: 700 }
                            : { background: 'rgba(232,131,74,0.04)', border: '1.5px solid rgba(232,131,74,0.12)', color: 'var(--text-secondary)', fontWeight: 600 })
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Berat Limbah */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
                      ⚖️ Berapa Banyak Limbahnya?
                    </label>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 50, background: 'rgba(232,131,74,0.1)', color: 'var(--primary)', fontWeight: 700 }}>
                      dalam kilogram (kg)
                    </span>
                  </div>
                  <input
                    type="number" step="0.1" min="0" max="20"
                    value={form.wasteKg}
                    onChange={e => setForm({ ...form, wasteKg: e.target.value })}
                    className="input-field"
                    placeholder="Contoh: 0.5 (setengah kg)" required
                  />
                  <p style={{ fontSize: 12, marginTop: 6, color: 'var(--text-muted)', fontWeight: 600 }}>
                    🎯 Kurang dari 0.5 kg/hari? Anda luar biasa! Dapat poin maksimal!
                  </p>
                </div>

                {/* Cara Penanganan */}
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
                    ♻️ Bagaimana Cara Mengelolanya?
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {wasteDisposalMethods.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, disposalMethod: opt.value })}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 16px', borderRadius: 14, cursor: 'pointer',
                          fontFamily: 'Nunito, sans-serif', transition: 'all 0.18s',
                          ...(form.disposalMethod === opt.value
                            ? { background: `${opt.color}12`, border: `1.5px solid ${opt.color}50`, color: 'var(--text-primary)' }
                            : { background: 'rgba(232,131,74,0.04)', border: '1.5px solid rgba(232,131,74,0.1)', color: 'var(--text-secondary)' })
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{opt.label}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{opt.desc}</div>
                        </div>
                        <span style={{
                          fontSize: 13, fontWeight: 800,
                          color: form.disposalMethod === opt.value ? opt.color : 'var(--text-muted)'
                        }}>
                          {opt.points} poin
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Catatan */}
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                    📝 Catatan Tambahan (opsional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="input-field"
                    style={{ resize: 'none', fontFamily: 'Nunito, sans-serif' }}
                    rows={2}
                    placeholder="Misalnya: sisa masakan kemarin, kulit mangga dari buah siang..."
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: 14 }}>
                    Batal
                  </button>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary"
                    style={{ flex: 2, justifyContent: 'center', fontSize: 14, opacity: submitting ? 0.75 : 1 }}
                  >
                    {submitting ? (
                      <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%' }} className="animate-spin" /> Menyimpan...</>
                    ) : (
                      <><FiCheck size={16} /> Simpan Catatan 🌿</>
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
