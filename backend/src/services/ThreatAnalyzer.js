export class ThreatAnalyzer {
  constructor() {
    this.emailRegex = /\\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\\.[A-Z|a-z]{2,})\\b/g;
    this.passwordRegex = /(?:password|pass|pwd|p)[\\s:=]+([^\\s]+)/gi;
    this.apiKeyRegex = /(?:sk_live_|AKIA|Bearer )[a-zA-Z0-9_\\-]+/g;
  }

  async analyzeData(collectedData, organizationConfig) {
    const threats = [];
    const content = collectedData.content;

    const emailMatches = this.detectEmails(content, organizationConfig.domains);
    const passwordMatches = this.detectPasswords(content);
    const apiKeyMatches = this.detectAPIKeys(content);

    // Context snippet extraction (200 chars approx)
    const contextSnippet = content.substring(0, 200) + (content.length > 200 ? '...' : '');

    if (apiKeyMatches.length > 0) {
      threats.push({
        organizationId: organizationConfig.id,
        category: 'API_Key_Exposure',
        sensitive_data_type: 'api_key',
        sensitive_data_value: apiKeyMatches[0],
        sourceId: collectedData.sourceId,
        sourceType: collectedData.sourceType,
        detectedAt: collectedData.collectedAt,
        keywords: ['api_key', 'token'],
        context_snippet: contextSnippet
      });
    }

    if (emailMatches.length > 0) {
      const hasPassword = passwordMatches.length > 0;
      threats.push({
        organizationId: organizationConfig.id,
        category: hasPassword ? 'Credential_Leak' : 'Email_Leak',
        sensitive_data_type: hasPassword ? 'credentials' : 'email',
        sensitive_data_value: emailMatches[0] + (hasPassword ? ':' + passwordMatches[0] : ''),
        sourceId: collectedData.sourceId,
        sourceType: collectedData.sourceType,
        detectedAt: collectedData.collectedAt,
        keywords: hasPassword ? ['email', 'password', 'credentials'] : ['email'],
        context_snippet: contextSnippet
      });
    }

    return threats;
  }

  detectEmails(content, monitoredDomains) {
    const matches = content.match(this.emailRegex) || [];
    return matches.filter(email => {
      const domain = email.split('@')[1];
      return monitoredDomains.includes(domain);
    });
  }

  detectPasswords(content) {
    const matches = Array.from(content.matchAll(this.passwordRegex));
    return matches.map(m => m[1]);
  }

  detectAPIKeys(content) {
    return content.match(this.apiKeyRegex) || [];
  }
}
