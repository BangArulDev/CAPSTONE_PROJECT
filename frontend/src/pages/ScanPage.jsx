import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiCamera, FiX, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { scanAPI } from '../services/api';
import Navbar from '../components/Navbar';

// Info pengelolaan per kategori sampah
const wasteInfo = {
  cardboard: {
    namaBahasa: 'Kardus / Karton',
    emoji: '📦',
    warna: '#e8834a',
    bg: 'rgba(232,131,74,0.08)',
    border: 'rgba(232,131,74,0.25)',
    cara: [
      'Lipat kardus agar lebih ringkas sebelum dibuang',
      'Bawa ke bank sampah atau tukang loak terdekat',
      'Bisa dijual atau ditukar dengan produk daur ulang',
    ],
    poin: 25,
    kategori: 'Daur Ulang ♻️',
  },
  glass: {
    namaBahasa: 'Kaca / Beling',
    emoji: '🫙',
    warna: '#45b7a0',
    bg: 'rgba(69,183,160,0.08)',
    border: 'rgba(69,183,160,0.25)',
    cara: [
      'Bungkus dengan koran agar tidak melukai',
      'Pisahkan dari sampah lain — berbahaya jika tercampur',
      'Bawa ke fasilitas daur ulang kaca atau bank sampah',
    ],
    poin: 30,
    kategori: 'Daur Ulang ♻️',
  },
  metal: {
    namaBahasa: 'Logam / Kaleng',
    emoji: '🔩',
    warna: '#9b7fe8',
    bg: 'rgba(155,127,232,0.08)',
    border: 'rgba(155,127,232,0.25)',
    cara: [
      'Cuci kaleng bekas agar tidak berbau',
      'Gepengkan agar lebih hemat tempat',
      'Jual ke pengepul atau bank sampah — nilainya cukup tinggi!',
    ],
    poin: 30,
    kategori: 'Daur Ulang ♻️',
  },
  paper: {
    namaBahasa: 'Kertas',
    emoji: '📄',
    warna: '#5cb285',
    bg: 'rgba(92,178,133,0.08)',
    border: 'rgba(92,178,133,0.25)',
    cara: [
      'Pisahkan kertas bersih dari yang berminyak/basah',
      'Kumpulkan dalam jumlah banyak baru dijual/dibuang',
      'Bawa ke bank sampah — kertas bisa didaur ulang berkali-kali',
    ],
    poin: 20,
    kategori: 'Daur Ulang ♻️',
  },
  plastic: {
    namaBahasa: 'Plastik',
    emoji: '🧴',
    warna: '#f17070',
    bg: 'rgba(241,112,112,0.08)',
    border: 'rgba(241,112,112,0.25)',
    cara: [
      'Cuci dan keringkan sebelum dibuang',
      'Cek kode daur ulang (segitiga di bawah produk)',
      'Kurangi penggunaan plastik sekali pakai di masa depan',
      'Bawa ke bank sampah atau drop point plastik',
    ],
    poin: 20,
    kategori: 'Daur Ulang / Kurangi 🔄',
  },
  trash: {
    namaBahasa: 'Sampah Residu',
    emoji: '🗑️',
    warna: '#b08c6e',
    bg: 'rgba(176,140,110,0.08)',
    border: 'rgba(176,140,110,0.25)',
    cara: [
      'Buang ke tempat sampah umum yang sesuai',
      'Pastikan sampah sudah dibungkus rapat agar tidak berserakan',
      'Hindari membuang jenis sampah ini di sembarang tempat',
    ],
    poin: 5,
    kategori: 'Sampah Residu 🗑️',
  },
};

const ScanPage = () => {
  const [image, setImage] = useState(null);        // preview URL
  const [imageFile, setImageFile] = useState(null); // File object
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, WEBP, dll)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 10MB');
      return;
    }
    setError(null);
    setHasil(null);
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  }, []);

  const handleInputChange = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleScan = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    setHasil(null);
    try {
      const res = await scanAPI.scan(imageFile);
      setHasil(res.data);
    } catch (err) {
      const msg = err?.message || 'Gagal menghubungi server analisis';
      if (msg.includes('Network') || msg.includes('ECONNREFUSED')) {
        setError('Server analisis AI tidak dapat dijangkau. Pastikan API Python sedang berjalan di port 8000.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImageFile(null);
    setHasil(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const info = hasil ? wasteInfo[hasil.predicted_class] : null;

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px 60px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, fontSize: 26,
              background: 'rgba(232,131,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>📸</div>
            <div>
              <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 'clamp(22px, 4vw, 28px)', color: 'var(--text-primary)' }}>
                Scan Sampah AI
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
                Upload foto sampah — AI kami langsung mengklasifikasikan dan memberi panduan pengelolaannya
              </p>
            </div>
          </div>

          {/* Model info badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 16px', borderRadius: 50, marginTop: 4,
            background: 'rgba(92,178,133,0.1)', border: '1.5px solid rgba(92,178,133,0.25)',
            color: '#3d8f61', fontSize: 12, fontWeight: 700
          }}>
            <div className="dot-live" style={{ background: '#5cb285' }} />
            Model CNN (Transfer Learning) · 6 Kelas Sampah
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: hasil ? '1fr 1fr' : '1fr', gap: 20, alignItems: 'start' }}>

          {/* Upload Area */}
          <motion.div layout className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid rgba(232,131,74,0.08)',
              background: 'linear-gradient(135deg, rgba(232,131,74,0.05), rgba(247,201,72,0.04))'
            }}>
              <h2 style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>
                📁 Upload Foto Sampah
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Mendukung JPG, PNG, WEBP — Maks 10MB
              </p>
            </div>

            <div style={{ padding: 20 }}>
              {/* Drop Zone */}
              {!image ? (
                <div
                  ref={dropRef}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? '#e8834a' : 'rgba(232,131,74,0.3)'}`,
                    borderRadius: 16, padding: '48px 20px', textAlign: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: dragOver ? 'rgba(232,131,74,0.05)' : 'transparent',
                  }}
                >
                  <div style={{ fontSize: 52, marginBottom: 12 }}>📸</div>
                  <p style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                    Seret foto ke sini, atau klik untuk pilih
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Pastikan foto terlihat jelas dan tidak terlalu gelap
                  </p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16,
                    padding: '10px 20px', borderRadius: 14,
                    background: 'rgba(232,131,74,0.1)', color: 'var(--primary)', fontWeight: 700, fontSize: 14,
                    border: '1.5px solid rgba(232,131,74,0.3)'
                  }}>
                    <FiUpload size={15} /> Pilih Gambar
                  </div>
                </div>
              ) : (
                <div>
                  {/* Preview */}
                  <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
                    <img
                      src={image}
                      alt="Preview sampah"
                      style={{ width: '100%', maxHeight: 300, objectFit: 'cover', display: 'block' }}
                    />
                    <button
                      onClick={handleReset}
                      style={{
                        position: 'absolute', top: 10, right: 10,
                        width: 32, height: 32, borderRadius: '50%', border: 'none',
                        background: 'rgba(0,0,0,0.55)', color: 'white', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <FiX size={14} />
                    </button>
                    {loading && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                      }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%',
                          border: '4px solid rgba(255,255,255,0.2)', borderTopColor: 'white',
                          animation: 'spin 0.9s linear infinite'
                        }} />
                        <p style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>AI sedang menganalisis...</p>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={handleReset}
                      className="btn-outline"
                      style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '11px 16px' }}
                    >
                      <FiRefreshCw size={13} /> Ganti Foto
                    </button>
                    <motion.button
                      whileHover={{ scale: loading ? 1 : 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleScan}
                      disabled={loading}
                      className="btn-primary"
                      style={{ flex: 2, justifyContent: 'center', fontSize: 14, padding: '11px 16px', opacity: loading ? 0.75 : 1 }}
                    >
                      {loading ? (
                        <>
                          <div style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
                          Menganalisis...
                        </>
                      ) : (
                        <><FiCamera size={15} /> Analisis Sekarang 🤖</>
                      )}
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleInputChange}
              />

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{
                      marginTop: 14, padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                      background: 'rgba(241,112,112,0.08)', border: '1.5px solid rgba(241,112,112,0.3)', color: '#c03a3a'
                    }}
                  >
                    ⚠️ {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Kelas yang bisa dideteksi */}
            <div style={{ padding: '0 20px 20px' }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Kelas Sampah yang Dapat Dideteksi:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {Object.entries(wasteInfo).map(([key, val]) => (
                  <span key={key} style={{
                    padding: '4px 12px', borderRadius: 50, fontSize: 11, fontWeight: 700,
                    background: val.bg, border: `1px solid ${val.border}`, color: val.warna
                  }}>
                    {val.emoji} {val.namaBahasa}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Hasil Analisis */}
          <AnimatePresence>
            {hasil && info && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className="card"
                style={{ padding: 0, overflow: 'hidden' }}
              >
                {/* Result Header */}
                <div style={{
                  padding: '20px 22px',
                  background: info.bg,
                  borderBottom: `2px solid ${info.border}`,
                  display: 'flex', alignItems: 'center', gap: 14
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 18, fontSize: 30,
                    background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 4px 16px ${info.border}`
                  }}>
                    {info.emoji}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <FiCheckCircle size={14} style={{ color: info.warna }} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: info.warna, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Terdeteksi
                      </span>
                    </div>
                    <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 20, color: 'var(--text-primary)' }}>
                      {info.namaBahasa}
                    </h2>
                    <p style={{ fontSize: 12, color: info.warna, fontWeight: 700 }}>{info.kategori}</p>
                  </div>
                </div>

                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Confidence + Poin */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{
                      padding: '12px 14px', borderRadius: 12, textAlign: 'center',
                      background: `${info.warna}0d`, border: `1.5px solid ${info.border}`
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: info.warna, fontFamily: 'Poppins, sans-serif' }}>
                        {hasil.confidence?.toFixed(1)}%
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginTop: 2 }}>Akurasi AI</div>
                    </div>
                    <div style={{
                      padding: '12px 14px', borderRadius: 12, textAlign: 'center',
                      background: 'rgba(247,201,72,0.08)', border: '1.5px solid rgba(247,201,72,0.3)'
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#c07a10', fontFamily: 'Poppins, sans-serif' }}>
                        +{info.poin} ⭐
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginTop: 2 }}>Poin EcoWise</div>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Keyakinan Model</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: info.warna }}>{hasil.confidence?.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${hasil.confidence}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: 100, background: `linear-gradient(90deg, ${info.warna}, #f7c948)` }}
                      />
                    </div>
                  </div>

                  {/* Top 3 Prediksi */}
                  {hasil.top_3?.length > 0 && (
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Top 3 Prediksi
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {hasil.top_3.map((item, i) => {
                          const w = wasteInfo[item.class];
                          return (
                            <div key={i} style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '8px 12px', borderRadius: 10,
                              background: i === 0 ? w?.bg : 'rgba(232,131,74,0.03)',
                              border: `1px solid ${i === 0 ? w?.border : 'rgba(232,131,74,0.1)'}`,
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 16 }}>{w?.emoji || '🗑️'}</span>
                                <span style={{ fontSize: 13, fontWeight: i === 0 ? 800 : 600, color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                  {w?.namaBahasa || item.class}
                                </span>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 800, color: i === 0 ? w?.warna : 'var(--text-muted)' }}>
                                {item.confidence?.toFixed(1)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Cara Pengelolaan */}
                  <div style={{
                    padding: '14px 16px', borderRadius: 12,
                    background: info.bg, border: `1.5px solid ${info.border}`
                  }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
                      💡 Cara Mengelola Sampah Ini:
                    </p>
                    <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {info.cara.map((c, i) => (
                        <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, fontWeight: 600 }}>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Scan Lagi */}
                  <button
                    onClick={handleReset}
                    className="btn-outline"
                    style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
                  >
                    <FiRefreshCw size={13} /> Scan Sampah Lain
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Card */}
        {!hasil && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
            style={{ marginTop: 20, padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: 14 }}
          >
            <span style={{ fontSize: 26, flexShrink: 0 }}>🧠</span>
            <div>
              <p style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, fontSize: 14 }}>
                Cara Kerja Model AI Kami
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Model ini menggunakan arsitektur <strong>Convolutional Neural Network (CNN)</strong> dengan teknik
                <strong> Transfer Learning</strong>. Ia dilatih untuk mengenali 6 kategori sampah: Kardus, Kaca, Logam,
                Kertas, Plastik, dan Sampah Residu. Cukup upload foto yang jelas, dan AI akan mengklasifikasikannya
                dalam hitungan detik.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
