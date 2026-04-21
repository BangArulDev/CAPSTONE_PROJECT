import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiLock, FiTarget } from 'react-icons/fi';
import { badgesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const requirementLabel = (req) => {
  if (!req) return '';
  const labels = {
    log_count: `Submit ${req.value} eco-log${req.value > 1 ? 's' : ''}`,
    streak: `Maintain a ${req.value}-day streak`,
    points: `Earn ${req.value} eco-points`,
    low_waste_days: `Keep waste under 1kg for ${req.value} days`,
    low_energy_days: `Keep energy under 5kWh for ${req.value} days`,
  };
  return labels[req.type] || '';
};

const BadgesPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await badgesAPI.get();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const earned = data?.badges?.filter(b => b.earned) || [];
  const locked = data?.badges?.filter(b => !b.earned) || [];

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="icon-box" style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>
                  <FiAward size={20} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                  Badges & Achievements
                </h1>
              </div>
              <p className="text-sm ml-14" style={{ color: 'var(--text-muted)' }}>
                {loading ? 'Loading...' : `${data?.earned || 0} of ${data?.total || 0} badges earned`}
              </p>
            </div>

            {/* Points & Streak summary */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl text-center"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div className="text-xl font-black text-amber-400">{user?.ecoPoints?.toLocaleString() || 0}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Eco Points</div>
              </div>
              <div className="px-4 py-2.5 rounded-xl text-center"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="text-xl font-black text-green-400">🔥 {user?.streak || 0}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Day Streak</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Progress Card ── */}
        {!loading && data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-glow p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiTarget size={16} style={{ color: '#a78bfa' }} />
                <span className="text-sm font-semibold text-white">Overall Progress</span>
              </div>
              <span className="text-sm font-bold" style={{ color: '#a78bfa' }}>{data.earned}/{data.total} badges</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(data.earned / data.total) * 100}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                style={{ background: 'linear-gradient(90deg, #a78bfa, #22c55e)' }}
              />
            </div>
            <div className="flex items-center justify-between mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Keep logging daily to earn more badges</span>
              <span>{Math.round((data.earned / data.total) * 100)}% complete</span>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-44 shimmer rounded-2xl" />)}
          </div>
        ) : (
          <>
            {/* Earned Section */}
            {earned.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-base font-bold text-white">✨ Earned Badges</h2>
                  <span className="pill" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }}>
                    {earned.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {earned.map((badge, i) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.07, type: 'spring', stiffness: 200 }}
                      onClick={() => setSelected(selected?.id === badge.id ? null : badge)}
                      className="badge-earned p-5 rounded-2xl text-center cursor-pointer transition-all duration-300"
                      style={selected?.id === badge.id
                        ? { transform: 'scale(1.03)', boxShadow: '0 0 30px rgba(34,197,94,0.3)' }
                        : {}}
                    >
                      <div className="text-4xl mb-3">{badge.icon}</div>
                      <div className="font-bold text-white text-sm mb-1.5">{badge.name}</div>
                      <div className="text-xs leading-snug" style={{ color: '#4ade80' }}>{badge.description}</div>

                      {selected?.id === badge.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-green-900/50"
                        >
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {requirementLabel(badge.requirement)}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked Section */}
            {locked.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <FiLock size={15} style={{ color: 'var(--text-muted)' }} />
                  <h2 className="text-base font-bold text-slate-500">Locked Badges</h2>
                  <span className="pill" style={{ background: 'rgba(255,255,255,0.04)', color: '#475569', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {locked.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {locked.map((badge, i) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelected(selected?.id === badge.id ? null : badge)}
                      className="badge-locked p-5 rounded-2xl text-center cursor-pointer hover:opacity-80 transition-all"
                    >
                      <div className="text-4xl mb-3 grayscale">{badge.icon}</div>
                      <div className="font-semibold text-sm mb-1.5" style={{ color: '#475569' }}>{badge.name}</div>
                      <div className="text-xs" style={{ color: '#334155' }}>{badge.description}</div>

                      {selected?.id === badge.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-white/5"
                        >
                          <p className="text-xs" style={{ color: '#475569' }}>
                            🎯 {requirementLabel(badge.requirement)}
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
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-xl font-bold text-white mb-2">No badges yet</h3>
                <p style={{ color: 'var(--text-muted)' }}>Start logging eco-data to earn your first badge!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BadgesPage;
