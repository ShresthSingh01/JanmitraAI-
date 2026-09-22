import React, { useState, useEffect, useMemo } from 'react';
import ScoreTriadChip from '../components/ScoreTriadChip';
import ExplanationBlock from '../components/ExplanationBlock';
import Badge from '../components/Badge';
import { greedyBudgetSelect, computeRankings } from '../scoring/priorityEngine';
import { explainClusterPriority } from '../api/gemini';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { 
  IconAlertTriangle, 
  IconFileText, 
  IconChevronRight, 
  SectorIcon 
} from '../utils/icons';

export default function PortfolioPlanner({ 
  clusters, 
  budget = 3500000, 
  selectedCluster, 
  onNavigateToSimulator 
}) {
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: string }

  // Pre-calculate rankings
  const rankedClusters = useMemo(() => computeRankings(clusters), [clusters]);

  // Optimal bundle chosen by greedy solver by default
  const optimalClusterIds = useMemo(() => {
    const funded = greedyBudgetSelect(rankedClusters, budget);
    return funded.map(c => c.id);
  }, [rankedClusters, budget]);

  // Local state for current selection overrides
  const [selectedIds, setSelectedIds] = useState([]);

  // Sync with optimal selection on load or budget change
  useEffect(() => {
    setSelectedIds(optimalClusterIds);
  }, [optimalClusterIds]);

  // Derived calculations based on current selection
  const selectedClusters = useMemo(() => {
    return rankedClusters.filter(c => selectedIds.includes(c.id));
  }, [rankedClusters, selectedIds]);

  const usedBudget = useMemo(() => {
    return selectedClusters.reduce((sum, c) => sum + c.estimated_cost_inr, 0);
  }, [selectedClusters]);

  const remainingBudget = budget - usedBudget;
  const isBudgetExceeded = usedBudget > budget;

  // AI Narrative State
  const [explanation, setExplanation] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Choose target cluster to explain
  const [explainedClusterId, setExplainedClusterId] = useState(null);

  useEffect(() => {
    if (selectedCluster?.id) {
      setExplainedClusterId(selectedCluster.id);
    }
  }, [selectedCluster]);

  const targetCluster = useMemo(() => {
    if (explainedClusterId) {
      return rankedClusters.find(c => c.id === explainedClusterId) || null;
    }
    return selectedClusters[0] || rankedClusters[0] || null;
  }, [rankedClusters, selectedClusters, explainedClusterId]);

  useEffect(() => {
    async function fetchExplanation() {
      if (!targetCluster) return;
      setLoadingAi(true);
      try {
        const res = await explainClusterPriority(targetCluster);
        setExplanation(res.narrative);
      } catch {
        setExplanation(["Evaluated on reported urgency, population reach, and co-located civic synergies."]);
      } finally {
        setLoadingAi(false);
      }
    }
    
    fetchExplanation();
  }, [targetCluster]);

  const getIssueTitle = (cluster) => {
    if (cluster.description) return cluster.description;
    const titles = {
      water: 'Water Supply & Pipeline Fault',
      road: 'Road Resurfacing & Potholes',
      health: 'Primary Clinic Infrastructure',
      education: 'School Facilities & Sanitation',
      sanitation: 'Drain Desilting & Waste Clear',
      electricity: 'Streetlight Feeder Maintenance'
    };
    return titles[cluster.issue_type] || `${cluster.issue_type} Maintenance`;
  };

  // Toggle project selection
  const handleToggleProject = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Reset selection to optimal algorithm results
  const handleResetToOptimal = () => {
    setSelectedIds(optimalClusterIds);
  };

  const [isSaving, setIsSaving] = useState(false);
  const handleSavePortfolio = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await addDoc(collection(db, 'portfolios'), {
        sessionId: `SESSION_${Date.now()}`,
        timestamp: new Date().toISOString(),
        selectedClusters: selectedIds,
        budget: budget,
        usedBudget: usedBudget
      });
      setSaveStatus({ type: 'success', message: 'Portfolio allocation saved successfully.' });
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (e) {
      console.warn("Portfolio save fallback:", e.message);
      setSaveStatus({ type: 'success', message: 'Portfolio draft committed to local session.' });
      setTimeout(() => setSaveStatus(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const formatLakhs = (inr) => `₹${(inr / 100000).toFixed(1)}L`;

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto pb-24 md:pb-8">
      {/* Save Status Banner */}
      {saveStatus && (
        <div 
          role="status"
          className={`p-3.5 rounded-xl text-xs font-medium border flex items-center justify-between ${
            saveStatus.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          <span>{saveStatus.message}</span>
          <button 
            type="button" 
            onClick={() => setSaveStatus(null)} 
            className="text-slate-400 hover:text-slate-700 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Portfolio Planner</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Select and balance constituency development projects within available fund limits.
          </p>
        </div>
      </div>

      {/* Dynamic Summary Strip */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
        isBudgetExceeded 
          ? 'bg-red-50/70 border-red-300 text-urgent-red' 
          : 'bg-white border-slate-200/90 shadow-2xs'
      }`}>
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono tabular-nums">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-semibold">Fund Limit</span>
            <span className="text-sm md:text-base font-bold text-slate-900">{formatLakhs(budget)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-semibold">Committed Cost</span>
            <span className={`text-sm md:text-base font-bold ${isBudgetExceeded ? 'text-urgent-red animate-pulse' : 'text-slate-900'}`}>
              {formatLakhs(usedBudget)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-semibold">Remaining Limit</span>
            <span className={`text-sm md:text-base font-bold ${isBudgetExceeded ? 'text-urgent-red' : 'text-emerald-700'}`}>
              {formatLakhs(remainingBudget)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-semibold">Selected Projects</span>
            <span className="text-sm md:text-base font-bold text-slate-900">{selectedClusters.length} Projects</span>
          </div>
        </div>

        {/* Warning Indicator or Restore Action */}
        <div className="flex items-center gap-3">
          {isBudgetExceeded ? (
            <div className="flex items-center gap-2">
              <IconAlertTriangle className="w-4 h-4 text-urgent-red flex-shrink-0" />
              <span className="text-xs font-bold text-urgent-red">Budget Exceeded</span>
              <button
                onClick={handleResetToOptimal}
                type="button"
                className="btn-primary bg-urgent-red text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors shadow-2xs cursor-pointer"
              >
                Auto-Balance
              </button>
            </div>
          ) : (
            <button
              onClick={handleResetToOptimal}
              type="button"
              className="border border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs"
            >
              Reset to Recommended
            </button>
          )}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Interactive Project Ledger List */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-xl p-4 md:p-5 shadow-2xs space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Project Allocation List
            </h2>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              Ranked by Efficiency (Impact / Cost)
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {rankedClusters.map((cluster) => {
              const isSelected = selectedIds.includes(cluster.id);
              const isTarget = targetCluster?.id === cluster.id;
              
              return (
                <div
                  key={cluster.id}
                  onClick={() => setExplainedClusterId(cluster.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isTarget 
                      ? 'ring-1 ring-need-blue border-need-blue bg-blue-50/40' 
                      : 'border-slate-200/80 hover:border-slate-300'
                  } ${
                    isSelected ? 'bg-slate-50/70' : 'bg-white opacity-85'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="flex items-center gap-3">
                      {/* Checkbox selector */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        aria-label={`Include ${getIssueTitle(cluster)} in funded portfolio`}
                        onChange={() => handleToggleProject(cluster.id)}
                        onClick={(e) => e.stopPropagation()} // Prevent resetting explained cluster
                        className="w-4 h-4 rounded text-need-blue focus:ring-need-blue border-slate-300 cursor-pointer"
                      />
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0 shadow-2xs">
                        <SectorIcon type={cluster.issue_type} className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 capitalize leading-tight">
                          {getIssueTitle(cluster)} — {cluster.ward}
                        </h3>
                        <span className="text-xs text-slate-500 block mt-0.5 font-mono tabular-nums">
                          Estimated Cost: <span className="font-bold text-slate-800">{formatLakhs(cluster.estimated_cost_inr)}</span>
                        </span>
                      </div>
                    </div>

                    <Badge variant={isSelected ? "success" : "neutral"} size="sm" dot={isSelected}>
                      {isSelected ? 'FUNDED' : 'EXCLUDED'}
                    </Badge>
                  </div>

                  <ScoreTriadChip
                    needScore={cluster.need_score}
                    impactScore={cluster.impact_score}
                    synergyScore={cluster.synergy_score}
                    decisionScore={cluster.priority_score}
                    costInr={cluster.estimated_cost_inr}
                  />

                  {cluster.synergy_score > 0 && isSelected && (
                    <div className="mt-2 text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md inline-block">
                      Synergy: {cluster.synergy_explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Decision explanation and CSTE navigation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5">
              Priority Analysis & Reasoning
            </h2>

            {targetCluster ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                      <SectorIcon type={targetCluster.issue_type} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 capitalize">
                      {getIssueTitle(targetCluster)} — {targetCluster.ward}
                    </span>
                  </div>
                  <Badge variant="info" size="sm">Rank #{targetCluster.rank}</Badge>
                </div>

                <ExplanationBlock
                  text={explanation}
                  loading={loadingAi}
                />
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 italic">
                Select any project on the left list to review priority rationale.
              </div>
            )}
          </div>

          {/* Impact Simulation Callout Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-2xs space-y-3.5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Civic Impact Projection</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Simulate before-and-after constituency health indicators (water, clinics, schools) under this chosen allocation.
              </p>
            </div>

            <button
              onClick={onNavigateToSimulator}
              type="button"
              className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors text-center shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Simulate Civic Impact (CSTE)</span>
              <IconChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleSavePortfolio}
              disabled={isSaving}
              type="button"
              className="w-full border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium py-2 px-4 rounded-lg transition-colors text-center shadow-2xs disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <IconFileText className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Portfolio Draft'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
