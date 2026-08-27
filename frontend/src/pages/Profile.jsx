import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';
import { getMyInquiries } from '../api/inquiries';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchInquiries = async () => {
      setLoading(true);
      try {
        const data = await getMyInquiries();
        setInquiries(data || []);
      } catch (err) {
        console.error("Error loading user inquiries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <MobileShell>
        <div className="p-6 text-center py-16">
          <div className="w-16 h-16 rounded-full bg-surface-container-low text-secondary mx-auto flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-3xl">account_circle</span>
          </div>
          <h2 className="font-display font-bold text-lg text-on-surface">Account Access</h2>
          <p className="text-outline text-xs mt-1 max-w-xs mx-auto">
            Log in to view your profile, manage saved properties, and check your agent inquiry history.
          </p>

          <div className="mt-6 flex flex-col gap-2 max-w-xs mx-auto">
            <button
              onClick={() => navigate('/login')}
              className="py-3 bg-secondary text-on-secondary text-xs font-bold rounded-xl shadow-md hover:bg-secondary/90 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="py-3 bg-surface-container-low text-on-surface text-xs font-semibold rounded-xl border border-surface-container-high hover:bg-surface-container transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      
      {/* User Header */}
      <div className="bg-primary-container text-white p-5 pt-8 rounded-b-3xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container font-display font-bold text-2xl flex items-center justify-center border-2 border-secondary shadow-sm">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">{user.name}</h1>
            <p className="text-on-primary-container text-xs mt-0.5">{user.email}</p>
            {user.phone && <p className="text-on-primary-container text-xs">{user.phone}</p>}
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-5 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          Sign Out
        </button>
      </div>

      {/* Tracked Inquiries Section */}
      <div className="p-4 space-y-4 mt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-base text-on-surface">
            My Submitted Inquiries ({inquiries.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-4 text-center text-xs text-outline">Loading inquiries...</div>
        ) : inquiries.length === 0 ? (
          <EmptyState
            icon="mark_email_read"
            title="No inquiries sent yet"
            description="When you contact agents about a property, your message history will appear here."
            actionText="Browse Listings"
            actionLink="/search"
          />
        ) : (
          <div className="space-y-3">
            {inquiries.map((iq) => (
              <div
                key={iq.id}
                className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between">
                  <Link
                    to={`/property/${iq.property_id}`}
                    className="font-display font-semibold text-sm text-on-surface hover:text-secondary transition-colors line-clamp-1 flex-1 pr-2"
                  >
                    {iq.property_title || 'Listing Detail'}
                  </Link>

                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      iq.status === 'contacted'
                        ? 'bg-emerald-100 text-emerald-700'
                        : iq.status === 'closed'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {iq.status}
                  </span>
                </div>

                <p className="text-on-surface-variant text-xs italic bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high/60">
                  "{iq.message}"
                </p>

                <div className="text-[10px] text-outline flex items-center justify-between pt-1">
                  <span>Contact: {iq.phone || iq.email}</span>
                  <span>Sent: {new Date(iq.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </MobileShell>
  );
};

export default Profile;
