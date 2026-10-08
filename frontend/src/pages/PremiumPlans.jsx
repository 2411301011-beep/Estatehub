import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import { useAuth } from '../context/AuthContext';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter Seller',
    tagline: 'Ideal for individual property owners',
    price: '₹999',
    period: '/ month',
    badge: 'Basic',
    features: [
      'Post up to 5 verified listings',
      'Standard search result ranking',
      'Receive buyer email inquiries',
      '30-day listing validity',
    ],
    buttonText: 'Select Starter Plan',
    popular: false,
  },
  {
    id: 'gold',
    name: 'Gold Real Estate Agent',
    tagline: 'For active brokers & luxury consultants',
    price: '₹2,499',
    period: '/ month',
    badge: 'Most Popular',
    features: [
      'Post up to 25 verified listings',
      'Featured Gold placement in search & categories',
      'Direct WhatsApp & phone call leads',
      'Verified Gold Agent badge on profile',
      'Priority customer support',
    ],
    buttonText: 'Subscribe Gold Plan',
    popular: true,
  },
  {
    id: 'platinum',
    name: 'Platinum Developer Club',
    tagline: 'For real estate firms & large builders',
    price: '₹5,999',
    period: '/ month',
    badge: 'Enterprise',
    features: [
      'Unlimited property & sky penthouse listings',
      'Homepage Hero Banner spotlight',
      'Dedicated relationship account manager',
      'Verified Builder badge & lead analytics',
      'Custom marketing campaigns & promotion',
    ],
    buttonText: 'Join Platinum Club',
    popular: false,
  },
];

const PremiumPlans = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscribedMsg, setSubscribedMsg] = useState('');

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setSubscribedMsg(`Successfully subscribed to ${plan.name}! Your account has been upgraded.`);
  };

  // Enforce rule: Premium plans cannot be seen before sign in!
  if (!isAuthenticated) {
    return (
      <MobileShell>
        <div className="max-w-lg mx-auto py-16 px-4">
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-secondary-container/40 text-secondary mx-auto flex items-center justify-center border border-secondary/30 shadow-inner">
              <span className="material-symbols-outlined text-3xl">lock</span>
            </div>

            <div>
              <span className="text-secondary text-[11px] font-bold tracking-widest uppercase bg-secondary-container/30 px-3 py-1 rounded-full border border-secondary/20 inline-block mb-3">
                Exclusive Member Access
              </span>
              <h1 className="font-display font-bold text-2xl text-on-surface">
                Sign In Required to View Premium Plans
              </h1>
              <p className="text-outline text-xs mt-2 leading-relaxed">
                EstateHub Premium Membership plans, pricing packages, and agent listing upgrades are strictly reserved for registered members. Please sign in or create an account to view our plans.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3 max-w-xs mx-auto">
              <button
                onClick={() => navigate('/login', { state: { from: '/plans' } })}
                className="py-3 bg-secondary hover:bg-secondary/90 text-on-secondary text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>Sign In to Unlock Plans</span>
              </button>

              <button
                onClick={() => navigate('/register')}
                className="py-3 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold rounded-xl border border-surface-container-high transition-all"
              >
                Create Free Account
              </button>
            </div>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="max-w-6xl mx-auto space-y-10 pb-16">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
          <span className="text-secondary text-xs font-bold tracking-widest uppercase bg-secondary-container/30 px-3.5 py-1.5 rounded-full border border-secondary/30 inline-block">
            Member Membership Tiers
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-on-surface">
            EstateHub <span className="text-secondary font-serif italic">Premium</span> Plans
          </h1>
          <p className="text-outline text-xs sm:text-sm leading-relaxed">
            Welcome back, <strong className="text-on-surface">{user?.name}</strong>! Choose the right seller or agent plan to feature your listings across India's premier real estate network.
          </p>
        </div>

        {subscribedMsg && (
          <div className="max-w-xl mx-auto bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-2xl text-center text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            <span>{subscribedMsg}</span>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-surface-container-lowest p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-lg ${
                plan.popular
                  ? 'border-secondary shadow-2xl ring-2 ring-secondary/20'
                  : 'border-surface-container-high hover:border-secondary/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  ★ Most Popular Plan
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-xl text-on-surface">{plan.name}</h3>
                  <span className="text-[10px] font-bold text-outline uppercase bg-surface-container-low px-2.5 py-0.5 rounded-full border">
                    {plan.badge}
                  </span>
                </div>
                <p className="text-outline text-xs mt-1">{plan.tagline}</p>

                {/* Price Display */}
                <div className="my-6 pt-4 border-t border-surface-container-high flex items-baseline gap-1">
                  <span className="font-display font-bold text-4xl text-on-surface">{plan.price}</span>
                  <span className="text-xs text-outline font-medium">{plan.period}</span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 text-xs text-on-surface-variant">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-surface-container-high">
                <button
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-secondary hover:bg-secondary/90 text-on-secondary'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high'
                  }`}
                >
                  <span>{plan.buttonText}</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </MobileShell>
  );
};

export default PremiumPlans;
