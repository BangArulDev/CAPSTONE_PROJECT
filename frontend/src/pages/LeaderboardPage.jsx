import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiTrendingUp, FiAward, FiRefreshCw } from 'react-icons/fi';
import { leaderboardAPI } from '../services/api';
import Navbar from '../components/Navbar';

const medals = ['🥇', '🥈', '🥉'];
const rankColors = ['#f59e0b', '#94a3b8', '#f97316'];

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
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="icon-box" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
                <FiUsers size={20} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                  Global Leaderboard
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {data?.totalUsers || 0} eco-warriors competing worldwide
                </p>
              </div>
            </div>
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="btn-outline p-2.5"
              title="Refresh"
            >
              <FiRefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </motion.div>

        {/* ── Your Rank Banner ── */}
        {data?.currentUserRank && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.04))',
              border: '1px solid rgba(34,197,94,0.25)',
              boxShadow: '0 0 30px rgba(34,197,94,0.06)'
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white' }}>
                #{data.currentUserRank.rank}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#4ade80' }}>Your Ranking</p>
                <p className="font-bold text-white text-lg">{data.currentUserRank.ecoPoints.toLocaleString()} eco-points</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-green-400 text-sm font-semibold justify-end">
                <FiTrendingUp size={14} />
                Rank #{data.currentUserRank.rank}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                🔥 {data.currentUserRank.streak}d streak 
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Top 3 Podium ── */}
        {!loading && top3.length >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card mb-6 p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-6 text-center" style={{ color: 'var(--text-muted)' }}>
              🏆 Top Performers
            </p>
            <div className="flex items-end justify-center gap-4">
              {/* Reorder: 2nd, 1st, 3rd */}
              {[1, 0, 2].map((idx) => {
                const u = top3[idx];
                if (!u) return <div key={idx} className="flex-1 max-w-32" />;
                const isFirst = idx === 0;
                const podiumHeights = [28, 40, 20];
                const podiumH = podiumHeights[idx === 0 ? 1 : idx === 1 ? 0 : 2];

                return (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex-1 max-w-36 text-center"
                  >
                    {/* Crown for #1 */}
                    {isFirst && <div className="text-2xl mb-1">👑</div>}

                    {/* Avatar */}
                    <div className="relative mx-auto mb-2" style={{ width: isFirst ? 56 : 44, height: isFirst ? 56 : 44 }}>
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center font-black text-white"
                        style={{
                          background: `linear-gradient(135deg, ${rankColors[u.rank - 1] || '#374151'}, ${rankColors[u.rank - 1] || '#374151'}99)`,
                          fontSize: isFirst ? 20 : 16,
                          boxShadow: isFirst ? `0 0 20px ${rankColors[0]}40` : 'none'
                        }}
                      >
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                    </div>

                    {/* Name & points */}
                    <p className="text-sm font-bold text-white truncate mb-0.5">{u.name}</p>
                    <p className="text-xs font-bold mb-1" style={{ color: rankColors[u.rank - 1] || '#64748b' }}>
                      {u.ecoPoints.toLocaleString()} pts
                    </p>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                      {medals[u.rank - 1]}
                    </p>

                    {/* Podium bar */}
                    <div className="rounded-t-xl mx-auto"
                      style={{
                        height: `${podiumH * 3}px`,
                        width: '100%',
                        background: `linear-gradient(180deg, ${rankColors[u.rank - 1] || '#374151'}20, ${rankColors[u.rank - 1] || '#374151'}08)`,
                        border: `1px solid ${rankColors[u.rank - 1] || '#374151'}30`,
                        borderBottom: 'none'
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Full Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
          style={{ padding: 0, overflow: 'hidden' }}
        >
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">All Rankings</h3>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Sorted by eco-points</span>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-14 shimmer" />)}
            </div>
          ) : !data?.leaderboard?.length ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🏆</div>
              <p className="font-medium text-white mb-1">No users yet</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Be the first eco-warrior!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="eco-table">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>Rank</th>
                    <th>User</th>
                    <th className="text-right">Points</th>
                    <th className="text-right hidden sm:table-cell">Streak</th>
                    <th className="text-right hidden sm:table-cell">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leaderboard.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      style={u.isCurrentUser
                        ? { background: 'rgba(34,197,94,0.04)' }
                        : {}}
                    >
                      <td>
                        <div className="flex items-center">
                          {u.rank <= 3 ? (
                            <span className="text-xl">{medals[u.rank - 1]}</span>
                          ) : (
                            <span className="text-sm font-bold font-mono px-2 py-1 rounded-lg"
                              style={{ background: 'rgba(255,255,255,0.04)', color: '#475569' }}>
                              #{u.rank}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{
                              background: u.isCurrentUser
                                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                                : 'linear-gradient(135deg, #1e293b, #0f172a)',
                              border: u.isCurrentUser ? '2px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.06)'
                            }}
                          >
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-white text-sm">{u.name}</span>
                            {u.isCurrentUser && (
                              <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                                style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className="font-bold text-base" style={{ color: '#4ade80' }}>
                          {u.ecoPoints.toLocaleString()}
                        </span>
                      </td>
                      <td className="text-right hidden sm:table-cell">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>🔥 {u.streak}d</span>
                      </td>
                      <td className="text-right hidden sm:table-cell">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>🏅 {u.badges}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
