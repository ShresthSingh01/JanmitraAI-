import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { computeRankings, greedyBudgetSelect } from '../scoring/priorityEngine';
import KpiCard from '../components/KpiCard';
import MapPanel from '../components/MapPanel';
import CSTEPanel from '../components/CSTEPanel';
import Badge from '../components/Badge';
import { 
  IconFileText, 
  IconIssues, 
  IconUsers, 
  IconCurrencyRupee, 
  IconPortfolio,
  IconChevronRight,
  SectorIcon 
} from '../utils/icons';

export default function Dashboard({ clusters, onNavigateToPortfolio, onNavigateToIssues }) {
  const { t } = useTranslation();
  const defaultBudget = 3500000; // ₹35 Lakhs standard development tranche
  const [reportStatus, setReportStatus] = useState(null); // { type: 'error' | 'success', message: string }

  // Compute rankings and selections
  const rankedClusters = useMemo(() => {
    return computeRankings(clusters);
  }, [clusters]);

  const fundedClusters = useMemo(() => {
    return greedyBudgetSelect(rankedClusters, defaultBudget);
  }, [rankedClusters]);

  // KPI calculations
  const totalComplaints = useMemo(() => {
    return clusters.reduce((sum, c) => sum + (c.complaint_count || 0), 0);
  }, [clusters]);

  const criticalIssuesCount = useMemo(() => {
    return clusters.filter(c => c.urgency === 'critical').length;
  }, [clusters]);

  const totalPeopleImpacted = useMemo(() => {
    return fundedClusters.reduce((sum, c) => sum + (c.affected_population || 0), 0);
  }, [fundedClusters]);

  const totalAllocatedCost = useMemo(() => {
    return fundedClusters.reduce((sum, c) => sum + c.estimated_cost_inr, 0);
  }, [fundedClusters]);

  const formatCostLakhs = (val) => `${(val / 100000).toFixed(0)}L`;

  const getIssueTitle = (cluster) => {
    if (cluster.description) return cluster.description;
    const titles = {
      water: 'Water Supply & Pipeline Fault',
      road: 'Road Resurfacing & Potholes',
      health: 'Primary Clinic Access & Medicine',
      education: 'School Sanitation & Desks',
      sanitation: 'Drain Desilting & Waste Clear',
      electricity: 'Streetlight Feeder Outage'
    };
    return titles[cluster.issue_type] || `${cluster.issue_type} Maintenance`;
  };

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setReportStatus(null);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/api/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportData: {
            totalComplaints,
            activeIssues: rankedClusters.length,
            budget: defaultBudget,
            topProjects: fundedClusters
          }
        })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `janmitra-briefing-${Date.now()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        setReportStatus({ type: 'success', message: 'Briefing report downloaded successfully.' });
        setTimeout(() => setReportStatus(null), 4000);
        return;
      }
    } catch {
      // Backend unavailable; generate high-fidelity client briefing document
    }

    try {
      const reportDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
      const projectsRows = fundedClusters.map((c, idx) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px; font-weight: bold; font-family: monospace;">#${idx + 1}</td>
          <td style="padding: 10px; font-weight: 600;">${c.ward || 'General'}</td>
          <td style="padding: 10px; text-transform: capitalize;">${c.issue_type}</td>
          <td style="padding: 10px; color: #334155;">${c.description || 'Public works infrastructure upgrade'}</td>
          <td style="padding: 10px; text-align: right; font-weight: bold; color: #047857;">₹${((c.estimated_cost_inr || 0) / 100000).toFixed(1)}L</td>
          <td style="padding: 10px; text-align: right; font-family: monospace;">${(c.affected_population || 0).toLocaleString()}</td>
        </tr>
      `).join('');

      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>JanMitra AI - Executive Constituency Briefing</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 900px; margin: auto; line-height: 1.5; }
    h1 { margin-bottom: 4px; color: #1e3a8a; font-size: 24px; letter-spacing: -0.5px; }
    .subtitle { color: #64748b; font-size: 13px; margin-bottom: 24px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
    .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
    .kpi-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
    .kpi-value { font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; }
    .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; }
    @media print { body { padding: 0; } button { display: none; } }
  </style>
</head>
<body>
  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
    <div>
      <h1>JANMITRA AI - EXECUTIVE CONSTITUENCY BRIEFING</h1>
      <div class="subtitle">Evidence-based municipal intelligence & capital prioritization • Date: ${reportDate}</div>
    </div>
    <button onclick="window.print()" style="padding: 8px 16px; background: #1e3a8a; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 600;">Print / Save as PDF</button>
  </div>
  
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Active Grievances</div>
      <div class="kpi-value">${totalComplaints}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Problem Clusters</div>
      <div class="kpi-value">${rankedClusters.length}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Approved Capital</div>
      <div class="kpi-value">₹${(totalAllocatedCost / 100000).toFixed(1)}L</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Citizen Reach</div>
      <div class="kpi-value">${totalPeopleImpacted.toLocaleString()}</div>
    </div>
  </div>

  <h2 style="font-size: 16px; font-weight: 700; margin-top: 24px; color: #1e293b;">Recommended Priority Investment Portfolio (₹${(defaultBudget / 100000).toFixed(0)} Lakhs Cap)</h2>
  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Ward</th>
        <th>Sector</th>
        <th>Intervention Scope</th>
        <th style="text-align: right;">Cost</th>
        <th style="text-align: right;">Reach</th>
      </tr>
    </thead>
    <tbody>
      ${projectsRows}
    </tbody>
  </table>

  <div class="footer">
    <span>Generated by JanMitra AI Decision Engine (CIO Formula & 0/1 Knapsack)</span>
    <span>Confidential Municipal Planning Document</span>
  </div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `janmitra-briefing-${Date.now()}.html`;
      a.click();
      window.URL.revokeObjectURL(url);
      setReportStatus({ type: 'success', message: 'Executive Briefing generated & downloaded successfully.' });
      setTimeout(() => setReportStatus(null), 4000);
    } catch (e) {
      console.warn("Report generation error:", e);
      setReportStatus({ type: 'error', message: 'Failed to generate briefing document.' });
      setTimeout(() => setReportStatus(null), 4000);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto pb-24 md:pb-8">
      {/* Inline Feedback Banner for Reports */}
      {reportStatus && (
        <div 
          role="status"
          className={`p-3.5 rounded-xl text-xs font-medium border flex items-center justify-between ${
            reportStatus.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          <span>{reportStatus.message}</span>
          <button 
            type="button" 
            onClick={() => setReportStatus(null)} 
            className="text-slate-400 hover:text-slate-700 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            {t('dashboard.title', 'Constituency Operational Kiosk')}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            {t('dashboard.subtitle', 'Monitor and manage citizen complaints, allocate budgets, and model impacts.')}
          </p>
        </div>
        <div>
          <button 
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            type="button"
            className="btn-primary flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium py-2.5 px-4 rounded-lg shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <IconFileText className="w-4 h-4" />
            <span>{isGeneratingReport ? t('dashboard.generating_pdf', 'Compiling Brief...') : t('dashboard.download_brief', 'Download PDF Docket')}</span>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 animate-stagger">
        <KpiCard
          title={t('dashboard.kpi_complaints', 'Logged Grievances')}
          value={totalComplaints.toLocaleString()}
          subtext="Verified reports"
          icon={IconFileText}
          variant="default"
        />
        <KpiCard
          title={t('dashboard.kpi_critical', 'Critical Priorities')}
          value={rankedClusters.length}
          subtext="Grouped clusters"
          icon={IconIssues}
          variant={criticalIssuesCount > 0 ? "warning" : "default"}
        />
        <KpiCard
          title={t('dashboard.kpi_budget', 'Development Fund')}
          value={`₹${formatCostLakhs(defaultBudget)}`}
          subtext="Allocated budget"
          icon={IconCurrencyRupee}
          variant="highlighted"
        />
        <KpiCard
          title={t('dashboard.allocated_budget_title', 'Selected Projects')}
          value={fundedClusters.length}
          subtext="Click to review planner"
          icon={IconPortfolio}
          variant="highlighted"
          onClick={onNavigateToPortfolio}
        />
        <KpiCard
          title={t('dashboard.kpi_citizens', 'Population Impact')}
          value={totalPeopleImpacted.toLocaleString()}
          subtext="Direct beneficiaries"
          icon={IconUsers}
          variant="success"
        />
      </div>

      {/* CSTE Baseline Panel */}
      <CSTEPanel clusters={clusters} />

      {/* Main 3-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Column 1: Top Priority Issues */}
        <section className="lg:col-span-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col justify-between min-h-[440px]">
          <div>
            <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t('dashboard.priority_queue', 'High-Priority Issues')}
              </h2>
              <Badge variant="navy" size="sm">
                Ranked by Need & Impact
              </Badge>
            </div>

            {rankedClusters.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No active grievance clusters recorded yet.
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[340px] pr-1">
                {rankedClusters.slice(0, 5).map((cluster, index) => {
                  const isCritical = cluster.urgency === 'critical' || (cluster.priority_score && cluster.priority_score > 0.5);
                  return (
                    <button
                      key={cluster.id}
                      onClick={() => onNavigateToIssues(cluster)}
                      type="button"
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200/80 hover:border-need-blue bg-slate-50/50 hover:bg-white transition-all text-left group shadow-2xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0 group-hover:border-need-blue group-hover:text-need-blue transition-colors">
                          <SectorIcon type={cluster.issue_type} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono text-slate-400 font-bold">#{index + 1}</span>
                            <h3 className="text-xs font-bold text-slate-900 truncate group-hover:text-need-blue">
                              {getIssueTitle(cluster)}
                            </h3>
                          </div>
                          <span className="text-xs text-slate-500 block truncate mt-0.5">
                            {cluster.ward} · {cluster.complaint_count || 0} citizen reports
                          </span>
                        </div>
                      </div>

                      <div className="text-right pl-2 flex-shrink-0">
                        <Badge variant={isCritical ? "critical" : "warning"} size="sm" dot>
                          {cluster.priority_score ? cluster.priority_score.toFixed(2) : '0.00'}
                        </Badge>
                        <span className="text-xs text-slate-400 block mt-0.5 font-mono">Score</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2">
            <button
              onClick={() => onNavigateToIssues(rankedClusters[0] || null)}
              type="button"
              className="w-full py-2 px-3 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t('dashboard.view_all_clusters', 'View All Issues')}</span>
              <IconChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Column 2: Constituency Overview Map */}
        <section className="lg:col-span-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col min-h-[440px]">
          <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('wardmap.title', 'Constituency Ward Map')}
            </h2>
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-need-blue" />
              <span className="text-xs text-slate-500">{t('map.gis_intelligence', 'Active Clusters')}</span>
            </div>
          </div>

          <div className="flex-1 rounded-lg overflow-hidden border border-slate-200 min-h-[300px]">
            <MapPanel
              clusters={rankedClusters}
              selectedCluster={null}
              hoveredCluster={null}
              onSelectCluster={onNavigateToIssues}
            />
          </div>
        </section>

        {/* Column 3: Recommended Allocation Summary */}
        <section className="lg:col-span-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col justify-between min-h-[440px]">
          <div>
            <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t('dashboard.allocated_budget_title', 'Recommended Allocation')}
              </h2>
              <Badge variant="success" size="sm" dot>
                {t('dashboard.allocated_budget_sub', 'Budget Optimized')}
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Allocation Progress Bar */}
              <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Committed:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    ₹{formatCostLakhs(totalAllocatedCost)} / ₹{formatCostLakhs(defaultBudget)}
                  </span>
                </div>
                <div 
                  role="progressbar"
                  aria-label="Budget committed"
                  aria-valuenow={Math.round(Math.min(100, (totalAllocatedCost / defaultBudget) * 100))}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden"
                >
                  <div 
                    className="h-full bg-need-blue rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totalAllocatedCost / defaultBudget) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono text-slate-500 pt-0.5 tabular-nums">
                  <span>{((totalAllocatedCost / defaultBudget) * 100).toFixed(0)}% Utilized</span>
                  <span>₹{formatCostLakhs(defaultBudget - totalAllocatedCost)} Remaining</span>
                </div>
              </div>

              {/* Selected Projects List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Top Recommended Interventions
                </span>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {fundedClusters.slice(0, 4).map((c) => (
                    <div key={c.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-50/70 border border-slate-200/70 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <SectorIcon type={c.issue_type} className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                        <span className="font-medium text-slate-800 capitalize truncate max-w-[140px]">
                          {getIssueTitle(c)}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-800 text-xs tabular-nums">
                        ₹{formatCostLakhs(c.estimated_cost_inr)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3">
            <button
              onClick={onNavigateToPortfolio}
              type="button"
              className="btn-primary w-full bg-need-blue hover:bg-need-blue-dark text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors text-center block shadow-2xs cursor-pointer"
            >
              {t('dashboard.open_planner', 'Open Portfolio Planner')}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
