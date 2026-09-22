import { db } from '../firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getSmartFallback } from '../utils/fallbackParser';

export async function submitCitizenComplaint(rawText, language = 'hi', constituency = 'varanasi') {
  try {
    // 1. Call Backend AI Extraction
    let extractedData;
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/api/extract-complaint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText, constituency })
      });

      if (response.ok) {
        extractedData = await response.json();
      } else {
        extractedData = getSmartFallback(rawText, constituency);
      }
    } catch {
      extractedData = getSmartFallback(rawText, constituency);
    }

    const complaintDoc = {
      id: `C${Date.now().toString().slice(-4)}`,
      raw_text: rawText,
      language,
      constituency,
      extracted: {
        issue_type: extractedData.issue_type,
        location: extractedData.location,
        urgency: extractedData.urgency,
        affected_group: extractedData.affected_group,
        severity_rationale: extractedData.severity_rationale
      },
      cluster_id: extractedData.cluster_id,
      timestamp: new Date().toISOString()
    };

    // 2. Persist to Firestore if configured
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const isFirebaseValid = projectId && !projectId.includes("YOUR_");

    if (isFirebaseValid) {
      try {
        await addDoc(collection(db, 'complaints'), complaintDoc);
        
        // Update Cluster in Firestore
        const clusterRef = doc(db, 'clusters', extractedData.cluster_id);
        const clusterSnap = await getDoc(clusterRef);
        
        if (clusterSnap.exists()) {
          const currentCluster = clusterSnap.data();
          const prevCount = currentCluster.complaint_count || 10;
          await updateDoc(clusterRef, {
            complaint_count: prevCount + 1,
            recurrence_score: Math.min(1.0, (currentCluster.recurrence_score || 0.5) + 0.05)
          });
        }
      } catch (dbErr) {
        console.warn("Firestore write failed, using local persistence:", dbErr.message);
      }
    }

    // Always update local cache so dashboard immediately reflects the new complaint
    try {
      const localComplaints = JSON.parse(localStorage.getItem('jm_complaints') || '[]');
      localComplaints.unshift(complaintDoc);
      localStorage.setItem('jm_complaints', JSON.stringify(localComplaints.slice(0, 100)));

      // Increment cluster count in localStorage clusters and notify App
      const localClusters = JSON.parse(localStorage.getItem('janmitra_clusters') || '[]');
      const matched = localClusters.find(c => c.id === extractedData.cluster_id || (c.ward === extractedData.location?.ward && c.issue_type === extractedData.issue_type));
      if (matched) {
        matched.complaint_count = (matched.complaint_count || 0) + 1;
        matched.recurrence_score = Math.min(1.0, (matched.recurrence_score || 0.5) + 0.04);
        localStorage.setItem('janmitra_clusters', JSON.stringify(localClusters));
        window.dispatchEvent(new Event('janmitra_clusters_updated'));
      }
    } catch (e) {
      console.warn("Local storage update error:", e);
    }

    return {
      success: true,
      complaint: complaintDoc,
      extracted: extractedData
    };
  } catch (error) {
    console.error("Error submitting complaint:", error);
    return {
      success: false,
      error: error.message
    };
  }
}
