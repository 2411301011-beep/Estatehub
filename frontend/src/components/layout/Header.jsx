import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CITIES = ['Gurgaon', 'Delhi', 'Noida', 'Mumbai'];

const Header = ({ activeCity = 'Gurgaon', onCityChange }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'Explore' },
    { path: '/search', label: 'Search Listings' },
    { path: '/saved', label: 'Saved' },
    { path: '/agents', label: 'Agents' },
  ];

  // Only include Premium Plans in nav if user is authenticated (or allow clicking to prompt sign in)
  if (isAuthenticated) {
    navLinks.push({ path: '/plans', label: '★ Premium Plans' });
  }

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-surface-container-high shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Left: Brand Logo & Desktop Nav Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-1.5 group">
            <span className="material-symbols-outlined text-secondary text-2xl font-bold">domain</span>
            <span className="font-display font-bold text-xl tracking-tight text-on-surface">
              Estate<span className="text-secondary font-serif italic">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors ${
                    isActive
                      ? 'text-secondary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Dedicated Admin Portal Link (Unique URL: /admin) */}
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  isActive
                    ? 'bg-secondary/20 text-secondary border-secondary font-bold'
                    : 'text-on-surface-variant border-transparent hover:border-outline-variant/60 hover:text-on-surface'
                }`
              }
            >
              ⚙️ Admin Portal
            </NavLink>
          </nav>
        </div>

        {/* Right: City Selector & Auth / Profile */}
        <div className="flex items-center gap-3">
          
          {/* City Selector Pill */}
          <div className="relative">
            <select
              value={activeCity}
              onChange={(e) => {
                if (onCityChange) onCityChange(e.target.value);
                else navigate(`/search?city=${e.target.value}`);
              }}
              className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold px-3 py-1.5 pr-7 rounded-full border border-outline-variant/50 focus:outline-none focus:ring-1 focus:ring-secondary cursor-pointer transition-colors"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  📍 {c}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Account / Login Button */}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container border border-surface-container-high px-3 py-1 rounded-full text-xs font-semibold text-on-surface transition-all"
            >
              <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary text-[10px] flex items-center justify-center font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
              <span className="hidden sm:inline">{user?.name || 'Profile'}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-secondary hover:bg-secondary/90 text-on-secondary text-xs font-bold px-4 py-1.5 rounded-full shadow-sm transition-all"
            >
              Sign In
            </Link>
          )}

        </div>

      </div>
    </header>
  );
};

export default Header;
