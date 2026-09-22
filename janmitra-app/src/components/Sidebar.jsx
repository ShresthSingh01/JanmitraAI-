import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  IconHome, 
  IconAnalytics, 
  IconIssues, 
  IconPortfolio, 
  IconSimulator, 
  IconMap, 
  IconCitizen 
} from '../utils/icons';

export default function Sidebar({ activeView, onViewChange, currentConstituency = 'varanasi' }) {
  const { t } = useTranslation();

  // Clean Navigation Structure
  const NAV_SECTIONS = [
    {
      heading: t('sidebar.overview', 'Overview'),
      items: [
        { id: 'home', label: t('sidebar.home', 'Home'), icon: IconHome },
        { id: 'analytics', label: t('sidebar.analytics', 'Analytics'), icon: IconAnalytics }
      ]
    },
    {
      heading: t('sidebar.operations', 'Planning & Allocations'),
      items: [
        { id: 'issues', label: t('sidebar.issues', 'Issues & Clusters'), icon: IconIssues },
        { id: 'portfolio', label: t('sidebar.planner', 'Portfolio Planner'), icon: IconPortfolio },
        { id: 'simulator', label: t('sidebar.simulator', 'Budget Simulator'), icon: IconSimulator }
      ]
    },
    {
      heading: t('sidebar.field', 'Constituency & Community'),
      items: [
        { id: 'wardmap', label: t('sidebar.map', 'Ward Map'), icon: IconMap },
        { id: 'citizen', label: t('sidebar.kiosk', 'Citizen Portal'), icon: IconCitizen }
      ]
    }
  ];

  // Mobile Bottom Bar (5 Primary Views)
  const MOBILE_ITEMS = [
    { id: 'home', label: t('sidebar.home', 'Home'), icon: IconHome },
    { id: 'issues', label: t('sidebar.issues', 'Issues'), icon: IconIssues },
    { id: 'portfolio', label: t('sidebar.planner', 'Portfolio'), icon: IconPortfolio },
    { id: 'wardmap', label: t('sidebar.map', 'Ward Map'), icon: IconMap },
    { id: 'citizen', label: t('sidebar.kiosk', 'Citizen'), icon: IconCitizen }
  ];

  const constituencyNames = {
    varanasi: "Varanasi (UP-77)",
    lucknow: "Lucknow (UP-35)",
    amethi: "Amethi (UP-37)"
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white text-slate-700 h-screen sticky top-0 flex-shrink-0 border-r border-slate-200/90 z-20 select-none shadow-2xs">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-white text-xs tracking-wider shadow-xs">
            JM
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-slate-900 tracking-tight text-sm leading-tight">
              JanMitra
            </h1>
            <span className="text-xs text-slate-500 block mt-0.5 font-medium">
              Civic Operations
            </span>
          </div>
        </div>

        {/* Menu Navigation with Groups */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto" aria-label="Main Navigation">
          {NAV_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {section.heading}
              </div>
              {section.items.map((item) => {
                const isActive = activeView === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-blue-50/90 text-need-blue font-semibold border-l-2 border-need-blue pl-2.5 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-need-blue' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Constituency Footer Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="p-2.5 rounded-lg border border-slate-200/80 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Constituency
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active"></span>
            </div>
            <p className="text-xs font-medium text-slate-800 mt-1 truncate">
              {constituencyNames[currentConstituency.toLowerCase()] || currentConstituency}
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-50 px-2 shadow-sm" aria-label="Mobile Navigation">
        {MOBILE_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-colors ${
                isActive ? 'text-need-blue font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5 flex-shrink-0" />
              <span className="text-xs tracking-tight truncate max-w-full">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
