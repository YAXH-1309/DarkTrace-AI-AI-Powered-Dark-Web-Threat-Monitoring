export class ThreatAnalyzer {
  static async analyzeTargetedData(scrapedData, domains, keywords) {
    const results = [];
    const targets = [...domains, ...keywords];

    for (const dump of scrapedData) {
      const text = dump.content.toLowerCase();
      
      // See if ANY target is inside this dump
      const foundTargets = targets.filter(t => text.includes(t.toLowerCase()));
      
      if (foundTargets.length > 0) {
        // AI Category Classification Mock
        let category = 'Leak Data';
        
        if (text.includes('cc') || text.includes('cvv') || text.includes('btc') || text.includes('bin') || text.match(/\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/)) {
          category = 'Financial Data';
        } else if (text.includes('ssn') || text.includes('passport') || text.includes('address') || text.includes('hr')) {
          category = 'PII/Sensitive Data';
        } else if (text.includes('source code') || text.includes('internal') || text.includes('proprietary')) {
          category = 'Corporate Secrets';
        } else if (text.includes('infrastructure') || text.includes('mapping') || text.includes('does anyone know')) {
          category = 'General Mention';
        }

        results.push({
          source_type: dump.url,
          category,
          details: `Found targeted entities: ${foundTargets.join(', ')}`,
          detected_at: new Date().toISOString()
        });
      }
    }
    
    return results;
  }
}
