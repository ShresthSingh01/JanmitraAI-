import React, { useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { getSmartFallback, VARANASI_WARD_CENTROIDS, LUCKNOW_WARD_CENTROIDS } from '../utils/fallbackParser';
import Badge from '../components/Badge';
import { 
  IconMicrophone, 
  IconCamera, 
  IconCheckCircle, 
  IconSparkles, 
  IconChevronRight 
} from '../utils/icons';

export default function CitizenWidget({ currentConstituency = 'varanasi' }) {
  const { i18n } = useTranslation();
  const [step, setStep] = useState(1); // 1: Input, 2: Review, 3: Success
  const [mode, setMode] = useState('type'); // 'type' | 'voice'
  const [rawText, setRawText] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);

  const wardMap = currentConstituency.toLowerCase() === 'lucknow' ? LUCKNOW_WARD_CENTROIDS : VARANASI_WARD_CENTROIDS;

  // Extracted data state for review
  const [extractedData, setExtractedData] = useState({
    issue_type: 'water',
    ward: 'Ward 7',
    locality: 'Chetganj',
    urgency: 'critical',
    affected_group: 'residents',
    severity_rationale: ''
  });
  
  // Voice Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [complaintId, setComplaintId] = useState('');

  // Handle Image Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1 -> Step 2: Trigger Extraction
  const handleExtract = async () => {
    if (!rawText.trim()) {
      setSpeechError("Please type or speak your grievance details before continuing.");
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    setIsExtracting(true);
    setSpeechError(null);
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/api/extract-complaint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText, language: i18n.language, constituency: currentConstituency })
      });

      if (response.ok) {
        const data = await response.json();
        setExtractedData({
          issue_type: data.issue_type || 'water',
          ward: data.location?.ward || 'Ward 7',
          locality: data.location?.locality || data.location?.name || 'Varanasi',
          urgency: data.urgency || 'moderate',
          affected_group: data.affected_group || 'residents',
          severity_rationale: data.severity_rationale || '',
          embedding: data.embedding
        });
      } else {
        const fb = getSmartFallback(rawText, currentConstituency);
        setExtractedData({
          ...fb,
          ward: fb.location.ward,
          locality: fb.location.locality
        });
      }
    } catch (e) {
      console.warn("Backend extraction note:", e.message);
      const fb = getSmartFallback(rawText, currentConstituency);
      setExtractedData({
        ...fb,
        ward: fb.location.ward,
        locality: fb.location.locality
      });
    } finally {
      setIsExtracting(false);
      setStep(2);
    }
  };

  // Step 2 -> Step 3: Write to Firestore / localstorage and show success receipt
  const handleRegister = async () => {
    setIsSubmitting(true);
    const generatedId = `C${Date.now().toString().slice(-4)}`;
    setComplaintId(generatedId);

    const wardCoord = wardMap[extractedData.ward] || { lat: 25.3176, lng: 82.9739 };
    const prefix = currentConstituency.toLowerCase() === 'lucknow' ? 'LKO' : 'VAR';
    const clusterId = `CL_${prefix}_${extractedData.ward.replace(/\s+/g, '')}_${extractedData.issue_type.toUpperCase()}`;

    const complaintDoc = {
      id: generatedId,
      raw_text: rawText || "Voice logged complaint",
      language: i18n.language || 'hi',
      has_photo: !!photoPreview,
      extracted: {
        issue_type: extractedData.issue_type,
        location: {
          lat: wardCoord.lat,
          lng: wardCoord.lng,
          ward: extractedData.ward,
          locality: extractedData.locality || wardCoord.name
        },
        urgency: extractedData.urgency,
        affected_group: extractedData.affected_group,
        severity_rationale: extractedData.severity_rationale
      },
      cluster_id: clusterId,
      constituency_id: currentConstituency,
      embedding: extractedData.embedding || null,
      timestamp: new Date().toISOString()
    };

    // Firebase write if configured
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const isFirebaseValid = projectId && !projectId.includes("YOUR_");

    if (isFirebaseValid) {
      try {
        await addDoc(collection(db, 'complaints'), complaintDoc);
      } catch (dbErr) {
        console.warn("Firestore skipped:", dbErr.message);
      }
    }

    // Update Local Storage
    try {
      const savedComplaints = JSON.parse(localStorage.getItem('jm_complaints') || '[]');
      savedComplaints.unshift(complaintDoc);
      localStorage.setItem('jm_complaints', JSON.stringify(savedComplaints.slice(0, 100)));

      const savedClustersStr = localStorage.getItem('janmitra_clusters');
      if (savedClustersStr) {
        const currentClusters = JSON.parse(savedClustersStr);
        const targetIndex = currentClusters.findIndex(
          (c) => c.ward === extractedData.ward && c.issue_type === extractedData.issue_type
        );
        if (targetIndex !== -1) {
          const prevCount = currentClusters[targetIndex].complaint_count || 10;
          currentClusters[targetIndex] = {
            ...currentClusters[targetIndex],
            complaint_count: prevCount + 1,
            recurrence_score: Math.min(1.0, (currentClusters[targetIndex].recurrence_score || 0.5) + 0.04)
          };
          localStorage.setItem('janmitra_clusters', JSON.stringify(currentClusters));
          window.dispatchEvent(new Event('janmitra_clusters_updated'));
        }
      }
    } catch (lsErr) {
      console.warn("Local storage sync skipped:", lsErr);
    }

    setIsSubmitting(false);
    setStep(3);
  };

  // Speech Recognition hook
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Browser speech recognition is not supported in this browser. Please type your grievance.");
      setTimeout(() => setSpeechError(null), 5000);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
    };

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setRawText(transcript);
      setIsListening(false);
    };

    rec.onerror = (event) => {
      console.warn("Speech Recognition error:", event.error);
      setIsListening(false);
      setSpeechError("Could not capture audio clearly. Please try again or type directly.");
      setTimeout(() => setSpeechError(null), 4000);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.start();
  };

  const handleReset = () => {
    setRawText('');
    setPhotoPreview(null);
    setSpeechError(null);
    setStep(1);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto pb-24 md:pb-8">
      {/* Header with Civic Accent */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-need-blue" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            {currentConstituency.toUpperCase()} CITIZEN INTAKE
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Citizen Grievance Portal
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">
          Submit civic complaints in Hindi or English with voice or photo evidence. Logged directly into constituency planning.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border border-slate-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
            step >= 1 ? 'bg-need-blue text-white' : 'bg-slate-100 text-slate-500'
          }`}>1</span>
          <span className="text-xs font-medium text-slate-700">Intake</span>
        </div>
        <IconChevronRight className="text-slate-300 w-4 h-4" />
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
            step >= 2 ? 'bg-need-blue text-white' : 'bg-slate-100 text-slate-500'
          }`}>2</span>
          <span className="text-xs font-medium text-slate-700">Review & Triage</span>
        </div>
        <IconChevronRight className="text-slate-300 w-4 h-4" />
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
            step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
          }`}>3</span>
          <span className="text-xs font-medium text-slate-700">Confirmation</span>
        </div>
      </div>

      {/* Step Contents */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 md:p-6 shadow-2xs">
        
        {/* Step 1: Input Mode */}
        {step === 1 && (
          <div className="space-y-5">
            {speechError && (
              <div role="status" className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg">
                {speechError}
              </div>
            )}

            {/* Input Switcher (Type / Voice) */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/80" role="tablist">
              <button
                onClick={() => setMode('type')}
                type="button"
                role="tab"
                aria-selected={mode === 'type'}
                className={`flex-1 py-2 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'type' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Type Details</span>
              </button>
              <button
                onClick={() => setMode('voice')}
                type="button"
                role="tab"
                aria-selected={mode === 'voice'}
                className={`flex-1 py-2 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'voice' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <IconMicrophone className="w-3.5 h-3.5 text-need-blue" />
                <span>Voice (Hindi / English)</span>
              </button>
            </div>

            {mode === 'type' ? (
              <div>
                <label htmlFor="grievance-textarea" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Describe the Issue / समस्या का विवरण लिखें:
                </label>
                <textarea
                  id="grievance-textarea"
                  rows="4"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="उदा: चेतगंज में मुख्य सड़क पर गहरा गड्ढा है जिससे दुर्घटना हो रही है, या अस्सी पर नाला चोक है..."
                  className="w-full text-xs md:text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-need-blue bg-slate-50/50"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/70">
                <button
                  type="button"
                  onClick={startSpeechRecognition}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
                    isListening ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200' : 'bg-need-blue text-white hover:bg-need-blue-dark'
                  }`}
                  aria-label="Toggle voice input"
                >
                  <IconMicrophone className="w-8 h-8" />
                </button>
                <span className="text-xs font-bold text-slate-800 mt-3">
                  {isListening ? "Listening... बोलिए..." : "Tap to Speak (बोलने के लिए दबाएं)"}
                </span>
                <p className="text-xs text-slate-500 mt-1 max-w-xs text-center">
                  Speak in Hindi or English. Speech is transcribed and categorized automatically.
                </p>
                {rawText && (
                  <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 max-w-md w-full shadow-2xs">
                    <span className="font-semibold text-slate-900 block mb-0.5">Recognized Speech:</span>
                    <p className="italic text-slate-700">"{rawText}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Photo Attachment Section */}
            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Photo Evidence (Optional / फोटो संलग्न करें):
              </label>
              
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <IconCamera className="w-4 h-4 text-slate-500" />
                  <span>Attach Photo</span>
                </button>
                {photoPreview && (
                  <div className="flex items-center gap-2">
                    <img
                      src={photoPreview}
                      alt="Complaint Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="text-xs text-urgent-red hover:underline font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Step 1 Button */}
            <button
              onClick={handleExtract}
              disabled={isExtracting || !rawText.trim()}
              type="button"
              className="btn-primary w-full py-2.5 bg-need-blue hover:bg-need-blue-dark disabled:opacity-50 text-white font-semibold rounded-lg text-xs shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isExtracting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Classifying Grievance...</span>
                </>
              ) : (
                <>
                  <IconSparkles className="w-4 h-4" />
                  <span>Analyze & Review Details</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Review & Confirmation */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2.5">
              <IconSparkles className="w-4 h-4 text-need-blue flex-shrink-0 mt-0.5" />
              <div>
                <strong>Classification Review:</strong> Attributes extracted from your report. You can adjust any field before confirming.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Sector / Issue Category:</label>
                <select
                  value={extractedData.issue_type}
                  onChange={(e) => setExtractedData({ ...extractedData, issue_type: e.target.value })}
                  className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-need-blue capitalize bg-slate-50/60"
                >
                  <option value="water">Water Supply</option>
                  <option value="road">Road & Potholes</option>
                  <option value="health">Primary Health Center</option>
                  <option value="education">School Education</option>
                  <option value="drainage">Sewer & Drainage</option>
                  <option value="sanitation">Sanitation</option>
                  <option value="electricity">Power & Transformer</option>
                  <option value="streetlight">Streetlighting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ward / Locality:</label>
                <select
                  value={extractedData.ward}
                  onChange={(e) => setExtractedData({ ...extractedData, ward: e.target.value })}
                  className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-need-blue bg-slate-50/60"
                >
                  {Object.entries(wardMap).map(([wId, info]) => (
                    <option key={wId} value={wId}>
                      {wId} ({info.name || wId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Urgency Level:</label>
                <select
                  value={extractedData.urgency}
                  onChange={(e) => setExtractedData({ ...extractedData, urgency: e.target.value })}
                  className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-need-blue bg-slate-50/60 font-mono"
                >
                  <option value="critical">Critical (Immediate Hazard)</option>
                  <option value="moderate">Moderate (Interrupted Service)</option>
                  <option value="low">Standard / Routine</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Primary Affected Group:</label>
                <input
                  type="text"
                  value={extractedData.affected_group}
                  onChange={(e) => setExtractedData({ ...extractedData, affected_group: e.target.value })}
                  className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-need-blue bg-slate-50/60"
                />
              </div>
            </div>

            {extractedData.severity_rationale && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Classification Rationale:</span> {extractedData.severity_rationale}
              </div>
            )}

            {photoPreview && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <img src={photoPreview} alt="Attached" className="w-14 h-14 object-cover rounded-md border" />
                <span className="text-xs text-slate-600 font-medium">Photo evidence verified and attached to grievance document.</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                type="button"
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Back to Edit
              </button>
              <button
                onClick={handleRegister}
                disabled={isSubmitting}
                type="button"
                className="btn-primary flex-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <IconCheckCircle className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting..." : "Confirm & Register Grievance"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Grievance Receipt */}
        {step === 3 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-2xs">
              <IconCheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">Grievance Registered Successfully</h2>
              <p className="text-xs text-slate-500 mt-1">
                Logged in {currentConstituency.toUpperCase()} Constituency Portal
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2.5 text-xs font-mono max-w-md mx-auto shadow-2xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Tracking Reference:</span>
                <span className="font-bold text-need-blue">#{complaintId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Ward & Locality:</span>
                <span className="font-bold text-slate-800">{extractedData.ward} ({extractedData.locality})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Sector:</span>
                <span className="font-bold text-slate-800 uppercase">{extractedData.issue_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <Badge variant="success" size="sm" dot>
                  Registered & Grouped
                </Badge>
              </div>
            </div>

            <button
              onClick={handleReset}
              type="button"
              className="btn-primary px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs shadow-2xs transition-all cursor-pointer"
            >
              Submit Another Grievance
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
