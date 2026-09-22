import { computeRankings, greedyBudgetSelect, knapsackBudgetSelect } from '../priorityEngine.js';
import { CLUSTERS } from '../../../scripts/seedData.js';

function runTests() {
  console.log("Running JanMitra Priority & Optimization Engine Tests...\n");

  const ranked = computeRankings(CLUSTERS);
  
  const rank1 = ranked[0];
  console.log(`Rank #1 Cluster: ${rank1.id} (Score: ${rank1.priority_score.toFixed(3)}, Impact/Rupee: ${rank1.impact_per_rupee.toFixed(3)})`);

  if (rank1.id === "CL_VAR_W7_WATER" || rank1.id === "CL_W7_WATER") {
    console.log("✅ SUCCESS: Ward 7 Water issue is correctly ranked #1 based on high need, recurrence, and cost-effectiveness.");
  } else {
    console.error(`❌ FAILURE: Expected Ward 7 Water to be #1, but got ${rank1.id}`);
  }

  console.log("\nTesting Budget Simulation (₹20L budget)...");
  const budget = 2000000; // 20 Lakhs
  const selectedGreedy = greedyBudgetSelect(ranked, budget);
  const selectedKnapsack = knapsackBudgetSelect(ranked, budget);
  
  const totalCostGreedy = selectedGreedy.reduce((sum, c) => sum + c.estimated_cost_inr, 0);
  console.log(`[Greedy Solver] Selected ${selectedGreedy.length} clusters. Total cost: ₹${totalCostGreedy}`);
  selectedGreedy.forEach(c => {
    console.log(` - [Rank ${c.rank}] ${c.id} (${c.ward} ${c.issue_type}): ₹${c.estimated_cost_inr}`);
  });

  const totalCostKnapsack = selectedKnapsack.reduce((sum, c) => sum + c.estimated_cost_inr, 0);
  console.log(`\n[0/1 Knapsack DP with Ward Equity] Selected ${selectedKnapsack.length} clusters. Total cost: ₹${totalCostKnapsack}`);
  selectedKnapsack.forEach(c => {
    console.log(` - [Rank ${c.rank}] ${c.id} (${c.ward} ${c.issue_type}): ₹${c.estimated_cost_inr}`);
  });

  if (totalCostGreedy <= budget && totalCostKnapsack <= budget) {
    console.log("\n✅ SUCCESS: All selected cluster portfolios strictly fit within the ₹20L budget.");
  } else {
    console.error("\n❌ FAILURE: Selected clusters exceeded budget.");
  }
}

runTests();
