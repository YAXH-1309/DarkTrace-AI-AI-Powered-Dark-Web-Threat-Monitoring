import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'public-anon-key';

let client;

if (supabaseUrl.includes('xyzcompany')) {
  console.warn('⚠️  Using IN-MEMORY Mock Supabase database because a valid SUPABASE_URL was absent in .env');
  const _db = { 
    threats: [], 
    data_sources: [],
    users: [
      { id: 'u1', username: 'admin123', password: 'admin123', role: 'admin', display_name: 'Alex Rock' },
      { id: 'u2', username: 'org123', password: 'org123', role: 'organization', display_name: 'Sentintel Org' }
    ]
  };
  
  client = {
    from: (table) => ({
      select: () => {
        let currentData = [...(_db[table] || [])];
        let isSingle = false;
        
        const builder = {
          eq: (col, val) => {
            currentData = currentData.filter(item => item[col] === val);
            return builder;
          },
          single: () => {
            isSingle = true;
            return builder;
          },
          order: (col, { ascending }) => {
            currentData.sort((a,b) => {
              const valA = new Date(a[col]).getTime() || a[col];
              const valB = new Date(b[col]).getTime() || b[col];
              if (valA < valB) return ascending ? -1 : 1;
              if (valA > valB) return ascending ? 1 : -1;
              return 0;
            });
            return builder;
          },
          limit: (n) => {
            currentData = currentData.slice(0, n);
            return builder;
          },
          then: (resolve) => {
             if (isSingle) resolve({ data: currentData[0] || null, error: null });
             else resolve({ data: currentData, error: null });
          }
        };
        return builder;
      },
      insert: (rows) => {
        if (!_db[table]) _db[table] = [];
        _db[table].push(...rows);
        return Promise.resolve({ data: rows, error: null });
      }
    })
  };
} else {
  client = createClient(supabaseUrl, supabaseKey);
}

export const supabase = client;
