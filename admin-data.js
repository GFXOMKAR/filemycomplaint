// Admin dashboard data layer — uses backend API instead of localStorage

let adminComplaintsCache = [];
let adminUsersCache = [];
let adminReadNotifications = JSON.parse(localStorage.getItem('ftc_admin_read_notifs') || '[]');
let complaintsCurrentPage = 1;
const complaintsPageSize = 8;
let filteredComplaintsList = [];
let usersCurrentPage = 1;
const usersPageSize = 8;
let filteredUsersList = [];

async function initAdminProfile() {
  try {
    const data = await api.getMe();
    if (data.user.role !== 'admin') return;

    setAuth(getToken(), data.user);

    const nameEl = document.getElementById('admin-name');
    if (nameEl) {
      nameEl.textContent = data.user.name || `${data.user.fname || ''} ${data.user.lname || ''}`.trim();
    }
  } catch {
    // Route guard handles redirect
  }
}

function renderStatsSkeletons() {
  const container = document.getElementById('stats-grid-container');
  container.innerHTML = Array(4).fill(0).map(() => `
    <div class="stat-card skeleton" style="min-height:92px; border:none; background:#eee; opacity:0.6;"></div>
  `).join('');
}

async function loadData() {
  renderStatsSkeletons();

  try {
    const [complaintsRes, usersRes] = await Promise.all([
      api.getAllComplaints(),
      api.getAllUsers(),
    ]);

    adminComplaintsCache = complaintsRes.complaints || [];
    adminUsersCache = usersRes.users || [];

    const complaints = adminComplaintsCache;
    const users = adminUsersCache;

    const totalComplaints = complaints.length;
    const newComplaints = complaints.filter(c => !c.status || c.status.toLowerCase() === 'received').length;
    const pendingComplaints = complaints.filter(c => c.status && c.status.toLowerCase() === 'pending').length;
    const solvedComplaints = complaints.filter(c => c.status && c.status.toLowerCase() === 'solved').length;
    const totalUsers = users.length;

    const statsContainer = document.getElementById('stats-grid-container');
    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-info"><h3>Total Cases</h3><div class="stat-number">${totalComplaints}</div></div>
        <div class="stat-icon gold"><i data-feather="folder"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info"><h3>New Filings</h3><div class="stat-number">${newComplaints}</div></div>
        <div class="stat-icon blue"><i data-feather="plus-circle"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info"><h3>Pending Cases</h3><div class="stat-number">${pendingComplaints}</div></div>
        <div class="stat-icon amber"><i data-feather="clock"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info"><h3>Solved Cases</h3><div class="stat-number">${solvedComplaints}</div></div>
        <div class="stat-icon green"><i data-feather="check-circle"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info"><h3>Total Clients</h3><div class="stat-number">${totalUsers}</div></div>
        <div class="stat-icon purple"><i data-feather="users"></i></div>
      </div>
    `;

    const recentTbody = document.getElementById('recent-complaints-tbody');
    const sortedComplaints = [...complaints].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    const recentComplaints = sortedComplaints.slice(0, 5);

    if (recentComplaints.length === 0) {
      recentTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-secondary);">No complaints submitted yet.</td></tr>`;
    } else {
      recentTbody.innerHTML = recentComplaints.map(c => {
        const dateStr = new Date(c.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        let badgeClass = 'status-received';
        let statusLabel = c.status || 'Received';
        if (statusLabel.toLowerCase() === 'pending') badgeClass = 'status-pending';
        if (statusLabel.toLowerCase() === 'solved') badgeClass = 'status-solved';
        return `
          <tr>
            <td class="case-id-cell">${c.caseId}</td>
            <td style="font-weight:600; color:var(--text-primary);">${c.name || ''}</td>
            <td><span style="font-size:0.8rem; color:var(--gold); font-weight:600;">${c.category}</span></td>
            <td>${dateStr}</td>
            <td><span class="status-badge ${badgeClass}">${statusLabel}</span></td>
            <td><button class="btn-action view" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="openComplaintDetailsModal('${c.caseId}')">View</button></td>
          </tr>
        `;
      }).join('');
    }

    renderCharts(complaints);
    renderComplaintsList();
    renderUsersList();
    renderReportsTable();
    renderNotificationsList();
    feather.replace();
  } catch (error) {
    showToast(error.message || 'Failed to load dashboard data.', 'error');
  }
}

function renderComplaintsList() {
  const tbody = document.getElementById('complaints-tbody');
  const searchVal = document.getElementById('complaint-search-box').value.trim().toLowerCase();
  const statusFilter = document.getElementById('complaint-status-filter').value;
  const dateSort = document.getElementById('complaint-date-sort').value;

  filteredComplaintsList = adminComplaintsCache.filter(c => {
    const matchesSearch = (c.caseId || '').toLowerCase().includes(searchVal) ||
      (c.name || '').toLowerCase().includes(searchVal) ||
      (c.email || '').toLowerCase().includes(searchVal) ||
      (c.phone || '').toLowerCase().includes(searchVal) ||
      (c.category || '').toLowerCase().includes(searchVal) ||
      (c.issueDescription || '').toLowerCase().includes(searchVal);

    let matchesStatus = true;
    if (statusFilter) {
      const status = (c.status || 'Received').toLowerCase();
      matchesStatus = status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  filteredComplaintsList.sort((a, b) => {
    const da = new Date(a.submittedAt);
    const db = new Date(b.submittedAt);
    return dateSort === 'desc' ? db - da : da - db;
  });

  const totalItems = filteredComplaintsList.length;
  const totalPages = Math.ceil(totalItems / complaintsPageSize) || 1;
  if (complaintsCurrentPage > totalPages) complaintsCurrentPage = totalPages;

  const startIndex = (complaintsCurrentPage - 1) * complaintsPageSize;
  const endIndex = Math.min(startIndex + complaintsPageSize, totalItems);
  const pageItems = filteredComplaintsList.slice(startIndex, endIndex);

  document.getElementById('complaints-pagination-info').textContent = totalItems > 0
    ? `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} entries`
    : 'Showing 0 to 0 of 0 entries';

  document.getElementById('btn-complaints-prev').disabled = complaintsCurrentPage === 1;
  document.getElementById('btn-complaints-next').disabled = complaintsCurrentPage === totalPages;

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:3rem; color:var(--text-secondary);">No matching complaints found.</td></tr>`;
    return;
  }

  tbody.innerHTML = pageItems.map(c => {
    const dateStr = new Date(c.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    let statusClass = 'status-received';
    let statusLabel = c.status || 'Received';
    if (statusLabel.toLowerCase() === 'pending') statusClass = 'status-pending';
    if (statusLabel.toLowerCase() === 'solved') statusClass = 'status-solved';

    return `
      <tr>
        <td class="case-id-cell">${c.caseId}</td>
        <td style="font-weight:600; color:var(--text-primary);">${c.name || ''}</td>
        <td>${c.phone || '—'}</td>
        <td><span style="font-size:0.8rem; color:var(--gold); font-weight:600; text-transform:uppercase;">${c.category}</span></td>
        <td style="max-width:180px; overflow:hidden; text-overflow:ellipsis; color:var(--text-secondary);" title="${c.against}">Against: ${c.against}</td>
        <td>${dateStr}</td>
        <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
        <td>
          <button class="btn-action view" onclick="openComplaintDetailsModal('${c.caseId}')">Details</button>
          <button class="btn-action delete" onclick="deleteComplaint('${c.caseId}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function saveNewComplaint(e) {
  e.preventDefault();
  const name = document.getElementById('new-case-name').value.trim();
  const phone = document.getElementById('new-case-phone').value.trim();
  const email = document.getElementById('new-case-email').value.trim().toLowerCase();
  const category = document.getElementById('new-case-category').value;
  const city = document.getElementById('new-case-city').value.trim();
  const state = document.getElementById('new-case-state').value;
  const against = document.getElementById('new-case-against').value.trim();
  const date = document.getElementById('new-case-date').value;
  const desc = document.getElementById('new-case-desc').value.trim();

  if (!/^[6-9]\d{9}$/.test(phone)) {
    showToast('Please enter a valid 10-digit mobile number.', 'error');
    return;
  }

  try {
    const data = await api.createAdminComplaint({
      name, phone, email, category, city, state, against, date, issueDescription: desc,
    });
    showToast(`Manual case ${data.complaint.caseId} filed successfully.`, 'success');
    closeNewComplaintModal();
    loadData();
  } catch (error) {
    showToast(error.message || 'Failed to create complaint.', 'error');
  }
}

async function saveComplaintUpdates(e) {
  e.preventDefault();
  if (!currentViewingCaseId) return;

  const newStatus = document.getElementById('update-modal-status').value;
  const remarksText = document.getElementById('update-modal-remarks').value.trim();

  try {
    await api.updateComplaint(currentViewingCaseId, { status: newStatus, remarks: remarksText });
    showToast(`Case ${currentViewingCaseId} updated successfully.`, 'success');
    closeComplaintDetailsModal();
    loadData();
  } catch (error) {
    showToast(error.message || 'Failed to update complaint.', 'error');
  }
}

async function deleteComplaint(caseId) {
  if (!confirm(`Are you sure you want to permanently delete case file ${caseId}? This action cannot be undone.`)) return;
  try {
    await api.deleteComplaint(caseId);
    showToast(`Case ${caseId} deleted.`, 'info');
    loadData();
  } catch (error) {
    showToast(error.message || 'Failed to delete complaint.', 'error');
  }
}

function renderUsersList() {
  const tbody = document.getElementById('users-tbody');
  const searchVal = document.getElementById('user-search-box').value.trim().toLowerCase();

  filteredUsersList = adminUsersCache.filter(u => {
    const name = `${u.fname} ${u.lname}`.toLowerCase();
    return name.includes(searchVal) ||
      u.email.toLowerCase().includes(searchVal) ||
      u.phone.includes(searchVal) ||
      (u.city && u.city.toLowerCase().includes(searchVal));
  });

  const totalItems = filteredUsersList.length;
  const totalPages = Math.ceil(totalItems / usersPageSize) || 1;
  if (usersCurrentPage > totalPages) usersCurrentPage = totalPages;

  const startIndex = (usersCurrentPage - 1) * usersPageSize;
  const endIndex = Math.min(startIndex + usersPageSize, totalItems);
  const pageItems = filteredUsersList.slice(startIndex, endIndex);

  document.getElementById('users-pagination-info').textContent = totalItems > 0
    ? `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} entries`
    : 'Showing 0 to 0 of 0 entries';

  document.getElementById('btn-users-prev').disabled = usersCurrentPage === 1;
  document.getElementById('btn-users-next').disabled = usersCurrentPage === totalPages;

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:3rem; color:var(--admin-text-muted-light);">No registered clients found.</td></tr>`;
    return;
  }

  tbody.innerHTML = pageItems.map(u => {
    const statusLabel = u.blocked ? 'Blocked' : 'Active';
    const badgeClass = u.blocked ? 'status-received' : 'status-solved';
    return `
      <tr>
        <td style="font-family:var(--font-mono); font-size:0.8rem;">${u.id}</td>
        <td style="font-weight:600;">${u.fname} ${u.lname}</td>
        <td>${u.email}</td>
        <td>${u.phone}</td>
        <td>${u.city || 'N/A'}</td>
        <td><span style="font-size:0.75rem; font-weight:700; color:var(--admin-text-muted-light); text-transform:uppercase;">${u.role}</span></td>
        <td><span class="status-badge ${badgeClass}">${statusLabel}</span></td>
        <td>
          <button class="btn-page" style="padding:0.25rem 0.6rem; font-size:0.75rem; border-color:var(--primary-brand); color:var(--primary-brand);" onclick="openUserEditModal('${u.id}')">Edit</button>
          <button class="btn-page" style="padding:0.25rem 0.6rem; font-size:0.75rem; border-color:var(--gold-dark); color:var(--gold-dark);" onclick="toggleBlockUser('${u.id}')">${u.blocked ? 'Unblock' : 'Block'}</button>
          <button class="btn-page" style="padding:0.25rem 0.6rem; font-size:0.75rem; border-color:#EF4444; color:#EF4444;" onclick="deleteUser('${u.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function toggleBlockUser(userId) {
  try {
    const data = await api.toggleBlockUser(userId);
    showToast(`Client account status changed to ${data.user.blocked ? 'Blocked' : 'Active'}.`, 'info');
    loadData();
  } catch (error) {
    showToast(error.message || 'Failed to update user.', 'error');
  }
}

async function deleteUser(userId) {
  if (!confirm('Are you sure you want to permanently delete this client? All case filings associated with this account will remain in database but the user login is lost.')) return;
  try {
    await api.deleteUser(userId);
    showToast('User account deleted.', 'info');
    loadData();
  } catch (error) {
    showToast(error.message || 'Failed to delete user.', 'error');
  }
}

function openUserEditModal(userId) {
  const u = adminUsersCache.find(user => user.id === userId);
  if (!u) return;
  document.getElementById('edit-user-id').value = u.id;
  document.getElementById('edit-user-fname').value = u.fname;
  document.getElementById('edit-user-lname').value = u.lname;
  document.getElementById('edit-user-phone').value = u.phone;
  document.getElementById('edit-user-city').value = u.city || '';
  document.getElementById('user-edit-modal').classList.add('open');
}

async function saveUserDetails(e) {
  e.preventDefault();
  const id = document.getElementById('edit-user-id').value;
  const fname = document.getElementById('edit-user-fname').value.trim();
  const lname = document.getElementById('edit-user-lname').value.trim();
  const phone = document.getElementById('edit-user-phone').value.trim();
  const city = document.getElementById('edit-user-city').value.trim();

  if (!/^[6-9]\d{9}$/.test(phone)) {
    showToast('Please enter a valid 10-digit mobile number.', 'error');
    return;
  }

  try {
    await api.updateUser(id, { fname, lname, phone, city });
    showToast('Client details updated successfully.', 'success');
    closeUserEditModal();
    loadData();
  } catch (error) {
    showToast(error.message || 'Failed to update user.', 'error');
  }
}

function renderReportsTable() {
  const reportsTbody = document.getElementById('reports-tbody');
  const complaints = adminComplaintsCache;
  const stats = {};

  complaints.forEach(c => {
    const cat = c.category || 'General';
    if (!stats[cat]) stats[cat] = { total: 0, pending: 0, solved: 0 };
    stats[cat].total++;
    if (c.status && c.status.toLowerCase() === 'pending') stats[cat].pending++;
    if (c.status && c.status.toLowerCase() === 'solved') stats[cat].solved++;
  });

  const categories = Object.keys(stats);
  if (categories.length === 0) {
    reportsTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--admin-text-muted-light);">No data available to generate reports.</td></tr>`;
    return;
  }

  document.getElementById('report-date').textContent = `Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`;

  reportsTbody.innerHTML = categories.map(cat => {
    const item = stats[cat];
    const successRate = item.total > 0 ? Math.round((item.solved / item.total) * 100) : 0;
    return `
      <tr>
        <td style="font-weight:600; color:var(--navy);">${cat}</td>
        <td style="font-weight:700;">${item.total}</td>
        <td style="color:#d97706; font-weight:600;">${item.pending}</td>
        <td style="color:#047857; font-weight:600;">${item.solved}</td>
        <td style="font-weight:700; color:var(--primary-brand);">${successRate}%</td>
      </tr>
    `;
  }).join('');
}

function exportCSVReport() {
  const complaints = adminComplaintsCache;
  if (complaints.length === 0) {
    showToast('No data available to export.', 'error');
    return;
  }

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'Case ID,Client Name,Client Email,Client Mobile,Category,Filing Against,Date,Status,Advocate Remarks\r\n';

  complaints.forEach(c => {
    const remarksCleaned = c.remarks ? c.remarks.replace(/"/g, '""').replace(/\n/g, ' ') : '';
    const row = [
      c.caseId,
      `"${c.name}"`,
      c.email,
      c.phone,
      `"${c.category}"`,
      `"${c.against}"`,
      c.submittedAt,
      c.status || 'Received',
      `"${remarksCleaned}"`,
    ].join(',');
    csvContent += row + '\r\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Filing_Analytics_Report_${new Date().getFullYear()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('CSV report generated and downloading.', 'success');
}

function renderNotificationsList() {
  const adminNotifs = [...adminComplaintsCache]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 10)
    .map(c => ({
      id: c.caseId,
      caseId: c.caseId,
      message: `New complaint filed by ${c.name} — ${c.category}`,
      timestamp: c.submittedAt,
      read: adminReadNotifications.includes(c.caseId),
    }));

  const unreadCount = adminNotifs.filter(n => !n.read).length;
  const badge = document.getElementById('notif-badge-count');
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }

  const notifList = document.getElementById('notif-list-items');
  if (adminNotifs.length === 0) {
    notifList.innerHTML = `<li style="padding:1.5rem; text-align:center; color:var(--admin-text-muted-light); font-size:0.8rem;">No new notifications</li>`;
    return;
  }

  notifList.innerHTML = adminNotifs.slice(0, 5).map(n => {
    const timeStr = new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const unreadClass = n.read ? '' : 'unread';
    return `
      <li class="notif-item ${unreadClass}" onclick="handleNotifClick('${n.id}', '${n.caseId}')">
        <div class="notif-item-message">${n.message}</div>
        <div class="notif-item-time">${timeStr}</div>
      </li>
    `;
  }).join('');
}

function markAllNotificationsRead() {
  adminReadNotifications = adminComplaintsCache.map(c => c.caseId);
  localStorage.setItem('ftc_admin_read_notifs', JSON.stringify(adminReadNotifications));
  renderNotificationsList();
}

function handleNotifClick(notifId, caseId) {
  if (!adminReadNotifications.includes(caseId)) {
    adminReadNotifications.push(caseId);
    localStorage.setItem('ftc_admin_read_notifs', JSON.stringify(adminReadNotifications));
  }
  const notifBox = document.getElementById('notif-dropdown-box');
  if (notifBox) notifBox.classList.remove('open');
  switchTab('complaints');
  openComplaintDetailsModal(caseId);
}

function closeUserEditModal() {
  document.getElementById('user-edit-modal').classList.remove('open');
}

function adminSignOut() {
  clearAuth();
  showToast('Logged out successfully.', 'info');
  setTimeout(() => {
    window.location.href = 'admin-login.html';
  }, 500);
}
