import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(name, email, password, phone);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell>
      <div className="py-12 px-4 max-w-md mx-auto w-full">
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high shadow-xl">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-container text-secondary mx-auto flex items-center justify-center mb-3 shadow-md">
              <span className="material-symbols-outlined text-3xl">person_add</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-on-surface">Create Account</h1>
            <p className="text-outline text-xs mt-1">Join EstateHub to save favorites and contact agents</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-low border border-surface-container-high px-3.5 py-2.5 rounded-xl text-xs font-medium text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-surface-container-high px-3.5 py-2.5 rounded-xl text-xs font-medium text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-surface-container-low border border-surface-container-high px-3.5 py-2.5 rounded-xl text-xs font-medium text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-surface-container-high px-3.5 py-2.5 rounded-xl text-xs font-medium text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-secondary text-on-secondary rounded-xl text-xs font-bold shadow-md hover:bg-secondary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-surface-container-high">
            <p className="text-xs text-outline">
              Already have an account?{' '}
              <Link to="/login" state={{ from }} className="font-bold text-secondary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MobileShell>
  );
};

export default Register;
