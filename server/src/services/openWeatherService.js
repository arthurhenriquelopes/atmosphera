import { LocationNotFoundError, ExternalAPIError } from '../middleware/errorHandler.js';

const BASE = 'https://api.openweathermap.org';
const key = () => process.env.OPENWEATHER_API_KEY;

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ExternalAPIError('openweathermap', body.message || res.statusText);
  }
  return res.json();
}

export async function geocode(query) {
  const url = `${BASE}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${key()}`;
  const results = await fetchJSON(url);

  if (!results.length) {
    throw new LocationNotFoundError(query);
  }

  return results.map((r) => ({
    name: r.name,
    country: r.country,
    state: r.state || null,
    lat: r.lat,
    lon: r.lon,
  }));
}

export async function reverseGeocode(lat, lon) {
  const url = `${BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key()}`;
  const results = await fetchJSON(url);

  if (!results.length) {
    throw new LocationNotFoundError(`${lat}, ${lon}`);
  }

  return {
    name: results[0].name,
    country: results[0].country,
    state: results[0].state || null,
    lat: results[0].lat,
    lon: results[0].lon,
  };
}

export async function getCurrentWeather(lat, lon) {
  const url = `${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key()}`;
  return fetchJSON(url);
}

export async function getForecast(lat, lon) {
  const url = `${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key()}`;
  return fetchJSON(url);
}

// figures out what the user typed and resolves coordinates
export async function resolveLocation(input) {
  const coordPattern = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;
  const match = input.trim().match(coordPattern);

  if (match) {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);
    const geo = await reverseGeocode(lat, lon);
    return geo;
  }

  const results = await geocode(input);
  return results[0];
}
