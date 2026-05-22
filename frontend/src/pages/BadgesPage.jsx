import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiTarget } from 'react-icons/fi';
import { badgesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const requirementLabel = (req) => {
  if (!req) return '';
  const labels = {
    log_count: `Catat ${req.value} limbah dapur`,
    streak: `${req.value} hari berturut-turut mencatat`,
    points: `Kumpulkan ${req.value} poin`,
    low_waste_days: `Limbah kurang dari 1kg selama ${req.value} hari`,
    low_energy_days: `Hemat energi selama ${req.value} hari`,
  };
  return labels[req.type] || '';
};

const BadgesPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await badgesAPI.get();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const earned = data?.badges?.filter(b => b.earned) || [];
  const locked = data?.badges?.filter(b => !b.earned) || [];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px 60px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, fontSize: 26,
                background: 'rgba(247,201,72,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                🏆
              </div>
              <div>
                <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 'clamp(22px, 4vw, 28px)', color: 'var(--text-primary)' }}>
                  Pencapaian & Lencana
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
                  {loading ? 'Memuat...' : `${data?.earned || 0} dari ${data?.total || 0} lencana diraih`}
                </p>
              </div>
            </div>

            {/* Points & Streak */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{
                padding: '12px 16px', borderRadius: 16, textAlign: 'center',
                background: 'rgba(247,201,72,0.1)', border: '1.5px solid rgba(247,201,72,0.25)'
              }}>
                <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Poppins, sans-serif', color: '#c07a10' }}>
                  ⭐ {(user?.ecoPoints || 0).toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>Total Poin</div>
              </div>
              <div style={{
                padding: '12px 16px', borderRadius: 16, textAlign: 'center',
                background: 'rgba(232,131,74,0.1)', border: '1.5px solid rgba(232,131,74,0.25)'
              }}>
                <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Poppins, sans-serif', color: 'var(--primary)' }}>
                  🔥 {user?.streak || 0}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>Hari Beruntun</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Card */}
        {!loading && data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-glow"
            style={{ padding: '20px 24px', marginBottom: 28 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiTarget size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>Progress Keseluruhan</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)' }}>
                {data.earned}/{data.total} lencana
              </span>
            </div>
            <div className="progress-bar" style={{ height: 12 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.total > 0 ? (data.earned / data.total) * 100 : 0}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                style={{
                  height: '100%', borderRadius: 100,
                  background: 'linear-gradient(90deg, #e8834a, #f7c948)',
                  transition: 'width 1.2s ease'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
              <span>Terus catat limbah dapur untuk meraih lebih banyak lencana! 💪</span>
              <span>{Math.round(data.total > 0 ? (data.earned / data.total) * 100 : 0)}% selesai</span>
            </div>
          </motion.div>
        )}

        {/* Motivational Banner */}
        {earned.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="friendly-alert"
            style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}
          >
            <span style={{ fontSize: 32 }}>🌱</span>
            <div>
              <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 15 }}>
                Mulai Kumpulkan Lencana Pertamamu!
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Catat limbah dapur hari ini dan dapatkan lencana pertamamu!
                Setiap langkah kecil membuat perubahan besar untuk lingkungan. 🌍
              </p>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
            {[...Array(8)].map((_, i) => <div key={i} className="shimmer" style={{ height: 180, borderRadius: 20 }} />)}
          </div>
        ) : (
          <>
            {/* Earned Badges */}
            {earned.length > 0 && (
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                    ✨ Lencana yang Sudah Diraih
                  </h2>
                  <span style={{
                    padding: '3px 10px', borderRadius: 50, fontSize: 12, fontWeight: 800,
                    background: 'rgba(92,178,133,0.12)', color: '#3d8f61', border: '1.5px solid rgba(92,178,133,0.3)'
                  }}>
                    {earned.length} lencana
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 14 }}>
                  {earned.map((badge, i) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.07, type: 'spring', stiffness: 200 }}
                      onClick={() => setSelected(selected?.id === badge.id ? null : badge)}
                      className="badge-earned"
                      style={{
                        padding: '20px 16px', borderRadius: 20, textAlign: 'center',
                        cursor: 'pointer', transition: 'all 0.3s',
                        ...(selected?.id === badge.id ? { transform: 'scale(1.05)', boxShadow: '0 12px 40px rgba(247,201,72,0.3)' } : {})
                      }}
                    >
                      <div style={{ fontSize: 44, marginBottom: 10 }}>{badge.icon}</div>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 14, marginBottom: 6 }}>
                        {badge.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#3d8f61', lineHeight: 1.4 }}>
                        {badge.description}
                      </div>
                      {selected?.id === badge.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(247,201,72,0.3)' }}
                        >
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                            🎯 {requirementLabel(badge.requirement)}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked Badges */}
            {locked.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <FiLock size={15} style={{ color: 'var(--text-muted)' }} />
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-muted)' }}>
                    Lencana yang Belum Diraih
                  </h2>
                  <span style={{
                    padding: '3px 10px', borderRadius: 50, fontSize: 12, fontWeight: 700,
                    background: 'rgba(122,92,62,0.08)', color: 'var(--text-muted)', border: '1px solid rgba(122,92,62,0.15)'
                  }}>
                    {locked.length} tersisa
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 14 }}>
                  {locked.map((badge, i) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelected(selected?.id === badge.id ? null : badge)}
                      className="badge-locked"
                      style={{
                        padding: '20px 16px', borderRadius: 20, textAlign: 'center',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ fontSize: 44, marginBottom: 10, filter: 'grayscale(1) opacity(0.4)' }}>{badge.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5, color: 'var(--text-muted)' }}>
                        {badge.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', opacity: 0.7 }}>
                        {badge.description}
                      </div>
                      {selected?.id === badge.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(122,92,62,0.1)' }}
                        >
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>
                            🎯 Cara raih: {requirementLabel(badge.requirement)}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {earned.length === 0 && locked.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🏅</div>
                <p style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, fontSize: 18 }}>
                  Belum ada lencana
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  Mulai catat limbah dapur untuk mendapatkan lencana pertamamu!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BadgesPage;
