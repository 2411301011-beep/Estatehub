import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import PropertyCard from '../components/property/PropertyCard';
import { PropertySkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { getFavorites } from '../api/favorites';
import { useAuth } from '../context/AuthContext';

const Saved = () => {
  const { isAuthenticated, favorites } = useAuth();
  const navigate = useNavigate();

  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchSaved = async () => {
      setLoading(true);
      try {
        const data = await getFavorites();
        setSavedProperties(data || []);
      } catch (err) {
        console.error("Error loading favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [isAuthenticated, favorites.length]);

  return (
    <MobileShell>
      
      {/* Header */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high shadow-sm mb-6">
        <h1 className="font-display font-bold text-2xl text-on-surface">Saved Properties</h1>
        <p className="text-outline text-xs sm:text-sm mt-1">Your shortlisted luxury homes and investment properties</p>
      </div>

      {/* Content */}
      {!isAuthenticated ? (
        <EmptyState
          icon="lock"
          title="Sign in to view saved properties"
          description="Create a free buyer account or sign in to keep track of your favorite properties across devices."
          actionText="Sign In / Register"
          onAction={() => navigate('/login', { state: { from: '/saved' } })}
        />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertySkeleton />
          <PropertySkeleton />
          <PropertySkeleton />
        </div>
      ) : savedProperties.length === 0 ? (
        <EmptyState
          icon="favorite"
          title="No saved properties yet"
          description="Tap the heart icon on any property card to save it here for quick access later."
          actionText="Explore Properties"
          actionLink="/search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}

    </MobileShell>
  );
};

export default Saved;
