import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { computeRankings } from '../scoring/priorityEngine';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { 
  IconSearch, 
  IconChevronRight, 
  IconCheckCircle,
  IconPortfolio,
  SectorIcon 
} from '../utils/icons';

export default function IssuesPage({ clusters, selectedCluster, setSelectedCluster, onNavigateToPortfolio }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all'); // 'all' | 'water' | 'road' | 'health' | 'education'
  const [urgencyTab, setUrgencyTab] = useState('all'); // 'all' | 'critical'

  // Pre-calculate ranked issues
  const rankedClusters = useMemo(() => {
    return computeRankings(clusters);
  }, [clusters]);

  // Sector filter buttons
  const SECTORS = [
    { id: 'all', label: 'All Sectors' },
    { id: 'water', label: 'Water' },
    { id: 'road', label: 'Roads' },
    { id: 'health', label: 'Healthcare' },
    { id: 'education', label: 'Education' }
  ];

  const getIssueTitle = (cluster) => {
    if (cluster.description) return cluster.description;
    const titles = {
      water: 'Water Supply & Pipeline Fault',
      road: 'Road Resurfacing & Potholes',
      health: 'Primary Health Clinic Infrastructure',
      education: 'School Sanitation & Desks',
      sanitation: 'Drain Desilting & Waste Clear',
      electricity: 'Streetlight Feeder Maintenance'
    };
    return titles[cluster.issue_type] || `${cluster.issue_type} Maintenance`;
  };

  // Handle Search and Sector/Urgency Filtering
  const filteredClusters = useMemo(() => {
    return rankedClusters.filter(c => {
      // Urgency tab check
      if (urgencyTab === 'critical' && c.urgency !== 'critical') {
        return false;
      }
      // Sector filter check
      if (sectorFilter !== 'all' && c.issue_type.toLowerCase() !== sectorFilter) {
        return false;
      }
      // Search query check
      if (!searchQuery.trim()) return true;
      const lower = searchQuery.toLowerCase();
      return (
        c.issue_type.toLowerCase().includes(lower) ||
        c.ward.toLowerCase().includes(lower) ||
        (c.description || '').toLowerCase().includes(lower) ||
        (c.public_evidence || []).some(evidence => evidence.toLowerCase().includes(lower))
      );
    });
  }, [rankedClusters, searchQuery, sectorFilter, urgencyTab]);

  // Set initial selected cluster if none selected
  const activeCluster = useMemo(() => {
    if (selectedCluster && filteredClusters.some(c => c.id === selectedCluster.id)) {
      return selectedCluster;
    }
    return filteredClusters[0] || null;
  }, [selectedCluster, filteredClusters]);

  const formatCostLakhs = (val) => `₹${(val / 100000).toFixed(1)}L`;

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto pb-24 md:pb-8">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{t('issues.title', 'Issues & Clusters')}</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            {t('issues.subtitle', 'Aggregated citizen complaints grouped into actionable development priorities.')}
          </p>
        </div>
        
        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToPortfolio()}
            type="button"
            className="btn-primary flex items-center gap-2 bg-need-blue hover:bg-need-blue-dark text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <IconPortfolio className="w-4 h-4" />
            <span>{t('dashboard.open_planner', 'Open Planner')}</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Strip */}
      <div className="space-y-3 bg-white p-4 border border-slate-200/90 rounded-xl shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input with accessible label */}
          <div className="relative w-full sm:max-w-md flex-1">
            <input
              type="text"
              aria-label="Search issues by ward, sector, or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('issues.search_placeholder', 'Search by sector, ward name, or grievance...')}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-need-blue focus:border-need-blue bg-slate-50/70"
            />
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>

          {/* Functional View Tab Controls */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/80 w-full sm:w-auto" role="tablist">
            <button
              onClick={() => setUrgencyTab('all')}
              role="tab"
              aria-selected={urgencyTab === 'all'}
              type="button"
              className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                urgencyTab === 'all' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Issues ({rankedClusters.length})
            </button>
            <button
              onClick={() => setUrgencyTab('critical')}
              role="tab"
              aria-selected={urgencyTab === 'critical'}
              type="button"
              className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                urgencyTab === 'critical' ? 'bg-white text-urgent-red font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('issues.critical_only', 'Critical Only')}
            </button>
          </div>
        </div>

        {/* Sector Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex-shrink-0 mr-1">
            Sector:
          </span>
          {SECTORS.map(s => {
            const isSelected = sectorFilter === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSectorFilter(s.id)}
                type="button"
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex-shrink-0 cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 text-white shadow-2xs' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Ranked Issues List */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-4 md:p-5 shadow-2xs space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Prioritized Issues
            </h2>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              Showing {filteredClusters.length} items
            </span>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredClusters.map((cluster) => {
              const isSelected = activeCluster?.id === cluster.id;
              const isCritical = cluster.urgency === 'critical' || (cluster.priority_score && cluster.priority_score > 0.55);

              return (
                <button
                  key={cluster.id}
                  onClick={() => setSelectedCluster(cluster)}
                  type="button"
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-need-blue bg-blue-50/50 shadow-2xs ring-1 ring-blue-500/20'
                      : isCritical
                      ? 'border-red-200/90 bg-red-50/30 hover:bg-red-50/60'
                      : 'border-slate-200/80 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0 shadow-2xs">
                      <SectorIcon type={cluster.issue_type} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-bold text-slate-900 leading-tight truncate">
                        {getIssueTitle(cluster)}
                      </h3>
                      <span className="text-xs text-slate-500 block mt-0.5 truncate">
                        {cluster.ward} · {cluster.complaint_count || 0} reports
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2 flex-shrink-0">
                    <Badge variant={isCritical ? "critical" : "warning"} size="sm" dot>
                      {cluster.priority_score ? cluster.priority_score.toFixed(2) : '0.00'}
                    </Badge>
                    <IconChevronRight className="text-slate-400 w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}

            {filteredClusters.length === 0 && (
              <EmptyState 
                title="No matching issues"
                description="Try clearing your search query or switching the sector filter."
                actionLabel="Reset Filters"
                onAction={() => { setSearchQuery(''); setSectorFilter('all'); setUrgencyTab('all'); }}
              />
            )}
          </div>
        </div>

        {/* Right Panel: Selected Issue Detail */}
        <div className="lg:col-span-7 space-y-4">
          {activeCluster ? (
            <>
              {/* Detailed Summary Card */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 md:p-6 shadow-2xs space-y-5">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs">
                      <SectorIcon type={activeCluster.issue_type} className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                        {getIssueTitle(activeCluster)}
                      </h2>
                      <p className="text-xs font-mono text-slate-500 mt-0.5">Issue ID: {activeCluster.id}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={activeCluster.urgency === 'critical' ? 'critical' : 'warning'} 
                    size="md" 
                    dot
                  >
                    {activeCluster.urgency === 'critical' ? 'CRITICAL' : 'MODERATE'}
                  </Badge>
                </div>

                {/* Primary Metric Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold mb-0.5">Ward</span>
                    <span className="text-xs font-bold text-slate-800">{activeCluster.ward}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold mb-0.5">Grievances</span>
                    <span className="text-xs font-bold text-slate-800 tabular-nums">{activeCluster.complaint_count || 0} reports</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold mb-0.5">Population</span>
                    <span className="text-xs font-bold text-slate-800 tabular-nums">{activeCluster.affected_population ? activeCluster.affected_population.toLocaleString() : 'Ward-wide'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold mb-0.5">Estimated Cost</span>
                    <span className="text-xs font-bold font-mono text-need-blue tabular-nums">{formatCostLakhs(activeCluster.estimated_cost_inr)}</span>
                  </div>
                </div>

                {/* Citizen Reports / Specific Details */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Citizen Reports & Evidence</h3>
                  <ul className="space-y-2">
                    {(activeCluster.public_evidence || []).map((evidence, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
                        <IconCheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{evidence}</span>
                      </li>
                    ))}
                    {(activeCluster.public_evidence || []).length === 0 && (
                      <li className="text-xs text-slate-500 italic py-2">
                        Citizen complaint registered through ward intake without extended text.
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Lower Section Action Kicker */}
              <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 md:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Recommended Action</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Include this priority project in constituency fund allocation for {activeCluster.ward}.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToPortfolio()}
                  type="button"
                  className="btn-primary bg-need-blue hover:bg-need-blue-dark text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-all shadow-2xs flex-shrink-0 cursor-pointer"
                >
                  Allocate in Portfolio
                </button>
              </div>
            </>
          ) : (
            <EmptyState
              title="Select an issue to inspect"
              description="Click any issue cluster from the list to review details, evidence, and estimated budget."
            />
          )}
        </div>

      </div>
    </div>
  );
}
