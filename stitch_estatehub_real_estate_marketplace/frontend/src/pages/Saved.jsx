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
      <div className="bg-surface-container-lowest p-4 sticky top-[57px] z-30 border-b border-surface-container-high shadow-sm">
        <h1 className="font-display font-bold text-xl text-on-surface">Saved Properties</h1>
        <p className="text-outline text-xs mt-0.5">Your shortlisted dream homes and investments</p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {!isAuthenticated ? (
          <EmptyState
            icon="lock"
            title="Sign in to view saved properties"
            description="Create a free buyer account or sign in to keep track of your favorite properties across devices."
            actionText="Sign In / Register"
            onAction={() => navigate('/login', { state: { from: '/saved' } })}
          />
        ) : loading ? (
          <>
            <PropertySkeleton />
            <PropertySkeleton />
          </>
        ) : savedProperties.length === 0 ? (
          <EmptyState
            icon="favorite"
            title="No saved properties yet"
            description="Tap the heart icon on any property card to save it here for quick access later."
            actionText="Explore Properties"
            actionLink="/search"
          />
        ) : (
          savedProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))
        )}
      </div>

    </MobileShell>
  );
};

export default Saved;
