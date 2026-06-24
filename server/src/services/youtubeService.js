import { ExternalAPIError } from '../middleware/errorHandler.js';

const BASE = 'https://www.googleapis.com/youtube/v3';
const key = () => process.env.YOUTUBE_API_KEY;

export async function getLocationVideos(locationName, maxResults = 6) {
  if (!key()) return [];

  const query = `${locationName} travel guide`;
  const url = `${BASE}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${key()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new ExternalAPIError('youtube', res.statusText);
  }

  const data = await res.json();

  return data.items.map((item) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    channel: item.snippet.channelTitle,
  }));
}
