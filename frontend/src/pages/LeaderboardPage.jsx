import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import { leaderboardAPI } from '../services/api';
import Navbar from '../components/Navbar';

const medals = ['🥇', '🥈', '🥉'];
const podiumColors = ['#f7c948', '#b8c0cc', '#e8834a'];

const LeaderboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await leaderboardAPI.get();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const top3 = data?.leaderboard?.slice(0, 3) || [];
  const rest = data?.leaderboard?.slice(3) || [];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 16px 60px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, fontSize: 26,
                background: 'rgba(247,201,72,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                🌟
              </div>
              <div>
                <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 'clamp(22px, 4vw, 28px)', color: 'var(--text-primary)' }}>
                  Papan Nilai Komunitas
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
                  {data?.totalUsers || 0} ibu hebat sedang bersaing mengurangi limbah dapur 👩‍🍳
                </p>
              </div>
            </div>
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="btn-outline"
              style={{ padding: '10px 14px', gap: 6 }}
            >
              <FiRefreshCw size={15} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
              Perbarui
            </button>
          </div>
        </motion.div>

        {/* Your Rank Banner */}
        {data?.currentUserRank && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginBottom: 24, padding: '16px 20px', borderRadius: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
              background: 'linear-gradient(135deg, rgba(232,131,74,0.1), rgba(247,201,72,0.06))',
              border: '1.5px solid rgba(232,131,74,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 16, color: 'white',
                background: 'linear-gradient(135deg, #e8834a, #f7c948)',
                boxShadow: '0 4px 12px rgba(232,131,74,0.35)'
              }}>
                #{data.currentUserRank.rank}
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)', marginBottom: 2 }}>
                  Posisi Saya
                </p>
                <p style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: 18, fontFamily: 'Poppins, sans-serif' }}>
                  ⭐ {data.currentUserRank.ecoPoints.toLocaleString('id-ID')} poin
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#3d8f61', fontSize: 14, fontWeight: 800 }}>
                <FiTrendingUp size={14} />
                Peringkat #{data.currentUserRank.rank}
              </div>
              <div style={{ fontSize: 12, marginTop: 2, color: 'var(--text-muted)', fontWeight: 600 }}>
                🔥 {data.currentUserRank.streak} hari beruntun
              </div>
            </div>
          </motion.div>
        )}

        {/* Top 3 Podium */}
        {!loading && top3.length >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
            style={{ padding: '24px 20px', marginBottom: 20 }}
          >
            <p style={{
              fontSize: 12, fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.1em', textAlign: 'center', color: 'var(--text-muted)', marginBottom: 24
            }}>
              🏆 Ibu Paling Ramah Lingkungan
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16 }}>
              {[1, 0, 2].map((idx) => {
                const u = top3[idx];
                if (!u) return <div key={idx} style={{ flex: 1, maxWidth: 140 }} />;
                const isFirst = idx === 0;
                const podiumHeights = [100, 130, 75];
                const podH = podiumHeights[idx === 0 ? 1 : idx === 1 ? 0 : 2];

                return (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    style={{ flex: 1, maxWidth: 140, textAlign: 'center' }}
                  >
                    {isFirst && <div style={{ fontSize: 24, marginBottom: 4 }}>👑</div>}

                    {/* Avatar */}
                    <div style={{ position: 'relative', margin: '0 auto 10px', width: isFirst ? 60 : 48, height: isFirst ? 60 : 48 }}>
                      <div style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, color: 'white', fontSize: isFirst ? 22 : 17,
                        background: `linear-gradient(135deg, ${podiumColors[u.rank - 1] || '#b08c6e'}, ${podiumColors[u.rank - 1] || '#b08c6e'}aa)`,
                        boxShadow: isFirst ? `0 0 20px ${podiumColors[0]}60` : 'none',
                        border: `3px solid ${podiumColors[u.rank - 1] || '#b08c6e'}60`
                      }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                    </div>

                    <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.name?.split(' ')[0]}
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 800, marginBottom: 4, color: podiumColors[u.rank - 1] || '#b08c6e' }}>
                      ⭐ {u.ecoPoints.toLocaleString('id-ID')}
                    </p>
                    <p style={{ fontSize: 18, marginBottom: 8 }}>{medals[u.rank - 1]}</p>

                    {/* Podium bar */}
                    <div style={{
                      height: `${podH}px`, borderRadius: '12px 12px 0 0',
                      background: `linear-gradient(180deg, ${podiumColors[u.rank - 1] || '#b08c6e'}25, ${podiumColors[u.rank - 1] || '#b08c6e'}08)`,
                      border: `1.5px solid ${podiumColors[u.rank - 1] || '#b08c6e'}35`,
                      borderBottom: 'none'
                    }} />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Full Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
          style={{ padding: 0, overflow: 'hidden' }}
        >
          <div style={{
            padding: '16px 24px', borderBottom: '1px solid rgba(232,131,74,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <h3 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 15 }}>
              Semua Peringkat
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
              Diurutkan berdasarkan poin
            </span>
          </div>

          {loading ? (
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[...Array(5)].map((_, i) => <div key={i} className="shimmer" style={{ height: 56 }} />)}
            </div>
          ) : !data?.leaderboard?.length ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🌿</div>
              <p style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                Belum ada pengguna
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                Jadilah yang pertama mencatat limbah dapur!
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="eco-table">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>Posisi</th>
                    <th>Nama</th>
                    <th style={{ textAlign: 'right' }}>Poin</th>
                    <th style={{ textAlign: 'right' }}>Streak</th>
                    <th style={{ textAlign: 'right' }}>Lencana</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leaderboard.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      style={u.isCurrentUser ? { background: 'rgba(232,131,74,0.05)' } : {}}
                    >
                      <td>
                        {u.rank <= 3 ? (
                          <span style={{ fontSize: 20 }}>{medals[u.rank - 1]}</span>
                        ) : (
                          <span style={{
                            fontSize: 13, fontWeight: 800, padding: '3px 9px', borderRadius: 8,
                            background: 'rgba(232,131,74,0.06)', color: 'var(--text-muted)'
                          }}>
                            #{u.rank}
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 15, fontWeight: 900, color: 'white',
                            background: u.isCurrentUser
                              ? 'linear-gradient(135deg, #e8834a, #f7c948)'
                              : 'linear-gradient(135deg, #e8c9aa, #d4a574)',
                            border: u.isCurrentUser ? '2px solid rgba(232,131,74,0.5)' : '1.5px solid rgba(232,131,74,0.15)'
                          }}>
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 14 }}>
                              {u.name}
                            </span>
                            {u.isCurrentUser && (
                              <span style={{
                                marginLeft: 8, fontSize: 11, padding: '2px 8px', borderRadius: 50,
                                background: 'rgba(232,131,74,0.12)', color: 'var(--primary)', fontWeight: 800
                              }}>
                                Saya 👩‍🍳
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 900, fontSize: 15, color: '#c07a10' }}>
                          ⭐ {u.ecoPoints.toLocaleString('id-ID')}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 700 }}>
                          🔥 {u.streak} hari
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 700 }}>
                          🏆 {u.badges}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="friendly-alert-green"
          style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}
        >
          <span style={{ fontSize: 28 }}>💪</span>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 600 }}>
            Semakin sedikit limbah dapur yang Anda hasilkan, semakin tinggi poin dan posisi Anda!
            Bersama-sama, kita bisa membuat Indonesia lebih bersih! 🌿🇮🇩
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
