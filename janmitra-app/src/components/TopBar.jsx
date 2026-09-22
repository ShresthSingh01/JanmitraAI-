import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconBell, IconCitizen } from '../utils/icons';

export default function TopBar({ 
  notificationCount = 0, 
  currentConstituency = 'varanasi', 
  onConstituencyChange,
  onNavigateToCitizen
}) {
  const { i18n } = useTranslation();
  
  // Format real current date cleanly
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const constituencies = [
    { id: 'varanasi', label: 'Varanasi (UP-77)' },
    { id: 'lucknow', label: 'Lucknow (UP-35)' }
  ];

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  return (
    <header className="bg-white border-b border-slate-200/90 h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Constituency Selector and Date */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <label htmlFor="constituency-select" className="text-xs font-medium text-slate-500">
            Constituency:
          </label>
          <select
            id="constituency-select"
            value={currentConstituency}
            onChange={(e) => onConstituencyChange && onConstituencyChange(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-need-blue cursor-pointer transition-colors"
          >
            {constituencies.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="hidden lg:flex items-center text-xs text-slate-500 border-l border-slate-200 pl-4">
          <span>{todayFormatted}</span>
        </div>
      </div>

      {/* Right-side Controls */}
      <div className="flex items-center gap-2.5 md:gap-3">
        {/* Quick Launch Citizen Portal button */}
        {onNavigateToCitizen && (
          <button
            onClick={onNavigateToCitizen}
            type="button"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-need-blue bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/70 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <IconCitizen className="w-3.5 h-3.5" />
            <span>Citizen Portal</span>
          </button>
        )}

        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200 cursor-pointer"
          aria-label="Toggle language between Hindi and English"
        >
          <span>{i18n.language === 'en' ? 'अ हिन्दी' : 'A English'}</span>
        </button>

        {/* Notification Bell with SVG Icon & Counter */}
        <div className="relative">
          <button 
            type="button"
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200/60"
            aria-label={`Critical priority alerts: ${notificationCount}`}
            title={`${notificationCount} critical issues currently active`}
          >
            <IconBell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-urgent-red text-white text-xs font-bold font-mono rounded-full flex items-center justify-center border-2 border-white tabular-nums">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
