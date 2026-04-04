import express from 'express';
import { startPoller } from './services/Pipeline.js';
import threatRoutes from './routes/threats.js';
import orgRoutes from './routes/organization.js';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const allowedOrigin = process.env.FRONTEND_ORIGIN || '*';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

// Routes
app.use('/api/threats', threatRoutes);
app.use('/api/organization', orgRoutes);
app.use('/api/auth', authRoutes);

async function start() {
  console.log('Initializing DarkTrace AI Backend Pipeline...');
  
  // Poller is disabled in favor of interactive /api/threats/fetch manual triggers.
  // startPoller();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend Server listening on port ${PORT}`);
  });
}

start().catch(console.error);

process.on('SIGINT', () => {
  process.exit();
});
