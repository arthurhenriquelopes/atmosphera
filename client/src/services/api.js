import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const weatherService = {
  getCurrent: (q, lat, lon) => api.get('/weather/current', { params: { q, lat, lon } }).then(res => res.data),
  getForecast: (q, lat, lon) => api.get('/weather/forecast', { params: { q, lat, lon } }).then(res => res.data),
  getExplore: (q) => api.get('/weather/explore', { params: { q } }).then(res => res.data),
  geocode: (q) => api.get('/weather/geocode', { params: { q } }).then(res => res.data),
};

export const recordsService = {
  getAll: (location) => api.get('/records', { params: { location } }).then(res => res.data),
  create: (data) => api.post('/records', data).then(res => res.data),
  update: (id, data) => api.put(`/records/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/records/${id}`).then(res => res.data),
};

export const exportService = {
  getDownloadUrl: (format) => `http://localhost:3001/api/export/${format}`,
};

export default api;
