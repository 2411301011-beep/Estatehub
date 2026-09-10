import React, { useState, useEffect } from 'react';
import MobileShell from '../components/layout/MobileShell';
import AgentCard from '../components/agent/AgentCard';
import { AgentSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { getAgents } from '../api/agents';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAgentsList = async (q = '') => {
    setLoading(true);
    try {
      const data = await getAgents(q);
      setAgents(data || []);
    } catch (err) {
      console.error("Error fetching agents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentsList(searchQuery);
  }, [searchQuery]);

  return (
    <MobileShell>
      
      {/* Header */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high shadow-sm mb-6">
        <h1 className="font-display font-bold text-2xl text-on-surface">Verified Real Estate Advisors</h1>
        <p className="text-outline text-xs sm:text-sm mt-1">Connect with India's top real estate advisors and property brokers</p>

        {/* Agent Search input */}
        <div className="mt-4 bg-surface-container-low px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-outline-variant/40 max-w-md">
          <span className="material-symbols-outlined text-outline text-xl">search</span>
          <input
            type="text"
            placeholder="Search by agent name, agency, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm text-on-surface font-medium placeholder-outline focus:outline-none"
          />
        </div>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AgentSkeleton />
          <AgentSkeleton />
          <AgentSkeleton />
        </div>
      ) : agents.length === 0 ? (
        <EmptyState
          icon="badge"
          title="No agents found"
          description="We couldn't find any agent matching your query."
          actionText="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((ag) => <AgentCard key={ag.id} agent={ag} />)}
        </div>
      )}

    </MobileShell>
  );
};

export default Agents;
