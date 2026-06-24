import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { weatherService } from '../services/api';
import './ExplorePage.css';

// fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  
  const [location, setLocation] = useState(null);
  const [media, setMedia] = useState({ videos: [], photos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q) {
      setError('no location provided');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const geoRes = await weatherService.getExplore(q);
        // We need the coordinates, so let's do a quick geocode if we don't have them
        const geocodeRes = await weatherService.getCurrent(q);
        
        setLocation(geocodeRes.location);
        setMedia(geoRes);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'failed to load exploration data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q]);

  if (loading) return <div className="page-container loader">loading media...</div>;
  if (error) return <div className="page-container error-message glass-panel">{error}</div>;
  if (!location) return null;

  return (
    <div className="explore-page page-container">
      <header className="page-header">
        <h1>explore {location.name}</h1>
        <p className="subtitle">discover the area through maps, videos, and photos.</p>
      </header>

      <div className="map-section glass-panel">
        <MapContainer center={[location.lat, location.lon]} zoom={12} style={{ height: '400px', width: '100%', borderRadius: '8px', zIndex: 1 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.lat, location.lon]}>
            <Popup>
              {location.name}, {location.country}
            </Popup>
          </Marker>
          <MapUpdater center={[location.lat, location.lon]} />
        </MapContainer>
      </div>

      {media.photos.length > 0 && (
        <div className="media-section">
          <h2>photos</h2>
          <div className="photo-grid">
            {media.photos.map(photo => (
              <a key={photo.id} href={photo.url} target="_blank" rel="noreferrer" className="photo-card">
                <img src={photo.thumb} alt={photo.alt} loading="lazy" />
                <div className="photo-credit">by {photo.author} on Unsplash</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {media.videos.length > 0 && (
        <div className="media-section">
          <h2>travel guides & videos</h2>
          <div className="video-grid">
            {media.videos.map(video => (
              <a key={video.videoId} href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noreferrer" className="video-card glass-panel">
                <img src={video.thumbnail} alt={video.title} />
                <div className="video-info">
                  <h4>{video.title}</h4>
                  <p>{video.channel}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
      
      {media.videos.length === 0 && media.photos.length === 0 && (
        <div className="glass-panel text-center">
          <p>no external media found for this location.</p>
          <p className="text-sm text-secondary mt-2">ensure you have configured your YOUTUBE_API_KEY and UNSPLASH_ACCESS_KEY in the backend .env file.</p>
        </div>
      )}
    </div>
  );
}
