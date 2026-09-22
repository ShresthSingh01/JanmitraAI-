import React from 'react';

/**
 * Minimalist, high-clarity KPI Card for civic data displays.
 * Renders an interactive button only if onClick is provided, else a clean semantic article.
 */
export default function KpiCard({ 
  title, 
  value, 
  subtext, 
  trend, 
  icon: Icon,
  variant = 'default',
  onClick 
}) {
  const variantStyles = {
    default: 'bg-white border-slate-200/90 hover:border-slate-300',
    highlighted: 'bg-white border-blue-200 ring-1 ring-blue-500/15',
    warning: 'bg-white border-red-200 ring-1 ring-red-500/15',
    success: 'bg-white border-emerald-200 ring-1 ring-emerald-500/15'
  };

  const accentBars = {
    default: 'bg-slate-300',
    highlighted: 'bg-need-blue',
    warning: 'bg-urgent-red',
    success: 'bg-emerald-600'
  };

  const Component = onClick ? 'button' : 'div';
  const componentProps = onClick 
    ? { type: 'button', onClick, className: 'cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all text-left' } 
    : { role: 'article' };

  return (
    <Component
      {...componentProps}
      className={`relative w-full rounded-xl p-4 md:p-5 border overflow-hidden shadow-2xs ${
        variantStyles[variant] || variantStyles.default
      } ${onClick ? 'cursor-pointer hover:shadow-xs hover:-translate-y-0.5 transition-all text-left' : ''}`}
    >
      {/* Left Accent indicator line */}
      <span className={`absolute top-0 left-0 bottom-0 w-1 ${accentBars[variant] || accentBars.default}`} />

      <div className="flex items-center justify-between gap-2 mb-2 pl-1.5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
          {title}
        </span>
        {Icon && (
          <div className="text-slate-400 flex-shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2.5 pl-1.5 mt-0.5">
        <span className="text-2xl md:text-3xl font-bold font-mono text-slate-900 tracking-tight tabular-nums">
          {value}
        </span>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded font-mono tabular-nums ${
            trend.type === 'positive' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
              : trend.type === 'negative'
              ? 'bg-red-50 text-red-700 border border-red-200/60'
              : 'bg-slate-100 text-slate-600 border border-slate-200/60'
          }`}>
            {trend.value}
          </span>
        )}
      </div>

      {subtext && (
        <span className="text-xs text-slate-500 block mt-2 font-mono pl-1.5 truncate">
          {subtext}
        </span>
      )}
    </Component>
  );
}
