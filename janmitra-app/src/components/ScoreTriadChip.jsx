import React from 'react';

export default function ScoreTriadChip({ needScore = 0, impactScore = 0, synergyScore = 0, decisionScore = 0, costInr = 0 }) {
  const formatCostLakhs = (inr) => (inr / 100000).toFixed(1);

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center flex-wrap gap-1.5 font-mono text-xs tabular-nums">
        
        {/* Need */}
        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
          <span className="text-slate-500 uppercase tracking-wider text-xs font-semibold">Need</span>
          <span className="font-bold text-slate-800 text-xs">{needScore.toFixed(2)}</span>
        </div>
        
        {/* Impact */}
        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
          <span className="text-slate-500 uppercase tracking-wider text-xs font-semibold">Impact</span>
          <span className="font-bold text-slate-800 text-xs">{impactScore.toFixed(2)}</span>
        </div>
        
        {/* Synergy */}
        <div className="flex items-center gap-1.5 bg-emerald-50/70 px-2 py-0.5 rounded-md border border-emerald-200/70">
          <span className="text-emerald-700 uppercase tracking-wider text-xs font-semibold">Synergy</span>
          <span className="font-bold text-emerald-800 text-xs">+{synergyScore.toFixed(2)}</span>
        </div>
        
        <span className="text-slate-400 mx-0.5" aria-hidden="true">→</span>
        
        {/* Priority Score */}
        <div className="flex items-center gap-1.5 bg-blue-50/80 px-2.5 py-0.5 rounded-md border border-blue-200/80">
          <span className="text-need-blue uppercase tracking-wider text-xs font-semibold">Priority</span>
          <span className="font-bold text-blue-900 text-xs">{decisionScore.toFixed(2)}</span>
          <span className="text-slate-500 text-xs">/ ₹{formatCostLakhs(costInr)}L</span>
        </div>

      </div>
    </div>
  );
}
