import { useState, useEffect } from 'react';
import SearchBar from '../components/search/SearchBar';
import { weatherService, recordsService } from '../services/api';
import './HomePage.css';

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('weather'); // 'weather', 'history', 'about'

  // Refatorado para carregar os dados de previsão e mídia de uma vez só para compor a tela
  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      // Usar a mesma estratégia anterior mas trazendo o forecast também para a lista inferior
      const current = await weatherService.getCurrent(query);
      const forecast = await weatherService.getForecast(null, current.location.lat, current.location.lon);
      const media = await weatherService.getExplore(query);
      
      const photoUrl = media.photos.length > 0 ? media.photos[0].url : '';
      
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

  // Se não buscou nada, mostra uma tela inicial simples
  if (!data && !loading && !error) {
    return (
      <div className="home-mobile">
        <div className="mobile-header empty-header" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1000&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', height: '100%', flex: 1, justifyContent: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '2rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)', letterSpacing: '-1px' }}>Atmosphera</h1>
          <div className="search-wrapper" style={{ width: '85%' }}>
            <SearchBar onSearch={handleSearch} onUseLocation={handleLocation} />
          </div>
        </div>
      </div>
    );
  }

  // Determinar cor da overlay baseada na temperatura (Frio = azul, Quente = laranja/amarelo)
  let overlayColor = 'rgba(0, 0, 0, 0.4)';
  if (data) {
    const temp = data.current.main.temp;
    if (temp < 10) overlayColor = 'rgba(30, 80, 120, 0.7)'; // Azul frio
    else if (temp < 25) overlayColor = 'rgba(70, 130, 110, 0.6)'; // Verde temperado
    else overlayColor = 'rgba(210, 110, 40, 0.6)'; // Laranja quente
  }

  const headerStyle = {
    backgroundImage: `linear-gradient(to bottom, ${overlayColor}, ${overlayColor}), url(${data?.photo || ''})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div className="home-mobile">
      <div className="mobile-header" style={headerStyle}>
        <div className="search-wrapper">
          <SearchBar onSearch={handleSearch} onUseLocation={handleLocation} />
        </div>
        
        {loading && <div className="loading-text">Loading...</div>}
        {error && <div className="error-text">{error}</div>}

        {data && !loading && (
          <div className="hero-weather">
            <h2 className="weather-condition">{data.current.weather[0].main}</h2>
            <p className="weather-location">{data.location.name}, {data.location.country}</p>
            <h1 className="weather-temp">{Math.round(data.current.main.temp)}&deg;</h1>
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
                      <span className="forecast-temp">{Math.round(item.main.temp)}&deg; C</span>
                      <span className="forecast-desc">{item.weather[0].main}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="coming-soon">
              <a href="/history" className="btn">Go to History Page</a>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="coming-soon">
               <a href="/about" className="btn">Go to About Page</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
