export function getWeatherIcon(code) {
  const iconMap = {
    '01d': 'clear-day.svg',
    '01n': 'clear-night.svg',
    '02d': 'cloudy-1-day.svg',
    '02n': 'cloudy-1-night.svg',
    '03d': 'cloudy-2-day.svg',
    '03n': 'cloudy-2-night.svg',
    '04d': 'cloudy.svg',
    '04n': 'cloudy.svg',
    '09d': 'rainy-1-day.svg',
    '09n': 'rainy-1-night.svg',
    '10d': 'rainy-2-day.svg',
    '10n': 'rainy-2-night.svg',
    '11d': 'scattered-thunderstorms-day.svg',
    '11n': 'scattered-thunderstorms-night.svg',
    '13d': 'snowy-1-day.svg',
    '13n': 'snowy-1-night.svg',
    '50d': 'fog-day.svg',
    '50n': 'fog-night.svg',
  };

  const filename = iconMap[code] || 'cloudy.svg';
  return `/weather-icons/${filename}`;
}
