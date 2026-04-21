import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiBarChart2, FiZap, FiAward, FiUsers,
  FiLogOut, FiMenu, FiX, FiChevronDown
} from 'react-icons/fi';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <FiHome size={15} /> },
  { path: '/predictions', label: 'AI Predictions', icon: <FiBarChart2 size={15} /> },
  { path: '/recommendations', label: 'Tips', icon: <FiZap size={15} /> },
  { path: '/badges', label: 'Badges', icon: <FiAward size={15} /> },
  { path: '/leaderboard', label: 'Leaderboard', icon: <FiUsers size={15} /> },
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
    <nav className="glass sticky top-0 z-50" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <NavLink to="/dashboard" className="flex items-center gap-2.5 no-underline group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              <span className="text-sm">🌱</span>
            </div>
            <span className="font-bold text-base text-white tracking-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Eco<span className="gradient-text">Wise</span>
            </span>
          </NavLink>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* ── User Info ── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Points Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)'
              }}>
              <div className="dot-live" />
              <span className="text-green-400 text-xs font-semibold">
                {(user?.ecoPoints || 0).toLocaleString()} pts
              </span>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #22c55e, #818cf8)' }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="hidden lg:block">
                <p className="text-white text-sm font-medium leading-tight">{user?.name}</p>
                <p className="text-gray-500 text-xs">🔥 {user?.streak || 0} day streak</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <FiLogOut size={16} />
            </button>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-3 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `nav-link flex items-center gap-2 w-full py-2.5 ${isActive ? 'active' : ''}`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #22c55e, #818cf8)' }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{user?.name}</p>
                <p className="text-green-400 text-xs">{user?.ecoPoints || 0} pts</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-red-400 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all">
              <FiLogOut size={14} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
