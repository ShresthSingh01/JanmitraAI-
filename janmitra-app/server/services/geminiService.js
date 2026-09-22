// Server-Side Gemini AI Service
// Features: Rate limiting (15 RPM free tier guard), in-memory TTL caching,
// dynamic multilingual extraction, and grounded cluster explanations.

import { getSmartFallback, VARANASI_WARD_CENTROIDS, LUCKNOW_WARD_CENTROIDS } from '../../src/utils/fallbackParser.js';

class RateLimiter {
  constructor(maxTokens = 15, refillIntervalMs = 60000) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillIntervalMs = refillIntervalMs;
    this.lastRefill = Date.now();
  }

  tryConsume() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    if (elapsed > this.refillIntervalMs) {
      this.tokens = this.maxTokens;
      this.lastRefill = now;
    }
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }
}

// 15 requests per minute rate limiter for free tier safety
const geminiRateLimiter = new RateLimiter(15, 60000);

// In-memory cache for cluster explanations (10 minutes TTL)
const explanationCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

export function getApiKey() {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  if (!key || key === 'YOUR_GEMINI_API_KEY' || key.includes('YOUR_')) {
    return null;
  }
  return key;
}

/**
 * Generate embedding vector using text-embedding-004
 */
export async function getEmbedding(text) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return new Array(768).fill(0);
  }

  if (!geminiRateLimiter.tryConsume()) {
    console.warn("⚠️ Rate limit reached for Gemini free tier (15 RPM). Using neutral embedding vector.");
    return new Array(768).fill(0);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text }] }
        })
      }
    );

    const data = await response.json();
    if (data.error) {
      console.error("🔴 Gemini Embedding Error:", data.error.message);
      return new Array(768).fill(0);
    }
    return data.embedding?.values || new Array(768).fill(0);
  } catch (err) {
    console.error("Gemini Embedding network error:", err.message);
    return new Array(768).fill(0);
  }
}

/**
 * Dynamic Extraction from raw citizen text (Hindi/English/Bhojpuri)
 */
export async function extractComplaintWithGemini(text, constituency = 'varanasi') {
  const apiKey = getApiKey();
  const fallback = getSmartFallback(text, constituency);

  if (!apiKey) {
    console.log("// INFO: Gemini API key not configured. Using grounded smart fallback parser.");
    const embedding = await getEmbedding(text);
    return { ...fallback, embedding };
  }

  if (!geminiRateLimiter.tryConsume()) {
    console.warn("⚠️ Free tier rate limit reached. Using smart fallback extraction.");
    const embedding = await getEmbedding(text);
    return { ...fallback, embedding, rateLimited: true };
  }

  const wardCentroids = constituency.toLowerCase() === 'lucknow' ? LUCKNOW_WARD_CENTROIDS : VARANASI_WARD_CENTROIDS;
  const knownWards = Object.keys(wardCentroids).join(', ');

  const promptText = `You are an expert AI civic triage officer for the ${constituency} parliamentary constituency in India.
Analyze this citizen complaint (which may be in Hindi, Bhojpuri, or English):
"${text}"

Extract structured civic intelligence in STRICT JSON format:
{
  "issue_type": "water" | "road" | "health" | "education" | "sanitation" | "drainage" | "electricity" | "streetlight" | "public_toilet" | "temple_ghat" | "bridge" | "park" | "other",
  "ward": "Ward 1" to "Ward 12" (or best match from: ${knownWards}),
  "locality": "Locality or landmark mentioned (e.g. Assi, Sigra, Lanka, BHU, Sarnath) or the ward name",
  "urgency": "critical" | "moderate" | "low",
  "affected_group": "residents" | "commuters" | "patients" | "students" | "pilgrims & locals" | "shopkeepers",
  "severity_rationale": "1 brief sentence explaining the risk or urgency factor"
}
Return valid JSON only. No explanations outside JSON.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    const data = await response.json();
    if (data.error) {
      console.warn("Gemini API returned error:", data.error.message);
      const embedding = await getEmbedding(text);
      return { ...fallback, embedding, apiError: data.error.message };
    }

    const rawOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawOutput);

    const wardName = parsed.ward && wardCentroids[parsed.ward] ? parsed.ward : fallback.location.ward;
    const wardCoord = wardCentroids[wardName] || fallback.location;
    const prefix = constituency.toLowerCase() === 'lucknow' ? 'LKO' : 'VAR';
    const cleanType = (parsed.issue_type || fallback.issue_type).toLowerCase();
    const cluster_id = `CL_${prefix}_${wardName.replace(/\s+/g, '')}_${cleanType.toUpperCase()}`;

    const embedding = await getEmbedding(text);

    return {
      isMock: false,
      issue_type: cleanType,
      location: {
        lat: wardCoord.lat,
        lng: wardCoord.lng,
        ward: wardName,
        locality: parsed.locality || wardCoord.name || wardName
      },
      urgency: parsed.urgency || fallback.urgency,
      affected_group: parsed.affected_group || fallback.affected_group,
      severity_rationale: parsed.severity_rationale || fallback.severity_rationale,
      cluster_id,
      embedding
    };
  } catch (err) {
    console.error("Gemini dynamic extraction failed:", err.message);
    const embedding = await getEmbedding(text);
    return { ...fallback, embedding };
  }
}

/**
 * Server-Side Grounded Cluster Priority Explanation
 * Strictly adheres to anti-hallucination rules and caches narratives.
 */
export async function explainClusterWithGemini(cluster) {
  if (!cluster || !cluster.id) {
    return {
      isMock: true,
      narrative: ["No project cluster selected for analysis."]
    };
  }

  // Check TTL cache to avoid repeating identical calls
  const cacheKey = `${cluster.id}_${cluster.priority_score}_${cluster.complaint_count}`;
  const cached = explanationCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return {
      isMock: cached.isMock,
      narrative: cached.narrative,
      cached: true
    };
  }

  const costLakhs = cluster.estimated_cost_inr ? (cluster.estimated_cost_inr / 100000).toFixed(1) : "N/A";
  const pop = cluster.affected_population ? cluster.affected_population.toLocaleString() : "N/A";
  const priority = cluster.priority_score ? cluster.priority_score.toFixed(3) : "N/A";

  const fallbackNarrative = [
    `Rank #${cluster.rank || 1} Priority in ${cluster.ward || 'Constituency'}: Directly addresses ${cluster.issue_type || 'civic'} deficits affecting ${pop} residents.`,
    `Service Gap: Nearest facility is ${cluster.nearest_facility_km || 0} km away, corroborated by ${cluster.complaint_count || 0} registered citizen complaints.`,
    `Cost-Effective Impact: Budget requirement of ₹${costLakhs} Lakhs delivers an optimal priority score of ${priority}.`
  ];

  const apiKey = getApiKey();
  if (!apiKey || !geminiRateLimiter.tryConsume()) {
    const result = { isMock: true, narrative: fallbackNarrative };
    explanationCache.set(cacheKey, { ...result, timestamp: Date.now() });
    return result;
  }

  const evidenceBullets = [
    `Rank Position: #${cluster.rank || 1}`,
    `Ward: ${cluster.ward}`,
    `Issue Type: ${cluster.issue_type}`,
    `Affected Population: ${pop} residents`,
    `Service Gap (Nearest Facility): ${cluster.nearest_facility_km} km`,
    `Historical Complaints Logged: ${cluster.complaint_count}`,
    `Recurrence Score: ${cluster.recurrence_score}`,
    `Estimated Cost: ₹${costLakhs} Lakhs`,
    `Priority Score: ${priority}`,
    ...(cluster.public_evidence || [])
  ];

  const promptText = `You are an executive civic advisor to a Member of Parliament reviewing constituency development projects.
Here are the pre-computed, verified facts for a project cluster:

${evidenceBullets.map(b => `- ${b}`).join('\n')}

Narrate these facts in 3 crisp, plain language bullet points for the MP.
Rules:
1. Ground every statement strictly in the numbers above.
2. Do NOT invent or estimate any number not provided above.
3. Keep tone objective, executive, and decisive.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      }
    );

    const data = await response.json();
    if (data.error) {
      console.warn("Gemini explanation error:", data.error.message);
      const result = { isMock: true, narrative: fallbackNarrative };
      explanationCache.set(cacheKey, { ...result, timestamp: Date.now() });
      return result;
    }

    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const lines = (generatedText || '')
      .split('\n')
      .map(l => l.replace(/^[-*•\d.\s]+/, '').trim())
      .filter(l => l.length > 0);

    const result = {
      isMock: false,
      narrative: lines.length > 0 ? lines : fallbackNarrative
    };

    explanationCache.set(cacheKey, { ...result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.error("Gemini explanation call failed:", err.message);
    const result = { isMock: true, narrative: fallbackNarrative };
    explanationCache.set(cacheKey, { ...result, timestamp: Date.now() });
    return result;
  }
}
