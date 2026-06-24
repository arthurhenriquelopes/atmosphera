import { Router } from 'express';
import * as weather from '../services/openWeatherService.js';
import { getLocationVideos } from '../services/youtubeService.js';
import { getLocationPhotos } from '../services/unsplashService.js';

const router = Router();

router.get('/current', async (req, res, next) => {
  try {
    const { q, lat, lon } = req.query;

    let location;
    if (lat && lon) {
      location = await weather.reverseGeocode(parseFloat(lat), parseFloat(lon));
    } else if (q) {
      location = await weather.resolveLocation(q);
    } else {
      return res.status(400).json({ error: { message: 'provide q or lat/lon' } });
    }

    const current = await weather.getCurrentWeather(location.lat, location.lon);

    res.json({ location, weather: current });
  } catch (err) {
    next(err);
  }
});

router.get('/forecast', async (req, res, next) => {
  try {
    const { q, lat, lon } = req.query;

    let location;
    if (lat && lon) {
      location = await weather.reverseGeocode(parseFloat(lat), parseFloat(lon));
    } else if (q) {
      location = await weather.resolveLocation(q);
    } else {
      return res.status(400).json({ error: { message: 'provide q or lat/lon' } });
    }

    const forecast = await weather.getForecast(location.lat, location.lon);

    res.json({ location, forecast });
  } catch (err) {
    next(err);
  }
});

router.get('/geocode', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: { message: 'provide q' } });

    const results = await weather.geocode(q);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

router.get('/explore', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: { message: 'provide q' } });

    const [videos, photos] = await Promise.allSettled([
      getLocationVideos(q),
      getLocationPhotos(q),
    ]);

    res.json({
      videos: videos.status === 'fulfilled' ? videos.value : [],
      photos: photos.status === 'fulfilled' ? photos.value : [],
    });
  } catch (err) {
    next(err);
  }
});

export default router;
