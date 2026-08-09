import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sh_token');
      localStorage.removeItem('sh_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ---- Auth ----
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// ---- Users ----
export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  getById: (id) => api.get(`/users/${id}`),
  list: (params) => api.get('/users', { params }),
};

// ---- Startups ----
export const startupAPI = {
  list: (params) => api.get('/startups', { params }),
  getById: (id) => api.get(`/startups/${id}`),
  create: (data) => api.post('/startups', data),
  update: (id, data) => api.put(`/startups/${id}`, data),
  remove: (id) => api.delete(`/startups/${id}`),
  mine: () => api.get('/startups/mine'),
  removeTeamMember: (id, userId) => api.delete(`/startups/${id}/team/${userId}`),
  analytics: (id) => api.get(`/startups/${id}/analytics`),
};

// ---- Applications ----
export const applicationAPI = {
  apply: (data) => api.post('/applications', data),
  forStartup: (startupId, params) => api.get(`/applications/startup/${startupId}`, { params }),
  mine: () => api.get('/applications/mine'),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};

// ---- Tasks ----
export const taskAPI = {
  create: (data) => api.post('/tasks', data),
  forStartup: (startupId) => api.get(`/tasks/startup/${startupId}`),
  mine: () => api.get('/tasks/mine'),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  remove: (id) => api.delete(`/tasks/${id}`),
  reorder: (tasks) => api.put('/tasks/reorder', { tasks }),
};

// ---- Messages ----
export const messageAPI = {
  direct: (userId) => api.get(`/messages/direct/${userId}`),
  team: (startupId) => api.get(`/messages/team/${startupId}`),
  conversations: () => api.get('/messages/conversations'),
  markRead: (userId) => api.put(`/messages/direct/${userId}/read`),
};

// ---- Notifications ----
export const notificationAPI = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// ---- Files ----
export const fileAPI = {
  upload: (startupId, formData) =>
    api.post(`/files/${startupId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  list: (startupId) => api.get(`/files/${startupId}`),
  remove: (id) => api.delete(`/files/${id}`),
};

// ---- Milestones ----
export const milestoneAPI = {
  create: (data) => api.post('/milestones', data),
  forStartup: (startupId) => api.get(`/milestones/startup/${startupId}`),
  update: (id, data) => api.put(`/milestones/${id}`, data),
  remove: (id) => api.delete(`/milestones/${id}`),
};

// ---- Admin ----
export const adminAPI = {
  stats: () => api.get('/admin/stats'),
  users: () => api.get('/admin/users'),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/status`),
  startups: () => api.get('/admin/startups'),
  toggleStartupStatus: (id) => api.put(`/admin/startups/${id}/status`),
};
