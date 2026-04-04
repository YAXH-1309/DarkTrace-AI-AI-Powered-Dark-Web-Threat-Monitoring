import { GeminiService } from './GeminiService.js';

export class ThreatAnalyzer {
  static async analyzeTargetedData(hits, domain) {
    const { redditHits = [], onionHits = [] } = hits;
    
    console.log(`[ThreatAnalyzer] Processing ${redditHits.length} OSINT hits and ${onionHits.length} Dark Web hits via Gemini 1.5 Pro...`);
    
    // Combine hits into a single pool for the AI to analyze
    const combinedData = [
      ...redditHits.map(h => ({ ...h, type: 'OSINT' })),
      ...onionHits.map(h => ({ ...h, type: 'DarkWeb' }))
    ];

    if (combinedData.length === 0) return [];

    // Call Gemini to analyze the found OSINT and Dark Web data
    const aiResults = await GeminiService.analyzeIntelligence(domain, combinedData);
    
    return aiResults.map(res => ({
      ...res,
      detected_at: new Date().toISOString()
    }));
  }
}
