import express from 'express';
import { supabase } from '../services/SupabaseClient.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Find user in mock database
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: 'Sentinel Access Denied: User not found.' });
  }

  if (data.password !== password) {
    return res.status(401).json({ error: 'Sentinel Access Denied: Incorrect password.' });
  }

  // Remove password from response
  const { password: _, ...user } = data;
  
  res.json({ 
    message: 'Access Granted: Sentinel Link Established',
    user 
  });
});

router.post('/register', async (req, res) => {
  const { username, password, display_name } = req.body;

  if (!username || !password || !display_name) {
    return res.status(400).json({ error: 'Username, password and display name are required.' });
  }

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (existingUser) {
    return res.status(400).json({ error: 'Sentinel Conflict: Operator ID already in use.' });
  }

  const newUser = {
    id: `u_${Date.now()}`,
    username,
    password,
    role: 'organization', // Default role for new registrations
    display_name
  };

  const { error } = await supabase.from('users').insert([newUser]);

  if (error) {
    return res.status(500).json({ error: 'Sentinel Core Error: Registration failed.' });
  }

  res.json({ 
    message: 'Uplink Created: Sentinel Operator Registered',
    user: { id: newUser.id, username: newUser.username, role: newUser.role, display_name: newUser.display_name }
  });
});

export default router;
