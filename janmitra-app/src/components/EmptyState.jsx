import React from 'react';
import { IconSearch } from '../utils/icons';

/**
 * Reusable empty state component with clean layout and optional action.
 */
export default function EmptyState({
  title = "No records found",
  description = "There are currently no active items matching your criteria.",
  icon: CustomIcon,
  actionLabel,
  onAction,
  className = ""
}) {
  const IconComponent = CustomIcon || IconSearch;

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-200 rounded-xl ${className}`}>
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
        <IconComponent className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs font-semibold text-need-blue bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
