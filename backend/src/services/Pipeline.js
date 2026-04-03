import { ScrapingNode } from './ScrapingNode.js';
import { ThreatAnalyzer } from './ThreatAnalyzer.js';
import { RiskScorer } from './RiskScorer.js';
import { supabase } from './SupabaseClient.js';
import { getOrgConfig } from '../routes/organization.js';
import { alertSystem } from './AlertSystem.js';

export async function startPoller() {
  console.log('Pipeline started. Monitoring Dark Web endpoints for targeted configuration...');

  setInterval(async () => {
    try {
      const config = getOrgConfig();
      const targets = [...config.domains, ...config.keywords];
      
      if (targets.length === 0) return;

      // 1. Emulate AI Deep Web Scraper
      const rawScrapes = await ScrapingNode.startScrape(targets);
      
      // 2. Multi-Vector Analysis Engine
      const threats = await ThreatAnalyzer.analyzeTargetedData(rawScrapes, config.domains, config.keywords);
      
      if (threats.length === 0) return;

      // 3. Process Hits
      for (const t of threats) {
        // Enforce risk levels
        const scoredThreat = {
           ...t,
           risk_level: RiskScorer.calculateRiskScore(t)
        };
        
        // Push to DB
        const { error } = await supabase.from('threats').insert([scoredThreat]);
        if (error) console.error('Failed to save targeted threat to Supabase:', error);
        
        // Push Alert
        if (alertSystem) {
          alertSystem.triggerAlert(scoredThreat);
        }
      }

    } catch (err) {
      console.error('Error in deep web pipeline pass:', err);
    }
  }, 10000); // 10 second polling for MVP showcase
}
