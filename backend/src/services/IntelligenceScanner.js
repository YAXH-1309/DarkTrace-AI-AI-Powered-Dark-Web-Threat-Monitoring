/**
 * OSINT Intelligence Scanner
 * Simulates deep web scanning by hitting public forum search APIs (like Reddit).
 * This provides real-time, unstructured data for the AI to analyze.
 */
export class IntelligenceScanner {
  static async scanLiveEndpoints(domain) {
    console.log(`[IntelligenceScanner] Launching live trace for: ${domain}`);

    try {
      // We use Reddit's JSON search as a rich "public chatter" source 
      // where many real-world leaks and mentions first appear.
      const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(domain)}+leak&sort=new&limit=5`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'DarkTrace-AI/1.0 (Cybersecurity Intelligence Node)'
        }
      });
      
      if (!response.ok) throw new Error('OSINT Node unavailable');

      const data = await response.json();
      const hits = data.data?.children || [];

      return hits.map((hit, index) => {
        const post = hit.data;
        
        // Simulating the AI's "Threat Level" assessment
        const isSuspicious = post.title.toLowerCase().includes('leak') || 
                             post.title.toLowerCase().includes('breach') || 
                             post.title.toLowerCase().includes('data');

        return {
          id: `live_${index}_${Date.now()}`,
          source_type: `reddit.com/${post.permalink}`,
          category: isSuspicious ? 'PII/Sensitive Data' : 'General Mention',
          details: `[REAL-TIME HIT] ${post.title.substring(0, 150)}... Mention found in public chatter.`,
          detected_at: new Date(post.created_utc * 1000).toISOString(),
          risk_level: isSuspicious ? 'Medium' : 'Low'
        };
      });

    } catch (error) {
      console.error('[IntelligenceScanner] Failed to fetch live OSINT data:', error);
      return []; // Fallback to dummy data only if live fetch fails
    }
  }
}
