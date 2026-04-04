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

export async function seedDefaultUsers() {
  const defaultUsers = [
    {
      id: 'u1',
      username: 'admin123',
      password: 'admin123',
      role: 'admin',
      display_name: 'Alex Rock'
    },
    {
      id: 'u2',
      username: 'org123',
      password: 'org123',
      role: 'organization',
      display_name: 'Sentintel Org'
    }
  ];

  for (const user of defaultUsers) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', user.username);

    if (error) {
      console.error(`Error checking user ${user.username}:`, error.message || error);
      continue;
    }

    if (!data || data.length === 0) {
      const { error: insertError } = await supabase.from('users').insert([user]);
      if (insertError) {
        console.error(`Error seeding user ${user.username}:`, insertError.message || insertError);
      } else {
        console.log(`Seeded default user: ${user.username}`);
      }
    }
  }
}
