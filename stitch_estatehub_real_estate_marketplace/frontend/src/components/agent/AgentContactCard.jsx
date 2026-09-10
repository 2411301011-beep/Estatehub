import React from 'react';
import { Link } from 'react-router-dom';

const AgentContactCard = ({ agent, onInquireClick }) => {
  if (!agent) return null;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container-high shadow-ambient">
      <div className="text-[10px] font-bold uppercase tracking-wider text-outline mb-3">
        Listed By Verified Agent
      </div>

      <div className="flex items-center gap-3">
        <img
          src={agent.photo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'}
          alt={agent.name}
          className="w-14 h-14 rounded-full object-cover border border-surface-container-high"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h4 className="font-display font-semibold text-base text-on-surface truncate">
              {agent.name}
            </h4>
            {agent.verified && (
              <span className="material-symbols-outlined text-secondary text-base">verified</span>
            )}
          </div>
          <p className="text-secondary text-xs font-medium truncate">{agent.agency}</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-outline">
            <span className="text-amber-500 font-semibold">★ {agent.rating || 4.9}</span>
            <span>•</span>
            <span>{agent.listings_count || 0} active listings</span>
          </div>
        </div>
      </div>

      {/* Contact CTAs */}
      <div className="grid grid-cols-2 gap-2.5 mt-4">
        <a
          href={`tel:${agent.phone || '+919810012345'}`}
          className="py-2.5 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-base">call</span>
          <span>Call Agent</span>
        </a>
        <button
          onClick={onInquireClick}
          className="py-2.5 px-3 bg-secondary hover:bg-secondary/90 text-on-secondary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-base">mail</span>
          <span>Send Inquiry</span>
        </button>
      </div>

      <div className="mt-3 text-center">
        <Link
          to={`/agents/${agent.id}`}
          className="text-xs font-semibold text-secondary hover:underline"
        >
          View Agent's Full Profile →
        </Link>
      </div>
    </div>
  );
};

export default AgentContactCard;
