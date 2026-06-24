import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import weatherRoutes from './routes/weather.js';
import recordsRoutes from './routes/records.js';
import exportRoutes from './routes/export.js';
import { errorHandler } from './middleware/errorHandler.js';

if (!process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY === 'your_openweathermap_api_key') {
  console.error('CRITICAL ERROR: OPENWEATHER_API_KEY is missing or invalid in server/.env');
  console.error('Please configure your API keys before starting the server.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/export', exportRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`atmosphera server running on port ${PORT}`);
});
