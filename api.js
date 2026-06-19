// ============ API CLIENT ============
const API_BASE = window.location.origin + '/api';
const TOKEN_KEY = 'ftc_token';
const USER_KEY = 'ftc_user';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getAuthHeaders(includeJson = true) {
  const headers = {};
  if (includeJson) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function apiRequest(endpoint, options = {}) {
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(options.body !== undefined),
      ...(options.headers || {}),
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  let data;

  try {
    data = await response.json();
  } catch {
    data = { success: false, message: 'Invalid server response.' };
  }

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

const api = {
  register(payload) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login(payload) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMe() {
    return apiRequest('/auth/me');
  },

  submitComplaint(payload) {
    return apiRequest('/complaints', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMyComplaints(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/complaints/mine${query ? `?${query}` : ''}`);
  },

  getAllComplaints(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/complaints${query ? `?${query}` : ''}`);
  },

  getComplaintByCaseId(caseId) {
    return apiRequest(`/complaints/${encodeURIComponent(caseId)}`);
  },

  updateComplaint(caseId, payload) {
    return apiRequest(`/complaints/${encodeURIComponent(caseId)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteComplaint(caseId) {
    return apiRequest(`/complaints/${encodeURIComponent(caseId)}`, {
      method: 'DELETE',
    });
  },

  createAdminComplaint(payload) {
    return apiRequest('/complaints/admin', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getComplaintStats() {
    return apiRequest('/complaints/stats');
  },

  getPublicStats() {
    return apiRequest('/complaints/public/stats');
  },

  getAllUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/users${query ? `?${query}` : ''}`);
  },

  updateUser(id, payload) {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  toggleBlockUser(id) {
    return apiRequest(`/users/${id}/block`, {
      method: 'PATCH',
    });
  },

  deleteUser(id) {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

window.api = api;
window.getToken = getToken;
window.getStoredUser = getStoredUser;
window.setAuth = setAuth;
window.clearAuth = clearAuth;
window.getAuthHeaders = getAuthHeaders;
