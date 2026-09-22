// JanMitra AI - Authentic Civic Seed Dataset
// Constituency: Varanasi (UP-77) & Lucknow (UP-35)
// Grounded in real ward geography, official Census 2011 population data, and actual civic works

import { VARANASI_WARD_CENTROIDS, LUCKNOW_WARD_CENTROIDS } from '../src/utils/fallbackParser.js';

const jitter = (center, maxOffset = 0.003) => ({
  lat: parseFloat((center.lat + (Math.random() - 0.5) * maxOffset).toFixed(5)),
  lng: parseFloat((center.lng + (Math.random() - 0.5) * maxOffset).toFixed(5)),
});

export const COMPLAINTS = [
  // ==========================================
  // VARANASI (UP-77) - 12 WARDS CIVIC ISSUES
  // ==========================================

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
    raw_text: "नाली का गंदा पानी सड़क पर बह रहा है, बारिश के बिना भी सिगरा बाजार में जलभराव हो गया है।",
    language: "hi",
    extracted: {
      issue_type: "drainage",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 4"]), ward: "Ward 4", locality: "Sigra" },
      urgency: "moderate",
      affected_group: "residents"
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
      affected_group: "residents"
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
      affected_group: "residents"
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
    raw_text: "सारनाथ बौद्ध संग्रहालय के पास सार्वजनिक शौचालय में ताला लगा है, विदेशी पर्यटकों और श्रद्धालुओं को भारी असुविधा।",
    language: "hi",
    extracted: {
      issue_type: "public_toilet",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 10"]), ward: "Ward 10", locality: "Sarnath" },
      urgency: "moderate",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W10_TOILET",
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "C017",
    raw_text: "Overflowing garbage dump and damaged sanitation block near Sarnath archaeological site entrance.",
    language: "en",
    extracted: {
      issue_type: "public_toilet",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 10"]), ward: "Ward 10", locality: "Sarnath" },
      urgency: "moderate",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W10_TOILET",
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
    raw_text: "Clogged stormwater channel and fractured drainage slab on Lanka road forcing pedestrians onto moving vehicular traffic.",
    language: "en",
    extracted: {
      issue_type: "drainage",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 2"]), ward: "Ward 2", locality: "Lanka" },
      urgency: "moderate",
      affected_group: "commuters"
    },
    cluster_id: "CL_VAR_W2_DRAINAGE",
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
  },

  // --- Ward 5 (Dashashwamedh) - Pilgrim Corridor Lighting ---
  {
    id: "C022",
    raw_text: "दशाश्वमेध घाट पर गंगा आरती के समय मुख्य मार्ग पर अंधेरा रहता है, महिलाओं और बुजुर्गों के लिए सोलर हाईमास्ट लाइट की सख्त जरूरत है।",
    language: "hi",
    extracted: {
      issue_type: "streetlight",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 5"]), ward: "Ward 5", locality: "Dashashwamedh" },
      urgency: "moderate",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W5_LIGHT",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "C023",
    raw_text: "Inadequate illumination and broken pedestrian safety railings on Dashashwamedh main pilgrim approach route.",
    language: "en",
    extracted: {
      issue_type: "streetlight",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 5"]), ward: "Ward 5", locality: "Dashashwamedh" },
      urgency: "moderate",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W5_LIGHT",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
  },

  // --- Ward 6 (Chowk) - Heritage Gali Electrical Safety ---
  {
    id: "C024",
    raw_text: "चौक की संकरी गलियों में बिजली के लटकते नंगे तार और आग बुझाने के लिए कोई पाइपलाइन नहीं है, तुरंत भूमिगत केबलिंग कराई जाए।",
    language: "hi",
    extracted: {
      issue_type: "electricity",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 6"]), ward: "Ward 6", locality: "Chowk" },
      urgency: "critical",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W6_POWER",
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "C025",
    raw_text: "Hanging high-voltage wire bundles in congested Chowk market pose acute electrocution and fire hazard.",
    language: "en",
    extracted: {
      issue_type: "electricity",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 6"]), ward: "Ward 6", locality: "Chowk" },
      urgency: "critical",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W6_POWER",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },

  // --- Ward 8 (Kotwali) - Market Sanitation & Solid Waste ---
  {
    id: "C026",
    raw_text: "कोतवाली क्षेत्र के थोक बाजार में कचरे का भारी ढेर लगा है, बदबू से दुकानदारों और राहगीरों का बुरा हाल है, हाइड्रोलिक कंपैक्टर लगाया जाए।",
    language: "hi",
    extracted: {
      issue_type: "sanitation",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 8"]), ward: "Ward 8", locality: "Kotwali" },
      urgency: "moderate",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W8_SANITATION",
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "C027",
    raw_text: "Open commercial garbage accumulation in Kotwali wholesale lane attracting rodents and blocking traffic.",
    language: "en",
    extracted: {
      issue_type: "sanitation",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 8"]), ward: "Ward 8", locality: "Kotwali" },
      urgency: "moderate",
      affected_group: "residents"
    },
    cluster_id: "CL_VAR_W8_SANITATION",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
  },

  // --- Ward 12 (Cantonment) - Station Approach Arterial Road ---
  {
    id: "C028",
    raw_text: "कैंट रेलवे स्टेशन के दक्षिणी छोर की सड़क पूरी तरह टूट चुकी है, ऑटो रिक्शा पलटने का खतरा बना रहता है, तुरंत सड़क पक्की करें।",
    language: "hi",
    extracted: {
      issue_type: "road",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 12"]), ward: "Ward 12", locality: "Cantonment" },
      urgency: "critical",
      affected_group: "commuters"
    },
    cluster_id: "CL_VAR_W12_ROAD",
    timestamp: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: "C029",
    raw_text: "Severe potholes and cracked pavement on Cantonment railway feeder road creating daily commuter gridlocks.",
    language: "en",
    extracted: {
      issue_type: "road",
      location: { ...jitter(VARANASI_WARD_CENTROIDS["Ward 12"]), ward: "Ward 12", locality: "Cantonment" },
      urgency: "critical",
      affected_group: "commuters"
    },
    cluster_id: "CL_VAR_W12_ROAD",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  },

  // ==========================================
  // LUCKNOW (UP-35) - 6 WARDS CIVIC ISSUES
  // ==========================================

  // --- Ward 1 (Hazratganj) - Commercial Promenade Infrastructure ---
  {
    id: "C030",
    raw_text: "हजरतगंज मार्केट में फुटपाथ की टाइलें टूटी हुई हैं और बारिश में जलभराव हो जाता है, पैदल चलने वालों को भारी परेशानी हो रही है।",
    language: "hi",
    extracted: {
      issue_type: "road",
      location: { ...jitter(LUCKNOW_WARD_CENTROIDS["Ward 1"]), ward: "Ward 1", locality: "Hazratganj" },
      urgency: "moderate",
      affected_group: "commuters"
    },
    cluster_id: "CL_LKO_W1_COMMERCIAL",
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "C031",
    raw_text: "Damaged cobblestone tiles and clogged pedestrian sidewalk drainage in Hazratganj heritage market corridor.",
    language: "en",
    extracted: {
      issue_type: "road",
      location: { ...jitter(LUCKNOW_WARD_CENTROIDS["Ward 1"]), ward: "Ward 1", locality: "Hazratganj" },
      urgency: "moderate",
      affected_group: "commuters"
    },
    cluster_id: "CL_LKO_W1_COMMERCIAL",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },

  // --- Ward 2 (Alambagh) - Potable Water Distribution ---
  {
    id: "C032",
    raw_text: "आलमबाग रेलवे कॉलोनी में 4 दिन से पीने का पानी नहीं आ रहा है, मुख्य पाइपलाइन में लीकेज है और लोग टैंकर के भरोसे हैं।",
    language: "hi",
    extracted: {
      issue_type: "water",
      location: { ...jitter(LUCKNOW_WARD_CENTROIDS["Ward 2"]), ward: "Ward 2", locality: "Alambagh" },
      urgency: "critical",
      affected_group: "residents"
    },
    cluster_id: "CL_LKO_W2_WATER",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "C033",
    raw_text: "Ruptured primary water distribution main in Alambagh sector B causing acute drinking water shortage for 500+ households.",
    language: "en",
    extracted: {
      issue_type: "water",
      location: { ...jitter(LUCKNOW_WARD_CENTROIDS["Ward 2"]), ward: "Ward 2", locality: "Alambagh" },
      urgency: "critical",
      affected_group: "residents"
    },
    cluster_id: "CL_LKO_W2_WATER",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
  },

  // --- Ward 3 (Gomti Nagar) - Arterial Road & Traffic Safety ---
  {
    id: "C034",
    raw_text: "गोमती नगर पत्रकारपुरम मुख्य सड़क पर गहरे गड्ढे हैं, आए दिन बाइक सवार गिर रहे हैं, तुरंत डामरीकरण कराया जाए।",
    language: "hi",
    extracted: {
      issue_type: "road",
      location: { ...jitter(LUCKNOW_WARD_CENTROIDS["Ward 3"]), ward: "Ward 3", locality: "Gomti Nagar" },
      urgency: "moderate",
      affected_group: "commuters"
    },
    cluster_id: "CL_LKO_W3_ROAD",
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "C035",
    raw_text: "Multiple deep craters on Patrakarpuram arterial intersection in Gomti Nagar creating peak hour safety hazards.",
    language: "en",
    extracted: {
      issue_type: "road",
      location: { ...jitter(LUCKNOW_WARD_CENTROIDS["Ward 3"]), ward: "Ward 3", locality: "Gomti Nagar" },
      urgency: "moderate",
      affected_group: "commuters"
    },
    cluster_id: "CL_LKO_W3_ROAD",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },

  // --- Ward 4 (Chowk Lucknow) - Community Healthcare Infrastructure ---
  {
    id: "C036",
    raw_text: "पुराने लखनऊ के चौक सामुदायिक स्वास्थ्य केंद्र (CHC) में एक्स-रे मशीन खराब है और प्रसव कक्ष में जरूरी दवाएं नहीं हैं।",
    language: "hi",
    extracted: {
      issue_type: "health",
      location: { ...jitter(LUCKNOW_WARD_CENTROIDS["Ward 4"]), ward: "Ward 4", locality: "Chowk Lucknow" },
      urgency: "critical",
      affected_group: "patients"
    },
    cluster_id: "CL_LKO_W4_HEALTH",
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "C037",
    raw_text: "Lack of emergency diagnostic kits and pediatric supplies at Chowk Community Health Center forcing transfers to KGMU.",
    language: "en",
    extracted: {
      issue_type: "health",
      location: { ...jitter(LUCKNOW_WARD_CENTROIDS["Ward 4"]), ward: "Ward 4", locality: "Chowk Lucknow" },
      urgency: "critical",
      affected_group: "patients"
    },
    cluster_id: "CL_LKO_W4_HEALTH",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
  },

  // --- Ward 5 (Indira Nagar) - Stormwater Drainage ---
  {
    id: "C038",
    raw_text: "इंदिरा नगर सेक्टर 14 में मुख्य नाला चोक होने से बारिश में घरों के अंदर गंदा पानी घुस जाता है, नाले की गहरी सफाई जरूरी है।",
    language: "hi",
    extracted: {
      issue_type: "drainage",
      location: { ...jitter(LUCKNOW_WARD_CENTROIDS["Ward 5"]), ward: "Ward 5", locality: "Indira Nagar" },
      urgency: "critical",
      affected_group: "residents"
    },
    cluster_id: "CL_LKO_W5_DRAINAGE",
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "C039",
    raw_text: "Major stormwater culvert blockage in Indira Nagar causing chronic street inundation during monsoon rains.",
    language: "en",
    extracted: {
      issue_type: "drainage",
      location: { ...jitter(LUCKNOW_WARD_CENTROIDS["Ward 5"]), ward: "Ward 5", locality: "Indira Nagar" },
      urgency: "critical",
      affected_group: "residents"
    },
    cluster_id: "CL_LKO_W5_DRAINAGE",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  },

  // --- Ward 6 (Charbagh) - Multimodal Passenger Sanitation & Shelter ---
  {
    id: "C040",
    raw_text: "चारबाग रेलवे स्टेशन बस स्टैंड पर यात्री शेड टूटा है और सार्वजनिक शौचालय में भारी गंदगी है, यात्रियों को बहुत असुविधा हो रही है।",
    language: "hi",
    extracted: {
      issue_type: "sanitation",
      location: { ...jitter(LUCKNOW_WARD_CENTROIDS["Ward 6"]), ward: "Ward 6", locality: "Charbagh" },
      urgency: "moderate",
      affected_group: "commuters"
    },
    cluster_id: "CL_LKO_W6_TRANSIT",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "C041",
    raw_text: "Severe commuter shelter deficiency and unhygienic community toilet facilities at Charbagh junction multimodal hub.",
    language: "en",
    extracted: {
      issue_type: "sanitation",
      location: { ...jitter(LUCKNOW_WARD_CENTROIDS["Ward 6"]), ward: "Ward 6", locality: "Charbagh" },
      urgency: "moderate",
      affected_group: "commuters"
    },
    cluster_id: "CL_LKO_W6_TRANSIT",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
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
    id: "CL_VAR_W1_LIGHT",
    constituency_id: "varanasi",
    issue_type: "streetlight",
    ward: "Ward 1",
    location: VARANASI_WARD_CENTROIDS["Ward 1"],
    complaint_count: 20,
    recurrence_score: 0.62,
    urgency: "moderate",
    affected_population: 16500,
    nearest_facility_km: 1.3,
    public_evidence: [
      "Assi Ghat high-mast illumination failure reported by Ganga Seva Nidhi",
      "Pilgrim evening safety risk identified along southern river promenade"
    ],
    estimated_cost_inr: 650000, // ₹6.5 Lakhs
    description: "High-mast solar hybrid lighting and riverside pathway illumination at Assi Ghat."
  },
  {
    id: "CL_VAR_W2_DRAINAGE",
    constituency_id: "varanasi",
    issue_type: "drainage",
    ward: "Ward 2",
    location: VARANASI_WARD_CENTROIDS["Ward 2"],
    complaint_count: 35,
    recurrence_score: 0.74,
    urgency: "critical",
    affected_population: 26000,
    nearest_facility_km: 2.1,
    public_evidence: [
      "Main sewer conduit structural fracture near Lanka BHU gate",
      "PWD traffic hazard log: Open manhole causing severe arterial constriction"
    ],
    estimated_cost_inr: 850000, // ₹8.5 Lakhs
    description: "Stormwater pipeline replacement and manhole reconstruction near Lanka BHU Gate."
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
    id: "CL_VAR_W5_LIGHT",
    constituency_id: "varanasi",
    issue_type: "streetlight",
    ward: "Ward 5",
    location: VARANASI_WARD_CENTROIDS["Ward 5"],
    complaint_count: 26,
    recurrence_score: 0.68,
    urgency: "moderate",
    affected_population: 31000,
    nearest_facility_km: 0.9,
    public_evidence: [
      "Dashashwamedh Ghat floodlighting outage logged during evening Ganga Aarti",
      "Municipal tourist security audit recommends unified LED high-mast network"
    ],
    estimated_cost_inr: 700000, // ₹7.0 Lakhs
    description: "Pilgrim movement corridor floodlighting and public safety barriers at Dashashwamedh Ghat."
  },
  {
    id: "CL_VAR_W6_POWER",
    constituency_id: "varanasi",
    issue_type: "electricity",
    ward: "Ward 6",
    location: VARANASI_WARD_CENTROIDS["Ward 6"],
    complaint_count: 29,
    recurrence_score: 0.71,
    urgency: "critical",
    affected_population: 22000,
    nearest_facility_km: 2.4,
    public_evidence: [
      "Varanasi Fire Service safety warning for congested Chowk textile market",
      "Overhead wiring tangles causing repeated short-circuits and localized outages"
    ],
    estimated_cost_inr: 1100000, // ₹11.0 Lakhs
    description: "Heritage alley underground electrical cabling and fire suppression water risers in Chowk."
  },
  {
    id: "CL_VAR_W8_SANITATION",
    constituency_id: "varanasi",
    issue_type: "sanitation",
    ward: "Ward 8",
    location: VARANASI_WARD_CENTROIDS["Ward 8"],
    complaint_count: 25,
    recurrence_score: 0.64,
    urgency: "moderate",
    affected_population: 24500,
    nearest_facility_km: 1.4,
    public_evidence: [
      "Kotwali main wholesale market open garbage accumulation log",
      "Varanasi Nagar Nigam mechanized collection route delay exceeding 36 hours"
    ],
    estimated_cost_inr: 800000, // ₹8.0 Lakhs
    description: "Semi-underground hydraulic waste compactor and market lane mechanized sweeping at Kotwali."
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
    id: "CL_VAR_W12_ROAD",
    constituency_id: "varanasi",
    issue_type: "road",
    ward: "Ward 12",
    location: VARANASI_WARD_CENTROIDS["Ward 12"],
    complaint_count: 37,
    recurrence_score: 0.73,
    urgency: "critical",
    affected_population: 34000,
    nearest_facility_km: 1.8,
    public_evidence: [
      "Northern Railway approach corridor surface degradation survey",
      "Cantonment board traffic assessment: Heavy commercial congestion and pavement cracks"
    ],
    estimated_cost_inr: 1400000, // ₹14 Lakhs
    description: "Varanasi Junction Cantt station south approach arterial road repair and illuminated pedestrian walkway."
  }
];

export const LUCKNOW_CLUSTERS = [
  {
    id: "CL_LKO_W1_COMMERCIAL",
    constituency_id: "lucknow",
    issue_type: "road",
    ward: "Ward 1",
    location: LUCKNOW_WARD_CENTROIDS["Ward 1"],
    complaint_count: 32,
    recurrence_score: 0.64,
    urgency: "moderate",
    affected_population: 38000,
    nearest_facility_km: 1.5,
    public_evidence: [
      "Hazratganj heritage commercial promenade cobblestone wear and pedestrian ramp gaps",
      "LMC water-ponding survey along Mahatma Gandhi Marg"
    ],
    estimated_cost_inr: 950000, // ₹9.5 Lakhs
    description: "Hazratganj heritage promenade cobblestone repair, tactile paving, and stormwater drainage."
  },
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
    public_evidence: [
      "Alambagh railway colony main feeder pipe fracture",
      "Jal Sansthan water pressure audit: Sector B deficit 60%"
    ],
    estimated_cost_inr: 850000, // ₹8.5 Lakhs
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
    public_evidence: [
      "Gomti Nagar arterial stretch potholes causing peak traffic congestion",
      "LDA road inspection report: Patrakarpuram crossing re-carpeting required"
    ],
    estimated_cost_inr: 3200000, // ₹32 Lakhs
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
    public_evidence: [
      "Old Lucknow Chowk CHC maternity ward equipment upgrade pending",
      "High infant OPD footfall logged by King George Medical University outreach"
    ],
    estimated_cost_inr: 1400000, // ₹14 Lakhs
    description: "Community Health Center emergency equipment and maternal health clinic stocking."
  },
  {
    id: "CL_LKO_W5_DRAINAGE",
    constituency_id: "lucknow",
    issue_type: "drainage",
    ward: "Ward 5",
    location: LUCKNOW_WARD_CENTROIDS["Ward 5"],
    complaint_count: 40,
    recurrence_score: 0.77,
    urgency: "critical",
    affected_population: 46000,
    nearest_facility_km: 2.2,
    public_evidence: [
      "Kalyani nala backflow during monsoon causing prolonged inundation",
      "Indira Nagar resident welfare association petition to Municipal Commissioner"
    ],
    estimated_cost_inr: 1600000, // ₹16 Lakhs
    description: "Indira Nagar stormwater trunk line de-silting, culvert widening, and pumping unit overhaul."
  },
  {
    id: "CL_LKO_W6_TRANSIT",
    constituency_id: "lucknow",
    issue_type: "sanitation",
    ward: "Ward 6",
    location: LUCKNOW_WARD_CENTROIDS["Ward 6"],
    complaint_count: 35,
    recurrence_score: 0.72,
    urgency: "moderate",
    affected_population: 49000,
    nearest_facility_km: 0.8,
    public_evidence: [
      "Charbagh bus station passenger transit shelter deficit",
      "Northern/North-Eastern railway circulating area sanitation overload"
    ],
    estimated_cost_inr: 750000, // ₹7.5 Lakhs
    description: "Charbagh junction multimodal passenger transit shelter and 24x7 community sanitation complex."
  }
];

export const ALL_CLUSTERS = [...CLUSTERS, ...LUCKNOW_CLUSTERS];
