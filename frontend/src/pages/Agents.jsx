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
      <div className="bg-surface-container-lowest p-4 sticky top-[57px] z-30 border-b border-surface-container-high shadow-sm">
        <h1 className="font-display font-bold text-xl text-on-surface">Verified Agent Directory</h1>
        <p className="text-outline text-xs mt-0.5">Connect with India's top real estate advisors</p>

        {/* Agent Search input */}
        <div className="mt-3 bg-surface-container-low px-3 py-2 rounded-xl flex items-center gap-2 border border-outline-variant/40">
          <span className="material-symbols-outlined text-outline text-lg">search</span>
          <input
            type="text"
            placeholder="Search by agent name or agency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-on-surface font-medium placeholder-outline focus:outline-none"
          />
        </div>
      </div>

      {/* Agents Grid */}
      <div className="p-4 space-y-4">
        {loading ? (
          <>
            <AgentSkeleton />
            <AgentSkeleton />
            <AgentSkeleton />
          </>
        ) : agents.length === 0 ? (
          <EmptyState
            icon="badge"
            title="No agents found"
            description="We couldn't find any agent matching your query."
            actionText="Clear Search"
            onAction={() => setSearchQuery('')}
          />
        ) : (
          agents.map((ag) => <AgentCard key={ag.id} agent={ag} />)
        )}
      </div>

    </MobileShell>
  );
};

export default Agents;
