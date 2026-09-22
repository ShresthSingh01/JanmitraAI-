/**
 * Constituency State Transition Engine (CSTE) - Evidence-Based Digital Twin
 * Grounded in real Indian government benchmarks (JJM, UDISE+, NFHS-5).
 * Simulates before-and-after civic outcomes based on funded project portfolio.
 */

import { DISTRICT_BASELINES } from './benchmarks.js';

/**
 * Computes baseline state by anchoring to official district indicators
 * and modulating by actual open citizen complaint clusters.
 */
export function computeBaselineFromClusters(clusters = [], constituency = 'varanasi') {
  const districtKey = constituency?.toLowerCase() === 'lucknow' ? 'lucknow' : 'varanasi';
  const baseline = DISTRICT_BASELINES[districtKey] || DISTRICT_BASELINES.varanasi;

  if (!clusters || clusters.length === 0) {
    return {
      waterCoverage: baseline.waterCoverage,
      schoolAttendance: baseline.schoolAttendance,
      healthcareAccess: baseline.healthcareAccess,
      facilityDistance: baseline.avgFacilityDistance,
      benchmarkSource: baseline.sources
    };
  }

  // Filter clusters by civic domain
  const waterClusters = clusters.filter(c => c.issue_type === 'water' || c.issue_type === 'drainage');
  const healthClusters = clusters.filter(c => c.issue_type === 'health');
  const educationClusters = clusters.filter(c => c.issue_type === 'education');
  const facilityClusters = [...healthClusters, ...educationClusters];

  // 1. Water Coverage: Starts from JJM FHTC baseline, modulated by active complaint density
  let waterCoverage = baseline.waterCoverage;
  if (waterClusters.length > 0) {
    const avgRecurrence = waterClusters.reduce((sum, c) => sum + (c.recurrence_score || 0.5), 0) / waterClusters.length;
    const totalAffected = waterClusters.reduce((sum, c) => sum + (c.affected_population || 5000), 0);
    const impactPenalty = Math.min(18, (avgRecurrence * 10) + (totalAffected / baseline.totalPopulation * 100));
    waterCoverage = Math.max(30, baseline.waterCoverage - impactPenalty);
  }

  // 2. School Attendance: Starts from UDISE+ baseline, adjusted for school infrastructure deficits
  let schoolAttendance = baseline.schoolAttendance;
  if (educationClusters.length > 0) {
    const sumComplaints = educationClusters.reduce((sum, c) => sum + (c.complaint_count || 5), 0);
    const avgRecurrence = educationClusters.reduce((sum, c) => sum + (c.recurrence_score || 0.5), 0) / educationClusters.length;
    const penalty = Math.min(15, (sumComplaints * 0.12) + (avgRecurrence * 6));
    schoolAttendance = Math.max(40, baseline.schoolAttendance - penalty);
  }

  // 3. Healthcare Access: Starts from NFHS-5 baseline, adjusted for PHC shortage
  let healthcareAccess = baseline.healthcareAccess;
  if (healthClusters.length > 0) {
    const avgRecurrence = healthClusters.reduce((sum, c) => sum + (c.recurrence_score || 0.5), 0) / healthClusters.length;
    const penalty = Math.min(20, avgRecurrence * 16);
    healthcareAccess = Math.max(35, baseline.healthcareAccess - penalty);
  }

  // 4. Facility Distance: Weighted average of nearest facility distances from GIS
  let facilityDistance = baseline.avgFacilityDistance;
  if (facilityClusters.length > 0) {
    const totalWeight = facilityClusters.reduce((sum, c) => sum + (c.complaint_count || 1), 0);
    const weightedSum = facilityClusters.reduce((sum, c) => sum + ((c.nearest_facility_km || baseline.avgFacilityDistance) * (c.complaint_count || 1)), 0);
    facilityDistance = totalWeight > 0 ? (weightedSum / totalWeight) : baseline.avgFacilityDistance;
  }

  return {
    waterCoverage: parseFloat(waterCoverage.toFixed(1)),
    schoolAttendance: parseFloat(schoolAttendance.toFixed(1)),
    healthcareAccess: parseFloat(healthcareAccess.toFixed(1)),
    facilityDistance: parseFloat(facilityDistance.toFixed(2)),
    benchmarkSource: baseline.sources
  };
}

/**
 * Simulates the future state after implementing the funded project portfolio.
 */
export function simulateCSTE(fundedClusters = [], allClusters = [], constituency = 'varanasi') {
  const districtKey = constituency?.toLowerCase() === 'lucknow' ? 'lucknow' : 'varanasi';
  const baselineConfig = DISTRICT_BASELINES[districtKey] || DISTRICT_BASELINES.varanasi;
  const baseState = computeBaselineFromClusters(allClusters, constituency);
  const futureState = { ...baseState };

  // Calculate infrastructure connectivity multiplier from road & drainage works
  let roadConnectivityBonus = 0;
  fundedClusters.forEach(cluster => {
    if (cluster.issue_type === 'road' || cluster.issue_type === 'bridge') {
      const popRatio = (cluster.affected_population || 10000) / baselineConfig.totalPopulation;
      const recFactor = cluster.recurrence_score || 0.5;
      roadConnectivityBonus += (4.5 * popRatio * 20 * recFactor);
      
      // Road repair directly cuts emergency travel distance
      futureState.facilityDistance = Math.max(1.2, futureState.facilityDistance - (0.45 * recFactor));
    }
  });

  // Calculate domain improvements from funded projects
  fundedClusters.forEach(cluster => {
    const popRatio = (cluster.affected_population || 10000) / baselineConfig.totalPopulation;
    const recFactor = cluster.recurrence_score || 0.5;

    switch (cluster.issue_type) {
      case 'water': {
        // Impact scales with population resolved and recurrence eliminated
        const waterGain = Math.min(18, (popRatio * 180) + (recFactor * 4.2));
        futureState.waterCoverage = Math.min(99.5, futureState.waterCoverage + waterGain);
        break;
      }
      case 'education': {
        const eduGain = Math.min(14, (popRatio * 140) + (recFactor * 3.5) + roadConnectivityBonus);
        futureState.schoolAttendance = Math.min(98.5, futureState.schoolAttendance + eduGain);
        break;
      }
      case 'health': {
        const healthGain = Math.min(22, (popRatio * 160) + (recFactor * 5.0) + (roadConnectivityBonus * 1.2));
        futureState.healthcareAccess = Math.min(97.0, futureState.healthcareAccess + healthGain);
        futureState.facilityDistance = Math.max(1.0, futureState.facilityDistance - (0.35 * recFactor));
        break;
      }
      case 'drainage':
      case 'sanitation': {
        // Sanitation directly protects water quality and eliminates water-borne disease
        const sanitGain = Math.min(8, (popRatio * 90) + 1.8);
        futureState.waterCoverage = Math.min(99.0, futureState.waterCoverage + (sanitGain * 0.5));
        futureState.healthcareAccess = Math.min(97.0, futureState.healthcareAccess + (sanitGain * 0.7));
        break;
      }
      default:
        break;
    }
  });

  futureState.waterCoverage = parseFloat(futureState.waterCoverage.toFixed(1));
  futureState.schoolAttendance = parseFloat(futureState.schoolAttendance.toFixed(1));
  futureState.healthcareAccess = parseFloat(futureState.healthcareAccess.toFixed(1));
  futureState.facilityDistance = parseFloat(futureState.facilityDistance.toFixed(2));

  return {
    baseState,
    futureState,
    improvements: {
      waterDelta: parseFloat((futureState.waterCoverage - baseState.waterCoverage).toFixed(1)),
      educationDelta: parseFloat((futureState.schoolAttendance - baseState.schoolAttendance).toFixed(1)),
      healthDelta: parseFloat((futureState.healthcareAccess - baseState.healthcareAccess).toFixed(1)),
      distanceDelta: parseFloat((baseState.facilityDistance - futureState.facilityDistance).toFixed(2))
    },
    computedAt: Date.now()
  };
}
