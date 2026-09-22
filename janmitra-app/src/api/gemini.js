// Client-side API proxy for cluster explanation
// Zero client-side API keys exposed. All AI operations are securely proxied via backend.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export async function explainClusterPriority(cluster) {
  if (!cluster) {
    return {
      isMock: true,
      narrative: ["No project cluster selected for analysis."]
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/explain-cluster`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cluster })
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.warn("Backend explain-cluster unreachable, using client-side grounded fallback:", err);
  }

  // Anti-Hallucination grounded fallback when backend is unavailable
  const costLakhs = cluster.estimated_cost_inr ? (cluster.estimated_cost_inr / 100000).toFixed(1) : "N/A";
  const pop = cluster.affected_population ? cluster.affected_population.toLocaleString() : "N/A";
  const priority = cluster.priority_score ? cluster.priority_score.toFixed(3) : "N/A";

  return {
    isMock: true,
    narrative: [
      `Rank #${cluster.rank || 1} Priority in ${cluster.ward || 'Constituency'}: Directly addresses critical ${cluster.issue_type || 'civic'} deficits affecting ${pop} residents.`,
      `Service Gap: Nearest facility is ${cluster.nearest_facility_km || 0} km away, backed by ${cluster.complaint_count || 0} registered citizen complaints and local recurrence patterns.`,
      `Cost-Effective Impact: Projected budget of ₹${costLakhs} Lakhs delivers an optimal priority score of ${priority}.`
    ]
  };
}
