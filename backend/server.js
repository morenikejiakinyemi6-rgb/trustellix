import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import verifyRoute from './routes/verify.js';
import infrastructureRoute from './routes/infrastructure.js';
import quickscanRoute from './routes/quickscan.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/verify', verifyRoute);
app.use('/api/infrastructure', infrastructureRoute);
app.use('/api/quickscan', quickscanRoute);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'Trustellix Engine Online',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/verify', '/api/infrastructure', '/api/quickscan'],
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🛡️  Trustellix backend running on port ${PORT}`);
});