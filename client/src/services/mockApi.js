// AuraHabit REST client. Kept at the old import path to minimize changes to the original UI.
const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;
  if (!response.ok) {
    const error = new Error(payload?.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

export const getTodayString = (dateObj = new Date()) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const SEED_USERS = [];
export const mockApi = {
  register: async (name, email, password) => (await request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })).user,
  login: async (email, password) => (await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })).user,
  getCurrentUser: async () => { try { return (await request('/auth/me')).user; } catch (error) { if (error.status === 401) return null; throw error; } },
  logout: async () => request('/auth/logout', { method: 'POST', body: '{}' }),
  updateProfile: async (data) => (await request('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) })).user,
  getHabitsAndLogs: async () => request('/habits'),
  getHabits: async () => (await request('/habits')).habits,
  getLogs: async () => (await request('/habits')).logs,
  addHabit: async (_userId, habitData) => (await request('/habits', { method: 'POST', body: JSON.stringify(habitData) })).habit,
  updateHabit: async (habitId, updates) => (await request(`/habits/${habitId}`, { method: 'PATCH', body: JSON.stringify(updates) })).habit,
  archiveHabit: async (habitId) => (await request(`/habits/${habitId}/archive`, { method: 'PATCH', body: '{}' })).habit,
  deleteHabit: async (habitId) => request(`/habits/${habitId}`, { method: 'DELETE' }),
  toggleHabitLog: async (_userId, habitId, date = getTodayString()) => (await request(`/habits/${habitId}/toggle`, { method: 'POST', body: JSON.stringify({ date }) })).completed,
  exportUserData: async () => request('/habits/backup/export'),
  importUserData: async (_userId, jsonString) => {
    let data; try { data = JSON.parse(jsonString); } catch { return false; }
    await request('/habits/backup/import', { method: 'POST', body: JSON.stringify(data) }); return true;
  },
  getAllHabitsSystem: async () => (await request('/habits/admin/stats')).habitsCount,
  getAdminStats: async () => request('/habits/admin/stats'),
};
