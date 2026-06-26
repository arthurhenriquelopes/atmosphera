import { ExternalAPIError } from '../middleware/errorHandler.js';

const BASE = 'https://api.unsplash.com';
const key = () => process.env.UNSPLASH_ACCESS_KEY;

export async function getLocationPhotos(locationName, count = 6) {
  // Try Unsplash API first (if key is available)
  if (key()) {
    try {
      const url = `${BASE}/search/photos?query=${encodeURIComponent(locationName)}&per_page=${count}&orientation=landscape`;
      const res = await fetch(url, {
        headers: { Authorization: `Client-ID ${key()}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          return data.results.map((photo) => ({
            id: photo.id,
            url: photo.urls.regular,
            thumb: photo.urls.small,
            alt: photo.alt_description || locationName,
            author: photo.user.name,
            authorUrl: photo.user.links.html,
          }));
        }
      }
    } catch (err) {
      console.warn('[unsplash] API call failed, using fallback:', err.message);
    }
  }

  // Fallback: use Unsplash Source URL (no API key needed, returns a random photo for the query)
  const fallbackPhotos = [];
  for (let i = 0; i < Math.min(count, 3); i++) {
    fallbackPhotos.push({
      id: `fallback-${i}`,
      url: `https://source.unsplash.com/1200x800/?${encodeURIComponent(locationName)},city,landscape&sig=${Date.now() + i}`,
      thumb: `https://source.unsplash.com/400x300/?${encodeURIComponent(locationName)},city&sig=${Date.now() + i}`,
      alt: locationName,
      author: 'Unsplash',
      authorUrl: 'https://unsplash.com',
    });
  }
  return fallbackPhotos;
}
