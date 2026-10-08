import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import { useAuth } from '../context/AuthContext';
import { getFeaturedProperties } from '../api/properties';
import { getMyInquiries } from '../api/inquiries';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProperties: 520,
    totalAgents: 104,
    totalInquiries: 1280,
    activeSubscribers: 48,
  });

  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // If logged in user is admin or enters passcode
    if (user?.role === 'admin' || localStorage.getItem('estatehub_admin_unlocked') === 'true') {
      setIsUnlocked(true);
    }

    const loadAdminData = async () => {
      setLoading(true);
      try {
        const inquiries = await getMyInquiries();
        setRecentInquiries(inquiries || []);
      } catch (err) {
        console.error("Error loading admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [user]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasscode === 'admin123' || adminPasscode === 'estatehub_admin_secret_key_123') {
      setIsUnlocked(true);
      localStorage.setItem('estatehub_admin_unlocked', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Admin Access Key. Try demo passcode: admin123');
    }
  };

  if (!isUnlocked) {
    return (
      <MobileShell>
        <div className="max-w-md mx-auto py-16 px-4">
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-secondary-container/40 text-secondary mx-auto flex items-center justify-center border border-secondary/20">
              <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-on-surface">Admin Portal Access</h1>
              <p className="text-outline text-xs mt-1.5 leading-relaxed">
                This URL (<span className="font-mono text-secondary font-bold">/admin</span>) is restricted to EstateHub platform administrators.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Admin Passcode Key
                </label>
                <input
                  type="password"
                  placeholder="Enter passcode (e.g. admin123)"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-error font-medium bg-error-container/30 p-2.5 rounded-lg border border-error/20">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-secondary hover:bg-secondary/90 text-on-secondary font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">lock_open</span>
                <span>Unlock Admin Portal</span>
              </button>
            </form>

            <div className="pt-2 text-[11px] text-outline border-t border-surface-container-high">
              Demo Admin Passcode: <code className="bg-surface-container-high px-1.5 py-0.5 rounded font-bold text-on-surface">admin123</code>
            </div>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        
        {/* Admin Header */}
        <div className="bg-primary-container text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center font-bold shadow-md">
              <span className="material-symbols-outlined text-3xl">shield_person</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl">EstateHub Control Center</h1>
                <span className="bg-secondary/20 text-secondary border border-secondary/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Dedicated URL: /admin
                </span>
              </div>
              <p className="text-on-primary-container text-xs mt-1">
                Manage property listings, user inquiries, agent verifications, and system settings.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('estatehub_admin_unlocked');
              setIsUnlocked(false);
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">lock</span>
            <span>Lock Portal</span>
          </button>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm space-y-2">
            <div className="flex items-center justify-between text-secondary">
              <span className="material-symbols-outlined text-2xl">apartment</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">+12 this week</span>
            </div>
            <div className="font-display font-bold text-2xl text-on-surface">{stats.totalProperties}</div>
            <p className="text-xs text-outline font-medium">Total Properties Listed</p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm space-y-2">
            <div className="flex items-center justify-between text-secondary">
              <span className="material-symbols-outlined text-2xl">badge</span>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Verified</span>
            </div>
            <div className="font-display font-bold text-2xl text-on-surface">{stats.totalAgents}</div>
            <p className="text-xs text-outline font-medium">Verified Real Estate Agents</p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm space-y-2">
            <div className="flex items-center justify-between text-secondary">
              <span className="material-symbols-outlined text-2xl">forum</span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="font-display font-bold text-2xl text-on-surface">{stats.totalInquiries}</div>
            <p className="text-xs text-outline font-medium">Buyer Inquiries Logged</p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm space-y-2">
            <div className="flex items-center justify-between text-secondary">
              <span className="material-symbols-outlined text-2xl">workspace_premium</span>
              <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Pro Tiers</span>
            </div>
            <div className="font-display font-bold text-2xl text-on-surface">{stats.activeSubscribers}</div>
            <p className="text-xs text-outline font-medium">Premium Memberships</p>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-on-surface">Administrative Management Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => alert('Property Management Console: Ready to upload & edit listings')}
              className="p-4 bg-surface-container-low hover:bg-surface-container border border-surface-container-high rounded-2xl text-left transition-all group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <span className="material-symbols-outlined text-xl">add_home</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-on-surface">Add New Property</h4>
                <p className="text-[11px] text-outline">Post verified luxury listing</p>
              </div>
            </button>

            <button
              onClick={() => alert('Agent Verification Console: Approve newly registered agents')}
              className="p-4 bg-surface-container-low hover:bg-surface-container border border-surface-container-high rounded-2xl text-left transition-all group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <span className="material-symbols-outlined text-xl">verified</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-on-surface">Approve Agents</h4>
                <p className="text-[11px] text-outline">Manage agent credentials</p>
              </div>
            </button>

            <button
              onClick={() => alert('Export Analytics: Downloading CSV report...')}
              className="p-4 bg-surface-container-low hover:bg-surface-container border border-surface-container-high rounded-2xl text-left transition-all group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <span className="material-symbols-outlined text-xl">download</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-on-surface">Export Leads Report</h4>
                <p className="text-[11px] text-outline">Download monthly inquiries</p>
              </div>
            </button>
          </div>
        </div>

        {/* System Inquiries Table */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-on-surface">Recent Platform Activity</h3>
            <span className="text-xs text-outline font-medium">Live Audit Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-container-high text-outline">
                  <th className="py-3 px-2 font-semibold">User</th>
                  <th className="py-3 px-2 font-semibold">Contact Email</th>
                  <th className="py-3 px-2 font-semibold">Listing Requested</th>
                  <th className="py-3 px-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {recentInquiries.length > 0 ? (
                  recentInquiries.map((iq) => (
                    <tr key={iq.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-2 font-semibold text-on-surface">{iq.name || 'Anonymous User'}</td>
                      <td className="py-3 px-2 text-outline">{iq.email || 'N/A'}</td>
                      <td className="py-3 px-2 text-on-surface font-medium">{iq.property_title || 'Listing #' + iq.property_id}</td>
                      <td className="py-3 px-2">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">
                          {iq.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-outline">
                      No system events recorded. All operations running smoothly.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </MobileShell>
  );
};

export default Admin;
