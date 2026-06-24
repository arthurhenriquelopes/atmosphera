import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateRecordCreate, validateRecordUpdate, validateId } from '../middleware/validators.js';
import { resolveLocation, getCurrentWeather } from '../services/openWeatherService.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();
const prisma = new PrismaClient();

router.post('/', validateRecordCreate, async (req, res, next) => {
  try {
    const { location, dateStart, dateEnd } = req.body;

    const geo = await resolveLocation(location);
    const weatherData = await getCurrentWeather(geo.lat, geo.lon);

    const record = await prisma.weatherRecord.create({
      data: {
        location: `${geo.name}, ${geo.country}`,
        latitude: geo.lat,
        longitude: geo.lon,
        dateStart: new Date(dateStart),
        dateEnd: new Date(dateEnd),
        temperature: weatherData.main.temp,
        feelsLike: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        rawData: JSON.stringify(weatherData),
      },
    });

    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { location, sortBy = 'createdAt', order = 'desc' } = req.query;

    const where = location
      ? { location: { contains: location } }
      : {};

    const records = await prisma.weatherRecord.findMany({
      where,
      orderBy: { [sortBy]: order },
    });

    res.json(records);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', validateId, async (req, res, next) => {
  try {
    const record = await prisma.weatherRecord.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!record) throw new AppError('record not found', 404, 'NOT_FOUND');

    res.json(record);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validateRecordUpdate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { location, dateStart, dateEnd, temperature, description } = req.body;

    const existing = await prisma.weatherRecord.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) throw new AppError('record not found', 404, 'NOT_FOUND');

    const updateData = {};

    if (location) {
      const geo = await resolveLocation(location);
      updateData.location = `${geo.name}, ${geo.country}`;
      updateData.latitude = geo.lat;
      updateData.longitude = geo.lon;
    }

    if (dateStart) updateData.dateStart = new Date(dateStart);
    if (dateEnd) updateData.dateEnd = new Date(dateEnd);
    if (temperature !== undefined) updateData.temperature = temperature;
    if (description) updateData.description = description;

    const record = await prisma.weatherRecord.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json(record);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const existing = await prisma.weatherRecord.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!existing) throw new AppError('record not found', 404, 'NOT_FOUND');

    await prisma.weatherRecord.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'record deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
