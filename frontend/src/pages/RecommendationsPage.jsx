import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { recommendationsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const impactConfig = {
  very_high: { label: 'Sangat Bermanfaat ⭐⭐⭐', color: '#3d8f61', bg: 'rgba(92,178,133,0.1)', border: 'rgba(92,178,133,0.3)' },
  high: { label: 'Bermanfaat ⭐⭐', color: '#e8834a', bg: 'rgba(232,131,74,0.1)', border: 'rgba(232,131,74,0.3)' },
  medium: { label: 'Lumayan ⭐', color: '#c07a10', bg: 'rgba(247,201,72,0.1)', border: 'rgba(247,201,72,0.3)' },
  low: { label: 'Ringan', color: '#7a5c3e', bg: 'rgba(122,92,62,0.1)', border: 'rgba(122,92,62,0.25)' },
};

const difficultyConfig = {
  easy: { label: '😊 Mudah', color: '#3d8f61' },
  medium: { label: '🤔 Sedang', color: '#c07a10' },
  hard: { label: '💪 Perlu Usaha', color: '#c03a3a' },
};

const categoryConfig = {
  all: { emoji: '🌿', label: 'Semua Tips' },
  waste: { emoji: '🗑️', label: 'Sampah Dapur' }
};

// Extra kitchen tips for housewives
const kitchenTipsExtra = [
  {
    id: 'kitchen_1',
    icon: '🥗',
    title: 'Manfaatkan Sisa Sayuran',
    description: 'Sayuran yang hampir layu bisa diolah menjadi sup, tumisan, atau dijus. Jangan biarkan terbuang sia-sia!',
    category: 'waste',
    impact: 'very_high',
    difficulty: 'easy',
  },
  {
    id: 'kitchen_2',
    icon: '🍚',
    title: 'Nasi Sisa? Jadikan Kreasi!',
    description: 'Nasi kemarin sangat cocok untuk nasi goreng, arem-arem, atau bubur. Lebih hemat dan tetap lezat!',
    category: 'waste',
    impact: 'very_high',
    difficulty: 'easy',
  },
  {
    id: 'kitchen_3',
    icon: '🛒',
    title: 'Belanja dengan Daftar Menu',
    description: 'Buat menu mingguan sebelum belanja agar tidak membeli bahan berlebih yang akhirnya terbuang.',
    category: 'waste',
    impact: 'high',
    difficulty: 'easy',
  },
  {
    id: 'kitchen_4',
    icon: '🧊',
    title: 'Bekukan Bahan yang Berlebih',
    description: 'Daging, ayam, ikan, dan bahkan nasi bisa dibekukan. Simpan dalam porsi kecil agar mudah digunakan.',
    category: 'waste',
    impact: 'high',
    difficulty: 'easy',
  },
  {
    id: 'kitchen_5',
    icon: '🌱',
    title: 'Mulai Kompos dari Dapur',
    description: 'Kulit buah, ampas kopi, dan sisa sayuran bisa dijadikan kompos untuk pupuk tanaman di rumah.',
    category: 'waste',
    impact: 'very_high',
    difficulty: 'medium',
  },
  {
    id: 'kitchen_6',
    icon: '🫙',
    title: 'Simpan dengan Wadah yang Tepat',
    description: 'Gunakan wadah kedap udara untuk menyimpan bahan makanan agar lebih tahan lama dan tidak cepat busuk.',
    category: 'waste',
    impact: 'high',
    difficulty: 'easy',
  },
];

const RecommendationsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await recommendationsAPI.get();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Merge API tips with extra kitchen tips
  // Merge API tips with extra kitchen tips and ONLY include 'waste' category
  const filtered = [
    ...kitchenTipsExtra,
    ...(data?.recommendations?.filter(r => r.category === 'waste') || []),
  ];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 16px 60px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, fontSize: 26,
              background: 'rgba(92,178,133,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              💡
            </div>
            <div>
              <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 'clamp(22px, 4vw, 28px)', color: 'var(--text-primary)' }}>
                Tips Dapur Cerdas
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
                Saran personal untuk mengurangi limbah dapur — mudah dipraktikkan setiap hari!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Banner */}
        {data?.stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}
          >
            {[
              { label: 'Rata-rata Limbah', value: `${data.stats.avgWasteKg} kg/hari`, emoji: '🗑️', color: '#e8834a', bg: 'rgba(232,131,74,0.08)', border: 'rgba(232,131,74,0.2)' },
              { label: 'Hemat Air', value: `${data.stats.avgWaterLiters || 0} L/hari`, emoji: '💧', color: '#45b7a0', bg: 'rgba(69,183,160,0.08)', border: 'rgba(69,183,160,0.2)' },
              { label: 'Hemat Energi', value: `${data.stats.avgEnergyKwh || 0} kWh/hari`, emoji: '⚡', color: '#f7c948', bg: 'rgba(247,201,72,0.08)', border: 'rgba(247,201,72,0.2)' },
              { label: 'Tips Tersedia', value: `${filtered.length} tips`, emoji: '💡', color: '#9b7fe8', bg: 'rgba(155,127,232,0.08)', border: 'rgba(155,127,232,0.2)' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{ borderRadius: 16, padding: '16px', background: s.bg, border: `1.5px solid ${s.border}` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>{s.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{s.label}</span>
                </div>
                <div style={{ fontWeight: 900, fontSize: 18, color: s.color, fontFamily: 'Poppins, sans-serif' }}>
                  {s.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Daily Challenge Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="friendly-alert"
          style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'space-between', flexWrap: 'wrap' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <span style={{ fontSize: 32 }}>🏆</span>
            <div>
              <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 15 }}>
                Tantangan Hari Ini
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Coba masak menu baru dari bahan-bahan yang tersisa di kulkas! Kreatiflah, Bu!
              </p>
            </div>
          </div>
          <span style={{
            padding: '8px 16px', borderRadius: 50, fontSize: 13, fontWeight: 800,
            background: 'rgba(232,131,74,0.12)', color: 'var(--primary)',
            border: '1.5px solid rgba(232,131,74,0.3)', whiteSpace: 'nowrap'
          }}>
            +30 Poin ⭐
          </span>
        </motion.div>



        {/* Tips Cards */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[...Array(6)].map((_, i) => <div key={i} className="shimmer" style={{ height: 200, borderRadius: 20 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <p style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
              Belum ada tips untuk kategori ini
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Coba pilih kategori yang lain ya!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filtered.map((rec, i) => {
              const impact = impactConfig[rec.impact] || impactConfig.medium;
              const diff = difficultyConfig[rec.difficulty] || difficultyConfig.easy;
              const isExpanded = expandedId === rec.id;

              return (
                <motion.div
                  key={rec.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="tip-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontSize: 36 }}>{rec.icon}</div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '4px 10px', borderRadius: 50, fontSize: 11, fontWeight: 700,
                      color: impact.color, background: impact.bg, border: `1px solid ${impact.border}`
                    }}>
                      <FiStar size={9} />
                      {impact.label}
                    </span>
                  </div>

                  <h3 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, fontSize: 15, lineHeight: 1.4 }}>
                    {rec.title}
                  </h3>

                  <AnimatePresence>
                    {isExpanded ? (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 12 }}
                      >
                        {rec.description}
                      </motion.p>
                    ) : (
                      <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: 12, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {rec.description}
                      </p>
                    )}
                  </AnimatePresence>

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(232,131,74,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 16 }}>{categoryConfig[rec.category]?.emoji || '🌿'}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
                        {categoryConfig[rec.category]?.label || rec.category}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: diff.color }}>{diff.label}</span>
                      <span style={{ fontSize: 14, color: 'var(--text-muted)', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>›</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;
