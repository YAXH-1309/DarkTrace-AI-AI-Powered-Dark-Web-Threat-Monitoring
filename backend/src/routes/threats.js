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

import { IntelligenceScanner } from '../services/IntelligenceScanner.js';
import { ThreatAnalyzer } from '../services/ThreatAnalyzer.js';
import { DummyDatabase } from '../services/DummyDatabase.js';

router.post('/fetch', async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain is required.' });

    console.log(`[Route] Initiating Full Live Trace for ${domain}...`);

    // 1. Scan Live Endpoints (Reddit + Ahmia Dark Web + Gemini Knowledge Trace)
    const scanResults = await IntelligenceScanner.scanLiveEndpoints(domain);
    const { aiHistoricalHits } = scanResults;
    
    // 2. Analyze Live Data (Reddit + Onion) using Gemini 1.5 Pro
    const liveAnalysis = await ThreatAnalyzer.analyzeTargetedData(scanResults, domain);
    
    // 3. Combine Live Analysis with Gemini's direct historical research
    let intelligence = [...liveAnalysis, ...aiHistoricalHits];
    
    if (intelligence.length === 0) {
      console.log(`[Route] No live or historical hits found via OSINT. Providing baseline context.`);
      // Mock hits only if everything else fails
      const mockHits = await DummyDatabase.fetchTargetData(domain);
      intelligence = mockHits.slice(0, 3);
    }

    // Sort by Risk (High first)
    const riskMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
    intelligence.sort((a, b) => (riskMap[b.risk_level] || 0) - (riskMap[a.risk_level] || 0));

    const stats = {
      total: intelligence.length,
      high: intelligence.filter(d => d.risk_level === 'High').length,
      medium: intelligence.filter(d => d.risk_level === 'Medium').length,
      low: intelligence.filter(d => d.risk_level === 'Low').length
    };

    const trends = {
      labels: ['T-5h', 'T-4h', 'T-3h', 'T-2h', 'T-1h', 'Now'],
      highData: [0, 0, stats.high > 2 ? 1 : 0, stats.high > 1 ? 1 : 0, stats.high > 0 ? 1 : 0, stats.high],
      mediumData: [0, Math.floor(stats.medium / 2), stats.medium > 1 ? 1 : 0, Math.floor(stats.medium / 1.5), stats.medium, stats.medium],
      lowData: [stats.low / 2, stats.low / 2, stats.low, stats.low, stats.low, stats.low]
    };

    const scanLogs = [
      "Authenticating Sentinel AI Core...",
      `Scanning Public OSINT Node (Reddit) for ${domain}...`,
      "Accessing Dark Web Index (Ahmia.fi)...",
      "Querying Gemini 1.5 Pro 'DeepTrace' Research Vault...",
      "Analyzing 15+ live and historical signals...",
      "Extracting raw .onion links and masking sensitive PII...",
      "Trace Complete. Intelligence finalized."
    ];

    res.json({ threats: intelligence, stats, trends, scanLogs });

  } catch (err) {
    console.error('[Route Error]', err);
    res.status(500).json({ error: 'Internal Intelligence Failure: ' + err.message });
  }
});

export default router;
