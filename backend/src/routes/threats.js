import express from 'express';
import { supabase } from '../services/SupabaseClient.js';
import { alertSystem } from '../services/AlertSystem.js';

const router = express.Router();

// SSE Stream
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  alertSystem.clients.push(res);
  req.on('close', () => {
    alertSystem.clients = alertSystem.clients.filter(client => client !== res);
  });
});

router.get('/', async (req, res) => {
  let query = supabase.from('threats').select('*').order('detected_at', { ascending: false }).limit(50);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/stats', async (req, res) => {
  const { data, error } = await supabase.from('threats').select('risk_level');
  if (error) return res.status(500).json({ error: error.message });

  const stats = {
    total: data.length,
    high: data.filter(d => d.risk_level === 'High').length,
    medium: data.filter(d => d.risk_level === 'Medium').length,
    low: data.filter(d => d.risk_level === 'Low').length
  };
  res.json(stats);
});

router.get('/trends', async (req, res) => {
  // Mock trends for MVP
  res.json({
    labels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'],
    data: [12, 19, 15, 25, 22, 30]
  });
});

export default router;
