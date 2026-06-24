import { ExternalAPIError } from '../middleware/errorHandler.js';

const BASE = 'https://api.unsplash.com';
const key = () => process.env.UNSPLASH_ACCESS_KEY;

export async function getLocationPhotos(locationName, count = 6) {
  if (!key()) return [];

  const url = `${BASE}/search/photos?query=${encodeURIComponent(locationName)}&per_page=${count}&orientation=landscape`;

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key()}` },
  });

  if (!res.ok) {
    throw new ExternalAPIError('unsplash', res.statusText);
  }

  const data = await res.json();

  return data.results.map((photo) => ({
    id: photo.id,
    url: photo.urls.regular,
    thumb: photo.urls.small,
    alt: photo.alt_description || locationName,
    author: photo.user.name,
    authorUrl: photo.user.links.html,
  }));
}
