import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon = 'search_off', title = 'No results found', description = 'Try adjusting your search filters or browse other categories.', actionText, actionLink, onAction }) => {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-outline mb-3">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="font-display font-semibold text-lg text-on-surface">{title}</h3>
      <p className="text-outline text-xs mt-1 max-w-xs leading-relaxed">{description}</p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="mt-4 px-4 py-2 bg-secondary text-on-secondary text-xs font-semibold rounded-xl transition-all shadow-sm hover:bg-secondary/90"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-secondary text-on-secondary text-xs font-semibold rounded-xl transition-all shadow-sm hover:bg-secondary/90"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
