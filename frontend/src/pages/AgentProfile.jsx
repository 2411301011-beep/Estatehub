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
      <MobileShell>
        <div className="p-4 space-y-4 animate-pulse">
          <div className="h-40 bg-surface-container-high rounded-2xl w-full" />
          <div className="h-6 bg-surface-container-high rounded w-1/2" />
        </div>
      </MobileShell>
    );
  }

  if (!agent) {
    return (
      <MobileShell>
        <div className="p-12 text-center">
          <h2 className="font-display font-bold text-xl text-on-surface">Agent Not Found</h2>
          <button
            onClick={() => navigate('/agents')}
            className="mt-4 px-6 py-2.5 bg-secondary text-on-secondary rounded-xl text-xs font-bold"
          >
            Back to Agent Directory
          </button>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      
      {/* Top Header Card */}
      <div className="relative bg-primary-container text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-6 hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={agent.photo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'}
            alt={agent.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-secondary shadow-md shrink-0"
          />
          
          <div className="flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-display font-bold text-2xl sm:text-3xl">{agent.name}</h1>
              {agent.verified && (
                <span className="material-symbols-outlined text-secondary text-xl">verified</span>
              )}
            </div>
            
            <p className="text-secondary font-semibold text-sm mt-1">{agent.agency}</p>
            
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs sm:text-sm text-on-primary-container">
              <span className="text-amber-400 font-bold">★ {agent.rating || 4.9} Rating</span>
              <span>•</span>
              <span>{agent.listings_count || 0} active listings</span>
            </div>

            <p className="text-on-primary-container text-xs sm:text-sm mt-3 leading-relaxed max-w-2xl">
              {agent.bio}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-3 mt-6">
              <a
                href={`tel:${agent.phone}`}
                className="px-6 py-2.5 bg-secondary hover:bg-secondary/90 text-on-secondary rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">call</span>
                <span>Call {agent.phone}</span>
              </a>
              <a
                href={`mailto:${agent.email}`}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">mail</span>
                <span>Email Agent</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Active Listings Grid */}
      <div className="space-y-6">
        <h2 className="font-display font-bold text-xl sm:text-2xl text-on-surface">
          Active Listings by {agent.name} ({properties.length})
        </h2>

        {properties.length === 0 ? (
          <EmptyState
            icon="home"
            title="No active listings"
            description="This agent currently has no public properties listed."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>

    </MobileShell>
  );
};

export default AgentProfile;
