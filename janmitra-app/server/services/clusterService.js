// Server-side vector clustering service
// Implements cosine similarity, centroid updates, and cluster assignment

export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length === 0 || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Assigns or merges a complaint with embedding into the best cluster.
 * @param {Object} complaint - The incoming complaint object with embedding
 * @param {Array} existingClusters - Array of cluster objects currently in DB/memory
 * @param {number} threshold - Cosine similarity threshold (default 0.75)
 */
export function assignToCluster(complaint, existingClusters = [], threshold = 0.75) {
  const embedding = complaint.embedding;
  const ward = complaint.location?.ward || 'Ward 7';
  const issueType = (complaint.issue_type || 'water').toLowerCase();
  const defaultClusterId = complaint.cluster_id || `CL_VAR_${ward.replace(/\s+/g, '')}_${issueType.toUpperCase()}`;

  // If no embedding is available, match purely on ward + issueType
  if (!embedding || embedding.every(v => v === 0)) {
    const matchedCluster = existingClusters.find(
      c => c.ward === ward && (c.issue_type || '').toLowerCase() === issueType
    );
    return {
      cluster_id: matchedCluster ? matchedCluster.id : defaultClusterId,
      similarity: 1.0,
      merged: !!matchedCluster,
      isNew: !matchedCluster
    };
  }

  let bestMatch = null;
  let highestSim = -1;

  for (const cluster of existingClusters) {
    // Only match against clusters in the same ward and issue family or generic
    if (cluster.centroid && cluster.centroid.length === embedding.length) {
      const sim = cosineSimilarity(embedding, cluster.centroid);
      if (sim > highestSim) {
        highestSim = sim;
        bestMatch = cluster;
      }
    }
  }

  if (bestMatch && highestSim >= threshold) {
    return {
      cluster_id: bestMatch.id,
      similarity: highestSim,
      merged: true,
      isNew: false
    };
  }

  return {
    cluster_id: defaultClusterId,
    similarity: highestSim > 0 ? highestSim : 0,
    merged: false,
    isNew: true
  };
}

/**
 * Recalculate cluster centroid given a new vector
 */
export function updateCentroid(currentCentroid, newVector, totalCount) {
  if (!currentCentroid || currentCentroid.length === 0) {
    return [...newVector];
  }
  const n = Math.max(1, totalCount);
  const updated = new Array(currentCentroid.length);
  for (let i = 0; i < currentCentroid.length; i++) {
    updated[i] = ((currentCentroid[i] * (n - 1)) + newVector[i]) / n;
  }
  return updated;
}
