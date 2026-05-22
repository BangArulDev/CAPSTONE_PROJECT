import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiInfo } from 'react-icons/fi';
import { predictionsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const TrendBadge = ({ trend }) => {
  const cfg = {
    increasing: { icon: <FiTrendingUp size={11} />, label: 'Meningkat ⚠️', color: '#c03a3a', bg: 'rgba(241,112,112,0.1)', border: 'rgba(241,112,112,0.3)' },
    decreasing: { icon: <FiTrendingDown size={11} />, label: 'Menurun 👍', color: '#3d8f61', bg: 'rgba(92,178,133,0.12)', border: 'rgba(92,178,133,0.3)' },
    stable: { icon: <FiMinus size={11} />, label: 'Stabil', color: '#c07a10', bg: 'rgba(247,201,72,0.1)', border: 'rgba(247,201,72,0.3)' },
  }[trend] || { icon: <FiMinus size={11} />, label: 'Stabil', color: '#c07a10', bg: 'rgba(247,201,72,0.1)', border: 'rgba(247,201,72,0.3)' };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 12px', borderRadius: 50, fontSize: 12, fontWeight: 700,
      color: cfg.color, background: cfg.bg, border: `1.5px solid ${cfg.border}`
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="eco-tooltip">
        <p style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 6 }}>{label}</p>
        {payload.filter(p => p.value !== null).map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 700, fontSize: 13 }}>
            {p.name === 'historical' ? 'Aktual' : 'Prediksi'}: {p.value} kg
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const buildChartData = (historical = [], predictions = []) => [
  ...historical.map((v, i) => ({
    idx: `H${i + 1}`,
    historical: parseFloat(v.toFixed(2)),
    predicted: null,
    type: 'history'
  })),
  ...predictions.map((v, i) => ({
    idx: `+${i + 1}h`,
    historical: null,
    predicted: parseFloat(v.toFixed(2)),
    type: 'prediction'
  }))
];

const PredCard = ({ title, emoji, desc, color, predColor, trend, historical, predictions, unit, index, advice }) => {
  const chartData = buildChartData(historical, predictions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card"
      style={{ padding: 0, overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px 14px', borderBottom: '1px solid rgba(232,131,74,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, fontSize: 22,
            background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {emoji}
          </div>
          <div>
            <h3 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 15 }}>{title}</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{desc}</p>
          </div>
        </div>
        <TrendBadge trend={trend} />
      </div>

      <div style={{ padding: '16px 16px 8px' }}>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -25 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="idx" tick={{ fill: '#b08c6e', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#b08c6e', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {historical?.length > 0 && (
              <ReferenceLine
                x="+1h"
                stroke="rgba(232,131,74,0.2)"
                strokeDasharray="5 5"
                label={{ value: 'Prediksi →', position: 'top', fill: '#b08c6e', fontSize: 9 }}
              />
            )}
            <Line
              type="monotone" dataKey="historical" name="historical"
              stroke={color} strokeWidth={3}
              dot={{ r: 4, fill: color, strokeWidth: 2, stroke: 'white' }}
              activeDot={{ r: 6 }} connectNulls={false}
            />
            <Line
              type="monotone" dataKey="predicted" name="predicted"
              stroke={predColor} strokeWidth={2.5} strokeDasharray="7 4"
              dot={{ r: 3.5, fill: predColor, fillOpacity: 0.8, strokeWidth: 1.5, stroke: 'white' }}
              activeDot={{ r: 5 }} connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 3, borderRadius: 2, background: color }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Data Aktual</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 3, borderRadius: 2, background: predColor, borderTop: '2px dashed' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Prediksi AI</span>
          </div>
        </div>

        {/* Advice */}
        {advice && (
          <div style={{
            padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 600,
            background: `${color}08`, border: `1px solid ${color}25`, color: 'var(--text-secondary)',
            lineHeight: 1.5, marginBottom: 8
          }}>
            💡 {advice}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PredictionsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await predictionsAPI.get();
        setData(res.data);
      } catch (err) {
        setError(err?.message || 'Gagal memuat prediksi');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getWasteAdvice = (trend) => {
    if (trend === 'increasing') return 'Limbah dapur Anda diprediksi meningkat. Coba rencanakan menu minggu ini agar tidak banyak sisa!';
    if (trend === 'decreasing') return 'Luar biasa! Tren limbah dapur Anda menurun. Teruskan kebiasaan baik ini ya, Bu!';
    return 'Limbah dapur Anda cukup stabil. Sedikit usaha lagi bisa membuat trennya menurun!';
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 16px 60px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, fontSize: 26,
              background: 'rgba(232,131,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              🤖
            </div>
            <div>
              <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 'clamp(22px, 4vw, 28px)', color: 'var(--text-primary)' }}>
                Prediksi Limbah Dapur
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
                AI kami menganalisis pola limbah dapur Anda dan memprediksi 7 hari ke depan
              </p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="shimmer" style={{ height: 320, borderRadius: 20 }} />
            ))}
          </div>
        ) : error ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>😔</div>
            <p style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, fontSize: 16 }}>
              Prediksi belum tersedia
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {error}.<br />Coba catat lebih banyak data limbah dapur terlebih dahulu ya, Bu!
            </p>
          </div>
        ) : (
          <>
            {/* Info Banner */}
            {data?.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 24 }}
              >
                <div className="friendly-alert-green" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>🤖</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 15, marginBottom: 6 }}>
                      {data.message}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                        📊 {data.dataPoints || 0} data dianalisis
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 90 }}>
                          <div className="progress-fill-green" style={{ width: `${data.confidence || 0}%` }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#3d8f61' }}>
                          {data.confidence || 0}% akurasi
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 24 }}>
              <PredCard
                index={0}
                title="Prediksi Limbah Dapur"
                emoji="🗑️"
                desc="Perkiraan limbah dapur 7 hari ke depan"
                color="#e8834a"
                predColor="#f4a76c"
                trend={data?.waste?.trend}
                historical={data?.waste?.historical}
                predictions={data?.waste?.predictions}
                unit="kg/hari"
                advice={getWasteAdvice(data?.waste?.trend)}
              />

              {/* AI Tips Panel */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="card"
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                <h3 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  🧠 Cara AI Kami Bekerja
                </h3>

                {[
                  {
                    title: 'Analisis Pola',
                    body: 'AI menganalisis riwayat limbah dapur Anda selama beberapa hari terakhir untuk menemukan pola kebiasaan.',
                    emoji: '📊'
                  },
                  {
                    title: 'Prediksi Regresi',
                    body: 'Menggunakan model Regresi Linear untuk menghitung tren dan memperkirakan jumlah limbah ke depan.',
                    emoji: '📐'
                  },
                  {
                    title: 'Saran Personal',
                    body: 'Berdasarkan prediksi, sistem memberikan saran khusus yang sesuai dengan kebiasaan dapur Anda.',
                    emoji: '💡'
                  },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '14px 16px', borderRadius: 14,
                    background: 'rgba(232,131,74,0.05)', border: '1px solid rgba(232,131,74,0.12)'
                  }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 5 }}>
                      {item.emoji} {item.title}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {item.body}
                    </p>
                  </div>
                ))}

                {/* Slope display */}
                {data?.waste?.slope !== undefined && (
                  <div style={{
                    padding: '14px 16px', borderRadius: 14,
                    background: 'rgba(92,178,133,0.06)', border: '1.5px solid rgba(92,178,133,0.2)'
                  }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
                      📈 Tren Limbah Dapur Anda
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                        🗑️ Limbah Dapur
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 70 }}>
                          <div style={{
                            height: '100%', borderRadius: 100,
                            width: `${Math.min(100, Math.abs(data.waste.slope) * 80)}%`,
                            background: data.waste.slope < 0 ? '#5cb285' : data.waste.slope > 0 ? '#e8834a' : '#f7c948',
                            transition: 'width 1s ease'
                          }} />
                        </div>
                        <span style={{
                          fontSize: 13, fontWeight: 900, minWidth: 56, textAlign: 'right',
                          color: data.waste.slope < 0 ? '#3d8f61' : data.waste.slope > 0 ? '#c03a3a' : '#c07a10'
                        }}>
                          {data.waste.slope > 0 ? '+' : ''}{data.waste.slope} kg/hari
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, fontWeight: 600 }}>
                      {data.waste.slope < 0 ? '👍 Tren bagus! Limbah Anda semakin berkurang setiap hari!' :
                       data.waste.slope > 0 ? '⚠️ Perlu perhatian — limbah cenderung meningkat.' :
                       '😊 Stabil! Sedikit usaha lagi untuk menurunkan tren.'}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Tips to reduce waste */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 16, marginBottom: 16 }}>
                🌿 Tips Mengurangi Limbah Berdasarkan Prediksi
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                {[
                  { emoji: '🛒', title: 'Belanja Sesuai Menu', desc: 'Buat daftar belanja sesuai menu mingguan agar tidak beli bahan berlebih.' },
                  { emoji: '🥗', title: 'Manfaatkan Sisa Bahan', desc: 'Sisa sayuran bisa dibuat sup, tumisan, atau salad esok harinya.' },
                  { emoji: '🧊', title: 'Simpan dengan Benar', desc: 'Simpan bahan makanan di tempat yang tepat agar tahan lebih lama.' },
                  { emoji: '♻️', title: 'Mulai Komposter', desc: 'Sisa organik seperti kulit buah bisa jadi pupuk kompos untuk tanaman.' },
                ].map((tip, i) => (
                  <div key={i} className="tip-card">
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{tip.emoji}</div>
                    <h4 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 14, marginBottom: 6 }}>
                      {tip.title}
                    </h4>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {tip.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default PredictionsPage;
