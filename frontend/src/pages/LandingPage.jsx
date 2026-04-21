import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBarChart2, FiZap, FiAward, FiUsers, FiTrendingDown, FiCpu, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: <FiCpu />, title: 'AI Waste Prediction', desc: 'Linear Regression model analyzes your patterns and forecasts future trends 7 days ahead.', color: '#22c55e', tag: 'AI / ML' },
  { icon: <FiZap />, title: 'Smart Recommendations', desc: 'Personalized eco-tips matched to your consumption patterns — 15 categories.', color: '#818cf8', tag: 'Personalized' },
  { icon: <FiAward />, title: 'Gamification & Badges', desc: 'Earn badges, build streaks, and climb the leaderboard as you build green habits.', color: '#f59e0b', tag: 'Gamified' },
  { icon: <FiBarChart2 />, title: 'Trend Analytics', desc: 'Beautiful charts showing waste, energy, and water consumption over time.', color: '#22d3ee', tag: 'Analytics' },
  { icon: <FiUsers />, title: 'Community Rankings', desc: 'Compete with other eco-warriors and get inspired to do better every day.', color: '#f87171', tag: 'Social' },
  { icon: <FiTrendingDown />, title: 'Daily Eco Logging', desc: 'Quickly log your daily footprint in under a minute — waste, energy, water, transport.', color: '#a78bfa', tag: 'Tracking' },
];

const stats = [
  { value: '30%', label: 'Avg. Waste Reduction', icon: '♻️' },
  { value: '15K+', label: 'Active Users', icon: '🌍' },
  { value: '2.5T', label: 'CO₂ Saved (kg)', icon: '🌿' },
  { value: '98%', label: 'Satisfaction Rate', icon: '⭐' },
];

const howItWorks = [
  { step: '01', title: 'Create Account', desc: 'Sign up for free and set up your eco-profile in 30 seconds.' },
  { step: '02', title: 'Log Daily Data', desc: 'Submit your waste, energy, water, and transport every day.' },
  { step: '03', title: 'Get AI Insights', desc: 'Our AI analyzes your patterns and predicts your future footprint.' },
  { step: '04', title: 'Earn & Improve', desc: 'Collect badges, climb the leaderboard, and reduce your impact.' },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>

      {/* ── Navbar ── */}
      <nav className="glass sticky top-0 z-50" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              <span className="text-sm">🌱</span>
            </div>
            <span className="font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Eco<span className="gradient-text">Wise</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary text-sm px-4 py-2">
                Dashboard <FiArrowRight size={14} />
              </button>
            ) : (
              <>
                <Link to="/auth" className="text-sm font-medium transition-colors no-underline"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                >
                  Sign In
                </Link>
                <Link to="/auth?mode=register" className="btn-primary text-sm px-4 py-2 no-underline">
                  Get Started <FiArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-24 px-4">
        {/* BG blobs */}
        <div className="hero-blob" style={{ width: 600, height: 600, top: '-200px', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(34,197,94,0.08), transparent 70%)' }} />
        <div className="hero-blob" style={{ width: 400, height: 400, bottom: '-100px', right: '10%', background: 'radial-gradient(circle, rgba(129,140,248,0.06), transparent 70%)' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}
            >
              <div className="dot-live" />
              AI-Powered Sustainable Living Platform
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Live{' '}
              <span className="gradient-text-hero">Greener,</span>
              <br />
              Track Smarter
            </h1>

            <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}>
              EcoWise uses AI to analyze your daily habits, predict your environmental impact,
              and give you personalized tips to reduce your ecological footprint.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/auth?mode=register')}
                className="btn-primary text-base px-8 py-3.5"
              >
                Start for Free <FiArrowRight />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/auth')}
                className="btn-secondary text-base px-8 py-3.5"
              >
                Sign In
              </motion.button>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-1.5 mt-8">
              {['E', 'A', 'R', 'J', 'M'].map((l, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold -ml-1 first:ml-0"
                  style={{
                    background: `hsl(${i * 50 + 120}, 60%, 35%)`,
                    borderColor: 'var(--bg-dark)'
                  }}>
                  {l}
                </div>
              ))}
              <span className="text-sm ml-2" style={{ color: 'var(--text-secondary)' }}>
                Join <strong className="text-white">15,000+</strong> eco-warriors
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 px-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-3xl sm:text-4xl font-black gradient-text mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {s.value}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#22c55e' }}>Features</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Everything You Need to Go{' '}
                <span className="gradient-text">Green</span>
              </h2>
              <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                A comprehensive toolkit for tracking, analyzing, and improving your environmental impact.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card group p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="icon-box" style={{ background: `${feat.color}15`, color: feat.color }}>
                    {feat.icon}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${feat.color}12`, color: feat.color, border: `1px solid ${feat.color}25` }}>
                    {feat.tag}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-2 text-base group-hover:gradient-text transition-all">{feat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#818cf8' }}>How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Get Started in <span className="gradient-text-purple">4 Steps</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative"
              >
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px z-0"
                    style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.3), transparent)' }} />
                )}
                <div className="card p-5 relative z-10">
                  <div className="text-3xl font-black mb-3" style={{ color: 'rgba(34,197,94,0.3)', fontFamily: 'Space Grotesk' }}>
                    {step.step}
                  </div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-border"
          >
            <div className="card text-center rounded-2xl py-16 px-8">
              <div className="text-5xl mb-5 animate-float">🌍</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Ready to Make a Difference?
              </h2>
              <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Join thousands of eco-warriors already tracking and reducing their environmental impact with AI.
              </p>

              {/* Benefits */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                {['Free forever', 'No credit card', 'AI-powered'].map(b => (
                  <div key={b} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <FiCheck size={14} style={{ color: '#22c55e' }} /> {b}
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/auth?mode=register')}
                className="btn-primary text-base px-10 py-3.5"
              >
                Join EcoWise Today <FiArrowRight />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} className="py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              <span className="text-xs">🌱</span>
            </div>
            <span className="font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>EcoWise</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2024 EcoWise — Building a sustainable future, one log at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
