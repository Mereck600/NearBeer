// client/src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach token from localStorage if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('nearBeerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
