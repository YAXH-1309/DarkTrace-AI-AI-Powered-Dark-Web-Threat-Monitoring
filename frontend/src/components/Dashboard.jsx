import React, { useState, useEffect } from 'react';
import { AlertCircle, ShieldAlert, Key, Mail, CheckCircle2 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

// Mock Data
const generateMockThreats = () => {
  return [
    { id: '1', riskLevel: 'High', category: 'API_Key_Exposure', sourceType: 'simulated_dataset', timestamp: new Date().toISOString(), details: 'sk_live_...' },
    { id: '2', riskLevel: 'Medium', category: 'Credential_Leak', sourceType: 'osint_feed', timestamp: new Date(Date.now() - 5000).toISOString(), details: 'admin@global.corp:pass123' },
    { id: '3', riskLevel: 'Low', category: 'Email_Leak', sourceType: 'breach_database', timestamp: new Date(Date.now() - 15000).toISOString(), details: 'user@global.corp' },
  ];
};

export default function Dashboard() {
  const [threats, setThreats] = useState(generateMockThreats());
  const [showAlert, setShowAlert] = useState(true);

  // Auto-refresh mechanism (Polling 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates happening
      setThreats(prev => {
        const newThreat = {
          id: Math.random().toString(36).substr(2, 9),
          riskLevel: Math.random() > 0.8 ? 'High' : (Math.random() > 0.5 ? 'Medium' : 'Low'),
          category: 'Credential_Leak',
          sourceType: 'simulated_dataset',
          timestamp: new Date().toISOString(),
          details: 'new.user@global.corp:unknown'
        };
        return [newThreat, ...prev].slice(0, 10);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'],
    datasets: [
      {
        fill: true,
        label: 'Threat Frequency',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: 'var(--brand-primary)',
        backgroundColor: 'rgba(77, 0, 255, 0.2)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { grid: { color: 'rgba(68, 72, 79, 0.15)' }, ticks: { color: 'var(--text-secondary)' } },
      x: { grid: { display: false }, ticks: { color: 'var(--text-secondary)' } }
    },
    plugins: { legend: { display: false } }
  };

  const getStatusColor = (risk) => {
    switch(risk) {
      case 'High': return 'var(--status-high)';
      case 'Medium': return 'var(--status-medium)';
      case 'Low': return 'var(--status-low)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 3. Alert Popup */}
      {showAlert && (
        <div className="glass-panel" style={{ 
          position: 'fixed', top: '24px', right: '24px', zIndex: 1000, padding: '16px 24px',
          display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--status-high)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)', animation: 'slideIn 0.3s ease-out'
        }}>
          <AlertCircle color="var(--status-high)" size={24} />
          <div>
            <h4 style={{ color: 'var(--status-high)', marginBottom: '4px' }}>Urgent: High-Risk Threat Detected</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>API Key exposed on public repository.</p>
          </div>
          <button onClick={() => setShowAlert(false)} style={{ color: 'var(--text-secondary)', marginLeft: '16px' }}>Dismiss</button>
        </div>
      )}

      {/* 6. Summary Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {[
          { title: 'Total Threats', value: '2,450', icon: ShieldAlert, color: 'var(--brand-primary)' },
          { title: 'High Risk', value: '12', icon: AlertCircle, color: 'var(--status-high)' },
          { title: 'Medium Risk', value: '85', icon: Key, color: 'var(--status-medium)' },
          { title: 'Low Risk', value: '150', icon: Mail, color: 'var(--status-low)' }
        ].map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.title}</h3>
              <stat.icon color={stat.color} size={20} />
            </div>
            <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: '600', color: 'var(--text-primary)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* 2. Trend Graph */}
        <div className="glass-panel" style={{ padding: '24px', height: '350px' }}>
          <h3 style={{ marginBottom: '24px', fontFamily: 'var(--font-display)' }}>Threat Frequency Trend</h3>
          <div style={{ height: '250px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* 5. Filter Controls */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)' }}>Filter Controls</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>Narrow down the live threat feed data.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Risk Level</label>
              <select className="glass-panel" style={{ width: '100%', padding: '10px', color: 'var(--text-primary)', outline: 'none' }}>
                <option>All Levels</option><option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Category</label>
              <select className="glass-panel" style={{ width: '100%', padding: '10px', color: 'var(--text-primary)', outline: 'none' }}>
                <option>All Categories</option><option>Credential_Leak</option><option>API_Key_Exposure</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Source Type</label>
              <select className="glass-panel" style={{ width: '100%', padding: '10px', color: 'var(--text-primary)', outline: 'none' }}>
                <option>All Sources</option><option>simulated_dataset</option><option>osint_feed</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Time Range</label>
              <select className="glass-panel" style={{ width: '100%', padding: '10px', color: 'var(--text-primary)', outline: 'none' }}>
                <option>Last 24 Hours</option><option>Last 7 Days</option>
              </select>
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop: 'auto' }}>Apply Filters</button>
        </div>
      </div>

      {/* 1. Live Threat Feed */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '24px', fontFamily: 'var(--font-display)' }}>Live Threat Feed <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', marginLeft: '12px', background: 'rgba(77,0,255,0.1)', padding: '4px 8px', borderRadius: '12px' }}>Live Updates (5s)</span></h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(80px, 1fr) 2fr 2fr 2fr 80px', padding: '0 16px 12px 16px', color: 'var(--text-secondary)', fontSize: '0.875rem', borderBottom: '1px solid var(--border-ghost)' }}>
            <div>Severity</div>
            <div>Source Type</div>
            <div>Category</div>
            <div>Timestamp</div>
            <div style={{ textAlign: 'right' }}>Action</div>
          </div>

          {/* Feed Rows */}
          {threats.map((threat) => (
            <div key={threat.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(80px, 1fr) 2fr 2fr 2fr 80px', alignItems: 'center', padding: '16px', background: 'var(--bg-elevated)', borderRadius: '8px', borderLeft: `3px solid ${getStatusColor(threat.riskLevel)}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(threat.riskLevel), boxShadow: `0 0 8px ${getStatusColor(threat.riskLevel)}` }}></div>
                <span style={{ color: getStatusColor(threat.riskLevel), fontSize: '0.875rem', fontWeight: '500' }}>{threat.riskLevel}</span>
              </div>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{threat.sourceType}</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'monospace' }}>{threat.category}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{new Date(threat.timestamp).toLocaleTimeString()}</div>
              
              <div style={{ textAlign: 'right' }}>
                {/* 4. Threat Details Panel Expansion (Toggle logic omitted for visual simplicity, but action exists) */}
                <button style={{ color: 'var(--brand-primary)', fontSize: '0.875rem', textDecoration: 'underline' }}>Expand</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
