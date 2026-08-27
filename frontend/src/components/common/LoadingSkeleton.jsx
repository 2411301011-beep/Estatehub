import React from 'react';

export const PropertySkeleton = () => (
  <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-surface-container-high animate-pulse flex flex-col">
    <div className="aspect-[16/9] w-full bg-surface-container-high" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-surface-container-high rounded w-3/4" />
      <div className="h-4 bg-surface-container-low rounded w-1/2" />
      <div className="pt-3 border-t border-surface-container-low flex justify-between">
        <div className="h-4 bg-surface-container-low rounded w-1/4" />
        <div className="h-4 bg-surface-container-low rounded w-1/4" />
        <div className="h-4 bg-surface-container-low rounded w-1/4" />
      </div>
    </div>
  </div>
);

export const AgentSkeleton = () => (
  <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container-high animate-pulse space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 rounded-full bg-surface-container-high" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-surface-container-high rounded w-1/2" />
        <div className="h-3 bg-surface-container-low rounded w-1/3" />
      </div>
    </div>
    <div className="h-3 bg-surface-container-low rounded w-full" />
  </div>
);
