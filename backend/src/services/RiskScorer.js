export class RiskScorer {
  static calculateRiskScore(threat) {
    if (threat.category === 'Financial Data' || threat.category === 'Corporate Secrets') {
      return 'High';
    } else if (threat.category === 'PII/Sensitive Data') {
      return 'Medium';
    } else if (threat.category === 'General Mention') {
      return 'Low';
    }
    return 'Low';
  }
}
