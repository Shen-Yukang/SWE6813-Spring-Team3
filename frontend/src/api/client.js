const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;
const API_BASE = import.meta.env.VITE_API_BASE || (API_ORIGIN ? `${API_ORIGIN}/api` : 'http://localhost:3000/api');
let authToken = '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'request failed');
  }
  return data;
}

function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (typeof value === 'string' && value.trim() === '') {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export const apiClient = {
  setToken: (token) => {
    authToken = token || '';
  },
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  upsertProfile: (userId, payload) =>
    request(`/profile/${userId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getMatches: (userId, options = {}) => request(`/matchmaking/${userId}${buildQueryString(options)}`),
};
