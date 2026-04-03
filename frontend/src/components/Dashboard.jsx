import React, { useState, useEffect } from 'react';
import { AlertCircle, ShieldAlert, Key, Mail } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { fetchThreats, fetchStats, fetchTrends, setupSSE } from '../services/api.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function Dashboard() {
  const [threats, setThreats] = useState([]);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    // Initial Load
    fetchThreats().then(setThreats).catch(console.error);
    fetchStats().then(setStats).catch(console.error);
    fetchTrends().then(res => {
      setChartData({
        labels: res.labels,
        datasets: [{
          fill: true,
          label: 'Threat Frequency',
          data: res.data,
          borderColor: 'var(--brand-primary)',
          backgroundColor: 'rgba(77, 0, 255, 0.2)',
          tension: 0.4
        }]
      })
    }).catch(console.error);

    // Setup SSE
    const evtSource = setupSSE(
      (newThreat) => {
        setThreats(prev => [newThreat, ...prev].slice(0, 50));
        setStats(prev => ({ ...prev, total: prev.total + 1, [newThreat.risk_level.toLowerCase()]: prev[newThreat.risk_level.toLowerCase()] + 1 }));
      },
      (alertThreat) => {
        setThreats(prev => [alertThreat, ...prev].slice(0, 50));
        setStats(prev => ({ ...prev, total: prev.total + 1, high: prev.high + 1 }));
        setActiveAlert(alertThreat);
      }
    );

    return () => evtSource.close();
  }, []);

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
      {/* Alert Popup */}
      {activeAlert && (
        <div className="glass-panel" style={{ 
          position: 'fixed', top: '24px', right: '24px', zIndex: 1000, padding: '16px 24px',
          display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--status-high)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)', animation: 'slideIn 0.3s ease-out'
        }}>
          <AlertCircle color="var(--status-high)" size={24} />
          <div>
            <h4 style={{ color: 'var(--status-high)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Urgent: High-Risk Alert</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{activeAlert.category} detected from {activeAlert.source_type}</p>
          </div>
          <button onClick={() => setActiveAlert(null)} style={{ color: 'var(--text-secondary)', marginLeft: '16px', textDecoration: 'underline' }}>Dismiss</button>
        </div>
      )}

      {/* Summary Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {[
          { title: 'Total Threats', value: stats.total, icon: ShieldAlert, color: 'var(--brand-primary)' },
          { title: 'High Risk', value: stats.high, icon: AlertCircle, color: 'var(--status-high)' },
          { title: 'Medium Risk', value: stats.medium, icon: Key, color: 'var(--status-medium)' },
          { title: 'Low Risk', value: stats.low, icon: Mail, color: 'var(--status-low)' }
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
        {/* Trend Graph */}
        <div className="glass-panel" style={{ padding: '24px', height: '350px' }}>
          <h3 style={{ marginBottom: '24px', fontFamily: 'var(--font-display)' }}>Threat Frequency Trend</h3>
          <div style={{ height: '250px' }}>
            {chartData.labels.length > 0 && <Line data={chartData} options={chartOptions} />}
          </div>
        </div>

        {/* Filter Controls */}
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

      {/* Live Threat Feed */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '24px', fontFamily: 'var(--font-display)' }}>Live Threat Feed <span style={{ fontSize: '0.75rem', color: 'var(--status-low)', marginLeft: '12px', background: 'var(--status-low-bg)', padding: '4px 8px', borderRadius: '12px' }}>Real-time SSE Active</span></h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(80px, 1fr) 2fr 2fr 2fr 80px', padding: '0 16px 12px 16px', color: 'var(--text-secondary)', fontSize: '0.875rem', borderBottom: '1px solid var(--border-ghost)' }}>
            <div>Severity</div>
            <div>Source Type</div>
            <div>Category</div>
            <div>Timestamp</div>
            <div style={{ textAlign: 'right' }}>Action</div>
          </div>

          {threats.map((threat, idx) => (
            <div key={threat.id || idx} style={{ display: 'grid', gridTemplateColumns: 'minmax(80px, 1fr) 2fr 2fr 2fr 80px', alignItems: 'center', padding: '16px', background: 'var(--bg-elevated)', borderRadius: '8px', borderLeft: `3px solid ${getStatusColor(threat.risk_level)}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(threat.risk_level), boxShadow: `0 0 8px ${getStatusColor(threat.risk_level)}` }}></div>
                <span style={{ color: getStatusColor(threat.risk_level), fontSize: '0.875rem', fontWeight: '500' }}>{threat.risk_level}</span>
              </div>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{threat.source_type}</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'monospace' }}>{threat.category}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{new Date(threat.detected_at).toLocaleTimeString()}</div>
              
              <div style={{ textAlign: 'right' }}>
                <button style={{ color: 'var(--brand-primary)', fontSize: '0.875rem', textDecoration: 'underline' }}>Expand</button>
              </div>
            </div>
          ))}
          {threats.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No live threats detected yet. Awaiting SSE ping...</div>}
        </div>
      </div>
    </div>
  );
}
