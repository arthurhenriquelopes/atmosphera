import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateExportFormat } from '../middleware/validators.js';
import { toJSON, toCSV, toXML, toMarkdown, toPDF } from '../utils/exporters.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/:format', validateExportFormat, async (req, res, next) => {
  try {
    const { format } = req.params;
    const records = await prisma.weatherRecord.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const plain = records.map((r) => ({
      id: r.id,
      location: r.location,
      latitude: r.latitude,
      longitude: r.longitude,
      dateStart: r.dateStart,
      dateEnd: r.dateEnd,
      temperature: r.temperature,
      feelsLike: r.feelsLike,
      humidity: r.humidity,
      windSpeed: r.windSpeed,
      description: r.description,
    }));

    switch (format) {
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=atmosphera_records.json');
        return res.send(toJSON(plain));

      case 'csv':
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=atmosphera_records.csv');
        return res.send(toCSV(plain));

      case 'xml':
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Content-Disposition', 'attachment; filename=atmosphera_records.xml');
        return res.send(toXML(plain));

      case 'markdown':
        res.setHeader('Content-Type', 'text/markdown');
        res.setHeader('Content-Disposition', 'attachment; filename=atmosphera_records.md');
        return res.send(toMarkdown(plain));

      case 'pdf': {
        const buffer = await toPDF(plain);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=atmosphera_records.pdf');
        return res.send(buffer);
      }
    }
  } catch (err) {
    next(err);
  }
});

export default router;
