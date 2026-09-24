// ===================================================================
// NAGARIK-AI: Municipal Operations & Admin Dashboard Engine
// Handles Task Assignment, Triage, Resolution Proofs, and CSV Exports
// ===================================================================

let allAdminComplaints = [];

async function loadAdminComplaints() {
  try {
    const res = await fetch('/api/complaints');
    const result = await res.json();
    if (result.success) {
      allAdminComplaints = result.data;
      renderAdminTable(allAdminComplaints);
    }
  } catch (err) {
    console.error('Failed to load admin complaints:', err);
  }
}

function renderAdminTable(complaints) {
  const tableBody = document.getElementById('adminTableBody');
  if (!tableBody) return;

  if (complaints.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">No grievances match the selected filters.</td></tr>`;
    return;
  }

  tableBody.innerHTML = complaints.map(c => {
    const isResolved = c.status === 'Resolved';
    const officerName = c.assignedOfficer ? c.assignedOfficer.name : '<span style="color:#f59e0b; font-style:italic;">Unassigned</span>';

    return `
      <tr>
        <td style="font-family:monospace; font-weight:700; color:var(--primary);">${c.id}</td>
        <td>
          <div style="font-weight:700;">${c.title}</div>
          <div style="font-size:0.78rem; color:var(--text-dim);">${c.location.address || 'Street'} (${c.location.ward || 'Central'})</div>
        </td>
        <td>
          <span style="font-size:0.8rem; font-weight:600; color:#93c5fd;">${c.department}</span>
        </td>
        <td>
          <span class="status-badge status-${(c.status || 'Reported').replace(/\s+/g, '-')}">${c.status}</span>
        </td>
        <td>
          <span class="triage-pill ${c.severity === 'Critical' ? 'pill-severity' : 'pill-sla'}">${c.severity}</span>
        </td>
        <td>${officerName}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary btn-sm" onclick="viewComplaintDetail('${c.id}')">View</button>
            ${!isResolved ? `
              <button class="btn btn-primary btn-sm" onclick="openAssignModal('${c.id}')">Assign / Update</button>
              <button class="btn btn-success btn-sm" onclick="openResolveModal('${c.id}')">Resolve & Proof</button>
            ` : `
              <span style="color:var(--emerald); font-size:0.8rem; font-weight:700; display:flex; align-items:center; gap:4px;">
                ✓ Verified
              </span>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterAdminComplaints() {
  const statusFilter = document.getElementById('adminStatusFilter').value;
  const deptFilter = document.getElementById('adminDeptFilter').value;
  const searchFilter = (document.getElementById('adminSearchInput').value || '').toLowerCase();

  let filtered = allAdminComplaints.filter(c => {
    const matchStatus = statusFilter === 'all' || (c.status && c.status.toLowerCase() === statusFilter.toLowerCase());
    const matchDept = deptFilter === 'all' || c.department === deptFilter;
    const matchSearch = !searchFilter || 
      (c.id && c.id.toLowerCase().includes(searchFilter)) ||
      (c.title && c.title.toLowerCase().includes(searchFilter)) ||
      (c.location && c.location.address && c.location.address.toLowerCase().includes(searchFilter));
    return matchStatus && matchDept && matchSearch;
  });

  renderAdminTable(filtered);
}

function openAssignModal(ticketId) {
  const complaint = allAdminComplaints.find(c => c.id === ticketId);
  if (!complaint) return;

  const modal = document.getElementById('adminActionModal');
  const targetId = document.getElementById('modalTicketId');
  const officerNameInput = document.getElementById('actionOfficerName');
  const officerRoleInput = document.getElementById('actionOfficerRole');
  const officerPhoneInput = document.getElementById('actionOfficerPhone');
  const statusSelect = document.getElementById('actionStatusSelect');

  if (targetId) targetId.value = ticketId;
  if (statusSelect) statusSelect.value = complaint.status === 'Reported' ? 'Assigned' : complaint.status;
  if (officerNameInput) officerNameInput.value = complaint.assignedOfficer ? complaint.assignedOfficer.name : 'Er. K. Ramesh';
  if (officerRoleInput) officerRoleInput.value = complaint.assignedOfficer ? complaint.assignedOfficer.role : 'Ward Engineering Officer';
  if (officerPhoneInput) officerPhoneInput.value = complaint.assignedOfficer ? complaint.assignedOfficer.phone : '+91 98490 88221';

  modal.classList.add('active');
}

async function submitAdminAction() {
  const ticketId = document.getElementById('modalTicketId').value;
  const status = document.getElementById('actionStatusSelect').value;
  const officerName = document.getElementById('actionOfficerName').value;
  const officerRole = document.getElementById('actionOfficerRole').value;
  const officerPhone = document.getElementById('actionOfficerPhone').value;

  try {
    const res = await fetch(`/api/complaints/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        officerName,
        officerRole,
        officerPhone
      })
    });

    const result = await res.json();
    if (result.success) {
      showToast(`Ticket #${ticketId} updated to ${status}`, 'success');
      closeModal('adminActionModal');
      loadAdminComplaints();
      loadComplaintsFeed();
      loadAnalytics();

      dispatchNotificationSimulation(ticketId, `Update on Ticket #${ticketId}: Status changed to ${status}. Assigned to ${officerName}.`);
    }
  } catch (err) {
    console.error('Update failed:', err);
    showToast('Failed to update complaint.', 'danger');
  }
}

function openResolveModal(ticketId) {
  const complaint = allAdminComplaints.find(c => c.id === ticketId);
  if (!complaint) return;

  const modal = document.getElementById('resolveProofModal');
  const targetId = document.getElementById('resolveTicketId');
  const beforeImg = document.getElementById('resolveBeforeImg');
  const notes = document.getElementById('resolveNotes');

  if (targetId) targetId.value = ticketId;
  if (beforeImg) beforeImg.src = complaint.imageUrl;
  if (notes) notes.value = `Site inspection conducted. Civic repair completed in compliance with Municipal standards.`;

  modal.classList.add('active');
}

async function submitResolutionProof() {
  const ticketId = document.getElementById('resolveTicketId').value;
  const notes = document.getElementById('resolveNotes').value;
  const proofUrl = document.getElementById('resolveProofImgUrl').value || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80';

  try {
    const res = await fetch(`/api/complaints/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Resolved',
        resolutionNotes: notes,
        resolutionImage: proofUrl
      })
    });

    const result = await res.json();
    if (result.success) {
      showToast(`Ticket #${ticketId} marked as RESOLVED with proof photo.`, 'success');
      closeModal('resolveProofModal');
      loadAdminComplaints();
      loadComplaintsFeed();
      loadAnalytics();

      dispatchNotificationSimulation(ticketId, `🎉 Resolution Notice: Grievance #${ticketId} has been resolved! Check proof photos in your tracker.`);
    }
  } catch (err) {
    console.error('Failed to resolve complaint:', err);
    showToast('Failed to mark resolved.', 'danger');
  }
}

function exportComplaintsCsv() {
  if (!allAdminComplaints || allAdminComplaints.length === 0) {
    showToast('No complaint data available to export.', 'warning');
    return;
  }

  const headers = ['ID', 'Title', 'Category', 'Severity', 'Department', 'Status', 'Ward', 'Address', 'Upvotes', 'Reported At', 'Assigned Officer'];
  const rows = allAdminComplaints.map(c => [
    `"${c.id}"`,
    `"${(c.title || '').replace(/"/g, '""')}"`,
    `"${c.category}"`,
    `"${c.severity}"`,
    `"${c.department}"`,
    `"${c.status}"`,
    `"${(c.location && c.location.ward) || ''}"`,
    `"${(c.location && c.location.address ? c.location.address : '').replace(/"/g, '""')}"`,
    c.upvotes || 0,
    `"${c.reportedAt}"`,
    `"${c.assignedOfficer ? c.assignedOfficer.name : 'Unassigned'}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `NagarikAI_Grievances_Export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Exported grievance audit report as CSV.', 'success');
}
