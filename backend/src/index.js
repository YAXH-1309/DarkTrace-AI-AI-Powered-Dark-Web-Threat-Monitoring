import express from 'express';
import { startPoller } from './services/Pipeline.js';
import threatRoutes from './routes/threats.js';
import orgRoutes from './routes/organization.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/threats', threatRoutes);
app.use('/api/organization', orgRoutes);

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
