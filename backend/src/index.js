import express from 'express';
import { Pipeline } from './services/Pipeline.js';
import { seedDataSources } from './utils/seeders.js';
import threatRoutes from './routes/threats.js';
import orgRoutes from './routes/organization.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/threats', threatRoutes);
app.use('/api/organization', orgRoutes);

const organizationConfig = {
  id: 'org_123',
  domains: ['example.com', 'acmecorp.com', 'global.corp'],
  keywords: ['confidential', 'source_code', 'breach'],
  alertPreferences: { soundEnabled: true, highRiskOnly: false }
};

const pipeline = new Pipeline(organizationConfig);

async function start() {
  console.log('Initializing DarkTrace AI Backend Pipeline...');
  await seedDataSources();

  const simulatedSources = [
    { id: '1', name: 'Simulated Breach Dataset 1', type: 'simulated_dataset', status: 'active', url: './src/data/simulated/breach_1.json' },
    { id: '2', name: 'Simulated Breach Dataset 2', type: 'simulated_dataset', status: 'active', url: './src/data/simulated/breach_2.json' }
  ];

  pipeline.start(simulatedSources);
  console.log('Pipeline started. Monitoring for threats...');

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend Server listening on port ${PORT}`);
  });
}

start().catch(console.error);

process.on('SIGINT', () => {
  pipeline.stop();
  process.exit();
});
