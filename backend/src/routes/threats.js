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

  alertSystem.addClient(req, res);
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

import { DummyDatabase } from '../services/DummyDatabase.js';
import { IntelligenceScanner } from '../services/IntelligenceScanner.js';

router.post('/fetch', async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain is required.' });

    // Parallel fetch: Fixed dummy data + Real-time OSINT mentions across web (Reddit)
    const [mockHits, liveHits] = await Promise.all([
      DummyDatabase.fetchTargetData(domain),
      IntelligenceScanner.scanLiveEndpoints(domain)
    ]);
    
    // Combine results (Live hits at the top for freshness)
    const intelligence = [...liveHits, ...mockHits].slice(0, 15);
    
    // Construct dynamic stats
    const stats = {
      total: intelligence.length,
      high: intelligence.filter(d => d.risk_level === 'High').length,
      medium: intelligence.filter(d => d.risk_level === 'Medium').length,
      low: intelligence.filter(d => d.risk_level === 'Low').length
    };

    // Construct dynamic trends based on the risks
    const trends = {
      labels: ['T-5h', 'T-4h', 'T-3h', 'T-2h', 'T-1h', 'Now'],
      highData: [0, 0, stats.high > 2 ? 1 : 0, stats.high > 1 ? 1 : 0, stats.high > 0 ? 1 : 0, stats.high],
      mediumData: [0, Math.floor(stats.medium / 2), stats.medium > 1 ? 1 : 0, Math.floor(stats.medium / 1.5), stats.medium, stats.medium],
      lowData: [stats.low / 2, stats.low / 2, stats.low, stats.low, stats.low, stats.low]
    };

    // Simulated Analysis Logs for UI "Intelligence Phase"
    const scanLogs = [
      "Establishing Secure OSINT Link...",
      `Scanning Public Reddit Nodes for mention of ${domain}...`,
      "Analyzing Deep Web Paste Dumps...",
      "Resolving PII Overlaps and Financial Indicators...",
      "Threat Analysis Complete. Results Compiled."
    ];

    res.json({ threats: intelligence, stats, trends, scanLogs });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
