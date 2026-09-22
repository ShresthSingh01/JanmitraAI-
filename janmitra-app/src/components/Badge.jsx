import React from 'react';

/**
 * Reusable Badge for statuses, urgency ratings, and priority levels.
 * Variants: critical, warning, success, info, neutral
 */
export default function Badge({ 
  children, 
  variant = 'neutral', 
  size = 'md',
  className = '',
  dot = false,
  mono = false
}) {
  const variantStyles = {
    critical: 'bg-red-50/80 text-red-700 border-red-200/80',
    warning: 'bg-amber-50/80 text-amber-800 border-amber-200/80',
    success: 'bg-emerald-50/80 text-emerald-800 border-emerald-200/80',
    info: 'bg-blue-50/80 text-blue-800 border-blue-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    navy: 'bg-slate-800 text-white border-slate-700'
  };

  const dotColors = {
    critical: 'bg-red-500',
    warning: 'bg-amber-500',
    success: 'bg-emerald-500',
    info: 'bg-blue-500',
    neutral: 'bg-slate-400',
    navy: 'bg-emerald-400'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md ${mono ? 'font-mono' : 'font-sans'} tracking-tight ${variantStyles[variant] || variantStyles.neutral} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {dot && (
        <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant] || dotColors.neutral}`} />
      )}
      <span>{children}</span>
    </span>
  );
}
