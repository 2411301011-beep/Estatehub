import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import PropertyCard from '../components/property/PropertyCard';
import { PropertySkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { getAgentById, getAgentProperties } from '../api/agents';

const AgentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [agData, propsData] = await Promise.all([
          getAgentById(id),
          getAgentProperties(id),
        ]);
        setAgent(agData);
        setProperties(propsData || []);
      } catch (err) {
        console.error("Error loading agent profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <MobileShell hideHeader>
        <div className="p-4 space-y-4 animate-pulse">
          <div className="h-40 bg-surface-container-high rounded-2xl w-full" />
          <div className="h-6 bg-surface-container-high rounded w-1/2" />
        </div>
      </MobileShell>
    );
  }

  if (!agent) {
    return (
      <MobileShell hideHeader>
        <div className="p-8 text-center">
          <h2 className="font-display font-bold text-lg text-on-surface">Agent Not Found</h2>
          <button
            onClick={() => navigate('/agents')}
            className="mt-4 px-4 py-2 bg-secondary text-on-secondary rounded-xl text-xs font-bold"
          >
            Back to Agent Directory
          </button>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell hideHeader>
      
      {/* Top Banner & Header */}
      <div className="relative bg-primary-container text-white p-5 pt-8 rounded-b-3xl shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-4 hover:bg-white/20"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
        </button>

        <div className="flex items-center gap-4">
          <img
            src={agent.photo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'}
            alt={agent.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-secondary"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-display font-bold text-xl">{agent.name}</h1>
              {agent.verified && (
                <span className="material-symbols-outlined text-secondary text-lg">verified</span>
              )}
            </div>
            <p className="text-secondary font-medium text-xs mt-0.5">{agent.agency}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-on-primary-container">
              <span className="text-amber-400 font-semibold">★ {agent.rating || 4.9}</span>
              <span>•</span>
              <span>{agent.listings_count || 0} active listings</span>
            </div>
          </div>
        </div>

        {/* Quick Phone / Email CTAs */}
        <div className="grid grid-cols-2 gap-2 mt-5">
          <a
            href={`tel:${agent.phone}`}
            className="py-2.5 bg-secondary hover:bg-secondary/90 text-on-secondary rounded-xl text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">call</span>
            Call Agent
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">mail</span>
            Email
          </a>
        </div>
      </div>

      {/* About & Bio */}
      <div className="p-4 space-y-6">
        <div>
          <h3 className="font-display font-semibold text-base text-on-surface mb-1">About Agent</h3>
          <p className="text-on-surface-variant text-xs leading-relaxed">{agent.bio}</p>
        </div>

        {/* Active Listings Header */}
        <div>
          <h3 className="font-display font-semibold text-base text-on-surface mb-3">
            Active Listings ({properties.length})
          </h3>

          {properties.length === 0 ? (
            <EmptyState
              icon="home"
              title="No active listings"
              description="This agent currently has no public properties listed."
            />
          ) : (
            <div className="space-y-4">
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </div>
      </div>

    </MobileShell>
  );
};

export default AgentProfile;
