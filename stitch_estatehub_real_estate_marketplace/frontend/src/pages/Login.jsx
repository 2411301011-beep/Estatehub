import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell>
      <div className="py-12 px-4 max-w-md mx-auto w-full">
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high shadow-xl">
          
          {/* Top Brand Branding */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-container text-secondary mx-auto flex items-center justify-center mb-3 shadow-md">
              <span className="material-symbols-outlined text-3xl">domain</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-on-surface">Welcome Back</h1>
            <p className="text-outline text-xs mt-1">Sign in to manage your saved properties and inquiries</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  mail
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container-high pl-10 pr-4 py-3 rounded-xl text-xs font-medium text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  lock
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container-high pl-10 pr-4 py-3 rounded-xl text-xs font-medium text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-secondary text-on-secondary rounded-xl text-xs font-bold shadow-md hover:bg-secondary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center pt-4 border-t border-surface-container-high">
            <p className="text-xs text-outline">
              Don't have an account?{' '}
              <Link to="/register" state={{ from }} className="font-bold text-secondary hover:underline">
                Create Buyer Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MobileShell>
  );
};

export default Login;
