// ===================================================================
// NAGARIK-AI: Computer Vision Scanner & AI Complaint Generator
// Handles Image Detection, HUD Overlays, Bounding Boxes & Auto-Drafting
// ===================================================================

const SAMPLE_PRESETS = {
  potholes: {
    category: 'potholes',
    name: 'Pothole Cluster',
    icon: '🕳️',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    coords: { lat: 17.4435, lng: 78.3772, address: 'Cyber Towers Main Junction, Hitec City', ward: 'Ward 104 - Kondapur' }
  },
  garbage: {
    category: 'garbage',
    name: 'Garbage Accumulation',
    icon: '🗑️',
    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    coords: { lat: 17.4399, lng: 78.3912, address: 'Road No. 36, Jubilee Hills Extension', ward: 'Ward 98 - Jubilee Hills' }
  },
  water_leak: {
    category: 'water_leak',
    name: 'Water Pipe Burst',
    icon: '💧',
    url: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80',
    coords: { lat: 17.4244, lng: 78.4485, address: 'Banjara Hills Road No. 12', ward: 'Ward 92 - Banjara Hills' }
  },
  drainage: {
    category: 'drainage',
    name: 'Open Manhole & Sewage',
    icon: '🌊',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    coords: { lat: 17.4504, lng: 78.3808, address: 'Madhapur 100ft Road, Ayyappa Society', ward: 'Ward 107 - Madhapur' }
  },
  streetlights: {
    category: 'streetlights',
    name: 'Broken Streetlight',
    icon: '💡',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    coords: { lat: 17.4065, lng: 78.4772, address: 'Station Road, Nampally', ward: 'Ward 77 - Nampally' }
  },
  road_damage: {
    category: 'road_damage',
    name: 'Unpaved Road Trench',
    icon: '🚧',
    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    coords: { lat: 17.3850, lng: 78.4867, address: 'Koti Bank Street, Sultan Bazaar', ward: 'Ward 55 - Koti' }
  }
};

let currentAnalysisData = null;

function initAiVision() {
  const dropzone = document.getElementById('uploadDropzone');
  const fileInput = document.getElementById('imageFileInput');
  const presetContainer = document.getElementById('presetChips');

  if (presetContainer) {
    presetContainer.innerHTML = '';
    Object.keys(SAMPLE_PRESETS).forEach(key => {
      const preset = SAMPLE_PRESETS[key];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip-btn';
      btn.innerHTML = `<span>${preset.icon}</span> ${preset.name}`;
      btn.onclick = () => loadPresetImage(key);
      presetContainer.appendChild(btn);
    });
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', (e) => {
      if (e.target.closest('#presetChips') || e.target.closest('button')) return;
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleImageUpload(e.target.files[0]);
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--primary)';
        dropzone.style.backgroundColor = 'rgba(59, 130, 246, 0.12)';
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '';
        dropzone.style.backgroundColor = '';
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageUpload(e.dataTransfer.files[0]);
      }
    });
  }
}

function loadPresetImage(presetKey) {
  const preset = SAMPLE_PRESETS[presetKey];
  if (!preset) return;

  document.querySelectorAll('.chip-btn').forEach(btn => btn.classList.remove('active'));
  const clickedBtn = Array.from(document.querySelectorAll('.chip-btn')).find(b => b.textContent.includes(preset.name));
  if (clickedBtn) clickedBtn.classList.add('active');

  showHudScanner(preset.url);

  if (preset.coords) {
    updateFormLocation(preset.coords.lat, preset.coords.lng, preset.coords.address, preset.coords.ward);
  }

  analyzeCivicImage(preset.url, presetKey);
}

function handleImageUpload(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    showHudScanner(dataUrl);
    analyzeCivicImage(dataUrl, null);
  };
  reader.readAsDataURL(file);
}

function showHudScanner(imageUrl) {
  const hudContainer = document.getElementById('visionHudContainer');
  const previewImg = document.getElementById('previewImg');
  const dropzonePrompt = document.getElementById('dropzonePrompt');
  const hudBox = document.getElementById('hudBox');

  if (!hudContainer || !previewImg) return;

  dropzonePrompt.style.display = 'none';
  hudContainer.classList.add('active');
  hudContainer.classList.add('scanning');
  previewImg.src = imageUrl;

  hudBox.classList.remove('visible');

  const telemetry = document.getElementById('hudTelemetry');
  if (telemetry) {
    telemetry.innerHTML = `SCANNING SENSOR FEED...<br>DETECTING CIVIC HAZARDS`;
  }
}

async function analyzeCivicImage(imageUrl, hintKey) {
  try {
    const telemetry = document.getElementById('hudTelemetry');
    if (telemetry) telemetry.innerHTML = `AI TRIAGE IN PROGRESS...<br>ANALYZING STRUCTURAL DEFECT`;

    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: imageUrl,
        customHint: hintKey,
        language: currentLang
      })
    });

    const result = await response.json();
    if (result.success) {
      applyAiAnalysisResults(result.data, imageUrl);
    }
  } catch (err) {
    console.error('AI Analysis failed:', err);
    showToast('AI analysis encountered an issue. Using fallback model.', 'warning');
  }
}

function applyAiAnalysisResults(data, imageUrl) {
  currentAnalysisData = data;

  const hudContainer = document.getElementById('visionHudContainer');
  const hudBox = document.getElementById('hudBox');
  const hudBoxTag = document.getElementById('hudBoxTag');
  const telemetry = document.getElementById('hudTelemetry');

  if (hudContainer) hudContainer.classList.remove('scanning');

  if (hudBox && data.boundingBox) {
    hudBox.style.left = `${data.boundingBox.x}%`;
    hudBox.style.top = `${data.boundingBox.y}%`;
    hudBox.style.width = `${data.boundingBox.width}%`;
    hudBox.style.height = `${data.boundingBox.height}%`;
    if (hudBoxTag) hudBoxTag.textContent = `${data.boundingBox.label} • ${data.confidence}%`;
    hudBox.classList.add('visible');
  }

  if (telemetry) {
    telemetry.innerHTML = `CONFIDENCE: ${data.confidence}% | SEVERITY: ${data.severity}<br>TARGET: ${data.department}`;
  }

  const titleInput = document.getElementById('complaintTitle');
  const descInput = document.getElementById('complaintDescription');
  const categorySelect = document.getElementById('complaintCategory');
  const severityBadge = document.getElementById('triageSeverity');
  const deptBadge = document.getElementById('triageDept');
  const confBadge = document.getElementById('triageConfidence');
  const slaBadge = document.getElementById('triageSla');
  const hiddenImgInput = document.getElementById('complaintImageUrl');

  if (titleInput) titleInput.value = data.title;
  if (descInput) descInput.value = data.description;
  if (categorySelect) categorySelect.value = data.category;
  if (hiddenImgInput) hiddenImgInput.value = imageUrl;

  if (severityBadge) {
    severityBadge.textContent = `Severity: ${data.severity}`;
    severityBadge.className = `triage-pill pill-severity`;
  }
  if (deptBadge) deptBadge.textContent = `Dept: ${data.department}`;
  if (confBadge) confBadge.textContent = `AI Confidence: ${data.confidence}%`;
  if (slaBadge) slaBadge.textContent = `Target SLA: ${data.slaHours}h`;

  if (document.body.classList.contains('accessible-mode')) {
    speakText(`AI detected ${data.categoryLabel} with ${data.confidence}% confidence. Routed to ${data.department}.`);
  }

  checkNearbyDuplicates();

  showToast(`AI Identified: ${data.categoryLabel} (${data.confidence}% match)`, 'success');
}

function triggerCameraCapture() {
  const videoModal = document.getElementById('cameraModal');
  const videoElem = document.getElementById('cameraFeed');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showToast('Camera access is not supported by your browser.', 'danger');
    return;
  }

  videoModal.classList.add('active');
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      videoElem.srcObject = stream;
      window.activeCameraStream = stream;
    })
    .catch(err => {
      console.error('Camera error:', err);
      showToast('Camera access was denied or unavailable.', 'danger');
      closeCameraModal();
    });
}

function captureCameraSnapshot() {
  const videoElem = document.getElementById('cameraFeed');
  const canvas = document.createElement('canvas');
  canvas.width = videoElem.videoWidth || 640;
  canvas.height = videoElem.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

  closeCameraModal();
  showHudScanner(dataUrl);
  analyzeCivicImage(dataUrl, null);
}

function closeCameraModal() {
  const videoModal = document.getElementById('cameraModal');
  const videoElem = document.getElementById('cameraFeed');
  if (window.activeCameraStream) {
    window.activeCameraStream.getTracks().forEach(track => track.stop());
    window.activeCameraStream = null;
  }
  if (videoElem) videoElem.srcObject = null;
  if (videoModal) videoModal.classList.remove('active');
}
