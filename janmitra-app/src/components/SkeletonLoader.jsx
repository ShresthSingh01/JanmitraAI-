import React from 'react';

/**
 * Reusable skeleton loader matching card, list, and KPI geometry
 */
export default function SkeletonLoader({ type = 'card', count = 1, className = '' }) {
  const items = Array.from({ length: count });

  if (type === 'kpi') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="card-elevation-flat p-5 space-y-3">
            <div className="h-3 w-20 bg-slate-200 rounded shimmer" />
            <div className="h-7 w-28 bg-slate-200 rounded shimmer" />
            <div className="h-3 w-16 bg-slate-100 rounded shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3 w-full">
              <div className="w-8 h-8 rounded-lg bg-slate-200 shimmer flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3.5 w-3/4 bg-slate-200 rounded shimmer" />
                <div className="h-3 w-1/2 bg-slate-100 rounded shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="card-elevation-raised p-6 space-y-4">
          <div className="h-4 w-1/3 bg-slate-200 rounded shimmer" />
          <div className="h-3 w-full bg-slate-100 rounded shimmer" />
          <div className="h-3 w-4/5 bg-slate-100 rounded shimmer" />
        </div>
      ))}
    </div>
  );
}
