import React, { useState, useEffect } from 'react';
import { AlertCircle, User, Search, Filter } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ArcElement } from 'chart.js';
import { fetchThreats, fetchStats, fetchTrends, setupSSE } from '../services/api.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ArcElement);

const GaugeChart = ({ total, resolved }) => {
  const data = {
    labels: ['Resolved', 'Open'],
    datasets: [{
      data: [resolved, total - resolved],
      backgroundColor: [
        '#00F5FF', // Cyan
        '#FF007F'  // Pink
      ],
      borderWidth: 0,
      cutout: '85%',
      circumference: 270,
      rotation: 225
    }]
  };
  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } };
  return (
    <div style={{ position: 'relative', width: '100%', height: '180px', display: 'flex', justifyContent: 'center' }}>
      <Doughnut data={data} options={options} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '2rem', margin: 0, fontFamily: 'var(--font-display)' }}>{total}</h2>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Total active</span>
      </div>
    </div>
  );
};

const SegmentedRisk = ({ level }) => {
  const blocks = 12;
  const isHigh = level === 'High';
  const isMed = level === 'Medium';
  const activeCount = isHigh ? 10 : (isMed ? 6 : 3);
  const colorClass = isHigh ? 'filled-high' : (isMed ? 'filled-med' : 'filled-low');
  
  return (
    <div className="segmented-risk">
      {[...Array(blocks)].map((_, i) => (
        <div key={i} className={`risk-block ${i < activeCount ? colorClass : ''}`}></div>
      ))}
    </div>
  );
};

const HeatmapSquare = ({ intensity }) => {
  const opacities = [0.05, 0.4, 0.7, 1];
  const opacity = opacities[intensity];
  return (
    <div style={{
      width: '100%', aspectRatio: '1/1', borderRadius: '4px',
      backgroundColor: `rgba(172, 137, 255, ${opacity})`,
      boxShadow: intensity > 1 ? `0 0 10px rgba(172, 137, 255, ${opacity * 0.8})` : 'none'
    }}></div>
  );
};

export default function Dashboard() {
  const [threats, setThreats] = useState([]);
  const [stats, setStats] = useState({ total: 100, high: 20, medium: 45, low: 35 });
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    fetchThreats().then(setThreats).catch(console.error);
    const evtSource = setupSSE(
      (newThreat) => { setThreats(prev => [newThreat, ...prev].slice(0, 50)); },
      (alertThreat) => {
        setThreats(prev => [alertThreat, ...prev].slice(0, 50));
        setActiveAlert(alertThreat);
      }
    );
    return () => evtSource.close();
  }, []);

  const lineData = {
    labels: ['15 Oct', '16 Oct', '17 Oct', '18 Oct', '19 Oct', '20 Oct', '21 Oct', '22 Oct'],
    datasets: [
      {
        label: 'High Risk',
        data: [10, 20, 15, 30, 25, 40, 35, 45],
        borderColor: '#FF007F',
        backgroundColor: 'rgba(255, 0, 127, 0.1)',
        tension: 0.4, fill: true,
      },
      {
        label: 'Medium Risk',
        data: [30, 40, 25, 45, 30, 50, 45, 30],
        borderColor: '#ac89ff',
        tension: 0.4, fill: false,
      }
    ]
  };

  const lineOptions = {
    responsive: true, maintainAspectRatio: false,
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, border: { display: false }, ticks: { color: 'var(--text-secondary)' } },
      x: { grid: { display: false }, border: { display: false }, ticks: { color: 'var(--text-secondary)' } }
    },
    plugins: { legend: { display: false } },
    elements: { point: { radius: 0 } }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Alert Popup */}
      {activeAlert && (
         <div className="sentinel-card" style={{ 
          position: 'fixed', top: '32px', right: '32px', zIndex: 1000, 
          border: '1px solid var(--status-high)',
          boxShadow: '0 0 40px rgba(255, 0, 127, 0.3)', display: 'flex', gap: '16px', alignItems: 'center'
        }}>
          <AlertCircle color="var(--status-high)" />
          <div>
            <div style={{ color: 'white', fontWeight: 'bold' }}>CRITICAL EXPOSURE DETECTED</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{activeAlert.category}</div>
          </div>
          <button onClick={() => setActiveAlert(null)} style={{ color: 'var(--neon-cyan)', marginLeft: '16px' }}>Dismiss</button>
        </div>
      )}

      {/* Top Row: Metrics & Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '32px' }}>
        
        {/* Line Chart */}
        <div className="sentinel-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '8px' }}>Threat Frequency Over Time</h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}><span style={{ color: 'var(--neon-pink)', marginRight: '4px' }}>●</span>High Risk</span>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}><span style={{ color: 'var(--neon-purple)', marginRight: '4px' }}>●</span>Medium Risk</span>
          </div>
          <div style={{ flex: 1, minHeight: '200px' }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Heatmap Tactics */}
        <div className="sentinel-card">
          <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '24px' }}>Leak Vectors (Last 7 Days)</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.75rem', textAlign: 'right', justifyContent: 'center' }}>
              <div>Dark Forums</div><div>Telegram</div><div>Paste Sites</div><div>GitHub</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', flex: 1 }}>
              {[...Array(28)].map((_, i) => (
                <HeatmapSquare key={i} intensity={Math.floor(Math.random() * 4)} />
              ))}
            </div>
          </div>
        </div>

        {/* Gauge Chart */}
        <div className="sentinel-card">
          <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '24px' }}>Threats Status</h3>
          <GaugeChart total={stats.total} resolved={40} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--neon-pink)', marginRight: '8px' }}>●</span>Open</span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>{stats.high + stats.medium}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--neon-cyan)', marginRight: '8px' }}>●</span>Resolved</span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>40</span>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Threat Feed */}
      <div className="sentinel-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Security threats</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
             <div className="pill-nav" style={{ padding: '4px 16px', gap: '8px', border: '1px solid var(--border-ghost)' }}>
               <Search size={14} color="var(--text-secondary)" />
               <input type="text" placeholder="Search identities" style={{ background: 'transparent', border: 'none', color: 'white', padding: 0, fontSize: '0.8rem' }} />
             </div>
             <button className="pill-nav" style={{ padding: '6px 16px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}><Filter size={14} style={{ marginRight: '6px' }} /> Filter</button>
          </div>
        </div>

        {/* Table Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) 2fr 1fr 1fr 1fr 80px', padding: '0 16px 12px 16px', color: 'var(--text-secondary)', fontSize: '0.8rem', borderBottom: '1px solid var(--border-ghost)' }}>
          <div>Entity</div><div>Title</div><div>Last activity</div><div>Risk level</div><div>Data sources</div><div>Status</div>
        </div>

        {/* Table Body */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {threats.slice(0, 10).map((threat, idx) => (
            <div key={threat.id || idx} style={{ 
              display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) 2fr 1fr 1fr 1fr 80px', 
              alignItems: 'center', padding: '16px', 
              borderBottom: '1px solid rgba(255,255,255,0.02)',
              transition: 'background 0.2s'
            }} className="feed-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF007F, #7000FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="white" />
                </div>
                <div>
                  <div style={{ color: 'white', fontSize: '0.9rem' }}>{threat.details?.split(':')[0] || 'Unknown Entity'}</div>
                  <div style={{ color: 'var(--neon-cyan)', fontSize: '0.75rem' }}>◆ {threat.source_type || 'Dark Web'}</div>
                </div>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{threat.category || 'Leak'} exposure detection</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(threat.detected_at).toLocaleDateString()}</div>
              <div><SegmentedRisk level={threat.risk_level || 'Low'} /></div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>{(threat.source_type || 'TOR Network').slice(0,10)}...</div>
              <div>
                 <span style={{ 
                   display: 'inline-flex', alignItems: 'center', gap: '6px', 
                   background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.8rem', color: 'white' 
                 }}>
                   <span style={{ color: threat.risk_level === 'High' ? 'var(--neon-pink)' : 'var(--neon-purple)' }}>●</span> Open
                 </span>
              </div>
            </div>
          ))}
          {threats.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Awaiting Live Dark Web Intelligence...</div>}
        </div>
      </div>
    </div>
  );
}
