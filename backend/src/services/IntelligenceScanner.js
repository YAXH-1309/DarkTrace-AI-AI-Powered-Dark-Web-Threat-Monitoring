import { GeminiService } from './GeminiService.js';
import { AhmiaScraper } from './AhmiaScraper.js';

/**
 * OSINT Intelligence Scanner
 * Fetches real-time public chatter AND Dark Web mentions from Ahmia.
 */
export class IntelligenceScanner {
  static async scanLiveEndpoints(domain) {
    console.log(`[IntelligenceScanner] Launching deep trace for: ${domain}`);

    try {
      // 1. Fetch Real-time OSINT from Reddit (Public Chatter)
      const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(domain)}+leak&sort=new&limit=10`;
      
      const redditResponse = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'DarkTrace-AI/1.0 (Cybersecurity Intelligence Node)'
        }
      });
      
      let redditHits = [];
      if (redditResponse.ok) {
        const data = await redditResponse.json();
        const hits = data.data?.children || [];
        redditHits = hits.map(hit => ({
          content: `${hit.data.title}\n${hit.data.selftext}`,
          url: `reddit.com${hit.data.permalink}`,
          source: 'Public Web (Reddit)'
        }));
      }

      // 2. Fetch Real-time Dark Web Mentions (Ahmia)
      const onionHits = await AhmiaScraper.searchOnion(domain);

      // 3. Perform AI Deep Trace (Gemini 1.5 Pro's internal knowledge)
      console.log(`[IntelligenceScanner] Querying Gemini for historical breaches of ${domain}...`);
      const aiHistoricalHits = await GeminiService.performDeepTrace(domain);

      // Combine both sources for the analyzer
      return {
        redditHits,
        onionHits,
        aiHistoricalHits
      };

    } catch (error) {
      console.error('[IntelligenceScanner] Trace failed:', error);
      return { redditHits: [], onionHits: [], aiHistoricalHits: [] };
    }
  }
}
