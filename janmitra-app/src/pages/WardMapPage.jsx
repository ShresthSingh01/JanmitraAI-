import React, { useState, useMemo } from 'react';
import MapPanel from '../components/MapPanel';
import Badge from '../components/Badge';
import { SectorIcon } from '../utils/icons';
import { VARANASI_WARD_CENTROIDS, LUCKNOW_WARD_CENTROIDS } from '../utils/fallbackParser';

export default function WardMapPage({ clusters = [], setSelectedCluster, onNavigateToIssues, currentConstituency = 'varanasi' }) {
  const [selectedWard, setSelectedWard] = useState('Ward 7');

  const wardMap = currentConstituency.toLowerCase() === 'lucknow' ? LUCKNOW_WARD_CENTROIDS : VARANASI_WARD_CENTROIDS;

  // Compute ward details dynamically across all constituency wards
  const wardDetails = useMemo(() => {
    const details = {};

    // Pre-populate with known wards from GIS database
    Object.entries(wardMap).forEach(([wardId, info]) => {
      details[wardId] = {
        name: wardId,
        locality: info.name || wardId,
        complaints: 0,
        population: 0,
        issues: [],
        needScoreSum: 0
      };
    });

    clusters.forEach(c => {
      const wardKey = c.ward || 'General';
      if (!details[wardKey]) {
        details[wardKey] = {
          name: wardKey,
          locality: wardKey,
          complaints: 0,
          population: 0,
          issues: [],
          needScoreSum: 0
        };
      }
      details[wardKey].complaints += c.complaint_count || 0;
      details[wardKey].population = Math.max(details[wardKey].population, c.affected_population || 0);
      details[wardKey].issues.push(c);
      details[wardKey].needScoreSum += c.priority_score || 0.5;
    });

    // Calculate averages
    Object.keys(details).forEach(key => {
      const w = details[key];
      w.avgNeedScore = w.issues.length ? parseFloat((w.needScoreSum / w.issues.length).toFixed(3)) : 0;
    });

    return details;
  }, [clusters, wardMap]);

  const activeWard = wardDetails[selectedWard] || {
    name: selectedWard,
    locality: selectedWard,
    complaints: 0,
    population: 0,
    avgNeedScore: 0,
    issues: []
  };

  const handleSelectCluster = (cluster) => {
    if (setSelectedCluster) setSelectedCluster(cluster);
    if (onNavigateToIssues) onNavigateToIssues(cluster);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto pb-24 md:pb-8">
      {/* Header Info */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-need-blue"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
              {currentConstituency.toUpperCase()} WARD LEVEL OVERVIEW
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Constituency Ward Map
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Geographic ward boundaries, cluster locations, and localized service demands.
          </p>
        </div>

        {/* Quick Ward Selector */}
        <div className="flex items-center gap-2.5">
          <label htmlFor="ward-inspect-select" className="text-xs text-slate-500 font-medium">
            Select Ward:
          </label>
          <select
            id="ward-inspect-select"
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-need-blue cursor-pointer shadow-2xs"
          >
            {Object.keys(wardDetails).map(wId => (
              <option key={wId} value={wId}>
                {wId} {wardDetails[wId].locality ? `(${wardDetails[wId].locality})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {currentConstituency.toUpperCase()} Municipal Boundaries & Clusters
            </h2>
            <span className="text-xs font-mono text-slate-500">
              Click a ward or cluster pin to inspect
            </span>
          </div>
          
          <div className="h-[480px] w-full rounded-lg overflow-hidden border border-slate-200">
            <MapPanel 
              clusters={clusters} 
              onSelectWard={setSelectedWard}
              onSelectCluster={handleSelectCluster}
              currentConstituency={currentConstituency}
            />
          </div>
        </div>

        {/* Ward Details Inspector Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-xs text-slate-400 uppercase font-mono">Inspected Ward</span>
                <h3 className="text-lg font-bold text-slate-900">{activeWard.name}</h3>
                <p className="text-xs text-need-blue font-medium">{activeWard.locality}</p>
              </div>
              <Badge 
                variant={activeWard.avgNeedScore > 0.4 ? 'critical' : 'neutral'} 
                size="sm"
                dot
              >
                Need: {activeWard.avgNeedScore}
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                <span className="text-slate-500">Active Grievances:</span>
                <span className="font-bold text-slate-800 font-mono tabular-nums">{activeWard.complaints}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                <span className="text-slate-500">Identified Projects:</span>
                <span className="font-bold text-slate-800 font-mono tabular-nums">{activeWard.issues.length}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                <span className="text-slate-500">Beneficiary Base:</span>
                <span className="font-bold text-slate-800 font-mono tabular-nums">{activeWard.population > 0 ? activeWard.population.toLocaleString() : 'Ward-wide'}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Priority Issues in {activeWard.name}:</h4>
              {activeWard.issues.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-3">No active grievance clusters recorded in this ward.</p>
              ) : (
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                  {activeWard.issues.map(iss => (
                    <button
                      key={iss.id}
                      onClick={() => handleSelectCluster(iss)}
                      type="button"
                      className="w-full text-left p-2.5 rounded-lg border border-slate-200/80 hover:border-need-blue hover:bg-blue-50/40 transition-all cursor-pointer shadow-2xs"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                          <SectorIcon type={iss.issue_type} className="w-3.5 h-3.5 text-slate-600" />
                          <span className="text-xs font-bold text-slate-800 uppercase">{iss.issue_type}</span>
                        </div>
                        <span className="text-xs font-mono text-emerald-700 font-bold tabular-nums">₹{(iss.estimated_cost_inr / 100000).toFixed(1)}L</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{iss.description || iss.id}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
            Source: Constituency Wards GIS & Field Registry
          </div>
        </div>
      </div>
    </div>
  );
}
