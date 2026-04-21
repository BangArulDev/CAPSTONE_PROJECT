import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        if (!form.name.trim()) throw { message: 'Name is required' };
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (toRegister) => {
    setIsRegister(toRegister);
    setError('');
    setForm({ name: '', email: '', password: '' });
  };

  const benefits = ['🤖 AI-powered eco analysis', '♻️ Daily habit tracking', '🏆 Gamification & rewards', '📊 Predictive trend charts'];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-dark)' }}>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden">
        {/* BG */}
        <div className="hero-blob" style={{ width: 500, height: 500, top: '-150px', right: '-100px', background: 'radial-gradient(circle, rgba(34,197,94,0.08), transparent 70%)' }} />
        <div className="hero-blob" style={{ width: 400, height: 400, bottom: '-100px', left: '-50px', background: 'radial-gradient(circle, rgba(129,140,248,0.06), transparent 70%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,13,26,0.97) 0%, rgba(10,20,40,0.95) 100%)' }} />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-green"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              <span className="text-xl">🌱</span>
            </div>
            <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
              Eco<span className="gradient-text">Wise</span>
            </span>
          </div>

          <h2 className="text-4xl font-black mb-3 text-white leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
            Track your impact,<br />
            <span className="gradient-text-hero">change the world.</span>
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            AI-powered insights to help you live more sustainably, every single day.
          </p>

          {/* Benefits */}
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <FiCheck size={11} style={{ color: '#4ade80' }} />
                </div>
                <span className="text-sm" style={{ color: '#94a3b8' }}>{b}</span>
              </motion.div>
            ))}
          </div>

          {/* Bottom badge */}
          <div className="mt-12 inline-flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <div className="flex -space-x-1.5">
              {['A', 'B', 'C', 'D'].map((l, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `hsl(${i * 60 + 120}, 55%, 35%)`, borderColor: 'transparent' }}>
                  {l}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Trusted by 15,000+ users</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[...Array(5)].map((_, i) => <FiCheck key={i} size={8} style={{ color: '#fbbf24' }} />)}
                <span className="text-xs ml-1" style={{ color: '#64748b' }}>5.0 rating</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              <span>🌱</span>
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
              Eco<span className="gradient-text">Wise</span>
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 rounded-2xl mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[['Login', false], ['Create Account', true]].map(([label, toReg]) => (
              <button
                key={label}
                onClick={() => switchMode(toReg)}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200"
                style={isRegister === toReg
                  ? { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', boxShadow: '0 4px 15px rgba(34,197,94,0.3)' }
                  : { color: '#475569' }
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <div className="card-glow p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={isRegister ? 'register' : 'login'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                    {isRegister ? 'Create your account' : 'Welcome back'}
                  </h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    {isRegister ? 'Start your eco journey in seconds' : 'Continue your eco journey'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegister && (
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2" size={15} style={{ color: '#475569' }} />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="input-field pl-10"
                        required
                        autoComplete="name"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2" size={15} style={{ color: '#475569' }} />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="input-field pl-10"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2" size={15} style={{ color: '#475569' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder={isRegister ? 'Password (min 6 chars)' : 'Password'}
                      className="input-field pl-10 pr-11"
                      required
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: '#475569' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
                      onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                    >
                      {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 py-3 rounded-xl text-sm"
                        style={{
                          background: 'rgba(248,113,113,0.08)',
                          border: '1px solid rgba(248,113,113,0.25)',
                          color: '#fca5a5'
                        }}
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full justify-center py-3 text-sm mt-2"
                    style={{ opacity: loading ? 0.75 : 1 }}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isRegister ? 'Creating Account...' : 'Signing In...'}
                      </>
                    ) : (
                      <>
                        {isRegister ? 'Create Account' : 'Sign In'}
                        <FiArrowRight size={14} />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>

                <button
                  onClick={() => switchMode(!isRegister)}
                  className="w-full py-2.5 text-sm text-center transition-colors rounded-xl"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {isRegister ? 'Already have an account? Sign in →' : "Don't have an account? Sign up →"}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
