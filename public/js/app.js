// ===================================================================
// NAGARIK-AI: Main Application Controller
// Orchestrates Tabs, Roles, Notifications, Feed, and Ticket Timelines
// ===================================================================

let currentRole = 'citizen';
let notifications = [
  {
    id: 'NOTIF-1',
    type: 'SMS',
    title: 'Grievance Auto-Triaged',
    body: 'Ticket #CIVIC-1001 assigned to Roads & Pavements Wing with 48h SLA.',
    time: '10 mins ago',
    unread: true
  },
  {
    id: 'NOTIF-2',
    type: 'Push',
    title: 'Field Team Dispatched',
    body: 'Jetting machine crew dispatched for Open Drainage at Madhapur.',
    time: '1 hour ago',
    unread: true
  },
  {
    id: 'NOTIF-3',
    type: 'Email',
    title: 'Issue Resolved & Verified',
    body: 'Streetlights on School Road restored. Tap to review resolution photo.',
    time: 'Yesterday',
    unread: false
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initAiVision();
  initVoiceStudio();
  initReportMap();
  loadComplaintsFeed();
  loadAnalytics();
  checkSupabaseStatus();

  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  const reportForm = document.getElementById('civicReportForm');
  if (reportForm) {
    reportForm.addEventListener('submit', handleComplaintSubmit);
  }

  setTimeout(() => {
    loadPresetImage('potholes');
  }, 400);

  updateNotificationBadge();
});

// -------------------------------------------------------------
// TAB NAVIGATION
// -------------------------------------------------------------
function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  const activeTabBtn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
  const activePane = document.getElementById(`tab-${tabId}`);

  if (activeTabBtn) activeTabBtn.classList.add('active');
  if (activePane) activePane.classList.add('active');

  if (tabId === 'report' && reportMiniMap) {
    setTimeout(() => reportMiniMap.invalidateSize(), 200);
  }
  if (tabId === 'heatmap') {
    loadAnalytics();
  }
  if (tabId === 'admin') {
    loadAdminComplaints();
  }

  if (document.body.classList.contains('accessible-mode')) {
    speakText(`Switched to ${tabId} view.`);
  }
}

// -------------------------------------------------------------
// ROLE SWITCHER (Citizen vs Officer)
// -------------------------------------------------------------
function setRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-role') === role);
  });

  const adminTab = document.querySelector('.nav-tab[data-tab="admin"]');
  if (role === 'admin') {
    if (adminTab) adminTab.style.display = 'flex';
    switchTab('admin');
    showToast('Switched to Municipal Officer / Admin Mode', 'success');
  } else {
    switchTab('report');
    showToast('Switched to Citizen Portal', 'success');
  }
}

// -------------------------------------------------------------
// SENIOR CITIZEN & ACCESSIBILITY MODE
// -------------------------------------------------------------
function toggleAccessibleMode() {
  document.body.classList.toggle('accessible-mode');
  const isAccessible = document.body.classList.contains('accessible-mode');
  const toggleBtn = document.getElementById('accessibleModeToggle');

  if (toggleBtn) {
    toggleBtn.innerHTML = isAccessible ? `👓 Normal View` : `👓 Senior Mode`;
  }

  if (isAccessible) {
    speakText('Senior citizen accessible mode enabled. Font sizes enlarged and voice guidance activated.');
    showToast('Accessible Senior Mode Activated (High-Contrast, Large UI)', 'success');
  } else {
    showToast('Returned to Standard View', 'info');
  }
}

// -------------------------------------------------------------
// COMPLAINT SUBMISSION
// -------------------------------------------------------------
async function handleComplaintSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('submitComplaintBtn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>⏳</span> AI Routing Grievance...`;
  }

  const title = document.getElementById('complaintTitle').value;
  const description = document.getElementById('complaintDescription').value;
  const category = document.getElementById('complaintCategory').value;
  const address = document.getElementById('complaintAddress').value;
  const ward = document.getElementById('complaintWard').value;
  const landmark = document.getElementById('complaintLandmark').value;
  const lat = document.getElementById('complaintLat').value;
  const lng = document.getElementById('complaintLng').value;
  const imageUrl = document.getElementById('complaintImageUrl').value;
  const phone = document.getElementById('citizenPhone').value;

  const payload = {
    title,
    description,
    category,
    address,
    ward,
    landmark,
    lat,
    lng,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    phone: phone || '+91 98490 11223',
    submissionMode: 'AI Vision & Voice'
  };

  try {
    const res = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (result.success) {
      const newComplaint = result.data;

      showSubmissionSuccessModal(newComplaint);

      dispatchNotificationSimulation(
        newComplaint.id,
        `Govt of Telangana SMS: Your complaint #${newComplaint.id} has been registered. AI routed to ${newComplaint.department}. Expected SLA: ${newComplaint.slaHours}h.`
      );

      loadComplaintsFeed();
      loadAnalytics();

      if (document.body.classList.contains('accessible-mode')) {
        speakText(`Complaint successfully submitted. Your ticket number is ${newComplaint.id}.`);
      }
    }
  } catch (err) {
    console.error('Submission failed:', err);
    showToast('Failed to submit grievance. Please try again.', 'danger');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>🚀</span> ${t('btnSubmit')}`;
    }
  }
}

function showSubmissionSuccessModal(complaint) {
  const modal = document.getElementById('successModal');
  const ticketSpan = document.getElementById('successTicketId');
  const deptSpan = document.getElementById('successDept');
  const slaSpan = document.getElementById('successSla');

  if (ticketSpan) ticketSpan.textContent = complaint.id;
  if (deptSpan) deptSpan.textContent = complaint.department;
  if (slaSpan) slaSpan.textContent = `${complaint.slaHours} Hours`;

  modal.classList.add('active');
}

function finishSubmissionAndTrack() {
  closeModal('successModal');
  switchTab('track');
  const searchInput = document.getElementById('trackSearchInput');
  const ticketId = document.getElementById('successTicketId').textContent;
  if (searchInput) {
    searchInput.value = ticketId;
    filterComplaintsFeed();
  }
}

// -------------------------------------------------------------
// LIVE TRACKER & COMMUNITY FEED
// -------------------------------------------------------------
let allComplaints = [];

async function loadComplaintsFeed() {
  try {
    const res = await fetch('/api/complaints');
    const result = await res.json();
    if (result.success) {
      allComplaints = result.data;
      renderComplaintsFeed(allComplaints);
    }
  } catch (err) {
    console.error('Failed to load complaints:', err);
  }
}

function renderComplaintsFeed(complaints) {
  const feed = document.getElementById('complaintsFeedContainer');
  if (!feed) return;

  if (complaints.length === 0) {
    feed.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:50px 20px; color:var(--text-muted);">
        <h3>No complaints found matching your query.</h3>
      </div>
    `;
    return;
  }

  feed.innerHTML = complaints.map(c => `
    <div class="complaint-card">
      <div class="complaint-img-wrapper">
        <img src="${c.imageUrl}" alt="${c.title}" class="complaint-card-img" onerror="this.src='https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'">
        <div class="complaint-badges-overlay">
          <span class="status-badge status-${(c.status || 'Reported').replace(/\s+/g, '-')}">${c.status}</span>
          <span class="triage-pill ${c.severity === 'Critical' ? 'pill-severity' : 'pill-sla'}">${c.severity}</span>
        </div>
      </div>
      <div class="complaint-body">
        <div class="complaint-id">${c.id} • ${c.department}</div>
        <h3 class="complaint-title">${c.title}</h3>
        <p class="complaint-desc">${c.description}</p>
        <div class="complaint-meta">
          <span>📍 ${(c.location && c.location.ward) || 'Central Zone'}</span>
          <span>•</span>
          <span>🕒 ${formatRelativeTime(c.reportedAt)}</span>
        </div>
        <div class="complaint-footer">
          <button class="upvote-btn" onclick="upvoteExistingComplaint('${c.id}')">
            <span>👍</span> <span id="upvote-count-${c.id}">${c.upvotes || 1}</span> Me Too
          </button>
          <button class="btn btn-primary btn-sm" onclick="viewComplaintDetail('${c.id}')">
            Track Status &rarr;
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterComplaintsFeed() {
  const query = (document.getElementById('trackSearchInput').value || '').toLowerCase();
  const filterCat = document.getElementById('trackCategoryFilter').value;

  let filtered = allComplaints.filter(c => {
    const matchCat = filterCat === 'all' || c.category === filterCat;
    const matchQuery = !query ||
      (c.id && c.id.toLowerCase().includes(query)) ||
      (c.title && c.title.toLowerCase().includes(query)) ||
      (c.description && c.description.toLowerCase().includes(query)) ||
      (c.location && c.location.address && c.location.address.toLowerCase().includes(query)) ||
      (c.location && c.location.ward && c.location.ward.toLowerCase().includes(query));
    return matchCat && matchQuery;
  });

  renderComplaintsFeed(filtered);
}

async function upvoteExistingComplaint(ticketId) {
  try {
    const res = await fetch(`/api/complaints/${ticketId}/upvote`, { method: 'POST' });
    const result = await res.json();
    if (result.success) {
      showToast(`+1 Upvoted Ticket #${ticketId}. Priority escalated.`, 'success');
      const countEl = document.getElementById(`upvote-count-${ticketId}`);
      if (countEl) countEl.textContent = result.upvotes;
      loadComplaintsFeed();
    }
  } catch (err) {
    console.error('Upvote failed:', err);
  }
}

// -------------------------------------------------------------
// TICKET TIMELINE & DETAIL MODAL
// -------------------------------------------------------------
function viewComplaintDetail(ticketId) {
  const complaint = allComplaints.find(c => c.id === ticketId);
  if (!complaint) return;

  const modal = document.getElementById('ticketDetailModal');
  const title = document.getElementById('detailModalTitle');
  const content = document.getElementById('detailModalBody');

  if (title) title.innerHTML = `<span style="font-family:monospace; color:var(--primary);">${complaint.id}</span> - ${complaint.title}`;

  const timelineHtml = (complaint.timeline || []).map(t => `
    <div class="step-item completed">
      <div class="step-node">✓</div>
      <div class="step-title">${t.status}</div>
      <div class="step-time">${formatDate(t.timestamp)}</div>
      <div class="step-note">${t.note}</div>
    </div>
  `).join('');

  const officerHtml = complaint.assignedOfficer ? `
    <div style="background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px; margin:16px 0; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-size:0.75rem; color:var(--text-dim); text-transform:uppercase; font-weight:700;">Assigned Field Engineer</div>
        <div style="font-weight:700; font-size:1rem; color:#fff;">${complaint.assignedOfficer.name}</div>
        <div style="font-size:0.8rem; color:var(--text-muted);">${complaint.assignedOfficer.role} (${complaint.assignedOfficer.badgeId})</div>
      </div>
      <a href="tel:${complaint.assignedOfficer.phone}" class="btn btn-secondary btn-sm">📞 Call Officer</a>
    </div>
  ` : `
    <div style="background:var(--bg-tertiary); border:1px dashed var(--border-color); border-radius:var(--radius-md); padding:14px; margin:16px 0; font-size:0.85rem; color:var(--text-muted);">
      ⏳ Municipal triage in progress. A Ward Field Officer will be assigned shortly.
    </div>
  `;

  const proofHtml = complaint.resolutionProof ? `
    <div style="margin:20px 0;">
      <h4 style="font-size:0.95rem; font-weight:700; color:var(--emerald); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
        <span>✓</span> Side-by-Side Resolution Verification Proof
      </h4>
      <div class="proof-comparison">
        <div class="proof-box">
          <div class="proof-label" style="color:#ef4444;">Before (Reported Hazard)</div>
          <img src="${complaint.imageUrl}" alt="Before">
        </div>
        <div class="proof-box">
          <div class="proof-label" style="color:#10b981;">After (Municipal Repair)</div>
          <img src="${complaint.resolutionProof.imageUrl}" alt="After">
        </div>
      </div>
      <div style="font-size:0.82rem; color:var(--text-muted); background:var(--bg-card); padding:10px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
        <strong>Officer Verification Notes:</strong> ${complaint.resolutionProof.officerNotes}
      </div>
    </div>
  ` : '';

  if (content) {
    content.innerHTML = `
      <div style="margin-bottom:16px;">
        <span class="status-badge status-${(complaint.status || 'Reported').replace(/\s+/g, '-')}">${complaint.status}</span>
        <span class="triage-pill pill-dept" style="margin-left:8px;">${complaint.department}</span>
      </div>

      <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:16px;">
        ${complaint.description}
      </p>

      <div style="font-size:0.82rem; color:var(--text-dim); margin-bottom:16px;">
        📍 <strong>Location:</strong> ${(complaint.location && complaint.location.address) || 'Street'} (${(complaint.location && complaint.location.ward) || 'Central'})
      </div>

      ${officerHtml}

      <h4 style="font-size:0.95rem; font-weight:700; margin-top:20px;">Redressal Progress Timeline</h4>
      <div class="timeline-stepper">
        ${timelineHtml}
      </div>

      ${proofHtml}

      <div style="border-top:1px solid var(--border-color); padding-top:16px; margin-top:20px;">
        <div style="font-size:0.85rem; font-weight:700; color:var(--text-muted);">Citizen Satisfaction Feedback:</div>
        <div class="star-rating" onclick="rateSatisfaction(this)">
          <span class="star" data-v="1">★</span>
          <span class="star" data-v="2">★</span>
          <span class="star" data-v="3">★</span>
          <span class="star" data-v="4">★</span>
          <span class="star" data-v="5">★</span>
        </div>
      </div>
    `;
  }

  modal.classList.add('active');
}

function rateSatisfaction(el) {
  showToast('Thank you for rating municipal response quality!', 'success');
}

// -------------------------------------------------------------
// ANALYTICS & KPIS
// -------------------------------------------------------------
async function loadAnalytics() {
  try {
    const res = await fetch('/api/analytics');
    const result = await res.json();
    if (result.success) {
      const data = result.data;

      const totalEl = document.getElementById('kpiTotal');
      const inProgEl = document.getElementById('kpiInProgress');
      const resolvedEl = document.getElementById('kpiResolved');
      const slaEl = document.getElementById('kpiSla');
      const citizensEl = document.getElementById('kpiCitizens');

      if (totalEl) totalEl.textContent = data.summary.total;
      if (inProgEl) inProgEl.textContent = data.summary.inProgress;
      if (resolvedEl) resolvedEl.textContent = `${data.summary.resolutionRate}%`;
      if (slaEl) slaEl.textContent = `${data.summary.avgSlaCompliance}%`;
      if (citizensEl) citizensEl.textContent = data.summary.citizensEngaged.toLocaleString();

      const deptTable = document.getElementById('deptSlaTableBody');
      if (deptTable) {
        deptTable.innerHTML = data.departments.map(d => `
          <tr>
            <td style="font-weight:700; color:#fff;">${d.name}</td>
            <td>${d.avgResolutionHours} hrs</td>
            <td>
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="flex:1; height:6px; background:var(--bg-tertiary); border-radius:3px; overflow:hidden;">
                  <div style="width:${d.slaCompliance}%; height:100%; background:var(--emerald);"></div>
                </div>
                <span style="font-size:0.8rem; font-weight:700; color:var(--emerald);">${d.slaCompliance}%</span>
              </div>
            </td>
            <td>
              <span class="triage-pill ${d.activeTickets > 0 ? 'pill-severity' : 'pill-confidence'}">${d.activeTickets} Active</span>
            </td>
          </tr>
        `).join('');
      }

      initGisHeatmap(data.heatPoints);
    }
  } catch (err) {
    console.error('Failed to load analytics:', err);
  }
}

// -------------------------------------------------------------
// NOTIFICATIONS ENGINE
// -------------------------------------------------------------
function toggleNotificationCenter() {
  const panel = document.getElementById('notificationFlyout');
  if (panel) {
    panel.classList.toggle('active');
  }
}

function updateNotificationBadge() {
  const badge = document.getElementById('notifBadge');
  const count = notifications.filter(n => n.unread).length;
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function dispatchNotificationSimulation(ticketId, message) {
  const newNotif = {
    id: 'NOTIF-' + Date.now(),
    type: 'SMS',
    title: `Civic Alert: #${ticketId}`,
    body: message,
    time: 'Just now',
    unread: true
  };
  notifications.unshift(newNotif);
  updateNotificationBadge();
  renderNotificationList();
  showToast(`📲 SMS Alert: ${message}`, 'info');
}

function renderNotificationList() {
  const list = document.getElementById('notificationList');
  if (!list) return;

  list.innerHTML = notifications.map(n => `
    <div style="padding:12px; border-bottom:1px solid var(--border-color); background:${n.unread ? 'rgba(59,130,246,0.06)' : 'transparent'};">
      <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-dim); margin-bottom:4px;">
        <span style="font-weight:700; color:var(--primary);">${n.type}</span>
        <span>${n.time}</span>
      </div>
      <div style="font-weight:700; font-size:0.85rem; color:#fff; margin-bottom:2px;">${n.title}</div>
      <div style="font-size:0.8rem; color:var(--text-muted);">${n.body}</div>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// SUPABASE CLOUD MANAGEMENT
// -------------------------------------------------------------
async function checkSupabaseStatus() {
  const btn = document.getElementById('supabaseStatusBtn');
  const label = document.getElementById('supabaseStatusLabel');
  const banner = document.getElementById('supabaseBanner');
  const icon = document.getElementById('supabaseIndicatorIcon');
  const message = document.getElementById('supabaseStatusMessage');

  try {
    const res = await fetch('/api/supabase/status');
    const data = await res.json();

    if (data.connected) {
      if (label) label.textContent = 'Supabase: Active';
      if (btn) btn.style.borderColor = 'var(--emerald)';
      if (banner) {
        banner.style.background = 'rgba(16, 185, 129, 0.15)';
        banner.style.borderColor = 'rgba(16, 185, 129, 0.35)';
      }
      if (icon) icon.textContent = '🟢';
      if (message) message.textContent = 'Connected directly to Supabase PostgreSQL database.';
    } else if (data.isConfigured) {
      if (label) label.textContent = 'Supabase: Table Missing';
      if (btn) btn.style.borderColor = 'var(--amber)';
      if (banner) {
        banner.style.background = 'rgba(245, 158, 11, 0.15)';
        banner.style.borderColor = 'rgba(245, 158, 11, 0.35)';
      }
      if (icon) icon.textContent = '⚠️';
      if (message) message.textContent = data.message;
    } else {
      if (label) label.textContent = 'Supabase: Local Mode';
      if (btn) btn.style.borderColor = 'var(--border-color)';
      if (banner) {
        banner.style.background = 'rgba(59, 130, 246, 0.1)';
        banner.style.borderColor = 'rgba(59, 130, 246, 0.3)';
      }
      if (icon) icon.textContent = 'ℹ️';
      if (message) message.textContent = 'Running on Local Store. Configure Supabase credentials to enable cloud PostgreSQL.';
    }

    if (data.config && data.config.url) {
      const urlInput = document.getElementById('supabaseUrlInput');
      if (urlInput && !urlInput.value) urlInput.value = data.config.url;
    }
  } catch (err) {
    console.warn('Could not check Supabase status:', err);
  }
}

function openSupabaseModal() {
  const modal = document.getElementById('supabaseModal');
  if (modal) {
    modal.classList.add('active');
    checkSupabaseStatus();
  }
}

async function saveSupabaseConfig() {
  const url = document.getElementById('supabaseUrlInput').value.trim();
  const key = document.getElementById('supabaseKeyInput').value.trim();

  if (!url || !key) {
    showToast('Please enter both Supabase Project URL and Anon Key.', 'warning');
    return;
  }

  try {
    const res = await fetch('/api/supabase/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, key })
    });
    const result = await res.json();

    if (result.connected) {
      showToast('Successfully connected to Supabase PostgreSQL!', 'success');
      checkSupabaseStatus();
      loadComplaintsFeed();
      loadAnalytics();
    } else {
      showToast(`Saved. Status: ${result.message}`, 'warning');
      checkSupabaseStatus();
    }
  } catch (err) {
    console.error('Failed to save Supabase config:', err);
    showToast('Failed to connect to Supabase. Check console.', 'danger');
  }
}

// -------------------------------------------------------------
// UTILITIES & MODAL HELPERS
// -------------------------------------------------------------
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-size:0.86rem; font-weight:600;">${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none; border:none; color:var(--text-dim); cursor:pointer; font-size:1.1rem;">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 4000);
}

function formatRelativeTime(iso) {
  if (!iso) return 'Recent';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
