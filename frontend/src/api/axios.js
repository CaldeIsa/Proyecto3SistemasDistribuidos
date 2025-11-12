import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const normalizedBaseUrl = rawBaseUrl
  ? rawBaseUrl.replace(/\/$/, '')
  : '/api';

const appBasePath = import.meta.env.BASE_URL || '/';
const normalizedBasePath = appBasePath.endsWith('/')
  ? appBasePath.slice(0, -1)
  : appBasePath;
const loginPath = `${normalizedBasePath || ''}/login`;

const api = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = loginPath;
    }
    return Promise.reject(error);
  }
);

export default api;
