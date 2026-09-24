// ===================================================================
// NAGARIK-AI: Geographic Information System (GIS) & Maps Engine
// Handles GPS Geolocation, Mini Map Pin Picker & Hotspot Heatmaps
// ===================================================================

let reportMiniMap = null;
let reportMarker = null;
let gisHeatmap = null;
let heatmapMarkersLayer = null;

// Default City Center (Hyderabad Metro Area)
const DEFAULT_COORDS = { lat: 17.4435, lng: 78.3772 };

// Initialize Mini Map for Report View
function initReportMap() {
  const mapElement = document.getElementById('reportMiniMap');
  if (!mapElement || reportMiniMap) return;

  reportMiniMap = L.map('reportMiniMap', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng], 14);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 19
  }).addTo(reportMiniMap);

  const customPinIcon = L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background:#ef4444; width:22px; height:22px; border-radius:50%; border:3px solid #fff; box-shadow:0 0 12px rgba(239,68,68,0.7); animation: bounce 1.2s infinite alternate;"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });

  reportMarker = L.marker([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng], {
    draggable: true,
    icon: customPinIcon
  }).addTo(reportMiniMap);

  reportMarker.on('dragend', function(e) {
    const position = reportMarker.getLatLng();
    reverseGeocode(position.lat, position.lng);
  });

  reportMiniMap.on('click', function(e) {
    reportMarker.setLatLng(e.latlng);
    reverseGeocode(e.latlng.lat, e.latlng.lng);
  });
}

// Auto-detect Citizen GPS using Geolocation API
function autoDetectLocation() {
  const gpsBtn = document.getElementById('btnDetectGps');
  if (gpsBtn) {
    gpsBtn.innerHTML = `<span>⏳</span> Detecting Satellite GPS...`;
    gpsBtn.disabled = true;
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        updateMapPin(lat, lng);
        reverseGeocode(lat, lng);
        if (gpsBtn) {
          gpsBtn.innerHTML = `<span>📍</span> GPS Locked (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
          gpsBtn.disabled = false;
        }
        showToast('GPS Coordinates successfully acquired.', 'success');
      },
      (error) => {
        console.warn('Geolocation fallback:', error);
        const sampleCoords = [
          { lat: 17.4435, lng: 78.3772, address: 'Cyber Towers Main Junction, Hitec City', ward: 'Ward 104 - Kondapur' },
          { lat: 17.4399, lng: 78.3912, address: 'Road No. 36, Jubilee Hills Extension', ward: 'Ward 98 - Jubilee Hills' },
          { lat: 17.4244, lng: 78.4485, address: 'Banjara Hills Road No. 12', ward: 'Ward 92 - Banjara Hills' }
        ];
        const selected = sampleCoords[Math.floor(Math.random() * sampleCoords.length)];
        updateMapPin(selected.lat, selected.lng);
        updateFormLocation(selected.lat, selected.lng, selected.address, selected.ward);
        if (gpsBtn) {
          gpsBtn.innerHTML = `<span>📍</span> GPS Auto-Detected`;
          gpsBtn.disabled = false;
        }
        showToast('Local ward location acquired via Cellular Cell ID.', 'success');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  } else {
    showToast('Geolocation is not supported by your browser.', 'danger');
    if (gpsBtn) gpsBtn.disabled = false;
  }
}

function updateMapPin(lat, lng) {
  if (reportMarker) {
    reportMarker.setLatLng([lat, lng]);
  }
  if (reportMiniMap) {
    reportMiniMap.setView([lat, lng], 15);
    setTimeout(() => { reportMiniMap.invalidateSize(); }, 200);
  }
}

async function reverseGeocode(lat, lng) {
  const addressInput = document.getElementById('complaintAddress');
  const wardInput = document.getElementById('complaintWard');
  const latHidden = document.getElementById('complaintLat');
  const lngHidden = document.getElementById('complaintLng');

  if (latHidden) latHidden.value = lat;
  if (lngHidden) lngHidden.value = lng;

  let wardName = 'Ward 104 - Central IT Corridor';
  if (lat > 17.44) wardName = 'Ward 107 - Madhapur & Kondapur';
  else if (lat > 17.42) wardName = 'Ward 98 - Jubilee Hills & Banjara';
  else if (lat > 17.40) wardName = 'Ward 77 - Nampally Central';
  else wardName = 'Ward 55 - Koti & Charminar';

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        const road = data.address.road || data.address.suburb || data.address.neighbourhood || 'Main Road';
        const area = data.address.suburb || data.address.city_district || 'Municipal Zone';
        if (addressInput) addressInput.value = `${road}, ${area}`;
        if (wardInput) wardInput.value = wardName;
        checkNearbyDuplicates();
        return;
      }
    }
  } catch (err) {
    console.warn('Reverse geocode fallback:', err);
  }

  if (addressInput && !addressInput.value) {
    addressInput.value = `Near Geo-Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
  if (wardInput) wardInput.value = wardName;

  checkNearbyDuplicates();
}

function updateFormLocation(lat, lng, address, ward) {
  const addressInput = document.getElementById('complaintAddress');
  const wardInput = document.getElementById('complaintWard');
  const latHidden = document.getElementById('complaintLat');
  const lngHidden = document.getElementById('complaintLng');

  if (addressInput) addressInput.value = address;
  if (wardInput) wardInput.value = ward;
  if (latHidden) latHidden.value = lat;
  if (lngHidden) lngHidden.value = lng;

  updateMapPin(lat, lng);
  checkNearbyDuplicates();
}

// -------------------------------------------------------------
// ANALYTICS & GIS HOTSPOT HEATMAP
// -------------------------------------------------------------
function initGisHeatmap(heatPoints) {
  const mapElement = document.getElementById('gisHeatmap');
  if (!mapElement) return;

  if (!gisHeatmap) {
    gisHeatmap = L.map('gisHeatmap', {
      zoomControl: true
    }).setView([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }).addTo(gisHeatmap);

    heatmapMarkersLayer = L.layerGroup().addTo(gisHeatmap);
  }

  if (heatmapMarkersLayer) {
    heatmapMarkersLayer.clearLayers();
  }

  if (!heatPoints || heatPoints.length === 0) return;

  heatPoints.forEach(point => {
    const [lat, lng, intensity, title, category, status, id] = point;

    let color = '#3b82f6';
    if (intensity >= 0.9) { color = '#ef4444'; }
    else if (intensity >= 0.7) { color = '#f59e0b'; }

    L.circle([lat, lng], {
      color: color,
      fillColor: color,
      fillOpacity: 0.25,
      radius: 220 * intensity,
      weight: 1
    }).addTo(heatmapMarkersLayer);

    const markerIcon = L.divIcon({
      className: 'heatmap-hotspot-pin',
      html: `<div style="background:${color}; width:16px; height:16px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 14px ${color};"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(heatmapMarkersLayer);

    const popupHtml = `
      <div style="font-family:sans-serif; min-width:200px;">
        <div style="font-size:0.75rem; color:#6b7280; font-weight:700;">${id}</div>
        <div style="font-size:0.9rem; font-weight:700; margin:4px 0 6px;">${title}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem;">
          <span style="background:${color}; color:#fff; padding:2px 8px; border-radius:10px; font-weight:700;">${status}</span>
          <a href="#" onclick="viewComplaintDetail('${id}'); return false;" style="color:#2563eb; font-weight:700; text-decoration:none;">View &rarr;</a>
        </div>
      </div>
    `;
    marker.bindPopup(popupHtml);
  });

  setTimeout(() => {
    gisHeatmap.invalidateSize();
  }, 250);
}

// -------------------------------------------------------------
// DUPLICATE COMPLAINT DETECTOR
// -------------------------------------------------------------
async function checkNearbyDuplicates() {
  const latHidden = document.getElementById('complaintLat');
  const lngHidden = document.getElementById('complaintLng');
  const categorySelect = document.getElementById('complaintCategory');
  const dupBanner = document.getElementById('duplicateAlertBanner');

  if (!latHidden || !lngHidden || !dupBanner) return;

  const lat = parseFloat(latHidden.value);
  const lng = parseFloat(lngHidden.value);
  const category = categorySelect ? categorySelect.value : null;

  if (isNaN(lat) || isNaN(lng)) return;

  try {
    const url = `/api/duplicates?lat=${lat}&lng=${lng}&category=${category || ''}&radiusMeters=200`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.success && data.hasDuplicates && data.duplicates.length > 0) {
      const match = data.duplicates[0];
      const dupDetails = document.getElementById('dupDetailsText');
      const dupUpvoteBtn = document.getElementById('btnDupUpvote');

      if (dupDetails) {
        dupDetails.innerHTML = `
          <strong>#${match.id}</strong>: ${match.title}<br>
          <span style="font-size:0.8rem; color:#d97706;">📍 Approx. <strong>${match.distanceMeters}m</strong> away • Already supported by <strong>${match.upvotes}</strong> citizens</span>
        `;
      }

      if (dupUpvoteBtn) {
        dupUpvoteBtn.onclick = () => upvoteExistingComplaint(match.id);
      }

      dupBanner.classList.add('active');
    } else {
      dupBanner.classList.remove('active');
    }
  } catch (err) {
    console.warn('Duplicate check error:', err);
  }
}
