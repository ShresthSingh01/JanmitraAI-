import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import admin from 'firebase-admin';
import fs from 'fs';

import { 
  getEmbedding, 
  extractComplaintWithGemini, 
  explainClusterWithGemini,
  getApiKey
} from './services/geminiService.js';
import { assignToCluster } from './services/clusterService.js';
import { computeBaselineFromClusters } from '../src/scoring/csteEngine.js';
import { VARANASI_WARD_CENTROIDS, LUCKNOW_WARD_CENTROIDS } from '../src/utils/fallbackParser.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin if serviceAccountKey.json is present
const saPath = resolve(__dirname, '../serviceAccountKey.json');
let dbAdmin = null;
if (fs.existsSync(saPath)) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    dbAdmin = admin.firestore();
    console.log("✅ Firebase Admin initialized with service account.");
  } catch (err) {
    console.warn("⚠️ Failed to parse serviceAccountKey.json:", err.message);
  }
} else {
  console.log("ℹ️ Firebase Admin running in demo mode (no serviceAccountKey.json).");
}

const PORT = process.env.PORT || 3001;

// Concurrency lock for Puppeteer to avoid overloading server memory
let isGeneratingPdf = false;

// Health & System Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '2.0.0',
    aiConfigured: !!getApiKey(),
    firebaseAdmin: !!dbAdmin,
    primaryConstituency: 'varanasi',
    supportedConstituencies: ['varanasi', 'lucknow']
  });
});

// Endpoint: Grounded AI Explanation for Selected Project Cluster (Server-side key)
app.post('/api/explain-cluster', async (req, res) => {
  try {
    const { cluster } = req.body;
    if (!cluster) {
      return res.status(400).json({ error: 'Cluster data is required' });
    }
    const result = await explainClusterWithGemini(cluster);
    res.json(result);
  } catch (err) {
    console.error('Explain Cluster Error:', err.message);
    res.status(500).json({ error: 'Failed to generate cluster explanation' });
  }
});

// Endpoint: Generate embedding for raw citizen text (cached / rate-limited)
app.post('/api/embed-complaint', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const embedding = await getEmbedding(text);
    const hasApiKey = !!getApiKey();
    res.json({ isMock: !hasApiKey, embedding });
  } catch (err) {
    console.error('Embedding Endpoint Error:', err.message);
    res.status(500).json({ error: 'Failed to generate embedding' });
  }
});

// Endpoint: AI Extract complaint details from raw citizen text (Hindi / English / Bhojpuri)
app.post('/api/extract-complaint', async (req, res) => {
  try {
    const { text, constituency = 'varanasi' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const extracted = await extractComplaintWithGemini(text, constituency);
    res.json(extracted);
  } catch (err) {
    console.error('Complaint Extraction Error:', err.message);
    res.status(500).json({ error: 'Failed to extract complaint' });
  }
});

// Endpoint: Match or assign a complaint to an existing cluster
app.post('/api/cluster-complaint', async (req, res) => {
  try {
    const { complaint, existingClusters = [] } = req.body;
    if (!complaint) return res.status(400).json({ error: 'Complaint is required' });

    const result = assignToCluster(complaint, existingClusters);
    res.json(result);
  } catch (err) {
    console.error('Clustering Endpoint Error:', err.message);
    res.status(500).json({ error: 'Failed to assign cluster' });
  }
});

// Endpoint: Puppeteer PDF Generation with Concurrency Guard & Robust Template
app.post('/api/generate-report', async (req, res) => {
  if (isGeneratingPdf) {
    return res.status(429).json({ error: 'Another PDF generation is currently in progress. Please retry in 5 seconds.' });
  }

  isGeneratingPdf = true;
  let browser = null;

  try {
    const { reportData } = req.body;
    if (!reportData) {
      isGeneratingPdf = false;
      return res.status(400).json({ error: 'Report data is required' });
    }

    const constituency = (reportData.constituency || 'Varanasi').toUpperCase();
    const totalComplaints = reportData.totalComplaints || 0;
    const activeIssues = reportData.activeIssues || 0;
    const budgetLakhs = reportData.budget ? (reportData.budget / 100000).toFixed(1) : "0";
    const topProjects = reportData.topProjects || [];

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const page = await browser.newPage();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>JanMitra AI Executive Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0f172a; background: #ffffff; }
            .header { border-bottom: 3px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }
            .title { font-size: 24px; font-weight: bold; color: #0f172a; margin: 0; }
            .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
            .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
            .kpis { display: flex; gap: 16px; margin-bottom: 28px; }
            .kpi { flex: 1; padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; }
            .kpi-title { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; }
            .kpi-val { font-size: 22px; font-weight: bold; color: #0f172a; margin-top: 6px; }
            table { width: 100%; border-collapse: collapse; margin-top: 14px; }
            th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
            th { background-color: #f1f5f9; text-transform: uppercase; color: #475569; font-size: 11px; font-weight: 700; }
            .tag { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; text-transform: uppercase; }
            .urgent { background: #fee2e2; color: #b91c1c; font-weight: bold; }
            .footer { margin-top: 36px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="badge">OFFICIAL MPLADS CIVIC BRIEFING</span>
            <h1 class="title">JanMitra AI — ${constituency} Constituency Report</h1>
            <p class="subtitle">Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST) | Evidence-Based Resource Optimization</p>
          </div>
          
          <div class="kpis">
            <div class="kpi">
              <div class="kpi-title">Verified Citizen Reports</div>
              <div class="kpi-val">${totalComplaints}</div>
            </div>
            <div class="kpi">
              <div class="kpi-title">Active Problem Clusters</div>
              <div class="kpi-val">${activeIssues}</div>
            </div>
            <div class="kpi">
              <div class="kpi-title">Simulated Fund Allocation</div>
              <div class="kpi-val">₹${budgetLakhs} Lakhs</div>
            </div>
          </div>
          
          <div>
            <h2 style="font-size: 16px; margin-bottom: 8px; color: #1e293b;">Top Recommended Projects (Grounded Priority Ranking)</h2>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Ward</th>
                  <th>Sector</th>
                  <th>Affected Population</th>
                  <th>Estimated Cost</th>
                  <th>Priority Score</th>
                </tr>
              </thead>
              <tbody>
                ${topProjects.map((p, idx) => `
                  <tr>
                    <td><strong>#${idx + 1}</strong></td>
                    <td>${p.ward || 'Constituency'}</td>
                    <td style="text-transform: capitalize;">${p.issue_type}</td>
                    <td>${p.affected_population ? p.affected_population.toLocaleString() : 'N/A'}</td>
                    <td>₹${p.estimated_cost_inr ? (p.estimated_cost_inr / 100000).toFixed(1) : '0'}L</td>
                    <td class="${p.priority_score > 0.5 ? 'urgent' : ''}">${p.priority_score ? p.priority_score.toFixed(3) : '0.000'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            Confidential MP Decision Kiosk Document &bull; JanMitra AI Civic Intelligence Platform &bull; Anti-Hallucination Grounded Facts Only
          </div>
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 15000 });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
    });
    
    await browser.close();
    browser = null;
    isGeneratingPdf = false;
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="janmitra-constituency-report.pdf"'
    });
    res.send(pdfBuffer);
  } catch (err) {
    if (browser) await browser.close();
    isGeneratingPdf = false;
    console.error('PDF Generation Error:', err.message);
    res.status(500).json({ error: 'Failed to generate PDF report', details: err.message });
  }
});

// Endpoint: Dynamic CSTE State (Evidence-based baseline from benchmarks)
app.post('/api/cste-state', async (req, res) => {
  try {
    const { ward, clusters: clientClusters, constituency = 'varanasi' } = req.body;
    let clusters = clientClusters || [];

    if (clusters.length === 0 && dbAdmin) {
      const snap = await dbAdmin.collection('clusters').get();
      snap.forEach(doc => {
        clusters.push({ id: doc.id, ...doc.data() });
      });
      if (ward && ward !== 'All') {
        clusters = clusters.filter(c => c.ward === ward);
      }
    }

    const baseline = computeBaselineFromClusters(clusters, constituency);

    res.json({
      ward: ward || 'All',
      constituency,
      ...baseline,
      computedAt: Date.now(),
      source: dbAdmin && !clientClusters ? 'firestore' : 'benchmarks-grounded'
    });
  } catch (err) {
    console.error('CSTE State Error:', err.message);
    res.status(500).json({ error: 'Failed to compute CSTE state' });
  }
});

// Endpoint: Save CSTE Simulation Snapshot
app.post('/api/save-cste-snapshot', async (req, res) => {
  try {
    const { budget_inr, funded_cluster_ids, base_state, future_state, constituency_id = 'varanasi' } = req.body;

    const snapshotDoc = {
      timestamp: new Date().toISOString(),
      budget_inr,
      funded_cluster_ids,
      base_state,
      future_state,
      constituency_id
    };

    if (dbAdmin) {
      const docRef = await dbAdmin.collection('cste_snapshots').add(snapshotDoc);
      res.json({ success: true, id: docRef.id });
    } else {
      res.json({ success: true, mock: true, data: snapshotDoc });
    }
  } catch (err) {
    console.error('Save Snapshot Error:', err.message);
    res.status(500).json({ error: 'Failed to save snapshot' });
  }
});

// Endpoint: Geocode Ward with Authentic Varanasi & Lucknow Centroids
app.get('/api/geocode-ward', async (req, res) => {
  try {
    const { ward, constituency = 'varanasi' } = req.query;
    if (!ward) return res.status(400).json({ error: 'Ward is required' });

    const isLucknow = constituency.toLowerCase() === 'lucknow';
    const wardMap = isLucknow ? LUCKNOW_WARD_CENTROIDS : VARANASI_WARD_CENTROIDS;

    // Check local authentic centroid database first
    if (wardMap[ward]) {
      return res.json({
        lat: wardMap[ward].lat,
        lng: wardMap[ward].lng,
        name: wardMap[ward].name,
        source: 'local-gis-database'
      });
    }

    // Check Firestore cache if admin db is initialized
    if (dbAdmin) {
      const cacheQuery = await dbAdmin.collection('ward_coordinates')
        .where('ward', '==', ward)
        .where('constituency', '==', constituency)
        .limit(1)
        .get();

      if (!cacheQuery.empty) {
        const data = cacheQuery.docs[0].data();
        return res.json({ lat: data.lat, lng: data.lng, cached: true });
      }
    }

    // Default fallback to constituency center
    const fallbackCoord = isLucknow
      ? { lat: 26.8467, lng: 80.9462, name: "Lucknow Center" }
      : { lat: 25.3176, lng: 82.9739, name: "Varanasi Center" };

    return res.json({ ...fallbackCoord, source: 'constituency-centroid' });
  } catch (err) {
    console.error('Geocode Error:', err.message);
    res.status(500).json({ error: 'Failed to geocode ward' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 JanMitra AI Express Server running on port ${PORT}`);
});
