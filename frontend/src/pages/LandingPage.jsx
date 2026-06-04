import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    emoji: '📸',
    title: 'Scan Sampah dengan AI',
    desc: 'Arahkan kamera ke sampah Anda — AI kami langsung mengenali jenisnya dan memberi tahu cara pengelolaan terbaik.',
    color: '#e8834a',
    tag: 'Computer Vision',
  },
  {
    emoji: '📊',
    title: 'Prediksi Jejak Karbon',
    desc: 'AI memprediksi volume sampah dan jejak karbon Anda 7 hari ke depan berdasarkan kebiasaan harian.',
    color: '#5cb285',
    tag: 'Teknologi AI',
  },
  {
    emoji: '💡',
    title: 'Rekomendasi Cerdas',
    desc: 'Saran personal untuk mengurangi sampah plastik, beralih ke gaya hidup zero-waste, dan kebiasaan ramah lingkungan.',
    color: '#45b7a0',
    tag: 'Personal',
  },
  {
    emoji: '🏆',
    title: 'Sistem Pencapaian',
    desc: 'Kumpulkan poin & lencana setiap berhasil mengurangi sampah. Pantau pohon virtual yang tumbuh bersama aksimu!',
    color: '#f7c948',
    tag: 'Gamifikasi',
  },
  {
    emoji: '🌟',
    title: 'Papan Nilai Komunitas',
    desc: 'Bersaing dan saling menyemangati dengan sesama pengguna EcoWise untuk bersama-sama mengurangi limbah.',
    color: '#9b7fe8',
    tag: 'Komunitas',
  },
  {
    emoji: '📝',
    title: 'Catat Aktivitas Harian',
    desc: 'Catat sampah, energi, transportasi, dan penggunaan air harian dalam kurang dari 1 menit.',
    color: '#f17070',
    tag: 'Mudah',
  },
];

// Data sampah Indonesia dari KLHK / SIPSN 2023
const indonesiaWasteFacts = [
  {
    value: '67,8 Jt',
    unit: 'ton/tahun',
    label: 'Total Sampah Indonesia',
    detail: 'Indonesia menghasilkan ~67,8 juta ton sampah per tahun (SIPSN 2023)',
    emoji: '🗑️',
    color: '#e8834a',
    bg: 'rgba(232,131,74,0.08)',
    border: 'rgba(232,131,74,0.2)',
  },
  {
    value: '44,5%',
    unit: 'dari total',
    label: 'Sampah Sisa Makanan',
    detail: 'Hampir separuh sampah Indonesia adalah sisa makanan dari rumah tangga',
    emoji: '🍚',
    color: '#5cb285',
    bg: 'rgba(92,178,133,0.08)',
    border: 'rgba(92,178,133,0.2)',
  },
  {
    value: '13,6%',
    unit: 'saja',
    label: 'Sampah Terkelola Baik',
    detail: 'Hanya 13,6% sampah yang dikelola dengan benar — sisanya berakhir di TPA atau dibakar',
    emoji: '⚠️',
    color: '#f17070',
    bg: 'rgba(241,112,112,0.08)',
    border: 'rgba(241,112,112,0.2)',
  },
  {
    value: '4,6 Jt',
    unit: 'ton/tahun',
    label: 'Sampah Tak Terangkut',
    detail: 'Jutaan ton sampah tidak terangkut dan mencemari lingkungan setiap tahunnya',
    emoji: '🌊',
    color: '#45b7a0',
    bg: 'rgba(69,183,160,0.08)',
    border: 'rgba(69,183,160,0.2)',
  },
];

const howItWorks = [
  { step: '1', emoji: '📱', title: 'Daftar Gratis', desc: 'Buat akun dalam 30 detik, cukup nama dan email Anda.' },
  { step: '2', emoji: '📸', title: 'Scan atau Catat Sampah', desc: 'Foto sampah Anda — AI langsung mengklasifikasikannya, atau catat aktivitas harian secara manual.' },
  { step: '3', emoji: '🤖', title: 'Dapat Analisis AI', desc: 'AI menganalisis pola Anda dan memberikan prediksi jejak karbon serta saran gaya hidup berkelanjutan.' },
  { step: '4', emoji: '🏆', title: 'Kumpulkan Poin', desc: 'Dapatkan poin & lencana. Semakin sedikit sampah yang Anda hasilkan, semakin banyak reward!' },
];

const testimonials = [
  { name: 'Budi S.', location: 'Jakarta', text: 'EcoWise membantu saya sadar betapa banyak sampah yang saya hasilkan. Sekarang saya sudah mulai pilah sampah setiap hari!', avatar: 'B' },
  { name: 'Rina K.', location: 'Surabaya', text: 'Fitur scan sampahnya keren banget! Tinggal foto, langsung tahu cara daur ulangnya. Sangat edukatif!', avatar: 'R' },
  { name: 'Dimas A.', location: 'Bandung', text: 'Aplikasi ini seperti punya konsultan lingkungan pribadi. Grafik jejak karbonku makin turun tiap minggu!', avatar: 'D' },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>

      {/* ── Navbar ── */}
      <nav className="glass sticky top-0 z-50">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 14,
              background: 'linear-gradient(135deg, #e8834a, #f7c948)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 4px 12px rgba(232,131,74,0.35)'
            }}>🍃</div>
            <div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>
                Eco<span className="gradient-text">Wise</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
                Kelola Sampah. Jejak Karbon. Bumi Sehat. 🌍
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ fontSize: 14, padding: '10px 20px' }}>
                Masuk Beranda <FiArrowRight size={14} />
              </button>
            ) : (
              <>
                <Link to="/auth" className="no-underline" style={{
                  fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)',
                  padding: '10px 16px', borderRadius: 12, transition: 'all 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Masuk
                </Link>
                <Link to="/auth?mode=register" className="btn-primary no-underline" style={{ fontSize: 14, padding: '10px 20px' }}>
                  Mulai Gratis <FiArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 20px 80px' }}>
        {/* BG decorations */}
        <div className="hero-blob" style={{ width: 600, height: 600, top: '-200px', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(232,131,74,0.08), transparent 70%)' }} />
        <div className="hero-blob" style={{ width: 400, height: 400, bottom: '-100px', right: '5%', background: 'radial-gradient(circle, rgba(92,178,133,0.06), transparent 70%)' }} />

        {/* Floating kitchen items */}
        <div style={{ position: 'absolute', top: '15%', right: '8%', fontSize: 48, opacity: 0.15, transform: 'rotate(20deg)' }}>🥦</div>
        <div style={{ position: 'absolute', top: '40%', left: '5%', fontSize: 40, opacity: 0.12, transform: 'rotate(-15deg)' }}>🍅</div>
        <div style={{ position: 'absolute', bottom: '20%', right: '15%', fontSize: 36, opacity: 0.1, transform: 'rotate(10deg)' }}>🥕</div>

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 18px', borderRadius: 50, marginBottom: 28,
                background: 'rgba(232,131,74,0.1)', border: '1.5px solid rgba(232,131,74,0.3)',
                color: 'var(--primary)', fontSize: 13, fontWeight: 700
              }}
            >
              <div className="dot-live" />
              Platform Pengelolaan Sampah & Jejak Karbon Berbasis AI 🌍
            </motion.div>

            <h1 style={{
              fontFamily: 'Poppins, sans-serif', fontWeight: 900,
              fontSize: 'clamp(36px, 6vw, 64px)', marginBottom: 20,
              lineHeight: 1.15, color: 'var(--text-primary)'
            }}>
              Kurangi Sampah,{' '}
              <span className="gradient-text-hero">Selamatkan Bumi</span>
              <br />Bersama <span className="gradient-text">EcoWise!</span>
            </h1>

            <p style={{
              fontSize: 18, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px',
              color: 'var(--text-secondary)', lineHeight: 1.7
            }}>
              Platform AI untuk membantu Anda mengelola sampah, memantau jejak karbon,
              dan membangun kebiasaan hidup berkelanjutan — mulai hari ini. 🌍
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/auth?mode=register')}
                className="btn-primary"
                style={{ fontSize: 16, padding: '14px 32px', borderRadius: 18 }}
              >
                Mulai Gratis Sekarang 🎉
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/auth')}
                className="btn-secondary"
                style={{ fontSize: 16, padding: '14px 32px', borderRadius: 18 }}
              >
                Sudah Punya Akun? Masuk
              </motion.button>
            </div>

            {/* Source tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 16px', borderRadius: 50, marginTop: 4,
              background: 'rgba(92,178,133,0.1)', border: '1.5px solid rgba(92,178,133,0.25)',
              color: '#3d8f61', fontSize: 12, fontWeight: 700
            }}>
              📊 Data berdasarkan KLHK & SIPSN 2023 — Yuk jadi bagian dari solusi!
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Fakta Sampah Indonesia ── */}
      <section style={{
        padding: '72px 20px',
        borderTop: '1px solid rgba(232,131,74,0.1)',
        borderBottom: '1px solid rgba(232,131,74,0.1)',
        background: 'linear-gradient(180deg, rgba(255,250,245,0.8), rgba(255,247,237,0.6))'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Section title */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 50, marginBottom: 16,
              background: 'rgba(241,112,112,0.08)', border: '1.5px solid rgba(241,112,112,0.25)',
              color: '#c03a3a', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em'
            }}>
              📊 Fakta Sampah Indonesia
            </div>
            <h2 style={{
              fontFamily: 'Poppins, sans-serif', fontWeight: 800,
              fontSize: 'clamp(24px, 3.5vw, 36px)', color: 'var(--text-primary)', marginBottom: 12
            }}>
              Masalah Nyata yang Butuh{' '}
              <span className="gradient-text">Solusi Nyata</span>
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600, maxWidth: 480, margin: '0 auto' }}>
              Data resmi dari Kementerian Lingkungan Hidup & Kehutanan (KLHK) dan SIPSN 2023
            </p>
          </motion.div>

          {/* Fact cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 36 }}>
            {indonesiaWasteFacts.map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  borderRadius: 20, padding: '24px 20px',
                  background: fact.bg, border: `1.5px solid ${fact.border}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                whileHover={{ y: -4, boxShadow: `0 12px 32px ${fact.border}` }}
              >
                <div style={{ fontSize: 36, marginBottom: 14 }}>{fact.emoji}</div>
                <div style={{
                  fontFamily: 'Poppins, sans-serif', fontWeight: 900,
                  fontSize: 34, color: fact.color, lineHeight: 1, marginBottom: 2
                }}>
                  {fact.value}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: fact.color, opacity: 0.7, marginBottom: 8 }}>
                  {fact.unit}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {fact.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55, fontWeight: 600 }}>
                  {fact.detail}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to action banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              borderRadius: 20, padding: '20px 28px',
              background: 'rgba(232,131,74,0.06)', border: '1.5px solid rgba(232,131,74,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 16
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 36 }}>🏠</span>
              <div>
                <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 15, marginBottom: 4 }}>
                  Rumah Tangga adalah Sumber Terbesar Sampah Indonesia
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
                  Sebagai ibu rumah tangga, Anda memegang kunci perubahan — mulai dari dapur sendiri!
                </p>
              </div>
            </div>
            <div style={{
              padding: '10px 20px', borderRadius: 14, fontSize: 13, fontWeight: 800,
              background: 'linear-gradient(135deg, #e8834a, #f7c948)', color: 'white',
              whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(232,131,74,0.3)'
            }}>
              Sumber: KLHK & SIPSN 2023 📊
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: 12 }}>
                🌟 Fitur Unggulan
              </p>
              <h2 style={{
                fontFamily: 'Poppins, sans-serif', fontWeight: 800,
                fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--text-primary)', marginBottom: 16
              }}>
                Semua yang Anda Butuhkan untuk{' '}
                <span className="gradient-text">Hidup Ramah Lingkungan</span>
              </h2>
              <p style={{ maxWidth: 500, margin: '0 auto', color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7 }}>
                Dirancang untuk semua orang — mudah digunakan, berbasis AI canggih, dan menyenangkan!
              </p>
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card group"
                style={{ padding: 24 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 16,
                    background: `${feat.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26
                  }}>
                    {feat.emoji}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 50,
                    background: `${feat.color}12`, color: feat.color, border: `1px solid ${feat.color}25`
                  }}>
                    {feat.tag}
                  </span>
                </div>
                <h3 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, fontSize: 16 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{
        padding: '80px 20px',
        borderTop: '1px solid rgba(232,131,74,0.1)',
        background: 'linear-gradient(180deg, rgba(232,131,74,0.03), rgba(247,201,72,0.04))'
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5cb285', marginBottom: 12 }}>
              ✨ Cara Kerja
            </p>
            <h2 style={{
              fontFamily: 'Poppins, sans-serif', fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--text-primary)'
            }}>
              Mulai dalam <span className="gradient-text-green">4 Langkah Mudah</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="card"
                style={{ padding: 22, textAlign: 'center' }}
              >
                <div style={{ fontSize: 40, marginBottom: 14 }}>{step.emoji}</div>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e8834a, #f7c948)',
                  color: 'white', fontWeight: 900, fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px', boxShadow: '0 3px 10px rgba(232,131,74,0.3)'
                }}>
                  {step.step}
                </div>
                <h3 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9b7fe8', marginBottom: 12 }}>
              💬 Kata Mereka
            </p>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(26px, 4vw, 36px)', color: 'var(--text-primary)' }}>
              Pengguna yang Sudah Bergabung
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card"
                style={{ padding: 24 }}
              >
                <div style={{ fontSize: 24, marginBottom: 12 }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e8834a, #5cb285)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 14, color: 'white'
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 14 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 20px', background: 'rgba(232,131,74,0.03)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-border"
          >
            <div className="card" style={{ textAlign: 'center', borderRadius: 24, padding: '64px 40px' }}>
              <div style={{ fontSize: 56, marginBottom: 20 }} className="animate-float">🍃</div>
              <h2 style={{
                fontFamily: 'Poppins, sans-serif', fontWeight: 800,
                fontSize: 'clamp(26px, 4vw, 36px)', marginBottom: 16, color: 'var(--text-primary)'
              }}>
                Siap Berkontribusi untuk Bumi yang Lebih Baik?
              </h2>
              <p style={{ marginBottom: 28, maxWidth: 480, margin: '0 auto 28px', color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7 }}>
                Bergabunglah bersama ribuan pengguna EcoWise yang sudah berhasil mengurangi jejak karbon mereka!
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
                {['Gratis Selamanya', 'Tanpa Ribet', 'Bahasa Indonesia', 'Ramah Pemula'].map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                    <FiCheck size={14} style={{ color: '#5cb285' }} /> {b}
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/auth?mode=register')}
                className="btn-primary"
                style={{ fontSize: 16, padding: '14px 36px', borderRadius: 18 }}
              >
                Daftar Sekarang — Gratis! 🎉
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(232,131,74,0.1)', padding: '40px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: 'linear-gradient(135deg, #e8834a, #f7c948)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
            }}>🍃</div>
            <div>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: 'var(--text-primary)', fontSize: 16 }}>
                Eco<span className="gradient-text">Wise</span>
              </span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
            © 2024 EcoWise — Bersama kita jaga bumi untuk generasi mendatang 🌍
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
