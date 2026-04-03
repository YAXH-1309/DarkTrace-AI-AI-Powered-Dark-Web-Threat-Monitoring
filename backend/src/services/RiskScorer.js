export class RiskScorer {
  assignRiskLevel(threat) {
    if (threat.category === 'API_Key_Exposure') {
      threat.riskLevel = 'High';
    } else if (threat.category === 'Credential_Leak') {
      threat.riskLevel = 'Medium';
    } else if (threat.category === 'Email_Leak') {
      threat.riskLevel = 'Low';
    } else {
      threat.riskLevel = 'Low'; // default
    }
    return threat;
  }
}
