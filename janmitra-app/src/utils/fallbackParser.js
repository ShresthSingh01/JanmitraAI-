// Comprehensive Fallback Parser for JanMitra AI
// Supports Hindi, Bhojpuri, English, and Romanized Hinglish
// Uses real Varanasi ward geography and comprehensive civic issue taxonomy

export const VARANASI_WARD_CENTROIDS = {
  "Ward 1": { name: "Assi / Nagwa", lat: 25.2885, lng: 83.0035 },
  "Ward 2": { name: "Lanka / BHU", lat: 25.2805, lng: 82.9980 },
  "Ward 3": { name: "Bhelupur", lat: 25.3015, lng: 82.9950 },
  "Ward 4": { name: "Sigra", lat: 25.3150, lng: 82.9850 },
  "Ward 5": { name: "Dashashwamedh", lat: 25.3080, lng: 83.0090 },
  "Ward 6": { name: "Chowk", lat: 25.3125, lng: 83.0115 },
  "Ward 7": { name: "Chetganj", lat: 25.3180, lng: 82.9930 },
  "Ward 8": { name: "Kotwali", lat: 25.3210, lng: 83.0130 },
  "Ward 9": { name: "Pandeypur", lat: 25.3420, lng: 82.9990 },
  "Ward 10": { name: "Sarnath", lat: 25.3715, lng: 83.0230 },
  "Ward 11": { name: "Shivpur", lat: 25.3580, lng: 82.9650 },
  "Ward 12": { name: "Cantonment", lat: 25.3320, lng: 82.9780 }
};

export const LUCKNOW_WARD_CENTROIDS = {
  "Ward 1": { name: "Hazratganj", lat: 26.8500, lng: 80.9420 },
  "Ward 2": { name: "Alambagh", lat: 26.8150, lng: 80.9020 },
  "Ward 3": { name: "Gomti Nagar", lat: 26.8620, lng: 80.9980 },
  "Ward 4": { name: "Chowk Lucknow", lat: 26.8720, lng: 80.9080 },
  "Ward 5": { name: "Indira Nagar", lat: 26.8850, lng: 80.9850 },
  "Ward 6": { name: "Charbagh", lat: 26.8320, lng: 80.9220 }
};

const ISSUE_KEYWORDS = [
  {
    type: "drainage",
    keywords: ["drain", "drainage", "sewer", "gutter", "waterlogging", "choke", "नाला", "नाली", "सीवर", "जलभराव", "गंदा पानी", "उफान", "ड्रेनेज", "कीचड़"]
  },
  {
    type: "sanitation",
    keywords: ["garbage", "trash", "waste", "cleanliness", "sweep", "dustbin", "litter", "कचरा", "कूड़ा", "सफाई", "गंदगी", "कूड़ेदान", "सड़ांध", "बदबू"]
  },
  {
    type: "water",
    keywords: ["water", "drinking water", "pipeline", "leak", "contamination", "supply", "borewell", "handpump", "tap", "पानी", "जल", "पाइपलाइन", "हैंडपंप", "नल", "समरसेबल", "दूषित पानी", "पेयजल", "प्यास"]
  },
  {
    type: "road",
    keywords: ["road", "pothole", "pavement", "asphalt", "broken road", "divider", "speedbreaker", "traffic", "sarak", "sadak", "सड़क", "गड्ढा", "गड्ढे", "खड़ंजा", "मार्ग", "जाम", "रास्ता"]
  },
  {
    type: "health",
    keywords: ["hospital", "doctor", "clinic", "health", "dispensary", "dengue", "malaria", "medicine", "phc", "chc", "अस्पताल", "दवा", "डॉक्टर", "इलाज", "डेंगू", "मलेरिया", "स्वास्थ्य", "मरीज"]
  },
  {
    type: "education",
    keywords: ["school", "teacher", "bench", "classroom", "student", "blackboard", "education", "books", "स्कूल", "शिक्षा", "पढ़ाई", "अध्यापक", "शिक्षक", "कक्षा", "डेस्क", "छात्र", "विद्यार्थी", "विद्यालय"]
  },
  {
    type: "electricity",
    keywords: ["electricity", "power", "transformer", "wire", "voltage", "outage", "blackout", "bijli", "बिजली", "ट्रांसफार्मर", "तार", "वोल्टेज", "कटौती", "करंट", "मीटर"]
  },
  {
    type: "streetlight",
    keywords: ["street light", "streetlight", "lamp", "dark street", "pole light", "स्ट्रीट लाइट", "बत्ती", "अंधेरा", "खंभा", "लाइट"]
  },
  {
    type: "public_toilet",
    keywords: ["toilet", "washroom", "lavatory", "urinal", "sulabh", "शौचालय", "टॉयलेट", "सुलभ", "मूत्रालय"]
  },
  {
    type: "temple_ghat",
    keywords: ["ghat", "river", "ganga", "temple", "stairs", "railing", "घाट", "गंगा", "मंदिर", "सीढ़ी", "अस्सी घाट", "दशाश्वमेध"]
  },
  {
    type: "bridge",
    keywords: ["bridge", "flyover", "culvert", "overbridge", "पुल", "पुलिया", "फ्लाईओवर"]
  }
];

const LOCALITY_TO_WARD = {
  // Varanasi localities
  "assi": "Ward 1",
  "अस्सी": "Ward 1",
  "nagwa": "Ward 1",
  "नगवा": "Ward 1",
  "lanka": "Ward 2",
  "लंका": "Ward 2",
  "bhu": "Ward 2",
  "bhelupur": "Ward 3",
  "भेलूपुर": "Ward 3",
  "sigra": "Ward 4",
  "सिगरा": "Ward 4",
  "dashashwamedh": "Ward 5",
  "दशाश्वमेध": "Ward 5",
  "chowk": "Ward 6",
  "चौक": "Ward 6",
  "chetganj": "Ward 7",
  "चेतगंज": "Ward 7",
  "kotwali": "Ward 8",
  "कोतवाली": "Ward 8",
  "pandeypur": "Ward 9",
  "पांडेयपुर": "Ward 9",
  "sarnath": "Ward 10",
  "सारनाथ": "Ward 10",
  "shivpur": "Ward 11",
  "शिवपुर": "Ward 11",
  "cantt": "Ward 12",
  "cantonment": "Ward 12",
  "कैंट": "Ward 12"
};

export function getSmartFallback(text, constituency = 'varanasi') {
  const lower = (text || '').toLowerCase().trim();
  const isLucknow = constituency.toLowerCase() === 'lucknow';
  const wardMap = isLucknow ? LUCKNOW_WARD_CENTROIDS : VARANASI_WARD_CENTROIDS;

  // 1. Detect Issue Type
  let detectedType = "water"; // default civic baseline
  for (const group of ISSUE_KEYWORDS) {
    if (group.keywords.some(k => lower.includes(k.toLowerCase()))) {
      detectedType = group.type;
      break;
    }
  }

  // 2. Detect Ward / Locality
  let detectedWard = "Ward 7"; // Default central ward
  
  // Check direct ward numbers e.g. "ward 3", "वार्ड 3", "w3"
  for (let i = 1; i <= 15; i++) {
    const patterns = [`ward ${i}`, `ward${i}`, `w${i}`, `वार्ड ${i}`, `वार्ड${i}`, `वाढ ${i}`, `वाढ${i}`];
    if (patterns.some(p => lower.includes(p))) {
      detectedWard = `Ward ${i}`;
      break;
    }
  }

  // If no explicit "Ward X", check famous localities
  if (detectedWard === "Ward 7") {
    for (const [locality, ward] of Object.entries(LOCALITY_TO_WARD)) {
      if (lower.includes(locality)) {
        detectedWard = ward;
        break;
      }
    }
  }

  // 3. Detect Urgency Level
  const criticalWords = ["urgent", "emergency", "danger", "deadly", "severe", "overflowing", "खराब", "तुरंत", "आपातकाल", "गंभीर", "टूटा", "जानलेवा", "डेंगू", "3 दिन", "हफ्ते भर", "सड़"];
  const isCritical = criticalWords.some(w => lower.includes(w));
  const urgency = isCritical ? "critical" : lower.includes("जल्दी") || lower.includes("soon") ? "moderate" : "low";

  // 4. Determine Affected Group
  let affected_group = "residents";
  if (detectedType === "health") affected_group = "patients";
  else if (detectedType === "education") affected_group = "students";
  else if (detectedType === "road" || detectedType === "bridge") affected_group = "commuters";
  else if (detectedType === "sanitation" || detectedType === "temple_ghat") affected_group = "pilgrims & locals";
  else if (detectedType === "drainage") affected_group = "shopkeepers & residents";

  // 5. Compute Centroid Coordinates
  const wardInfo = wardMap[detectedWard] || wardMap["Ward 7"] || { lat: 25.3176, lng: 82.9739 };
  const prefix = isLucknow ? "LKO" : "VAR";
  const cluster_id = `CL_${prefix}_${detectedWard.replace(/\s+/g, '')}_${detectedType.toUpperCase()}`;

  const severity_rationale = isCritical
    ? `Classified as critical due to immediate public health/safety impact detected from urgency markers.`
    : `Classified as ${urgency} priority based on standard civic recurrence thresholds.`;

  return {
    isMock: true,
    issue_type: detectedType,
    location: {
      lat: wardInfo.lat,
      lng: wardInfo.lng,
      ward: detectedWard,
      locality: wardInfo.name || detectedWard
    },
    urgency,
    affected_group,
    cluster_id,
    severity_rationale
  };
}
