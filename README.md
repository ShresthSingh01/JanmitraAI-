<div align="center">

# 🇮🇳 JanMitra AI (जनमित्र AI)
### *Next-Generation Civic Intelligence & Evidence-Based Resource Optimization for Indian Constituencies*

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js & Express 5](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Google Gemini 2.5 Flash](https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Firebase Firestore](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Leaflet GIS](https://img.shields.io/badge/GIS-Leaflet_1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <b>Bridging the ₹5-Crore MPLADS Gap: Transforming unstructured citizen grievances in Hindi, Bhojpuri, and English into mathematically optimal, equitable, and cross-sectoral civic development portfolios.</b>
</p>

[Why JanMitra AI?](#-the-big-picture-why-janmitra-ai) •
[Core Innovations](#-core-innovations) •
[Platform Walkthrough](#-platform-walkthrough) •
[How Prioritization Works](#-how-prioritization-works) •
[System Architecture](#-system-architecture) •
[GIS & Constituencies](#-geographic-gis-coverage) •
[Zero-Crash Resilience](#-zero-crash-resilience) •
[Quick Start](#-quick-start-guide) •
[Deployment](#-deployment-options)

---

</div>

## 🧭 The Big Picture: Why JanMitra AI?

India is home to **543 Lok Sabha parliamentary constituencies** and over **4,120 Vidhan Sabha assembly constituencies**, representing 1.4 billion citizens. Under the **MPLADS** (Member of Parliament Local Area Development Scheme), each Member of Parliament is allocated **₹5 Crore (~$600,000 USD) annually** to execute local community projects.

Despite these substantial funds, elected representatives and district administrations face four major operational bottlenecks:

| Challenge | What Happens Today | How JanMitra AI Solves It |
| :--- | :--- | :--- |
| **Unstructured Influx** | Over 85% of complaints arrive on physical registers (*Jan Sunwai*), WhatsApp, or verbal petitions in vernacular languages (Hindi, Bhojpuri, Hinglish). | **Gemini 2.5 Flash** instantly extracts the ward, sector, urgency, and affected population from conversational vernacular text. |
| **Siloed Execution** | Water (Jal Nigam), road paving (PWD), and sanitation departments work in isolation, causing newly paved roads to be dug up weeks later for water pipelines. | **Cross-Sector Synergy Engine** identifies co-located projects in the same ward to coordinate civil works and eliminate redundant expenditure. |
| **Biased Allocation** | Capital allocation often relies on political intuition or whoever shouts the loudest, overlooking quiet or marginalized areas. | **Impact-per-Rupee Ranking** objectively scores projects on verified urgency, service deficits, and population vulnerability. |
| **Zero Impact Visibility** | Representatives have no quantitative way to forecast or prove how funded projects will improve civic metrics. | **Constituency Digital Twin (CSTE)** simulates before-and-after improvements in water coverage, healthcare access, and school attendance. |

---

## 💡 Core Innovations

### 1. 🧠 Multilingual Semantic Triage
Citizens submit grievances naturally in **Hindi, Bhojpuri, or English** without needing to know official administrative jargon. The system translates and parses the input into structured entities (`issue_type`, `ward`, `urgency`, `affected_group`) and projects it into a **768-dimensional semantic embedding space** (`text-embedding-004`) to cluster recurring complaints.

### 2. ⚡ Cross-Sector Synergy Detection
Civil projects that occur together in the same ward provide compounding public benefits. JanMitra’s algorithm detects these spatial combinations and applies a **synergy multiplier**:
* **Road + Health**: Accelerated emergency response and ambulance transit.
* **Water + Health**: Direct reduction in waterborne illnesses.
* **Drainage + Road**: Prevents seasonal waterlogging and extends road lifespan.

### 3. 🌐 Constituency State Tracking Engine (CSTE) — Digital Twin
Rather than generating static to-do lists, JanMitra includes a live **digital twin** of the constituency. It anchors to official Indian Government open datasets (**Jal Jeevan Mission**, **UDISE+**, **NFHS-5**) and dynamically updates civic health scores as projects are funded.

### 4. ⚖️ Dual-Solver Budget Optimizer with Ward Equity
Representatives can simulate how to spend their ₹5 Crore budget using two complementary algorithms:
* **0/1 Knapsack Optimizer**: Uses dynamic programming with discrete capital stepping to mathematically maximize total civic impact.
* **Ward Equity Protection**: Automatically caps single-ward expenditure at **45%** to prevent influential areas from monopolizing funds and ensure fair geographic distribution.

### 5. 🛡️ 100% Zero-Crash Resilience Architecture
Built from the ground up to never fail in high-stress demonstrations or low-connectivity environments. If external AI or database keys are missing, the platform automatically switches to **smart regex rule engines**, **in-memory caching**, and **offline GIS databases**.

### 6. 📄 Ministerial-Grade PDF Executive Briefings
With one click, server-side **headless Chromium (Puppeteer)** compiles the ranked project portfolio, CSTE metrics, and budget allocations into an official, print-ready A4 executive document for legislative sanctioning.

---

## 🖥 Platform Walkthrough

The platform serves three user roles: **Citizens**, **Elected Representatives (MPs/MLAs)**, and **District Planning Officers**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 THE JANMITRA EXPERIENCE                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  1. Citizen Portal      │ Voice/Text grievance intake in English or Hindi (हिंदी)       │
│  2. Executive Dashboard │ Live constituency pulse: critical issues, budgets, & metrics │
│  3. Interactive Map     │ Dark-theme GIS command center with ward boundary overlays     │
│  4. Portfolio Planner   │ Ranked projects sorted by Impact-per-Rupee with 1-click cart  │
│  5. Budget Simulator    │ Dynamic Knapsack optimizer with live before/after CSTE radar  │
│  6. AI Briefing Exporter│ Instant server-side PDF generation for committee meetings     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1. 🙋 Citizen Grievance Portal (`CitizenWidget.jsx`)
* Mobile-first, citizen-facing portal designed for quick reporting.
* Full bilingual support with instantaneous toggle between **English** and **हिंदी** (`i18next`).
* Automatically extracts location, urgency, and category from raw unstructured descriptions.
* Provides a real-time tracking badge and verified complaint reference ID.

### 2. 📊 Executive Command Dashboard (`Dashboard.jsx`)
* At-a-glance KPI cards: Total Grievances, Active Problem Clusters, Allocated Budget, and Critical Alerts.
* Real-time sync with **Cloud Firestore** for instant multi-user updates.
* Live summary of the top critical projects requiring immediate legislative attention.

### 3. 🗺 Interactive GIS Ward Map (`WardMapPage.jsx` & `MapPanel.jsx`)
* Command-center dark aesthetic powered by **Leaflet** and **CartoDB Dark Matter** tiles.
* Displays verified administrative ward boundaries (GeoJSON) with color-coded markers by sector (Water, Roads, Healthcare, Education, Sanitation).
* Smooth `flyTo` camera transitions when inspecting individual ward hotspots.

### 4. 💼 Project Portfolio Planner (`PortfolioPlanner.jsx`)
* Displays all AI-grouped problem clusters ranked by **Impact-per-Rupee**.
* Transparent score triad chips: displays the breakdown of **Need**, **Impact**, and **Synergy**.
* Interactive "Add to Portfolio" drawer with automatic budget subtraction and remaining fund counter.
* Grounded AI explanation block narrating why each project is prioritized using verified facts.

### 5. 💰 Budget Simulator (`BudgetSimulator.jsx`)
* Interactive budget slider allowing planners to test different allocations (e.g., ₹20 Lakhs to ₹2 Crore).
* Visual before-and-after comparisons of key civic health indicators.
* One-click CSTE state snapshot saving to compare longitudinal development trajectories.

---

## 🧮 How Prioritization Works

JanMitra replaces guesswork with an objective, transparent, and auditable decision metric:

$$\text{Priority Score} = \frac{\text{Need Score} \times \text{Impact Score} \times (1 + \text{Synergy Multiplier})}{\text{Project Cost (in Lakhs ₹)}}$$

### The Three Core Pillars

```
   ┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
   │      NEED SCORE      │  ×  │     IMPACT SCORE     │  ×  │   SYNERGY & EQUITY   │
   ├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
   │ • Urgency level      │     │ • Normalized population│   │ • Cross-sector boost │
   │ • Historical recurr- │     │   benefited          │     │   (e.g., Road+Health)│
   │   ence frequency     │     │ • Vulnerability index│     │ • Ward Equity Cap    │
   │ • Distance to nearest│     │   (patients, students│     │   (max 45% spend per │
   │   facility           │     │   pedestrians)       │     │   single ward)       │
   └──────────────────────┘     └──────────────────────┘     └──────────────────────┘
                                           │
                                           ▼
                       Divided by Cost (₹ Lakhs) = IMPACT PER RUPEE
```

<details>
<summary>🔬 <b>Technical Deep Dive: Mathematical Formulation & Weights (Click to expand)</b></summary>
<br>

#### 1. Need Score Formulation
$$\text{Need Score} = w_1 \cdot \text{Urgency} + w_3 \cdot \text{Recurrence} + w_4 \cdot \widetilde{\text{ServiceGap}}$$
* **Urgency ($w_1 = 0.25$)**: Critical = `1.0`, Moderate = `0.7`, Low = `0.4`. Water and health issues carry a baseline floor of $\ge 0.90$.
* **Recurrence ($w_3 = 0.15$)**: Frequency density of complaints over trailing 90-day periods.
* **Service Gap ($w_4 = 0.20$)**: Min-max normalized distance (km) to the nearest secondary civic facility.

#### 2. Impact Score Formulation
$$\text{Impact Score} = w_2 \cdot \widetilde{\text{Population}} + w_5 \cdot \text{VulnerabilityIndex}$$
* **Population ($w_2 = 0.20$)**: Normalized beneficiary population within the affected ward polygon.
* **Vulnerability Index ($w_5 = 0.10$)**: Demographic equity weight:
  * Patients / Hospitals: `1.0`
  * Students / Children: `0.9`
  * General Residents: `0.8`
  * Pedestrians: `0.7`
  * Daily Commuters: `0.6`

#### 3. Cross-Sector Synergy Multiplier
$$\text{Synergy Factor} = \sum \mathbf{M}[\text{Issue}_A + \text{Issue}_B]$$
* Road + Health: `+0.20` (Faster ambulance transit)
* Water + Health: `+0.15` (Waterborne disease eradication)
* Road + Education: `+0.15` (Monsoon school accessibility)
* Drainage + Road: `+0.15` (Pavement lifespan extension)

#### 4. Anchored Government Benchmarks (CSTE)
The digital twin anchors to official published baseline data:
* **Varanasi (UP-77)**: 76.4% Tap Water (JJM 2024), 74.2% School Retention (UDISE+ 2024), 65.8% Healthcare Access within 5km (NFHS-5).
* **Lucknow (UP-35)**: 81.2% Tap Water (JJM 2024), 79.5% School Retention (UDISE+ 2024), 73.1% Healthcare Access within 5km (NFHS-5).

</details>

---

## 🏗 System Architecture

JanMitra is structured as a decoupled full-stack civic system:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               FRONTEND (React 19 + Vite 8)                             │
│                                                                                        │
│   ┌─────────────────────┐  ┌─────────────────────┐  ┌──────────────────────────────┐   │
│   │   Citizen Portal    │  │ Executive Dashboard │  │     Interactive GIS Map      │   │
│   │  (Hindi / English)  │  │  (Portfolio Planner)│  │   (Leaflet + CartoDB Dark)   │   │
│   └──────────┬──────────┘  └──────────┬──────────┘  └──────────────┬───────────────┘   │
│              └────────────────────────┼────────────────────────────┘                   │
│                                       ▼                                                │
│                 ┌──────────────────────────────────────────┐                           │
│                 │   Algorithmic Core (priorityEngine.js)   │                           │
│                 │   • Impact-per-Rupee • Ward Equity Cap   │                           │
│                 │   • CSTE Digital Twin • 0/1 Knapsack DP  │                           │
│                 └─────────────────────┬────────────────────┘                           │
└───────────────────────────────────────┼────────────────────────────────────────────────┘
                                        │ REST API (JSON / HTTP)
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (Express 5 on Node.js)                            │
│                                                                                        │
│   ┌───────────────────────────┐ ┌───────────────────────────┐ ┌────────────────────┐   │
│   │   Token Bucket Limiter    │ │   Sliding TTL AI Cache    │ │ Concurrency Mutex  │   │
│   │   (15 RPM Free-Tier Guard)│ │  (10-Minute Narrative TTL)│ │ (PDF Generation)   │   │
│   └─────────────┬─────────────┘ └─────────────┬─────────────┘ └──────────┬─────────┘   │
│                 │                             │                          │             │
│                 ▼                             ▼                          ▼             │
│   ┌─────────────────────────────────────────────────────────┐ ┌────────────────────┐   │
│   │                   Google AI Services                    │ │  Puppeteer Chrome  │   │
│   │  • Gemini 2.5 Flash (Structured JSON extraction)        │ │  (A4 Executive PDF │   │
│   │  • text-embedding-004 (768-dim semantic vectors)        │ │   Briefing Engine) │   │
│   └───────────────────────────┬─────────────────────────────┘ └────────────────────┘   │
└───────────────────────────────┼────────────────────────────────────────────────────────┘
                                │ Persistence
                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         CLOUD STORAGE & HOSTING (Firebase / GCP)                       │
│                                                                                        │
│   • Cloud Firestore: Real-time collections (`clusters`, `cste_snapshots`)             │
│   • Global Edge Distribution: Sub-second worldwide client delivery                    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗺 Geographic GIS Coverage

JanMitra comes pre-loaded with verified administrative GeoJSON boundary files and authentic centroid coordinates:

### 1. Varanasi Parliamentary Constituency (UP-77)
* **Administrative Wards**: Assi, Bhelupur, Sigra, Dashashwamedh, Chetganj, Chowk, Kotwali, Jaitpura, Adampura, Bhelpura, Shivpur, Sarnath.
* **Geographic Center**: `25.3176° N, 82.9739° E`

### 2. Lucknow Parliamentary Constituency (UP-35)
* **Administrative Wards**: Hazratganj, Gomti Nagar, Alambagh, Chowk Lucknow, Aminabad, Mahanagar, Indira Nagar, Ashiyana, Rajajipuram, Charbagh.
* **Geographic Center**: `26.8467° N, 80.9462° E`

Planners can seamlessly switch constituencies from the top bar to inspect localized data, ward boundaries, and budget allocations.

---

## 🛡 Zero-Crash Resilience

The application is architected with a **no-fail design** so that live presentations, hackathons, and offline reviews run smoothly even with missing API keys:

* **Missing Gemini AI Key**: The server switches to an intelligent regex and keyword parser supporting both Hindi and English civic vocabulary.
* **Missing Firebase Keys**: The frontend automatically initializes using local seed datasets and persists user changes to `localStorage`.
* **Missing GIS Geocoding**: Automatically resolves locations against a local offline centroid database.
* **Rate-Limit Protection**: A built-in token bucket rate limiter protects free-tier Gemini keys against quota exhaustion.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: `v18.0.0` or higher (`v20+` recommended)
* **npm**: `v9.0.0` or higher

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/ShresthSingh01/CodeForCommunities.git
cd CodeForCommunities/janmitra-app

# Install dependencies
npm install
```

### 2. Environment Setup (Optional)
```bash
cp .env.example .env
```
> **Tip:** You can launch the app immediately without adding any keys. The system will operate in **Resilient Demo Mode** with complete mock datasets and local persistence.

To enable live Gemini AI or Firebase synchronization, add your keys to `.env`:
```env
# Server Gemini API Key (Kept secure on server)
GEMINI_API_KEY="your_gemini_api_key"

# Client Firebase Configuration (Optional)
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_PROJECT_ID="your_project_id"

# Backend Base URL
VITE_API_BASE_URL="http://localhost:3001"
```

### 3. Run the Platform
```bash
# Concurrently launches the Express backend (3001) and Vite frontend (5173)
npm start
```
* **Frontend Application**: `http://localhost:5173`
* **Backend Health Check**: `http://localhost:3001/api/health`

### 4. Code Quality & Build Verification
```bash
# Run lightning-fast static analysis (Oxlint)
npm run lint

# Validate production bundle compilation
npm run build
```

---

## 📦 Deployment Options

The project is structured for easy, cost-free production deployment:

### Free & Fast Setup (Zero Credit Card Required)

| Layer | Platform | Setup Steps |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** / **Cloudflare Pages** | Connect GitHub repo, set root to `janmitra-app`, build command `npm run build`, output directory `dist`. Add `VITE_API_BASE_URL`. |
| **Backend** | **Render.com** | Create a New Web Service pointing to `janmitra-app`, start command `node server/index.js`. Add `GEMINI_API_KEY`. |

*(Alternatively, deploy the frontend directly to **Firebase Hosting** using the pre-configured `firebase.json` via `npx firebase deploy --only hosting`).*

---

## 🛠 Technology Stack Matrix

```
┌───────────────────────────┬───────────────────────────────┬──────────────────────────────────────────┐
│ Component                 │ Technology                    │ Role in System                           │
├───────────────────────────┼───────────────────────────────┼──────────────────────────────────────────┤
│ User Interface            │ React 19 + Tailwind CSS v4    │ Modern, responsive, low-latency UI       │
│ Build Engine              │ Vite 8                        │ Sub-second HMR and tree-shaken bundling  │
│ Language Localization     │ i18next + react-i18next       │ English & Hindi (हिंदी) language engine   │
│ Spatial GIS Visualization │ Leaflet 1.9 + CartoDB Dark    │ Free, open-source ward boundary maps     │
│ Language Model            │ Google Gemini 2.5 Flash       │ Vernacular Hindi/Bhojpuri grievance NLP  │
│ Semantic Embeddings       │ Google text-embedding-004     │ 768-dimensional cluster similarity       │
│ Backend Service           │ Node.js + Express 5           │ Rate-limited, cached REST gateway        │
│ PDF Generation            │ Puppeteer 25 (Headless Chrome)│ Executive print-ready legislative brief  │
│ Real-Time Database        │ Cloud Firestore               │ Live multi-user state synchronization    │
│ Static Code Linter        │ Oxlint                        │ High-performance static analysis         │
└───────────────────────────┴───────────────────────────────┴──────────────────────────────────────────┘
```

---

<div align="center">
  <b>JanMitra AI — जन की आवाज़, डेटा की ज़बान</b><br>
  <i>(The voice of the people, spoken in the language of data)</i>
</div>
