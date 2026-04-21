import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiFilter, FiChevronRight, FiStar } from 'react-icons/fi';
import { recommendationsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const impactConfig = {
  very_high: { label: 'Very High', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
  high: { label: 'High', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  low: { label: 'Low', color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.25)' },
};

const difficultyConfig = {
  easy: { label: 'Easy', color: '#4ade80' },
  medium: { label: 'Medium', color: '#fbbf24' },
  hard: { label: 'Hard', color: '#f87171' },
};

const categoryConfig = {
  all: { emoji: '🌿', label: 'All Tips' },
  waste: { emoji: '🗑️', label: 'Waste' },
  energy: { emoji: '⚡', label: 'Energy' },
  transport: { emoji: '🚗', label: 'Transport' },
  water: { emoji: '💧', label: 'Water' },
  general: { emoji: '🌍', label: 'General' },
};

const RecommendationsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await recommendationsAPI.get();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = data?.recommendations?.filter(
    r => filter === 'all' || r.category === filter
  ) || [];

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="icon-box" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}>
              <FiZap size={20} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
              Eco Recommendations
            </h1>
          </div>
          <p className="text-sm ml-14" style={{ color: 'var(--text-muted)' }}>
            AI-powered tips tailored to your consumption patterns
          </p>
        </motion.div>

        {/* Stats Banner */}
        {data?.stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Avg Waste', value: `${data.stats.avgWasteKg} kg`, emoji: '🗑️', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
              { label: 'Avg Energy', value: `${data.stats.avgEnergyKwh} kWh`, emoji: '⚡', color: '#818cf8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.2)' },
              { label: 'Avg Water', value: `${data.stats.avgWaterLiters} L`, emoji: '💧', color: '#22d3ee', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.2)' },
              { label: 'Main Transport', value: data.stats.primaryTransport?.replace(/_/g, ' '), emoji: '🚗', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-xl px-4 py-4"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{s.emoji}</span>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                </div>
                <div className="font-bold text-lg capitalize" style={{ color: s.color }}>{s.value}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <FiFilter size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          {Object.entries(categoryConfig).map(([key, cfg]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(key)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={filter === key
                ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.35)' }
                : { background: 'rgba(255,255,255,0.03)', color: '#475569', border: '1px solid rgba(255,255,255,0.06)' }
              }
            >
              <span>{cfg.emoji}</span>
              <span>{cfg.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="h-56 shimmer rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-medium text-white mb-1">No tips for this category</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try a different filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((rec, i) => {
              const impact = impactConfig[rec.impact] || impactConfig.medium;
              const diff = difficultyConfig[rec.difficulty] || difficultyConfig.medium;
              const isExpanded = expandedId === rec.id;

              return (
                <motion.div
                  key={rec.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card cursor-pointer group"
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{rec.icon}</div>
                    <span className="pill text-xs"
                      style={{ color: impact.color, background: impact.bg, border: `1px solid ${impact.border}` }}>
                      <FiStar size={10} />
                      {impact.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-white mb-2 text-sm leading-snug group-hover:text-green-300 transition-colors">
                    {rec.title}
                  </h3>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm leading-relaxed mb-3"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {rec.description}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {!isExpanded && (
                    <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                      {rec.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-lg capitalize"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#475569' }}>
                        {categoryConfig[rec.category]?.emoji} {rec.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: diff.color }}>
                        {diff.label}
                      </span>
                      <FiChevronRight size={12}
                        style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                      />
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
