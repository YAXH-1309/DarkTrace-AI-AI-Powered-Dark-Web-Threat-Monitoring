// Pre-fabricated simulated domain threats
export const dummyIntelligence = {
  'world.com': [
    { id: '1', source_type: 'pastebin.com/raw/world', category: 'Financial Data', details: 'Full Credit Card dump including CVV attached to world.com executives. Records indicate over 5,000 active cards leaked.', detected_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), risk_level: 'High' },
    { id: '2', source_type: 'darkforum.onion/world', category: 'Corporate Secrets', details: 'Leaked architectural diagram of world.com main servers. Exposed port configurations and internal IP mapping.', detected_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), risk_level: 'High' },
    { id: '3', source_type: 't.me/hacker_world', category: 'PII/Sensitive Data', details: 'Customer emails linked to world.com accounts. Plaintext password file suspected.', detected_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), risk_level: 'Medium' },
    { id: '4', source_type: 'reddit.com/r/leaks', category: 'General Mention', details: 'Someone asking if world.com uses AWS for their main production environment.', detected_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), risk_level: 'Low' },
    { id: '5', source_type: 'twitter.com/anon', category: 'General Mention', details: 'Targeting world.com for next week distributed denial of service attack.', detected_at: new Date(Date.now() - 1000 * 60 * 200).toISOString(), risk_level: 'Low' },
  ],
  'acmecorp.com': [
    { id: '6', source_type: 'acmecorp-leak.onion', category: 'Corporate Secrets', details: 'Source code for Project Titan posted. Includes API keys for AWS and GCP environments.', detected_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), risk_level: 'High' },
    { id: '7', source_type: 't.me/acme_dump', category: 'PII/Sensitive Data', details: 'Internal HR database dump (Names, Home Addresses, Social Security Numbers).', detected_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(), risk_level: 'Medium' },
    { id: '8', source_type: 't.me/acme_dump', category: 'PII/Sensitive Data', details: 'Employee passwords hashed in MD5. Brute force attempts highly likely to succeed.', detected_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(), risk_level: 'Medium' }
  ],
  'tesla.com': [
    { id: 't1', source_type: 'elon-leak.io', category: 'Corporate Secrets', details: 'Autopilot v12 training weights discovered in public S3 bucket.', detected_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(), risk_level: 'High' },
    { id: 't2', source_type: 'darkforum.onion', category: 'Financial Data', details: 'Tesla customer pre-order credit card tokens (stale but valid for fingerprinting).', detected_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), risk_level: 'High' },
    { id: 't3', source_type: 'pastebin.com', category: 'General Mention', details: 'List of Tesla supercharger maintenance credentials.', detected_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), risk_level: 'Low' }
  ],
  'bankofamerica.com': [
    { id: 'b1', source_type: 'swift-leak.net', category: 'Financial Data', details: 'SWIFT transaction logs for high-net-worth individuals. Internal account numbers exposed.', detected_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(), risk_level: 'High' },
    { id: 'b2', source_type: 'bank-ghosts.onion', category: 'Financial Data', details: 'Mortgage application PII (Social Security Numbers, Tax Returns) for 2023-2024.', detected_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(), risk_level: 'High' },
    { id: 'b3', source_type: 'anon-files.com', category: 'Corporate Secrets', details: 'Internal security manual for physical branch vaults.', detected_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), risk_level: 'Medium' }
  ],
  'google.com': [
    { id: 'g1', source_type: 'search-leaks.tech', category: 'General Mention', details: 'Discussion of Google internal search ranking changes in private forum.', detected_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), risk_level: 'Low' },
    { id: 'g2', source_type: 'reddit.com', category: 'General Mention', details: 'Unconfirmed rumor of GCP region outage in us-east-1.', detected_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), risk_level: 'Low' }
  ],
  'default': [
    { id: '9', source_type: 'unknown.onion', category: 'General Mention', details: 'Domain found in a generalized paste list.', detected_at: new Date().toISOString(), risk_level: 'Low' }
  ]
};

export class DummyDatabase {
  static fetchTargetData(domain) {
    const key = domain.trim().toLowerCase();
    
    // Simulate real delay for dramatic effect
    return new Promise(resolve => {
      setTimeout(() => {
        if (dummyIntelligence[key]) {
          resolve(dummyIntelligence[key]);
        } else {
          // If domain isn't explicitly mocked, return a default low risk ping to show 'it found something'
          const genericHits = dummyIntelligence['default'].map(d => ({...d, details: `Domain ${key} found in generalized paste list.`}));
          resolve(genericHits);
        }
      }, 600);
    });
  }
}
