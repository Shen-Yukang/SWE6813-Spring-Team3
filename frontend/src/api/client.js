const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
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

export const apiClient = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  upsertProfile: (userId, payload) =>
    request(`/profile/${userId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getMatches: (userId) => request(`/matchmaking/${userId}`),
};
