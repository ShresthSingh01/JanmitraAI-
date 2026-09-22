import React from 'react';

export default function ExplanationBlock({ text, loading }) {
  return (
    <div className="bg-slate-50/80 border-l-2 border-need-blue p-4 rounded-r-lg border border-slate-200/60 shadow-2xs relative">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-wider text-slate-700 font-semibold flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-need-blue" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2.5a1 1 0 110 2 1 1 0 010-2zm1 8.5H7V7h2v5z"/>
          </svg>
          Priority Analysis & Scoring Breakdown
        </div>
      </div>
      
      {loading ? (
        <div role="status" className="py-2.5 flex items-center space-x-2 text-slate-500 text-xs">
          <span className="w-2 h-2 rounded-full bg-need-blue animate-pulse" />
          <span>Evaluating constituency need, impact, and synergy factors...</span>
        </div>
      ) : (
        <div className="text-xs leading-relaxed text-slate-700 space-y-2">
          {Array.isArray(text) ? (
            <ul className="space-y-1.5">
              {text.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-need-blue font-bold mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="leading-relaxed">{text}</p>
          )}
        </div>
      )}
    </div>
  );
}
