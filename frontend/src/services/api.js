import axios from 'axios';

// Di production (Vercel), gunakan VITE_API_URL dari environment variable
// Di development, gunakan proxy Vite ke localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecowise_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('ecowise_token');
      localStorage.removeItem('ecowise_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ──── Auth ────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ──── Logs ────
export const logsAPI = {
  getAll: () => api.get('/logs'),
  submit: (data) => api.post('/logs', data),
  getById: (id) => api.get(`/logs/${id}`),
};

// ──── AI Predictions ────
export const predictionsAPI = {
  get: () => api.get('/predictions'),
};

// ──── Recommendations ────
export const recommendationsAPI = {
  get: () => api.get('/recommendations'),
};

// ──── Leaderboard ────
export const leaderboardAPI = {
  get: () => api.get('/leaderboard'),
};

// ──── Badges ────
export const badgesAPI = {
  get: () => api.get('/badges'),
};

export default api;
