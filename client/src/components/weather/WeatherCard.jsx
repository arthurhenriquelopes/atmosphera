import './WeatherCard.css';

export default function WeatherCard({ weather, location }) {
  if (!weather || !location) return null;

  const { temp, feels_like, humidity } = weather.main;
  const { speed: windSpeed } = weather.wind;
  const { description, icon } = weather.weather[0];

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;

  return (
    <div className="weather-card glass-panel">
      <div className="weather-header">
        <h2>{location.name}{location.state ? `, ${location.state}` : ''}, {location.country}</h2>
        <p className="weather-desc">{description}</p>
      </div>
      
      <div className="weather-body">
        <div className="weather-main">
          <img src={iconUrl} alt={description} className="weather-icon" />
          <div className="temperature">
            <span className="temp-value">{Math.round(temp)}</span>
            <span className="temp-unit">°C</span>
          </div>
        </div>
        
        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">feels like</span>
            <span className="detail-value">{Math.round(feels_like)}°C</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">humidity</span>
            <span className="detail-value">{humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">wind</span>
            <span className="detail-value">{windSpeed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
