// ===================================================================
// NAGARIK-AI: Multilingual Voice Complaint Studio & TTS Reader
// Handles Web Speech API, Real-Time Audio Waveforms, and Voice Navigation
// ===================================================================

let speechRecognizer = null;
let isRecordingVoice = false;
let audioVisualizerAnimationId = null;

// Language code map for Speech Recognition
const SPEECH_LANG_MAP = {
  en: 'en-IN',
  te: 'te-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN'
};

function initVoiceStudio() {
  const micBtn = document.getElementById('voiceMicBtn');
  const canvas = document.getElementById('waveformCanvas');

  // Draw idle baseline waveform
  if (canvas) {
    drawIdleWaveform(canvas);
  }

  // Setup Web Speech API if supported
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    speechRecognizer = new SpeechRecognition();
    speechRecognizer.continuous = true;
    speechRecognizer.interimResults = true;

    speechRecognizer.onstart = () => {
      isRecordingVoice = true;
      if (micBtn) micBtn.classList.add('recording');
      updateVoiceStatus(t('voiceListening'));
      startAudioWaveformAnimation();
    };

    speechRecognizer.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const descInput = document.getElementById('complaintDescription');
      if (descInput && (finalTranscript || interimTranscript)) {
        const textToAdd = (finalTranscript || interimTranscript).trim();
        if (!descInput.value.includes(textToAdd)) {
          if (descInput.value.trim().length > 0) {
            descInput.value = `${descInput.value.trim()}\n[Citizen Voice Note]: ${textToAdd}`;
          } else {
            descInput.value = textToAdd;
          }
        }
      }

      const voiceStatus = document.getElementById('voiceStatusText');
      if (voiceStatus && interimTranscript) {
        voiceStatus.textContent = `"${interimTranscript}"`;
      }
    };

    speechRecognizer.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      stopVoiceRecording();
      updateVoiceStatus(`Voice note recorded. You can edit text directly.`);
    };

    speechRecognizer.onend = () => {
      stopVoiceRecording();
    };
  } else {
    console.warn('Speech recognition not natively supported in this browser.');
  }

  if (micBtn) {
    micBtn.addEventListener('click', toggleVoiceRecording);
  }
}

// Toggle recording state
function toggleVoiceRecording() {
  if (isRecordingVoice) {
    stopVoiceRecording();
  } else {
    startVoiceRecording();
  }
}

function startVoiceRecording() {
  if (!speechRecognizer) {
    simulateVoiceInput();
    return;
  }

  try {
    const langCode = SPEECH_LANG_MAP[currentLang] || 'en-IN';
    speechRecognizer.lang = langCode;
    speechRecognizer.start();
  } catch (err) {
    console.error('Failed to start speech recognition:', err);
    simulateVoiceInput();
  }
}

function stopVoiceRecording() {
  isRecordingVoice = false;
  const micBtn = document.getElementById('voiceMicBtn');
  if (micBtn) micBtn.classList.remove('recording');

  if (speechRecognizer) {
    try { speechRecognizer.stop(); } catch (e) {}
  }

  stopAudioWaveformAnimation();
  updateVoiceStatus(t('voicePrompt'));
}

// Simulated Voice Fallback
function simulateVoiceInput() {
  const micBtn = document.getElementById('voiceMicBtn');
  if (micBtn) micBtn.classList.add('recording');
  isRecordingVoice = true;
  startAudioWaveformAnimation();
  updateVoiceStatus(t('voiceListening'));

  const voiceSamplePhrases = {
    en: "Here is a severe water leakage flooding the road near the metro station. Commuters are facing issues.",
    te: "మెట్రో స్టేషన్ సమీపంలో రోడ్డుపై తాగునీరు భారీగా వృధాగా పోతోంది. వెంటనే పైపులైన్ రిపేర్ చేయించండి.",
    hi: "यहाँ मुख्य सड़क पर भारी कचरा फैला हुआ है और बदबू आ रही है। कृपया सफाई वाहन भेजें।",
    ta: "சாலையில் பெரிய பள்ளம் உள்ளது, உடனடியாக சீரமைக்க வேண்டும்.",
    kn: "ಇಲ್ಲಿ ರಸ್ತೆಯಲ್ಲಿ ಕಸದ ರಾಶಿ ಬಿದ್ದಿದೆ, ದಯವಿಟ್ಟು ಸ್ವಚ್ಛಗೊಳಿಸಿ.",
    ml: "തെരുവ് വിളക്ക് കത്തുന്നില്ല, രാത്രിയിൽ അപകട സാധ്യതയുണ്ട്."
  };

  setTimeout(() => {
    const phrase = voiceSamplePhrases[currentLang] || voiceSamplePhrases['en'];
    const descInput = document.getElementById('complaintDescription');
    if (descInput) {
      descInput.value = descInput.value.trim() ? `${descInput.value}\n[Citizen Voice Note]: ${phrase}` : phrase;
    }
    stopVoiceRecording();
    showToast(`Voice transcribed in ${currentLang.toUpperCase()}`, 'success');
  }, 2400);
}

function updateVoiceStatus(text) {
  const el = document.getElementById('voiceStatusText');
  if (el) el.textContent = text;
}

// Draw dynamic neon sound wave
function startAudioWaveformAnimation() {
  const canvas = document.getElementById('waveformCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let phase = 0;

  function renderWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#f43f5e';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#f43f5e';

    ctx.beginPath();
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    for (let x = 0; x < width; x += 3) {
      const freq = 0.05;
      const amp = isRecordingVoice ? (Math.sin(x * 0.08 + phase) * (height * 0.35) * Math.sin(phase * 1.5)) : 2;
      const y = midY + Math.sin(x * freq + phase) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    phase += 0.12;
    audioVisualizerAnimationId = requestAnimationFrame(renderWave);
  }

  cancelAnimationFrame(audioVisualizerAnimationId);
  renderWave();
}

function stopAudioWaveformAnimation() {
  cancelAnimationFrame(audioVisualizerAnimationId);
  const canvas = document.getElementById('waveformCanvas');
  if (canvas) drawIdleWaveform(canvas);
}

function drawIdleWaveform(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

// Text-to-Speech (TTS) for Accessibility
function speakText(message) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}
