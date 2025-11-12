import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const ensureTrailingSlash = (value) => (value.endsWith('/') ? value : `${value}/`);

function resolveBaseUrl() {
  if (rawBaseUrl) {
    const trimmed = rawBaseUrl.replace(/\/+$/, '');

    if (/^https?:\/\//i.test(trimmed)) {
      return ensureTrailingSlash(trimmed);
    }

    const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

    if (typeof window !== 'undefined' && window.location?.origin) {
      return ensureTrailingSlash(`${window.location.origin}${path}`);
    }

    return ensureTrailingSlash(path);
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return ensureTrailingSlash(`${window.location.origin}/api`);
  }

  return ensureTrailingSlash('/api');
}

const baseURL = resolveBaseUrl();

const appBasePath = import.meta.env.BASE_URL || '/';
const normalizedBasePath = appBasePath.endsWith('/')
  ? appBasePath.slice(0, -1)
  : appBasePath;
const loginPath = `${normalizedBasePath || ''}/login`;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token y normalizar rutas en todas las solicitudes
api.interceptors.request.use(
  (config) => {
    if (typeof config.url === 'string' && config.url.startsWith('/')) {
      config.url = config.url.slice(1);
    }

    if (typeof window !== 'undefined') {
      const token = window.localStorage?.getItem('token');
      if (token) {
        const headers = config.headers || {};
        if (typeof headers.set === 'function') {
          headers.set('Authorization', `Bearer ${token}`);
        } else {
          headers.Authorization = `Bearer ${token}`;
        }
        config.headers = headers;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.localStorage?.removeItem('token');
      window.localStorage?.removeItem('user');
      window.location.href = loginPath;
    }
    return Promise.reject(error);
  }
);

export default api;
