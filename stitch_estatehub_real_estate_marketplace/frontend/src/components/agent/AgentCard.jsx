import React from 'react';
import { Link } from 'react-router-dom';

const AgentCard = ({ agent }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient hover:shadow-ambient-hover border border-surface-container-high transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-3.5">
          {/* Agent Avatar */}
          <div className="relative">
            <img
              src={agent.photo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'}
              alt={agent.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-surface-container-high"
            />
            {agent.verified && (
              <span className="absolute -bottom-1 -right-1 bg-secondary-container text-on-secondary-container w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-xs font-bold">verified</span>
              </span>
            )}
          </div>

          {/* Name & Agency */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-base text-on-surface truncate">
              {agent.name}
            </h3>
            <p className="text-secondary font-medium text-xs truncate mt-0.5">
              {agent.agency}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-outline">
              <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                ★ {agent.rating || 4.9}
              </span>
              <span>•</span>
              <span>{agent.listings_count || 0} Listings</span>
            </div>
          </div>
        </div>

        {/* Bio snippet */}
        {agent.bio && (
          <p className="text-on-surface-variant text-xs mt-3 line-clamp-2 leading-relaxed">
            {agent.bio}
          </p>
        )}
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-3 border-t border-surface-container-low flex items-center gap-2">
        <Link
          to={`/agents/${agent.id}`}
          className="flex-1 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
        >
          <span>View Profile</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export default AgentCard;
