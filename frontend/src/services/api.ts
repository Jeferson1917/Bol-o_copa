import axios from 'axios';

const api = axios.create({
  // Na nuvem (Vercel) ele usa o link da Railway. Localmente, continua usando o proxy do Vite ('').
  baseURL: import.meta.env.VITE_API_URL || '', 
});

// Request interceptor to add authorization token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bolao_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle authorization expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bolao_token');
      localStorage.removeItem('bolao_user');
      // Only redirect to login if we aren't already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;