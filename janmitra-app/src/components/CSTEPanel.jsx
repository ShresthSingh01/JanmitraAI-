import React, { useMemo } from 'react';
import { computeBaselineFromClusters } from '../scoring/csteEngine';
import { IconWater, IconHealth, IconEducation, IconRoad } from '../utils/icons';

export default function CSTEPanel({ clusters }) {
  const baseState = useMemo(() => computeBaselineFromClusters(clusters), [clusters]);

  const metrics = [
    {
      id: 'water',
      label: 'Water Coverage',
      value: baseState.waterCoverage,
      icon: IconWater,
      unit: '%',
      inverse: false
    },
    {
      id: 'health',
      label: 'Healthcare Access',
      value: baseState.healthcareAccess,
      icon: IconHealth,
      unit: '%',
      inverse: false
    },
    {
      id: 'education',
      label: 'School Attendance',
      value: baseState.schoolAttendance,
      icon: IconEducation,
      unit: '%',
      inverse: false
    },
    {
      id: 'distance',
      label: 'Facility Proximity',
      value: baseState.facilityDistance,
      icon: IconRoad,
      unit: 'km',
      inverse: true // lower distance is better
    }
  ];

  // Threshold color evaluator
  const getThresholdColor = (percent) => {
    if (percent >= 70) return 'bg-emerald-500';
    if (percent >= 45) return 'bg-amber-500';
    return 'bg-urgent-red';
  };

  const getStatusText = (percent) => {
    if (percent >= 70) return 'Optimal';
    if (percent >= 45) return 'Moderate';
    return 'Critical Gap';
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs mb-6">
      {/* Panel Header */}
      <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Civic Infrastructure & Service Coverage
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <span>Constituency Baseline</span>
        </div>
      </div>

      {/* 4 Health Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {metrics.map((m) => {
          const Icon = m.icon;
          // Normalize score to 0-100 percentage for the bar
          let normalized = m.value;
          if (m.inverse) {
            // For distance, 1.5km or lower = 100%, 7km = 0%
            normalized = Math.max(10, Math.min(100, Math.round(100 - (m.value - 1) * 15)));
          }

          const barColor = getThresholdColor(normalized);
          const statusText = getStatusText(normalized);

          return (
            <div key={m.id} className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/90 flex items-center justify-center text-slate-700 shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 leading-tight">{m.label}</span>
                  </div>
                  <span className="text-base font-mono font-bold text-slate-900 tabular-nums">
                    {m.value}{m.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
                  <span>Status</span>
                  <span className="font-medium text-slate-700">{statusText}</span>
                </div>
              </div>

              {/* Accessible Threshold Indicator Bar */}
              <div 
                role="progressbar"
                aria-label={`${m.label} coverage`}
                aria-valuenow={normalized}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden"
              >
                <div 
                  className={`h-full ${barColor} transition-all duration-700 ease-out rounded-full`}
                  style={{ width: `${normalized}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
