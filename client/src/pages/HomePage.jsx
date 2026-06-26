import { useState, useEffect } from 'react';
import SearchBar from '../components/search/SearchBar';
import { weatherService, recordsService, exportService } from '../services/api';
import { getWeatherIcon } from '../utils/weatherIcons';
import './HomePage.css';

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('weather'); // 'weather', 'history', 'about'

  // History state
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      setLoadingRecords(true);
      recordsService.getAll()
        .then(data => setRecords(data))
        .catch(console.error)
        .finally(() => setLoadingRecords(false));
    }
  }, [activeTab]);

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await recordsService.delete(id);
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  // Refatorado para carregar os dados de previsão e mídia de uma vez só para compor a tela
  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      // Usar a mesma estratégia anterior mas trazendo o forecast também para a lista inferior
      const current = await weatherService.getCurrent(query);
      const forecast = await weatherService.getForecast(null, current.location.lat, current.location.lon);
      const media = await weatherService.getExplore(query);
      
      const photoUrl = media.photos.length > 0 ? media.photos[0].url : 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1000&auto=format&fit=crop';
      
      setData({ current: current.weather, location: current.location, forecast: forecast.forecast, photo: photoUrl });
      
      recordsService.create({
        location: query,
        dateStart: new Date().toISOString(),
        dateEnd: new Date().toISOString()
      }).catch(console.error);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLocation = () => {
    if (!navigator.geolocation) return setError('geolocation not supported');
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => handleSearch(`${position.coords.latitude}, ${position.coords.longitude}`),
      () => { setError('unable to retrieve location'); setLoading(false); }
    );
  };

  // Determine greeting based on local time
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const suggestedCities = ['Tokyo', 'New York', 'Paris', 'London'];

  // Se não buscou nada, mostra uma tela inicial simples
  if (!data && !loading && !error) {
    return (
      <div className="home-mobile">
        <div className="mobile-header empty-header futuristic-light-bg">
          <div className="empty-content fade-in-up">
            <img src="/logo-atmosphera.svg" alt="Atmosphera" className="brand-logo-large" />
            <p className="subtitle">Experience the weather anywhere.</p>
            
            <div className="search-wrapper" style={{ width: '100%', maxWidth: '340px', margin: '2rem auto 2rem' }}>
              <SearchBar onSearch={handleSearch} onUseLocation={handleLocation} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Overlay leve com gradiente: mais transparente no topo, mais escuro embaixo (para legibilidade do texto)
  let overlayTop = 'rgba(0, 0, 0, 0.15)';
  let overlayBottom = 'rgba(0, 0, 0, 0.55)';
  if (data) {
    const temp = data.current.main.temp;
    if (temp < 10) {
      overlayTop = 'rgba(20, 50, 80, 0.2)';
      overlayBottom = 'rgba(10, 30, 60, 0.6)';
    } else if (temp < 25) {
      overlayTop = 'rgba(30, 70, 60, 0.15)';
      overlayBottom = 'rgba(20, 50, 40, 0.55)';
    } else {
      overlayTop = 'rgba(80, 40, 10, 0.15)';
      overlayBottom = 'rgba(60, 30, 10, 0.55)';
    }
  }

  const headerStyle = {
    backgroundImage: `linear-gradient(to bottom, ${overlayTop}, ${overlayBottom}), url(${data?.photo || ''})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div className="home-mobile">
      <div className="mobile-header" style={headerStyle}>
        <img src="/logo-atmosphera.svg" alt="Atmosphera" className="brand-logo-small" />
        <div className="search-wrapper">
          <SearchBar onSearch={handleSearch} onUseLocation={handleLocation} />
        </div>
        
        {loading && <div className="loading-text">Loading...</div>}
        {error && <div className="error-text">{error}</div>}

        {data && !loading && (
          <div className="hero-weather">
            <img src={getWeatherIcon(data.current.weather[0].icon)} alt={data.current.weather[0].description} className="hero-icon" />
            <h1 className="weather-temp">{Math.round(data.current.main.temp)}&deg;</h1>
            <h2 className="weather-condition">{data.current.weather[0].main}</h2>
            <p className="weather-location">{data.location.name}, {data.location.country}</p>
          </div>
        )}
      </div>

      <div className="mobile-body">
        <div className="tabs">
          <button className={`tab ${activeTab === 'weather' ? 'active' : ''}`} onClick={() => setActiveTab('weather')}>Weather</button>
          <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>History</button>
          <button className={`tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About</button>
        </div>

        <div className="tab-content">
          {activeTab === 'weather' && data && (
            <div className="forecast-list">
              {data.forecast.list.filter((_, i) => i % 8 === 0).map((item, idx) => {
                const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
                return (
                  <div key={idx} className="forecast-row">
                    <span className="forecast-day">{date}</span>
                    <span className="forecast-info">
                      <img src={getWeatherIcon(item.weather[0].icon)} alt={item.weather[0].description} className="forecast-row-icon" />
                      <span className="forecast-temp">{Math.round(item.main.temp)}&deg;C</span>
                      <span className="forecast-desc">{item.weather[0].main}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="history-tab fade-in-up">
              <div className="export-links">
                <a href={exportService.getDownloadUrl('json')} download>JSON</a>
                <a href={exportService.getDownloadUrl('csv')} download>CSV</a>
                <a href={exportService.getDownloadUrl('pdf')} target="_blank" rel="noreferrer">PDF</a>
              </div>
              {loadingRecords ? (
                <p className="tab-msg">Loading history...</p>
              ) : records.length === 0 ? (
                <p className="tab-msg">No search history yet.</p>
              ) : (
                <div className="history-list">
                  {records.map(r => (
                    <div key={r.id} className="history-card">
                      <div className="history-card-left">
                        <h4>{r.location}</h4>
                        <span className="history-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="history-card-right">
                        <span className="history-temp">{r.temperature}°C</span>
                        <button className="history-del-btn" onClick={() => handleDeleteRecord(r.id)} title="Delete">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="about-tab fade-in-up">
              <div className="about-section">
                <h3>Developer</h3>
                <p>PM Accelerator Applicant</p>
                <span className="about-sub">Full Stack Engineer Assessment</span>
              </div>
              <div className="about-section">
                <h3>PM Accelerator</h3>
                <p>A premier program designed to help professionals transition into and accelerate their careers in product management.</p>
                <a href="https://www.linkedin.com/company/product-manager-accelerator/" target="_blank" rel="noreferrer" className="about-link">Visit LinkedIn</a>
              </div>
              <div className="about-section">
                <h3>Tech Stack</h3>
                <div className="tech-chips">
                  <span>React.js</span><span>Vite</span><span>Node.js</span><span>Express.js</span><span>SQLite</span><span>Prisma</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
