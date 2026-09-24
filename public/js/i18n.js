// ===================================================================
// NAGARIK-AI: Multilingual Translation Engine
// Supports English, Telugu (తెలుగు), Hindi (हिन्दी), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം)
// ===================================================================

const I18N_DATA = {
  en: {
    brandTitle: "NagarikAI",
    brandSubtitle: "Smart Civic Grievance & Redressal Hub",
    navReport: "Report Grievance",
    navTrack: "Live Tracker & Feed",
    navHeatmap: "Civic Heatmap & Analytics",
    navAdmin: "Municipal Operations",
    seniorMode: "Senior Mode",
    roleCitizen: "Citizen Portal",
    roleAdmin: "Officer Portal",
    
    // Report Form
    reportHeader: "AI-Powered Civic Issue Reporting",
    reportSubheader: "Snap a photo or speak in your regional language. AI detects the problem, captures GPS, and routes directly to authorities.",
    dropzoneText: "Drop civic issue photo or click to capture",
    dropzoneSub: "Supports JPG, PNG, WEBP up to 10MB • AI analyzes automatically",
    quickTestTitle: "Quick Test Scenarios:",
    voiceStudioTitle: "Voice-Based Complaint Recording",
    voicePrompt: "Click microphone to record your complaint in your mother tongue...",
    voiceListening: "Listening... Speak clearly about the civic problem.",
    voiceStop: "Stop Recording",
    
    // Triage Card
    triageTitle: "AI Triage & Department Routing",
    fieldTitle: "Grievance Title",
    fieldDesc: "Detailed Description (AI Generated)",
    fieldCategory: "Issue Category",
    fieldDept: "Responsible Department",
    fieldSeverity: "Assessed Severity",
    fieldLocation: "Incident Location & Ward",
    fieldLandmark: "Nearby Landmark",
    btnDetectGps: "Auto-Detect My GPS",
    btnSubmit: "Submit Civic Grievance",
    
    // Categories
    catPotholes: "Potholes & Road Cracks",
    catGarbage: "Solid Waste & Garbage Dumps",
    catWaterLeak: "Water Supply & Pipe Bursts",
    catDrainage: "Drainage Overflow & Sewage",
    catStreetlights: "Broken / Dark Streetlights",
    catRoadDamage: "Road Damage & Hazard",
    
    // Statuses
    statusReported: "Reported",
    statusTriaged: "AI Triaged",
    statusAssigned: "Officer Assigned",
    statusInProgress: "In Progress",
    statusResolved: "Resolved & Verified",
    
    // Notifications & Dupes
    duplicateAlert: "Similar Issue Found Nearby!",
    duplicateDesc: "A similar incident was already reported within 150m. Upvoting increases priority for faster municipal action.",
    btnUpvote: "Upvote (+1 Me Too)",
    btnIgnoreDup: "File Distinct Report"
  },

  te: {
    brandTitle: "నాగరిక్ AI",
    brandSubtitle: "స్మార్ట్ పౌర సమస్యల పరిష్కార వేదిక",
    navReport: "సమస్య నమోదు చేయండి",
    navTrack: "ప్రత్యక్ష స్థితి & ఫిర్యాదులు",
    navHeatmap: "హీట్‌మ్యాప్ & గణాంకాలు",
    navAdmin: "మున్సిపల్ కార్యకలాపాలు",
    seniorMode: "వృద్ధుల మోడ్",
    roleCitizen: "పౌరుల పోర్టల్",
    roleAdmin: "అధికారుల పోర్టల్",
    
    reportHeader: "AI ఆధారిత పౌర సమస్యల నమోదు",
    reportSubheader: "ఫోటో తీయండి లేదా మీ భాషలో మాట్లాడండి. AI స్వయంచాలకంగా సమస్యను గుర్తించి అధికారులకు పంపుతుంది.",
    dropzoneText: "సమస్య ఫోటో ఇక్కడ ఉంచండి లేదా తీయండి",
    dropzoneSub: "JPG, PNG, WEBP సపోర్ట్ చేస్తుంది • AI వెంటనే పరిశీలిస్తుంది",
    quickTestTitle: "త్వరిత పరీక్షలు:",
    voiceStudioTitle: "వాయిస్ ద్వారా ఫిర్యాదు నమోదు",
    voicePrompt: "మీ మాతృభాషలో ఫిర్యాదు చేయడానికి మైక్రోఫోన్ నొక్కండి...",
    voiceListening: "వినబడుతోంది... సమస్య గురించి స్పష్టంగా మాట్లాడండి.",
    voiceStop: "రికార్డింగ్ ఆపండి",
    
    triageTitle: "AI వర్గీకరణ & శాఖ కేటాయింపు",
    fieldTitle: "ఫిర్యాదు శీర్షిక",
    fieldDesc: "వివరమైన వివరణ (AI రూపొందించింది)",
    fieldCategory: "సమస్య వర్గం",
    fieldDept: "బాధ్యతాయుతమైన విభాగం",
    fieldSeverity: "తీవ్రత స్థాయి",
    fieldLocation: "సంఘటన స్థలం & వార్డు",
    fieldLandmark: "సమీప ల్యాండ్‌మార్క్",
    btnDetectGps: "నా GPS గుర్తించండి",
    btnSubmit: "ఫిర్యాదు సమర్పించండి",
    
    catPotholes: "గుంతలు & రోడ్డు పగుళ్లు",
    catGarbage: "చెత్త కుప్పలు & వ్యర్థాలు",
    catWaterLeak: "మంచినీటి పైపు లీకేజీ",
    catDrainage: "డ్రైనేజీ పొంగిపొర్లడం",
    catStreetlights: "వీధి దీపాలు వెలగకపోవడం",
    catRoadDamage: "రోడ్డు నష్టం & ప్రమాదాలు",
    
    statusReported: "నమోదైంది",
    statusTriaged: "AI విశ్లేషించింది",
    statusAssigned: "అధికారి కేటాయించబడ్డారు",
    statusInProgress: "పని జరుగుతోంది",
    statusResolved: "పరిష్కరించబడింది",
    
    duplicateAlert: "సమీపంలో ఇలాంటి సమస్య ఇప్పటికే ఉంది!",
    duplicateDesc: "150 మీటర్ల దూరంలో ఇప్పటికే ఫిర్యాదు నమోదైంది. మద్దతు ఇవ్వడం ద్వారా అధికారులు త్వరగా స్పందిస్తారు.",
    btnUpvote: "మద్దతు తెలపండి (+1)",
    btnIgnoreDup: "కొత్తగా నమోదు చేయండి"
  },

  hi: {
    brandTitle: "नागरिक AI",
    brandSubtitle: "स्मार्ट नागरिक शिकायत निवारण मंच",
    navReport: "शिकायत दर्ज करें",
    navTrack: "लाइव ट्रैकर और स्थिति",
    navHeatmap: "हीटमैप और विश्लेषण",
    navAdmin: "नगर निगम संचालन",
    seniorMode: "वरिष्ठ नागरिक मोड",
    roleCitizen: "नागरिक पोर्टल",
    roleAdmin: "अधिकारी पोर्टल",
    
    reportHeader: "AI-संचालित नागरिक समस्या निवारण",
    reportSubheader: "बस एक फोटो लें या अपनी भाषा में बोलें। AI स्वचालित रूप से समस्या की पहचान कर संबंधित विभाग को भेज देगा।",
    dropzoneText: "समस्या का फोटो अपलोड करें या खींचें",
    dropzoneSub: "JPG, PNG, WEBP समर्थित • AI तुरंत विश्लेषण करेगा",
    quickTestTitle: "त्वरित परीक्षण परिदृश्य:",
    voiceStudioTitle: "आवाज द्वारा शिकायत पंजीकरण",
    voicePrompt: "अपनी भाषा में शिकायत दर्ज करने के लिए माइक दबाएं...",
    voiceListening: "सुन रहा हूँ... कृपया समस्या के बारे में बताएं।",
    voiceStop: "रिकॉर्डिंग रोकें",
    
    triageTitle: "AI विश्लेषण और विभाग आवंटन",
    fieldTitle: "शिकायत का शीर्षक",
    fieldDesc: "विस्तृत विवरण (AI जनरेटेड)",
    fieldCategory: "समस्या श्रेणी",
    fieldDept: "संबंधित विभाग",
    fieldSeverity: "गंभीरता स्तर",
    fieldLocation: "घटना स्थल और वार्ड",
    fieldLandmark: "निकटतम लैंडमार्क",
    btnDetectGps: "मेरा GPS पता करें",
    btnSubmit: "शिकायत दर्ज करें",
    
    catPotholes: "सड़क के गड्ढे",
    catGarbage: "कचरे का ढेर व गंदगी",
    catWaterLeak: "पानी की पाइपलाइन रिसाव",
    catDrainage: "नाली ओवरफ्लो और सीवरेज",
    catStreetlights: "खराब स्ट्रीट लाइट",
    catRoadDamage: "सड़क क्षति व खतरा",
    
    statusReported: "दर्ज की गई",
    statusTriaged: "AI जांच पूर्ण",
    statusAssigned: "अधिकारी नियुक्त",
    statusInProgress: "कार्य प्रगति पर",
    statusResolved: "समाधान पूर्ण",
    
    duplicateAlert: "आस-पास ऐसी ही शिकायत मौजूद है!",
    duplicateDesc: "150 मीटर के दायरे में पहले से यह मुद्दा दर्ज है। समर्थन करने से प्राथमिकता बढ़ेगी।",
    btnUpvote: "समर्थन दें (+1)",
    btnIgnoreDup: "अलग शिकायत करें"
  },

  ta: {
    brandTitle: "நாகரிக் AI",
    brandSubtitle: "குடிமக்கள் குறைதீர்க்கும் தளம்",
    navReport: "புகார் பதிவு",
    navTrack: "நேரலை கண்காணிப்பு",
    navHeatmap: "வரைபடம் & பகுப்பாய்வு",
    navAdmin: "நிர்வாக மையம்",
    seniorMode: "முதியோர் முறை",
    roleCitizen: "குடிமக்கள் தளம்",
    roleAdmin: "அதிகாரிகள் தளம்",
    
    reportHeader: "AI மூலமாக புகார் பதிவு செய்யுங்கள்",
    reportSubheader: "புகைப்படம் எடுக்கவும் அல்லது குரல் மூலம் பேசவும். AI தானாகவே அதிகாரிகளுக்கு அனுப்பும்.",
    dropzoneText: "புகைப்படத்தை பதிவேற்றவும்",
    dropzoneSub: "AI தானாகவே வகைப்படுத்தும்",
    quickTestTitle: "மாதிரி சோதனைகள்:",
    voiceStudioTitle: "குரல் மூலம் புகார் பதிவு",
    voicePrompt: "பேசி பதிவு செய்ய மைக்ரோஃபோனை அழுத்தவும்...",
    voiceListening: "கேட்கிறது... பேசவும்.",
    voiceStop: "நிறுத்து",
    
    triageTitle: "AI ஒதுக்கீடு",
    fieldTitle: "புகார் தலைப்பு",
    fieldDesc: "விளக்கம்",
    fieldCategory: "வகை",
    fieldDept: "துறை",
    fieldSeverity: "தீவிரம்",
    fieldLocation: "இடம்",
    fieldLandmark: "அடையாளம்",
    btnDetectGps: "GPS கண்டறி",
    btnSubmit: "புகார் அனுப்புக",
    
    catPotholes: "சாலை பள்ளங்கள்",
    catGarbage: "குப்பை குவியல்",
    catWaterLeak: "குடிநீர் கசிவு",
    catDrainage: "கழிவுநீர் அடைப்பு",
    catStreetlights: "தெருவிளக்கு பிரச்சனை",
    catRoadDamage: "சேதமடைந்த சாலை",
    
    statusReported: "பதிவு செய்யப்பட்டது",
    statusTriaged: "AI சரிபார்த்தது",
    statusAssigned: "அதிகாரி நியமனம்",
    statusInProgress: "செயலில் உள்ளது",
    statusResolved: "தீர்க்கப்பட்டது",
    
    duplicateAlert: "அருகில் இதே போன்ற புகார் உள்ளது!",
    duplicateDesc: "இதற்கு ஆதரவு தெரிவிப்பதன் மூலம் விரைவில் நடவடிக்கை எடுக்கப்படும்.",
    btnUpvote: "ஆதரவு (+1)",
    btnIgnoreDup: "புதிய புகார்"
  },

  kn: {
    brandTitle: "ನಾಗರಿಕ್ AI",
    brandSubtitle: "ಸ್ಮಾರ್ಟ್ ಸಾರ್ವಜನಿಕ ಕುಂದುಕೊರತೆ ವೇದಿಕೆ",
    navReport: "ದೂರು ದಾಖಲಿಸಿ",
    navTrack: "ಲೈವ್ ಟ್ರ್ಯಾಕರ್",
    navHeatmap: "ಹೀಟ್‌ಮ್ಯಾಪ್ & ವಿಶ್ಲೇಷಣೆ",
    navAdmin: "ಅಧಿಕಾರಿಗಳ ನಿರ್ವಹಣೆ",
    seniorMode: "ಹಿರಿಯ ನಾಗರಿಕರ ಮೋಡ್",
    roleCitizen: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
    roleAdmin: "ಅಧಿಕಾರಿಗಳ ಪೋರ್ಟಲ್",
    
    reportHeader: "AI ಆಧಾರಿತ ಸಾರ್ವಜನಿಕ ಸಮಸ್ಯೆ ಪರಿಹಾರ",
    reportSubheader: "ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಧ್ವನಿ ಮೂಲಕ ದೂರು ನೀಡಿ. AI ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪರಿಶೀಲಿಸುತ್ತದೆ.",
    dropzoneText: "ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    dropzoneSub: "AI ತಕ್ಷಣ ವಿಶ್ಲೇಷಿಸುತ್ತದೆ",
    quickTestTitle: "ಮಾದರಿ ಪರೀಕ್ಷೆಗಳು:",
    voiceStudioTitle: "ಧ್ವನಿ ಮೂಲಕ ದೂರು",
    voicePrompt: "ಮಾತನಾಡಲು ಮೈಕ್ರೋಫೋನ್ ಒತ್ತಿರಿ...",
    voiceListening: "ಆಲಿಸುತ್ತಿದೆ... ಮಾತನಾಡಿ.",
    voiceStop: "ನಿಲ್ಲಿಸಿ",
    
    triageTitle: "AI ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಇಲಾಖೆ",
    fieldTitle: "ದೂರಿನ ಶೀರ್ಷಿಕೆ",
    fieldDesc: "ವಿವರಣೆ",
    fieldCategory: "ವರ್ಗ",
    fieldDept: "ಸಂಬಂಧಿತ ಇಲಾಖೆ",
    fieldSeverity: "ತೀವ್ರತೆ",
    fieldLocation: "ಸ್ಥಳ & ವಾರ್ಡ್",
    fieldLandmark: "ಹತ್ತಿರದ ಗುರುತು",
    btnDetectGps: "GPS ಪತ್ತೆ ಮಾಡಿ",
    btnSubmit: "ದೂರು ಸಲ್ಲಿಸಿ",
    
    catPotholes: "ರಸ್ತೆ ಗುಂಡಿಗಳು",
    catGarbage: "ಕಸದ ರಾಶಿ",
    catWaterLeak: "ನೀರಿನ ಸೋರಿಕೆ",
    catDrainage: "ಚರಂಡಿ ಬ್ಲಾಕ್",
    catStreetlights: "ಬೀದಿ ದೀಪ ದುರಸ್ತಿ",
    catRoadDamage: "ರಸ್ತೆ ಹಾನಿ",
    
    statusReported: "ದಾಖಲಾಗಿದೆ",
    statusTriaged: "AI ಪರಿಶೀಲಿಸಿದೆ",
    statusAssigned: "ಅಧಿಕಾರಿ ನೇಮಕ",
    statusInProgress: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    statusResolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    
    duplicateAlert: "ಸಮೀಪದಲ್ಲಿ ಇದೇ ರೀತಿಯ ದೂರು ಇದೆ!",
    duplicateDesc: "ಈ ದೂರಿಗೆ ಬೆಂಬಲ ನೀಡುವ ಮೂಲಕ ತ್ವರಿತ ಪರಿಹಾರ ಪಡೆಯಿರಿ.",
    btnUpvote: "ಬೆಂಬಲ ನೀಡಿ (+1)",
    btnIgnoreDup: "ಹೊಸ ದೂರು"
  },

  ml: {
    brandTitle: "നാഗരിക് AI",
    brandSubtitle: "പൗര പരാതി പരിഹാര പ്ലാറ്റ്ഫോം",
    navReport: "പരാതി നൽകുക",
    navTrack: "തത്സമയ ട്രാക്കർ",
    navHeatmap: "ഹീറ്റ്മാപ്പ് & വിശകലനം",
    navAdmin: "മുനിസിപ്പൽ അഡ്മിൻ",
    seniorMode: "മുതിർന്ന പൗരന്മാർക്ക്",
    roleCitizen: "പൗരന്മാരുടെ പോർട്ടൽ",
    roleAdmin: "ഉദ്യോഗസ്ഥ പോർട്ടൽ",
    
    reportHeader: "AI പൗര പരാതി പരിഹാരം",
    reportSubheader: "ഫോട്ടോ എടുക്കുകയോ സംസാരിക്കുകയോ ചെയ്യുക. AI സ്വയമേവ അധികാരികൾക്ക് കൈമാറും.",
    dropzoneText: "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
    dropzoneSub: "AI സ്വയമേവ വിശകലനം ചെയ്യുന്നു",
    quickTestTitle: "വേഗത്തിലുള്ള പരിശോധന:",
    voiceStudioTitle: "ശബ്ദത്തിലൂടെ പരാതി നൽകാം",
    voicePrompt: "സംസാരിക്കാൻ മൈക്രോഫോൺ അമർത്തുക...",
    voiceListening: "ശ്രദ്ധിക്കുന്നു... സംസാരിക്കുക.",
    voiceStop: "നിർത്തുക",
    
    triageTitle: "AI വിശകലനവും വകുപ്പും",
    fieldTitle: "തലക്കെട്ട്",
    fieldDesc: "വിശദമായ വിവരണം",
    fieldCategory: "വിഭാഗം",
    fieldDept: "ഉത്തരവാദപ്പെട്ട വകുപ്പ്",
    fieldSeverity: "തീവ്രത",
    fieldLocation: "സ്ഥലവും വാർഡും",
    fieldLandmark: "അടുത്തുള്ള അടയാളം",
    btnDetectGps: "GPS കണ്ടെത്തുക",
    btnSubmit: "പരാതി സമർപ്പിക്കുക",
    
    catPotholes: "റോഡിലെ കുഴികൾ",
    catGarbage: "മാലിന്യക്കൂമ്പാരം",
    catWaterLeak: "കുടിവെള്ള ചോർച്ച",
    catDrainage: "ഓടകളിലെ തടസ്സം",
    catStreetlights: "തെരുവ് വിളക്ക് തകരാർ",
    catRoadDamage: "റോഡ് തകർച്ച",
    
    statusReported: "രേഖപ്പെടുത്തി",
    statusTriaged: "AI പരിശോധിച്ചു",
    statusAssigned: "ഉദ്യോഗസ്ഥനെ നിയമിച്ചു",
    statusInProgress: "പുരോഗമിക്കുന്നു",
    statusResolved: "പരിഹരിച്ചു",
    
    duplicateAlert: "സമീപത്ത് സമാന പരാതി നിലവിലുണ്ട്!",
    duplicateDesc: "ഇതിനെ പിന്തുണയ്ക്കുന്നത് വേഗത്തിലുള്ള നടപടിക്ക് സഹായിക്കും.",
    btnUpvote: "പിന്തുണയ്ക്കുക (+1)",
    btnIgnoreDup: "പുതിയ പരാതി നൽകുക"
  }
};

let currentLang = 'en';

function setLanguage(lang) {
  if (!I18N_DATA[lang]) lang = 'en';
  currentLang = lang;
  localStorage.setItem('nagarik_lang', lang);
  applyTranslations();
  
  // Update select dropdown value
  const select = document.getElementById('langSelect');
  if (select && select.value !== lang) {
    select.value = lang;
  }
}

function t(key) {
  const dict = I18N_DATA[currentLang] || I18N_DATA['en'];
  return dict[key] || I18N_DATA['en'][key] || key;
}

function applyTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = translated;
    } else {
      el.textContent = translated;
    }
  });

  // Announce in accessible mode if active
  if (document.body.classList.contains('accessible-mode')) {
    speakText(`Language switched to ${currentLang.toUpperCase()}`);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('nagarik_lang') || 'en';
  setLanguage(savedLang);
});
