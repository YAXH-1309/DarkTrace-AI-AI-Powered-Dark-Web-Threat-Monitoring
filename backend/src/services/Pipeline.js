import { ThreatIntelligenceCollector } from './ThreatIntelligenceCollector.js';
import { ThreatAnalyzer } from './ThreatAnalyzer.js';
import { RiskScorer } from './RiskScorer.js';
import { supabase } from './SupabaseClient.js';
import { alertSystem } from './AlertSystem.js';

export class Pipeline {
  constructor(organizationConfig) {
    this.collector = new ThreatIntelligenceCollector();
    this.analyzer = new ThreatAnalyzer();
    this.scorer = new RiskScorer();
    this.organizationConfig = organizationConfig;
  }

  start(dataSources) {
    this.collector.subscribe(async (collectedData) => {
      try {
        const threats = await this.analyzer.analyzeData(collectedData, this.organizationConfig);
        for (let threat of threats) {
          threat = this.scorer.assignRiskLevel(threat);
          await this.saveThreat(threat);
          // Push to SSE clients
          alertSystem.triggerAlert(threat);
        }
      } catch (error) {
        console.error('Error processing collected data:', error);
      }
    });

    this.collector.startScanning(dataSources);
  }

  stop() {
    this.collector.stopScanning();
  }

  async saveThreat(threat) {
    const { error } = await supabase.from('threats').insert([{
      organization_id: threat.organizationId,
      organization_domains: this.organizationConfig.domains,
      category: threat.category,
      sensitive_data_type: threat.sensitive_data_type,
      sensitive_data_value: threat.sensitive_data_value,
      source_id: threat.sourceId,
      source_type: threat.sourceType,
      detected_at: threat.detectedAt,
      keywords: threat.keywords,
      context_snippet: threat.context_snippet,
      risk_level: threat.riskLevel
    }]);

    if (error) {
      console.error('Failed to save threat to Supabase:', error);
    } else {
      console.log('Saved threat:', threat.category, threat.riskLevel);
    }
  }
}
