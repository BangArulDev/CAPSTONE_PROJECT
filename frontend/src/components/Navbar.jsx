import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Beranda', emoji: '🏠' },
  { path: '/scan', label: 'Scan AI', emoji: '📸' },
  { path: '/predictions', label: 'Prediksi', emoji: '🤖' },
  { path: '/recommendations', label: 'Rekomendasi', emoji: '💡' },
  { path: '/badges', label: 'Pencapaian', emoji: '🏆' },
  { path: '/leaderboard', label: 'Papan Nilai', emoji: '🌟' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="glass sticky top-0 z-50">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

            {/* ── Logo ── */}
            <NavLink to="/dashboard" className="no-underline" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 14,
                background: 'linear-gradient(135deg, #e8834a, #f7c948)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, boxShadow: '0 4px 12px rgba(232,131,74,0.35)'
              }}>
                🍃
              </div>
              <div>
                <div style={{
                  fontFamily: 'Poppins, sans-serif', fontWeight: 800,
                  fontSize: 17, color: 'var(--text-primary)', lineHeight: 1.1
                }}>
                  Eco<span className="gradient-text">Wise</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
                  Kelola Sampah. Jejak Karbon. Bumi Sehat. 🌍
                </div>
              </div>
            </NavLink>

            {/* ── Desktop Nav ── */}
            <div style={{ display: 'none' }} className="desktop-nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* ── User Info ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Points Badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 50,
                background: 'rgba(232,131,74,0.1)',
                border: '1.5px solid rgba(232,131,74,0.25)',
              }}>
                <div className="dot-live" />
                <span style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 800 }}>
                  ⭐ {(user?.ecoPoints || 0).toLocaleString()} poin
                </span>
              </div>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 900, color: 'white',
                  background: 'linear-gradient(135deg, #e8834a, #5cb285)',
                  boxShadow: '0 3px 10px rgba(232,131,74,0.3)',
                  cursor: 'pointer',
                }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ display: 'none' }} className="user-name-block">
                  <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 700 }}>
                    Bu {user?.name?.split(' ')[0]}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                    🔥 {user?.streak || 0} hari beruntun
                  </p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Keluar"
                style={{
                  padding: '8px 14px', borderRadius: 12, border: 'none',
                  background: 'rgba(241,112,112,0.1)', color: '#e05252',
                  cursor: 'pointer', fontWeight: 700, fontSize: 13,
                  transition: 'all 0.2s', fontFamily: 'Nunito, sans-serif',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(241,112,112,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(241,112,112,0.1)'}
              >
                <span>🚪</span>
                <span style={{ display: 'none' }} className="logout-text">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="bottom-nav md:hidden">
        <div style={{
          display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '4px 0'
        }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, padding: '8px 12px', borderRadius: 14, textDecoration: 'none',
                transition: 'all 0.2s',
                background: isActive ? 'rgba(232,131,74,0.12)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              })}
            >
              <span style={{ fontSize: 20 }}>{item.emoji}</span>
              <span style={{ fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Spacer for bottom nav on mobile */}
      <div className="md:hidden" style={{ height: 72 }} />

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; align-items: center; gap: 4px; }
          .user-name-block { display: block !important; }
          .logout-text { display: inline !important; }
          .bottom-nav { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
