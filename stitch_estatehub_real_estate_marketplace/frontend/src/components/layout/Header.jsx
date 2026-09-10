import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CITIES = ['Gurgaon', 'Delhi', 'Noida', 'Mumbai'];

const Header = ({ activeCity = 'Gurgaon', onCityChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-surface-container-high px-4 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-1.5 group">
        <span className="material-symbols-outlined text-secondary text-2xl font-bold">domain</span>
        <span className="font-display font-bold text-xl tracking-tight text-on-surface">
          Estate<span className="text-secondary font-serif">Hub</span>
        </span>
      </Link>

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
    </header>
  );
};

export default Header;
