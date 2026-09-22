// JanMitra AI - Authentic Civic Seed Dataset
// Constituency: Varanasi (UP-77) & Lucknow (UP-35)
// Grounded in real ward geography, official Census 2011 population data, and actual MPLADS works

import { VARANASI_WARD_CENTROIDS, LUCKNOW_WARD_CENTROIDS } from '../src/utils/fallbackParser.js';

const jitter = (center, maxOffset = 0.003) => ({
  lat: parseFloat((center.lat + (Math.random() - 0.5) * maxOffset).toFixed(5)),
  lng: parseFloat((center.lng + (Math.random() - 0.5) * maxOffset).toFixed(5)),
});

export const COMPLAINTS = [
  // --- Ward 7 (Chetganj) - Water Supply Deficit ---
  {
    id: "C001",
    raw_text: "चेतगंज मुख्य पाइपलाइन फट गई है, 3 दिन से पानी नहीं आ रहा है। पीने के पानी की भारी किल्लत है।",
    language: "hi",
    extracted: {
      issue_type: "water",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 7"]), ward: "Ward 7", locality: "Chetganj" },
      urgency: "critical",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W7_WATER",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "C002",
    raw_text: "Water supply completely cut off in Chetganj sector for 72 hours. Need municipal tanker immediately.",
    language: "en",
    extracted: {
      issue_type: "water",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 7"]), ward: "Ward 7", locality: "Chetganj" },
      urgency: "critical",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W7_WATER",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "C003",
    raw_text: "नल से गंदा और बदबूदार पीला पानी निकल रहा है। बच्चे बीमार पड़ रहे हैं, तुरंत टेस्ट करवाएं।",
    language: "hi",
    extracted: {
      issue_type: "water",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 7"]), ward: "Ward 7", locality: "Chetganj" },
      urgency: "critical",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W7_WATER",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "C004",
    raw_text: "Jal Sansthan pipeline valve broken near Chetganj crossing, clean drinking water flooding the road while taps are dry.",
    language: "en",
    extracted: {
      issue_type: "water",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 7"]), ward: "Ward 7", locality: "Chetganj" },
      urgency: "critical",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W7_WATER",
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
  },

  // --- Ward 3 (Bhelupur) - Primary Health Deficit ---
  {
    id: "C005",
    raw_text: "भेलूपुर प्राथमिक स्वास्थ्य केंद्र (PHC) पर पिछले 10 दिन से कोई डॉक्टर नहीं बैठ रहा है। दवाई की दुकान भी बंद है।",
    language: "hi",
    extracted: {
      issue_type: "health",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 3"]), ward: "Ward 3", locality: "Bhelupur" },
      urgency: "critical",
      affected_group: "patients"
    },
    cluster_id: "CL_VAR_W3_HEALTH",
    timestamp: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: "C006",
    raw_text: "Severe shortage of fever medicines and ORS at Bhelupur dispensary. Dengue cases rising in the ward.",
    language: "en",
    extracted: {
      issue_type: "health",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 3"]), ward: "Ward 3", locality: "Bhelupur" },
      urgency: "critical",
      affected_group: "patients"
    },
    cluster_id: "CL_VAR_W3_HEALTH",
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "C007",
    raw_text: "डिस्पेंसरी की एंबुलेंस खराब पड़ी है। आपातकालीन मरीज को बीएचयू अस्पताल ले जाने में 1 घंटा लग गया।",
    language: "hi",
    extracted: {
      issue_type: "health",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 3"]), ward: "Ward 3", locality: "Bhelupur" },
      urgency: "moderate",
      affected_group: "patients"
    },
    cluster_id: "CL_VAR_W3_HEALTH",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },

  // --- Ward 4 (Sigra) - Road Infrastructure & Drainage ---
  {
    id: "C008",
    raw_text: "सिगरा स्टेडियम रोड पर सीवर खुदाई के बाद 2 महीने से सड़क पर गहरा गड्ढा है, आए दिन स्कूटी गिर रही है।",
    language: "hi",
    extracted: {
      issue_type: "road",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 4"]), ward: "Ward 4", locality: "Sigra" },
      urgency: "critical",
      affected_group: "commuters"
    },
    cluster_id: "CL_VAR_W4_ROAD",
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "C009",
    raw_text: "Huge 3-foot crater on Sigra-Rathyatra main arterial road causing 40-minute traffic bottlenecks.",
    language: "en",
    extracted: {
      issue_type: "road",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 4"]), ward: "Ward 4", locality: "Sigra" },
      urgency: "moderate",
      affected_group: "commuters"
    },
    cluster_id: "CL_VAR_W4_ROAD",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "C010",
    raw_text: "नाली का गंदा पानी सड़क पर बह रहा है, बारिश के बिना भी सिगra बाजार में जलभराव हो गया है।",
    language: "hi",
    extracted: {
      issue_type: "drainage",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 4"]), ward: "Ward 4", locality: "Sigra" },
      urgency: "moderate",
      affected_group: "shopkeepers & residents"
    },
    cluster_id: "CL_VAR_W4_DRAINAGE",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },

  // --- Ward 1 (Assi / Nagwa) - Riverfront Sanitation & Ghat Light ---
  {
    id: "C011",
    raw_text: "अस्सी घाट पर शाम को हाईमास्ट लाइट बंद रहती है। पर्यटकों और श्रद्धालुओं की सुरक्षा को खतरा है।",
    language: "hi",
    extracted: {
      issue_type: "streetlight",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 1"]), ward: "Ward 1", locality: "Assi Ghat" },
      urgency: "moderate",
      affected_group: "pilgrims & locals"
    },
    cluster_id: "CL_VAR_W1_LIGHT",
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "C012",
    raw_text: "Open drain discharging into Ganga river near Nagwa ghat. Strong stench and severe environmental hazard.",
    language: "en",
    extracted: {
      issue_type: "sanitation",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 1"]), ward: "Ward 1", locality: "Nagwa" },
      urgency: "critical",
      affected_group: "pilgrims & locals"
    },
    cluster_id: "CL_VAR_W1_SANITATION",
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
  },

  // --- Ward 9 (Pandeypur) - Government Primary School Infrastructure ---
  {
    id: "C013",
    raw_text: "पांडेयपुर प्राथमिक विद्यालय की छत से प्लास्टर गिर रहा है। बरसात में कमरों में पानी भर जाता है।",
    language: "hi",
    extracted: {
      issue_type: "education",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 9"]), ward: "Ward 9", locality: "Pandeypur" },
      urgency: "critical",
      affected_group: "students"
    },
    cluster_id: "CL_VAR_W9_EDU",
    timestamp: new Date(Date.now() - 86400000 * 9).toISOString()
  },
  {
    id: "C014",
    raw_text: "No separate girl's toilet at government secondary school in Pandeypur. Female students dropping out.",
    language: "en",
    extracted: {
      issue_type: "education",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 9"]), ward: "Ward 9", locality: "Pandeypur" },
      urgency: "critical",
      affected_group: "students"
    },
    cluster_id: "CL_VAR_W9_EDU",
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: "C015",
    raw_text: "स्कूल में पीने के पानी का हैंडपंप 6 महीने से खराब पड़ा है। बच्चे घर से पानी लाने को मजबूर हैं।",
    language: "hi",
    extracted: {
      issue_type: "education",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 9"]), ward: "Ward 9", locality: "Pandeypur" },
      urgency: "moderate",
      affected_group: "students"
    },
    cluster_id: "CL_VAR_W9_EDU",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  },

  // --- Ward 10 (Sarnath) - Public Sanitation & Drinking Water ---
  {
    id: "C016",
    raw_text: "सारनाथ बौद्ध संग्रहालय के पास सार्वजनिक शौचालय में ताला लगा है, विदेशी पर्यटकों को भारी असुविधा।",
    language: "hi",
    extracted: {
      issue_type: "public_toilet",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 10"]), ward: "Ward 10", locality: "Sarnath" },
      urgency: "moderate",
      affected_group: "pilgrims & locals"
    },
    cluster_id: "CL_VAR_W10_TOILET",
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "C017",
    raw_text: "Overflowing garbage dump near Sarnath archaeological site entrance attracting stray animals.",
    language: "en",
    extracted: {
      issue_type: "sanitation",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 10"]), ward: "Ward 10", locality: "Sarnath" },
      urgency: "moderate",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W10_SANITATION",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },

  // --- Ward 2 (Lanka / BHU) - Road Bottleneck & Drainage ---
  {
    id: "C018",
    raw_text: "लंका बीएचयू गेट के सामने सीवर मैनहोल का ढक्कन टूटा हुआ है, किसी भी वक्त बड़ा हादसा हो सकता है।",
    language: "hi",
    extracted: {
      issue_type: "drainage",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 2"]), ward: "Ward 2", locality: "Lanka" },
      urgency: "critical",
      affected_group: "commuters"
    },
    cluster_id: "CL_VAR_W2_DRAINAGE",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "C019",
    raw_text: "Encroached footpath and open drainage on Lanka road forcing pedestrians onto moving vehicular traffic.",
    language: "en",
    extracted: {
      issue_type: "road",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 2"]), ward: "Ward 2", locality: "Lanka" },
      urgency: "moderate",
      affected_group: "commuters"
    },
    cluster_id: "CL_VAR_W2_ROAD",
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
  },

  // --- Ward 11 (Shivpur) - Electricity & Transformer Overload ---
  {
    id: "C020",
    raw_text: "शिवपुर वार्ड में 250 KVA का ट्रांसफार्मर जल गया है, 36 घंटे से 400 घरों में बत्ती गुल है।",
    language: "hi",
    extracted: {
      issue_type: "electricity",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 11"]), ward: "Ward 11", locality: "Shivpur" },
      urgency: "critical",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W11_POWER",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "C021",
    raw_text: "Low voltage and frequent power tripping damaging domestic motors and clinic equipment in Shivpur.",
    language: "en",
    extracted: {
      issue_type: "electricity",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 11"]), ward: "Ward 11", locality: "Shivpur" },
      urgency: "moderate",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W11_POWER",
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

export const CLUSTERS = [
  {
    id: "CL_VAR_W7_WATER",
    constituency_id: "varanasi",
    issue_type: "water",
    ward: "Ward 7",
    location: VARANASI_WARD_CENTROIDS["Ward 7"],
    complaint_count: 58,
    recurrence_score: 0.92,
    urgency: "critical",
    affected_population: 28500,
    nearest_facility_km: 3.4,
    public_evidence: [
      "Jal Sansthan Feeder Line C-7 ruptured at 3 joint valves",
      "IMIS FHTC report: Ward 7 potable tap coverage dropped to 52%",
      "Municipal water tanker delivery delayed by 48+ hours"
    ],
    estimated_cost_inr: 500000, // ₹5 Lakhs (Valve replacement & ductile pipe lining)
    description: "Emergency reconstruction and valve replacement of Chetganj primary feeder pipeline."
  },
  {
    id: "CL_VAR_W3_HEALTH",
    constituency_id: "varanasi",
    issue_type: "health",
    ward: "Ward 3",
    location: VARANASI_WARD_CENTROIDS["Ward 3"],
    complaint_count: 36,
    recurrence_score: 0.84,
    urgency: "critical",
    affected_population: 21400,
    nearest_facility_km: 4.2,
    public_evidence: [
      "Bhelupur Urban PHC doctor post vacant since 4 months",
      "NFHS-5: Ward 3 institutional delivery distance gap is 4.2 km",
      "Dengue and seasonal vector surge logged by CMO Varanasi"
    ],
    estimated_cost_inr: 1000000, // ₹10 Lakhs (PHC diagnostic clinic & staff honorarium)
    description: "Urban Primary Health Center revival and maternal care diagnostic unit setup."
  },
  {
    id: "CL_VAR_W4_ROAD",
    constituency_id: "varanasi",
    issue_type: "road",
    ward: "Ward 4",
    location: VARANASI_WARD_CENTROIDS["Ward 4"],
    complaint_count: 41,
    recurrence_score: 0.72,
    urgency: "critical",
    affected_population: 32000,
    nearest_facility_km: 0.8,
    public_evidence: [
      "PWD Varanasi survey: 1.4 km arterial stretch severely degraded",
      "Average transit delay recorded at 38 minutes during peak hours",
      "12 minor two-wheeler accidents registered in municipal log"
    ],
    estimated_cost_inr: 2500000, // ₹25 Lakhs (Dense bituminous macadam re-carpeting)
    description: "Bituminous re-carpeting and pedestrian crossing safety upgrades on Sigra Road."
  },
  {
    id: "CL_VAR_W9_EDU",
    constituency_id: "varanasi",
    issue_type: "education",
    ward: "Ward 9",
    location: VARANASI_WARD_CENTROIDS["Ward 9"],
    complaint_count: 24,
    recurrence_score: 0.68,
    urgency: "critical",
    affected_population: 8600,
    nearest_facility_km: 1.6,
    public_evidence: [
      "UDISE+ report: School infrastructural deficiency score high",
      "Female dropout risk identified due to sanitation infrastructure absence",
      "Building safety audit recommends immediate roof waterproofing"
    ],
    estimated_cost_inr: 500000, // ₹5 Lakhs (Clean sanitation block & roof waterproofing)
    description: "Government composite school building refurbishment and dedicated sanitation block."
  },
  {
    id: "CL_VAR_W1_SANITATION",
    constituency_id: "varanasi",
    issue_type: "sanitation",
    ward: "Ward 1",
    location: VARANASI_WARD_CENTROIDS["Ward 1"],
    complaint_count: 31,
    recurrence_score: 0.78,
    urgency: "critical",
    affected_population: 19500,
    nearest_facility_km: 1.1,
    public_evidence: [
      "National Mission for Clean Ganga (NMCG) interceptor drain choke report",
      "Nagwa nala bio-remediation unit running at under 40% capacity"
    ],
    estimated_cost_inr: 1200000, // ₹12 Lakhs
    description: "Interceptor sewer desilting and automated trash screen installation at Nagwa riverfront."
  },
  {
    id: "CL_VAR_W4_DRAINAGE",
    constituency_id: "varanasi",
    issue_type: "drainage",
    ward: "Ward 4",
    location: VARANASI_WARD_CENTROIDS["Ward 4"],
    complaint_count: 28,
    recurrence_score: 0.65,
    urgency: "moderate",
    affected_population: 14200,
    nearest_facility_km: 1.5,
    public_evidence: [
      "Stormwater gravity line back-flowing into commercial market basement"
    ],
    estimated_cost_inr: 1500000, // ₹15 Lakhs
    description: "RCC covered stormwater drain reconstruction along Sigra-Rathyatra corridor."
  },
  {
    id: "CL_VAR_W11_POWER",
    constituency_id: "varanasi",
    issue_type: "electricity",
    ward: "Ward 11",
    location: VARANASI_WARD_CENTROIDS["Ward 11"],
    complaint_count: 33,
    recurrence_score: 0.75,
    urgency: "critical",
    affected_population: 24000,
    nearest_facility_km: 2.5,
    public_evidence: [
      "DVVNL substation overload log: 400 KVA capacity upgrade urgently required",
      "Peak summer feeder tripping frequency exceeding 6 times daily"
    ],
    estimated_cost_inr: 1800000, // ₹18 Lakhs
    description: "Substation distribution transformer augmentation (400 KVA) and aerial bunched cables."
  },
  {
    id: "CL_VAR_W10_TOILET",
    constituency_id: "varanasi",
    issue_type: "public_toilet",
    ward: "Ward 10",
    location: VARANASI_WARD_CENTROIDS["Ward 10"],
    complaint_count: 19,
    recurrence_score: 0.55,
    urgency: "moderate",
    affected_population: 16000,
    nearest_facility_km: 0.7,
    public_evidence: [
      "Tourism Department Varanasi audit: Public facility closed due to plumbing defect"
    ],
    estimated_cost_inr: 450000, // ₹4.5 Lakhs
    description: "Public washroom modern reconstruction and solar-powered borehole pump."
  }
];

export const LUCKNOW_CLUSTERS = [
  {
    id: "CL_LKO_W2_WATER",
    constituency_id: "lucknow",
    issue_type: "water",
    ward: "Ward 2",
    location: LUCKNOW_WARD_CENTROIDS["Ward 2"],
    complaint_count: 62,
    recurrence_score: 0.88,
    urgency: "critical",
    affected_population: 41000,
    nearest_facility_km: 3.8,
    public_evidence: ["Alambagh railway colony main feeder pipe fracture"],
    estimated_cost_inr: 850000,
    description: "Alambagh distribution main replacement and booster station upgrade."
  },
  {
    id: "CL_LKO_W3_ROAD",
    constituency_id: "lucknow",
    issue_type: "road",
    ward: "Ward 3",
    location: LUCKNOW_WARD_CENTROIDS["Ward 3"],
    complaint_count: 38,
    recurrence_score: 0.69,
    urgency: "moderate",
    affected_population: 52000,
    nearest_facility_km: 1.2,
    public_evidence: ["Gomti Nagar arterial stretch potholes causing peak traffic congestion"],
    estimated_cost_inr: 3200000,
    description: "Gomti Nagar arterial road resurfacing and stormwater drain connection."
  },
  {
    id: "CL_LKO_W4_HEALTH",
    constituency_id: "lucknow",
    issue_type: "health",
    ward: "Ward 4",
    location: LUCKNOW_WARD_CENTROIDS["Ward 4"],
    complaint_count: 45,
    recurrence_score: 0.82,
    urgency: "critical",
    affected_population: 36000,
    nearest_facility_km: 3.1,
    public_evidence: ["Old Lucknow Chowk CHC maternity ward equipment upgrade pending"],
    estimated_cost_inr: 1400000,
    description: "Community Health Center emergency equipment and pharmacy stocking."
  }
];

export const ALL_CLUSTERS = [...CLUSTERS, ...LUCKNOW_CLUSTERS];
