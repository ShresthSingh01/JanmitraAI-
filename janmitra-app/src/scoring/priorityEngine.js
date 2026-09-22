import { WEIGHTS, VULNERABILITY_INDEX, SYNERGY_MATRIX } from './weights.js';

/**
 * Normalizes an array of numeric values to a 0-1 scale.
 */
function normalize(values) {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  if (max === min) return values.map(() => 0.5); // Avoid division by zero
  
  return values.map(val => (val - min) / (max - min));
}

/**
 * Computes priority score and impact-per-rupee for an array of clusters.
 * Ranks them and returns the updated array.
 */
export function computeRankings(clusters, customWeights = WEIGHTS) {
  if (!clusters || clusters.length === 0) return [];

  // 1. Extract values for normalization
  const populations = clusters.map(c => c.affected_population || 0);
  const serviceGaps = clusters.map(c => c.nearest_facility_km || 0);

  // 2. Normalize indicators
  const normPopulations = normalize(populations);
  const normServiceGaps = normalize(serviceGaps);

  // 3. Compute scores
  const scoredClusters = clusters.map((cluster, index) => {
    // Dynamic evidence-based urgency based on verified cluster urgency or domain criticality
    const urgencyWeightMap = { critical: 1.0, urgent: 1.0, moderate: 0.7, low: 0.4 };
    const urgency = cluster.urgency_score 
      || (cluster.urgency ? urgencyWeightMap[cluster.urgency.toLowerCase()] : null)
      || (cluster.issue_type === 'water' || cluster.issue_type === 'health' ? 0.9 : 0.7);

    const affectedGroup = cluster.affected_group 
      || (cluster.issue_type === 'health' ? 'patients' : 
          cluster.issue_type === 'education' ? 'students' : 
          cluster.issue_type === 'road' ? 'commuters' : 'residents');
                          
    const vulnIndex = VULNERABILITY_INDEX[affectedGroup] || VULNERABILITY_INDEX.default || 1.0;

    const popNorm = normPopulations[index];
    const recScore = cluster.recurrence_score || 0;
    const gapNorm = normServiceGaps[index];

    // Need Score = Urgency + Recurrence + Service Gap
    const need_score = 
      (customWeights.w1 * urgency) + 
      (customWeights.w3 * recScore) + 
      (customWeights.w4 * gapNorm);

    // Impact Score = Population + Vulnerability
    const impact_score = 
      (customWeights.w2 * popNorm) + 
      (customWeights.w5 * vulnIndex);

    // Synergy Score: Cross-sector multiplier within the same ward
    let synergy_score = 0;
    const synergyContributors = [];
    
    clusters.forEach(otherCluster => {
      if (otherCluster.id !== cluster.id && otherCluster.ward === cluster.ward) {
        const comboKey = `${cluster.issue_type}+${otherCluster.issue_type}`;
        const bonus = SYNERGY_MATRIX[comboKey] || 0;
        if (bonus > 0) {
          synergy_score += bonus;
          const cType = cluster.issue_type.charAt(0).toUpperCase() + cluster.issue_type.slice(1);
          const oType = otherCluster.issue_type.charAt(0).toUpperCase() + otherCluster.issue_type.slice(1);
          synergyContributors.push(`+${bonus} from ${cType}+${oType} in ${cluster.ward}`);
        }
      }
    });

    const synergy_explanation = synergyContributors.length > 0 
      ? synergyContributors.join(', ') 
      : 'Standard single-sector investment';

    // Prevent division by zero and scale cost to Lakhs INR for clean priority scores
    const safeCost = (cluster.estimated_cost_inr && cluster.estimated_cost_inr > 0) ? cluster.estimated_cost_inr : 500000;
    const cost_lakhs = safeCost / 100000;

    // CIO Formula: Decision Score = (Need * Impact * (1 + Synergy)) / Cost(Lakhs)
    const base_score = need_score * impact_score * (1 + synergy_score);
    const priority_score = base_score / cost_lakhs;

    return {
      ...cluster,
      estimated_cost_inr: safeCost,
      urgency: cluster.urgency || (urgency >= 0.85 ? 'critical' : urgency >= 0.6 ? 'moderate' : 'low'),
      need_score,
      impact_score,
      synergy_score,
      synergy_explanation,
      priority_score,
      impact_per_rupee: priority_score
    };
  });

  // 4. Sort by Impact Per Rupee descending
  scoredClusters.sort((a, b) => b.impact_per_rupee - a.impact_per_rupee);

  // 5. Assign ranks
  return scoredClusters.map((cluster, index) => ({
    ...cluster,
    rank: index + 1
  }));
}

/**
 * Budget Simulation: Greedy selection with optional Ward Equity enforcement.
 * Backwards compatible with legacy calls.
 */
export function greedyBudgetSelect(rankedClusters, budgetInr, maxWardShare = 0.45) {
  let remainingBudget = budgetInr;
  const selected = [];
  const wardSpend = {};

  const maxPerWard = budgetInr * maxWardShare;

  for (const cluster of rankedClusters) {
    const cost = cluster.estimated_cost_inr;
    if (cost <= remainingBudget) {
      const ward = cluster.ward || 'General';
      const currentWardSpend = wardSpend[ward] || 0;

      // Allow if within equity limit or if only 1-2 clusters exist in total
      if (currentWardSpend + cost <= maxPerWard || rankedClusters.length <= 4) {
        selected.push(cluster);
        remainingBudget -= cost;
        wardSpend[ward] = currentWardSpend + cost;
      }
    }
  }

  // If budget remains and some items were skipped purely due to equity cap, fill available budget
  if (remainingBudget > 0) {
    for (const cluster of rankedClusters) {
      if (!selected.some(s => s.id === cluster.id) && cluster.estimated_cost_inr <= remainingBudget) {
        selected.push(cluster);
        remainingBudget -= cluster.estimated_cost_inr;
      }
    }
  }

  return selected;
}

/**
 * Advanced Dynamic Programming 0/1 Knapsack Optimizer
 * Strictly maximizes total civic impact while respecting budget and regional equity.
 */
export function knapsackBudgetSelect(rankedClusters, budgetInr, maxWardShare = 0.40) {
  if (!rankedClusters || rankedClusters.length === 0 || budgetInr <= 0) return [];

  // Granularity for DP table: 50,000 INR steps to keep memory and computation optimal (O(N * W))
  const STEP = 50000;
  const maxCapacity = Math.floor(budgetInr / STEP);
  const n = rankedClusters.length;

  if (maxCapacity <= 0) return [];

  // Weights (scaled costs) and values (scaled impact score * 1000)
  const weights = rankedClusters.map(c => Math.max(1, Math.round(c.estimated_cost_inr / STEP)));
  const values = rankedClusters.map(c => Math.round((c.priority_score || 1) * 1000));

  // DP table: dp[i][w] = max value using subset of first i items with capacity w
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(maxCapacity + 1));

  for (let i = 1; i <= n; i++) {
    const wt = weights[i - 1];
    const val = values[i - 1];
    for (let w = 0; w <= maxCapacity; w++) {
      if (wt <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - wt] + val);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find selected items
  let remainingCap = maxCapacity;
  const selectedIndices = [];
  for (let i = n; i > 0 && remainingCap > 0; i--) {
    if (dp[i][remainingCap] !== dp[i - 1][remainingCap]) {
      selectedIndices.push(i - 1);
      remainingCap -= weights[i - 1];
    }
  }

  const optimalSelection = selectedIndices.map(idx => rankedClusters[idx]);

  // If equity check passes, return optimal; otherwise fallback to greedy with equity
  const wardSpend = {};
  const maxPerWard = budgetInr * maxWardShare;
  let equitySatisfied = true;

  for (const c of optimalSelection) {
    const w = c.ward || 'General';
    wardSpend[w] = (wardSpend[w] || 0) + c.estimated_cost_inr;
    if (wardSpend[w] > maxPerWard && rankedClusters.length > 5) {
      equitySatisfied = false;
      break;
    }
  }

  if (equitySatisfied) {
    return optimalSelection;
  }

  return greedyBudgetSelect(rankedClusters, budgetInr, maxWardShare);
}
