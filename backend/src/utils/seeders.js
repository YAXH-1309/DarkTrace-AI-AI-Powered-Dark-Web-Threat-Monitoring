import { supabase } from '../services/SupabaseClient.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedDataSources() {
  const sources = [
    {
      type: 'simulated_dataset',
      url: path.resolve(__dirname, '../data/simulated/breach_1.json'),
      name: 'Simulated Breach Dataset 1',
      status: 'active'
    },
    {
      type: 'simulated_dataset',
      url: path.resolve(__dirname, '../data/simulated/breach_2.json'),
      name: 'Simulated Breach Dataset 2',
      status: 'active'
    }
  ];

  for (const source of sources) {
    const { data: existing } = await supabase
      .from('data_sources')
      .select('id')
      .eq('name', source.name)
      .single();

    if (!existing) {
      const { error } = await supabase.from('data_sources').insert([source]);
      if (error) console.error(`Error seeding ${source.name}:`, error);
      else console.log(`Seeded ${source.name}`);
    } else {
      console.log(`Source ${source.name} already exists.`);
    }
  }
}
