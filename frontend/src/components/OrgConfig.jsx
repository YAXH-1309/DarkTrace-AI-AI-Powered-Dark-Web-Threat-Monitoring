import React, { useState, useEffect } from 'react';
import { fetchOrgConfig } from '../services/api.js';

export default function OrgConfig() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetchOrgConfig().then(setConfig).catch(console.error);
  }, []);

  if (!config) return <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>Loading configuration...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="sentinel-card" style={{ padding: '32px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'white' }}>Organization Configuration</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Manage the domains and keywords DarkTrace AI will monitor on the dark web.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div>
            <h3 style={{ marginBottom: '16px', fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'white' }}>Monitored Domains</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input type="text" placeholder="e.g. acmecorp.com" style={{ flex: 1 }} />
              <button className="btn-neon">Add</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {config.domains.map(d => (
                <div key={d} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', border: '1px solid var(--border-ghost)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{d}</span>
                  <span style={{ color: 'var(--status-high)', cursor: 'pointer' }}>Remove</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '16px', fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'white' }}>Custom Keywords</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input type="text" placeholder="e.g. project_x_source" style={{ flex: 1 }} />
              <button className="btn-neon">Add</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {config.keywords.map(k => (
                <div key={k} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', border: '1px solid var(--border-ghost)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{k}</span>
                  <span style={{ color: 'var(--status-high)', cursor: 'pointer' }}>Remove</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '48px', borderTop: '1px solid var(--border-ghost)', paddingTop: '32px' }}>
          <h3 style={{ marginBottom: '24px', fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'white' }}>Alert Preferences</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-ghost)', marginBottom: '16px' }}>
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Audible Alerts</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Play a sound when a high-risk threat is detected.</p>
            </div>
            <div style={{ width: '40px', height: '24px', background: config.alertPreferences.soundEnabled ? 'var(--neon-purple)' : 'rgba(255,255,255,0.1)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: config.alertPreferences.soundEnabled ? '18px' : '2px', transition: 'left 0.2s' }}></div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-ghost)' }}>
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>High-Risk Only</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Only push desktop notifications for high-risk threats.</p>
            </div>
            <div style={{ width: '40px', height: '24px', background: config.alertPreferences.highRiskOnly ? 'var(--neon-purple)' : 'rgba(255,255,255,0.1)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: config.alertPreferences.highRiskOnly ? '18px' : '2px', transition: 'left 0.2s' }}></div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-neon" style={{ padding: '12px 32px' }}>Save Configuration</button>
        </div>
      </div>
    </div>
  );
}
