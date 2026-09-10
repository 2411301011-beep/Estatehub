import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Explore', icon: 'explore' },
  { path: '/search', label: 'Search', icon: 'search' },
  { path: '/saved', label: 'Saved', icon: 'favorite' },
  { path: '/agents', label: 'Agents', icon: 'badge' },
  { path: '/profile', label: 'Profile', icon: 'person' },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface/95 backdrop-blur-md border-t border-surface-container-high px-2 py-2 flex items-center justify-around shadow-lg">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 ${
              isActive
                ? 'text-secondary font-semibold scale-105'
                : 'text-outline hover:text-on-surface'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined text-2xl ${
                  isActive ? 'fill-current' : ''
                }`}
              >
                {item.icon}
              </span>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
