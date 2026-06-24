import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { weatherService } from '../services/api';
import './ForecastPage.css';

export default function ForecastPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q) {
      setError('no location provided');
      setLoading(false);
      return;
    }

    weatherService.getForecast(q)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error?.message || 'failed to fetch forecast');
        setLoading(false);
      });
  }, [q]);

  if (loading) return <div className="page-container loader">loading forecast...</div>;
  if (error) return <div className="page-container error-message glass-panel">{error}</div>;
  if (!data) return null;

  // process openweather 3-hour forecast into daily summaries and chart data
  const chartData = data.forecast.list.slice(0, 16).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like)
  }));

  // group by day
  const dailyData = {};
  data.forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    if (!dailyData[date]) {
      dailyData[date] = { temps: [], icons: [], descriptions: [], humidity: [], wind: [] };
    }
    dailyData[date].temps.push(item.main.temp);
    dailyData[date].icons.push(item.weather[0].icon);
    dailyData[date].descriptions.push(item.weather[0].description);
    dailyData[date].humidity.push(item.main.humidity);
    dailyData[date].wind.push(item.wind.speed);
  });

  const days = Object.keys(dailyData).slice(0, 5).map(date => {
    const day = dailyData[date];
    return {
      date,
      minTemp: Math.round(Math.min(...day.temps)),
      maxTemp: Math.round(Math.max(...day.temps)),
      icon: day.icons[Math.floor(day.icons.length / 2)], // take midday icon
      desc: day.descriptions[Math.floor(day.descriptions.length / 2)],
      avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      maxWind: Math.max(...day.wind).toFixed(1)
    };
  });

  return (
    <div className="forecast-page page-container">
      <header className="page-header">
        <h1>5-day forecast</h1>
        <p className="subtitle">{data.location.name}, {data.location.country}</p>
      </header>

      <div className="chart-section glass-panel">
        <h3>temperature trend (next 48h)</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} unit="°" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'white' }}
              />
              <Line type="monotone" dataKey="temp" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-dark)' }} activeDot={{ r: 6 }} name="temp °C" />
              <Line type="monotone" dataKey="feelsLike" stroke="var(--text-secondary)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="feels like °C" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="daily-forecast">
        {days.map((day, idx) => (
          <div key={idx} className="daily-card glass-panel">
            <div className="daily-date">{day.date}</div>
            <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.desc} className="daily-icon" />
            <div className="daily-temps">
              <span className="max-temp">{day.maxTemp}°</span>
              <span className="min-temp">{day.minTemp}°</span>
            </div>
            <div className="daily-desc">{day.desc}</div>
            <div className="daily-extra">
              <span>💧 {day.avgHumidity}%</span>
              <span>💨 {day.maxWind}m/s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
