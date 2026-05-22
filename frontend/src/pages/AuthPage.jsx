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
  const [isWide, setIsWide] = useState(window.innerWidth >= 1024);

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
        if (!form.name.trim()) throw { message: 'Nama tidak boleh kosong ya, Bu!' };
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Oops! Terjadi kesalahan. Coba lagi ya!');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (toRegister) => {
    setIsRegister(toRegister);
    setError('');
    setForm({ name: '', email: '', password: '' });
  };

  const benefits = [
    '🤖 Prediksi limbah dapur dengan AI',
    '🗑️ Catat limbah harian dengan mudah',
    '🏆 Kumpulkan poin & lencana',
    '💡 Dapat tips dapur yang berguna',
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-main)' }}>

      {/* LEFT PANEL — hanya tampil di layar lebar (≥1024px) */}
      {isWide && (
        <div style={{
          width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '60px 64px', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #2d1c0e 0%, #4a2c10 50%, #3d2008 100%)',
          flexShrink: 0,
        }}>
          {/* Background decorations */}
          <div style={{
            position: 'absolute', top: -100, right: -100, width: 400, height: 400,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,131,74,0.12), transparent 70%)',
            filter: 'blur(60px)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -80, left: -50, width: 350, height: 350,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(247,201,72,0.08), transparent 70%)',
            filter: 'blur(60px)', pointerEvents: 'none',
          }} />

          {/* Floating vegetables decoration */}
          <div style={{ position: 'absolute', top: '15%', right: '10%', fontSize: 52, opacity: 0.15, transform: 'rotate(20deg)', pointerEvents: 'none' }}>🥦</div>
          <div style={{ position: 'absolute', bottom: '25%', right: '5%', fontSize: 44, opacity: 0.1, transform: 'rotate(-10deg)', pointerEvents: 'none' }}>🍅</div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative', zIndex: 10 }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 16, fontSize: 24,
                background: 'linear-gradient(135deg, #e8834a, #f7c948)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(232,131,74,0.4)',
              }}>🍃</div>
              <div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 22, color: 'white', lineHeight: 1.1 }}>
                  Dapur
                  <span style={{
                    background: 'linear-gradient(135deg, #e8834a, #f7c948)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>Lestari</span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Kelola Limbah Dapurmu 🌿</div>
              </div>
            </div>

            <h2 style={{
              fontFamily: 'Poppins, sans-serif', fontWeight: 900,
              fontSize: 38, color: 'white', lineHeight: 1.2, marginBottom: 16,
            }}>
              Dapur Bersih,<br />
              <span style={{
                background: 'linear-gradient(135deg, #e8834a, #f7c948)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Bumi Sehat!</span>
            </h2>

            <p style={{ fontSize: 16, marginBottom: 36, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              Bergabunglah bersama ribuan ibu rumah tangga yang sudah peduli
              lingkungan melalui pengelolaan limbah dapur yang cerdas.
            </p>

            {/* Benefits list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(232,131,74,0.2)', border: '1px solid rgba(232,131,74,0.4)',
                  }}>
                    <FiCheck size={12} style={{ color: '#f7c948' }} />
                  </div>
                  <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{b}</span>
                </motion.div>
              ))}
            </div>

            {/* Social proof */}
            <div style={{
              marginTop: 40, display: 'inline-flex', alignItems: 'center', gap: 14,
              padding: '14px 20px', borderRadius: 20,
              background: 'rgba(232,131,74,0.08)', border: '1px solid rgba(232,131,74,0.2)',
            }}>
              <div style={{ display: 'flex' }}>
                {['R', 'D', 'A', 'N'].map((l, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: '50%', marginLeft: i === 0 ? 0 : -10,
                    background: `hsl(${i * 30 + 20}, 65%, 55%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 900, color: 'white',
                    border: '2px solid rgba(45,28,14,0.8)',
                  }}>{l}</div>
                ))}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>5.000+ ibu sudah bergabung!</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>⭐⭐⭐⭐⭐ 5.0 rating</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* RIGHT PANEL — Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        background: 'var(--bg-main)',
        minWidth: 0,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: 440 }}
        >
          {/* Mobile Logo — hanya tampil saat panel kiri tidak muncul */}
          {!isWide && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, justifyContent: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14, fontSize: 22,
                background: 'linear-gradient(135deg, #e8834a, #f7c948)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(232,131,74,0.35)',
              }}>🍃</div>
              <div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 19, color: 'var(--text-primary)' }}>
                  Dapur<span className="gradient-text">Lestari</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Kelola Limbah Dapurmu 🌿</div>
              </div>
            </div>
          )}

          {/* Mode Switcher */}
          <div style={{
            display: 'flex', padding: 5, borderRadius: 18, marginBottom: 24,
            background: 'rgba(232,131,74,0.08)', border: '1.5px solid rgba(232,131,74,0.15)',
          }}>
            {[['Masuk', false], ['Daftar Gratis', true]].map(([label, toReg]) => (
              <button
                key={label}
                onClick={() => switchMode(toReg)}
                style={{
                  flex: 1, padding: '11px 16px', borderRadius: 14, fontSize: 14, fontWeight: 800,
                  cursor: 'pointer', border: 'none', fontFamily: 'Nunito, sans-serif',
                  transition: 'all 0.2s',
                  ...(isRegister === toReg
                    ? { background: 'linear-gradient(135deg, #e8834a, #c96a30)', color: 'white', boxShadow: '0 4px 14px rgba(232,131,74,0.35)' }
                    : { background: 'transparent', color: 'var(--text-muted)' })
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <div className="card" style={{ padding: 28, boxShadow: '0 8px 40px rgba(232,131,74,0.1)', border: '1.5px solid rgba(232,131,74,0.2)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={isRegister ? 'register' : 'login'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ marginBottom: 24 }}>
                  <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--text-primary)' }}>
                    {isRegister ? '🌿 Buat Akun Baru' : '👋 Selamat Datang Kembali!'}
                  </h1>
                  <p style={{ fontSize: 14, marginTop: 6, color: 'var(--text-muted)', fontWeight: 600 }}>
                    {isRegister
                      ? 'Bergabung dan mulai perjalanan dapur hijau Anda!'
                      : 'Lanjutkan perjalanan dapur ramah lingkungan Anda!'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {isRegister && (
                    <div style={{ position: 'relative' }}>
                      <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} size={16} />
                      <input
                        type="text" name="name" value={form.name} onChange={handleChange}
                        placeholder="Nama lengkap Anda"
                        className="input-field" style={{ paddingLeft: 44 }}
                        required autoComplete="name"
                      />
                    </div>
                  )}

                  <div style={{ position: 'relative' }}>
                    <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} size={16} />
                    <input
                      type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="Alamat email Anda"
                      className="input-field" style={{ paddingLeft: 44 }}
                      required autoComplete="email"
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password" value={form.password} onChange={handleChange}
                      placeholder={isRegister ? 'Buat password (min 6 karakter)' : 'Password Anda'}
                      className="input-field" style={{ paddingLeft: 44, paddingRight: 48 }}
                      required
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                        padding: 4, display: 'flex', alignItems: 'center',
                      }}
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          padding: '12px 16px', borderRadius: 14, fontSize: 13, fontWeight: 700,
                          background: 'rgba(241,112,112,0.08)', border: '1.5px solid rgba(241,112,112,0.3)',
                          color: '#c03a3a',
                        }}
                      >
                        ⚠️ {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary"
                    style={{ justifyContent: 'center', fontSize: 15, padding: '14px 24px', marginTop: 4, opacity: loading ? 0.75 : 1 }}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: 18, height: 18,
                          border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: 'white',
                          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                        }} />
                        {isRegister ? 'Membuat Akun...' : 'Masuk...'}
                      </>
                    ) : (
                      <>
                        {isRegister ? '🎉 Daftar Sekarang' : '🚀 Masuk ke Dapur'}
                        <FiArrowRight size={16} />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(232,131,74,0.15)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>atau</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(232,131,74,0.15)' }} />
                </div>

                <button
                  onClick={() => switchMode(!isRegister)}
                  style={{
                    width: '100%', padding: '11px', fontSize: 14, fontWeight: 700,
                    textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontFamily: 'Nunito, sans-serif',
                    borderRadius: 12, transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {isRegister
                    ? 'Sudah punya akun? Masuk di sini →'
                    : 'Belum punya akun? Daftar gratis →'}
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
