import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-surface-container-high text-on-surface pt-12 pb-16 md:pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-surface-container-high">
          
          {/* Brand & Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-1.5 group">
              <span className="material-symbols-outlined text-secondary text-2xl font-bold">domain</span>
              <span className="font-display font-bold text-xl tracking-tight text-on-surface">
                Estate<span className="text-secondary font-serif italic">Hub</span>
              </span>
            </Link>
            <p className="text-outline text-xs leading-relaxed">
              India's premier real estate marketplace. Discover luxury villas, modern apartments, and premium commercial spaces across top metros.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm text-on-surface mb-3">Explore</h4>
            <ul className="space-y-2 text-xs text-outline">
              <li>
                <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-secondary transition-colors">Search Listings</Link>
              </li>
              <li>
                <Link to="/agents" className="hover:text-secondary transition-colors">Verified Agents</Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-secondary transition-colors">★ Premium Membership Plans</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-secondary transition-colors">⚙️ Admin Portal (/admin)</Link>
              </li>
            </ul>
          </div>

          {/* Top Markets */}
          <div>
            <h4 className="font-display font-semibold text-sm text-on-surface mb-3">Top Markets</h4>
            <ul className="space-y-2 text-xs text-outline">
              <li>
                <Link to="/search?city=Gurgaon" className="hover:text-secondary transition-colors">Gurgaon Properties</Link>
              </li>
              <li>
                <Link to="/search?city=Delhi" className="hover:text-secondary transition-colors">Delhi Real Estate</Link>
              </li>
              <li>
                <Link to="/search?city=Noida" className="hover:text-secondary transition-colors">Noida Commercial</Link>
              </li>
              <li>
                <Link to="/search?city=Mumbai" className="hover:text-secondary transition-colors">Mumbai Luxury Homes</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-display font-semibold text-sm text-on-surface mb-3">Customer Support</h4>
            <p className="text-xs text-outline mb-2">Have questions or need assistance?</p>
            <a href="mailto:support@estatehub.in" className="text-xs text-secondary font-semibold hover:underline block mb-1">
              ✉️ support@estatehub.in
            </a>
            <span className="text-xs text-outline block">
              📞 +91 1800-123-4567
            </span>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-outline">
          <p>© {new Date().getFullYear()} EstateHub Real Estate. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:text-on-surface">Admin Portal</Link>
            <span>•</span>
            <span className="hover:text-on-surface cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-on-surface cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
