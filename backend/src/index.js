import { Pipeline } from './services/Pipeline.js';
import { seedDataSources } from './utils/seeders.js';
import dotenv from 'dotenv';
dotenv.config();

const organizationConfig = {
  id: 'org_123',
  domains: ['example.com', 'acmecorp.com']
};

const pipeline = new Pipeline(organizationConfig);

async function start() {
  console.log('Initializing DarkTrace AI Backend Pipeline...');
  await seedDataSources();

  // For MVP, point pipeline to our simulated data sources explicitly
  // Normally it would pull active sources from DB
  const simulatedSources = [
    { id: '1', name: 'Simulated Breach Dataset 1', type: 'simulated_dataset', status: 'active', url: './src/data/simulated/breach_1.json' },
    { id: '2', name: 'Simulated Breach Dataset 2', type: 'simulated_dataset', status: 'active', url: './src/data/simulated/breach_2.json' }
  ];

  pipeline.start(simulatedSources);
  console.log('Pipeline started. Monitoring for threats...');
}

start().catch(console.error);

// Keep process alive
process.on('SIGINT', () => {
  pipeline.stop();
  process.exit();
});
