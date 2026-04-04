import React, { useState } from 'react';
import { AlertCircle, User, Search, Filter, CreditCard, Briefcase, FileCode } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ArcElement } from 'chart.js';
import { API_BASE_URL } from '../services/api.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ArcElement);

const GaugeChart = ({ stats }) => {
  // If no stats, render empty ring
  if (stats.total === 0) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '180px', display: 'flex', justifyContent: 'center' }}>
        <Doughnut data={{ labels: ['Empty'], datasets: [{ data: [1], backgroundColor: ['#2a2a35'], borderWidth: 0, cutout: '85%', circumference: 270, rotation: 225 }] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '2rem', margin: 0, fontFamily: 'var(--font-display)' }}>0</h2>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>No Data</span>
        </div>
      </div>
    );
  }

  const data = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [{
      data: [stats.high, stats.medium, stats.low],
      backgroundColor: [
        '#FF007F', // High Risk
        '#ac89ff', // Medium Risk
        '#00F5FF'  // Low Risk
      ],
      borderWidth: 0,
      cutout: '85%',
      circumference: 270,
      rotation: 225
    }]
  };
  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: true } } };
  return (
    <div style={{ position: 'relative', width: '100%', height: '180px', display: 'flex', justifyContent: 'center' }}>
      <Doughnut data={data} options={options} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '2rem', margin: 0, fontFamily: 'var(--font-display)' }}>{stats.total}</h2>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Total Threats</span>
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
  const [domainInput, setDomainInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [threats, setThreats] = useState([]);
  const [filteredThreats, setFilteredThreats] = useState([]);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });
  const [expandedId, setExpandedId] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('All');
  const [activeLog, setActiveLog] = useState('');
  const [trends, setTrends] = useState({
    labels: ['T-5h', 'T-4h', 'T-3h', 'T-2h', 'T-1h', 'Now'],
    highData: [0,0,0,0,0,0],
    mediumData: [0,0,0,0,0,0],
    lowData: [0,0,0,0,0,0]
  });

  const handleFetch = async () => {
    if (!domainInput.trim()) return;
    setIsFetching(true);
    setExpandedId(null);
    setActiveAlert(null);
    setCurrentFilter('All');
    setThreats([]);
    setFilteredThreats([]);
    
    try {
      const response = await fetch(`${API_BASE_URL}/threats/fetch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ domain: domainInput })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Uplink synchronization failed.');

      // Dynamic log cycle for visual impact (snappier)
      if (data.scanLogs) {
        for (const log of data.scanLogs) {
          setActiveLog(log);
          await new Promise(r => setTimeout(r, 400));
        }
      }
      
      const newThreats = data.threats || [];
      setThreats(newThreats);
      setFilteredThreats(newThreats);
      setStats(data.stats || { total: 0, high: 0, medium: 0, low: 0 });
      if (data.trends) setTrends(data.trends);

      const highRisk = newThreats.find(t => t.risk_level === 'High');
      if (highRisk) setTimeout(() => setActiveAlert(highRisk), 300);

    } catch (err) {
      console.error('[Dashboard Error]', err);
      setActiveLog(`ERROR: ${err.message}`);
      // Show error briefly then clear
      setTimeout(() => setIsFetching(false), 2000);
      return; 
    } finally {
      setIsFetching(false);
      setActiveLog('');
    }
  };

  const handleFilter = (filter) => {
    setCurrentFilter(filter);
    if (filter === 'All') {
      setFilteredThreats(threats);
    } else {
      setFilteredThreats(threats.filter(t => t.risk_level === filter));
    }
  };

  const lineData = {
    labels: trends.labels,
    datasets: [
      {
        label: 'High Risk',
        data: trends.highData,
        borderColor: '#FF007F',
        backgroundColor: 'rgba(255, 0, 127, 0.1)',
        tension: 0.4, fill: true,
      },
      {
        label: 'Medium Risk',
        data: trends.mediumData,
        borderColor: '#ac89ff',
        tension: 0.4, fill: false,
      },
      {
        label: 'Low Risk',
        data: trends.lowData,
        borderColor: '#00F5FF',
        tension: 0.4, fill: false,
      }
    ]
  };

  const lineOptions = {
    responsive: true, maintainAspectRatio: false,
    scales: {
      y: { 
        grid: { color: 'rgba(255, 255, 255, 0.05)' }, 
        border: { display: false }, 
        ticks: { color: 'var(--text-secondary)', stepSize: 1 },
        min: 0,
        suggestedMax: 4
      },
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
          boxShadow: '0 0 40px rgba(255, 0, 127, 0.4)', 
          display: 'flex', gap: '16px', alignItems: 'center',
          animation: 'slideIn 0.3s ease-out forwards',
          background: 'rgba(9, 9, 11, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <AlertCircle color="var(--status-high)" size={24} />
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>CRITICAL ASSET EXPOSURE</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{activeAlert.category} detected for {domainInput}</div>
          </div>
          <button 
            onClick={() => setActiveAlert(null)} 
            style={{ 
              background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', 
              padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' 
            }}
          >Dismiss</button>
        </div>
      )}

      {/* Central Search Bar Header */}
      <div className="sentinel-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', backgroundImage: 'radial-gradient(ellipse at top, rgba(255, 0, 127, 0.05) 0%, transparent 70%)' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'white', margin: 0, textAlign: 'center' }}>
          Interactive Domain Intelligence
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '600px', marginBottom: '8px' }}>
          Enter a domain to run a live trace. DarkTrace AI will query underground databanks for High, Medium, and Low risk threats tied to this target.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '600px' }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px' }} />
            <input 
              type="text" 
              placeholder="e.g. world.com, tesla.com, bankofamerica.com" 
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              style={{ 
                width: '100%', 
                background: 'rgba(0,0,0,0.5)', 
                border: '1px solid var(--border-ghost)', 
                color: 'white', 
                padding: '16px 16px 16px 48px', 
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'monospace'
              }} 
            />
          </div>
          <button 
            className="btn-neon" 
            onClick={handleFetch}
            disabled={isFetching}
            style={{ padding: '0 32px', minWidth: '160px', opacity: isFetching ? 0.7 : 1, transition: '0.2s all' }}
          >
            {isFetching ? 'TRACING...' : 'FETCH DATA'}
          </button>
        </div>
        
        {isFetching && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginTop: '12px', minHeight: '24px' }}>
            <div className="scanning-dot" style={{ animationDelay: '0s' }}></div>
            <div className="scanning-dot" style={{ animationDelay: '0.2s' }}></div>
            <div className="scanning-dot" style={{ animationDelay: '0.4s' }}></div>
            <span style={{ color: 'var(--neon-purple)', fontSize: '0.85rem', marginLeft: '12px', letterSpacing: '0.05em', fontFamily: 'monospace' }}>
              {activeLog || 'INITIALIZING SECURE TRACE...'}
            </span>
          </div>
        )}
      </div>

      {/* Top Row: Metrics & Charts */}
      {stats.total > 0 && !isFetching && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '32px' }}>
          
          {/* Line Chart */}
          <div className="sentinel-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '8px' }}>Threat Volumes Over Time</h3>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}><span style={{ color: 'var(--neon-pink)', marginRight: '4px' }}>●</span>High Risk</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}><span style={{ color: 'var(--neon-purple)', marginRight: '4px' }}>●</span>Medium Risk</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}><span style={{ color: 'var(--neon-cyan)', marginRight: '4px' }}>●</span>Low Risk</span>
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
            <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '24px' }}>Target Threat Breakdown</h3>
            <GaugeChart stats={stats} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--neon-pink)', marginRight: '8px' }}>●</span>High Risk</span>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>{stats.high}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--neon-purple)', marginRight: '8px' }}>●</span>Medium Risk</span>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>{stats.medium}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--neon-cyan)', marginRight: '8px' }}>●</span>Low Risk</span>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>{stats.low}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Row: Threat Feed */}
      <div className="sentinel-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Discovered Intelligences {domainInput && `for ${domainInput}`}</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
             {['All', 'High', 'Medium', 'Low'].map(f => (
               <button 
                key={f}
                className={`pill-nav ${currentFilter === f ? 'active' : ''}`}
                onClick={() => handleFilter(f)}
                style={{ padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid var(--border-ghost)' }}
               >
                 {f}
               </button>
             ))}
          </div>
        </div>

        {/* Table Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) 2fr 1fr 1fr 1fr', padding: '0 16px 12px 16px', color: 'var(--text-secondary)', fontSize: '0.8rem', borderBottom: '1px solid var(--border-ghost)' }}>
          <div>Entity Detected</div><div>Intelligence Findings</div><div>Discovery Time</div><div>Assessed Risk</div><div>Extracted Source</div>
        </div>

        {/* Table Body */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredThreats.map((threat, idx) => {
            let IconComponent = User;
            let iconGradient = 'linear-gradient(135deg, #7000FF, #00F5FF)';
            
            if (threat.category === 'Financial Data') {
              IconComponent = CreditCard;
              iconGradient = 'linear-gradient(135deg, #FF007F, #ff709e)';
            } else if (threat.category === 'Corporate Secrets') {
              IconComponent = FileCode;
              iconGradient = 'linear-gradient(135deg, #ac89ff, #7000FF)';
            } else if (threat.category === 'PII/Sensitive Data') {
              IconComponent = User;
              iconGradient = 'linear-gradient(135deg, #00F5FF, #290067)';
            } else if (threat.category === 'General Mention') {
              IconComponent = Search;
              iconGradient = 'linear-gradient(135deg, #002244, #00F5FF)';
            }

            const isExpanded = expandedId === threat.id;

            return (
            <React.Fragment key={threat.id || idx}>
              <div 
                style={{ 
                  display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) 2fr 1fr 1fr 1fr', 
                  alignItems: 'center', padding: '16px', 
                  borderBottom: '1px solid rgba(255,255,255,0.02)',
                  transition: 'background 0.2s',
                  backgroundColor: isExpanded ? 'rgba(255, 0, 127, 0.05)' : (idx % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent'),
                  cursor: 'pointer'
                }} 
                className="feed-row"
                onClick={() => setExpandedId(isExpanded ? null : threat.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: iconGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComponent size={16} color="white" />
                  </div>
                  <div>
                    <div style={{ color: 'white', fontSize: '0.9rem' }}>{threat.details?.split(' ')[0] || 'Unknown'} Source</div>
                    <div style={{ color: 'var(--neon-cyan)', fontSize: '0.75rem' }}>◆ {threat.category}</div>
                  </div>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '16px' }}>{threat.details}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(threat.detected_at).toLocaleTimeString()}</div>
                <div><SegmentedRisk level={threat.risk_level || 'Low'} /></div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>{(threat.source_type || 'Unknown').slice(0, 25)}...</div>
              </div>
              
              {isExpanded && (
                <div style={{ padding: '24px', background: 'rgba(9, 9, 11, 0.5)', borderBottom: '1px solid rgba(255, 0, 127, 0.2)', animation: 'slideDown 0.2s ease-out' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                    <div>
                      <h4 style={{ color: 'var(--neon-pink)', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '12px' }}>CAPTURED INTELLIGENCE</h4>
                      <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', color: 'white', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {threat.details}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--neon-cyan)', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '12px' }}>TECHNICAL METADATA</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '4px' }}>Source URL</label>
                          <div style={{ color: 'white', fontSize: '0.8rem', fontFamily: 'monospace' }}>{threat.source_type}</div>
                        </div>
                        <div>
                          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '4px' }}>Risk Assessment</label>
                          <div style={{ color: threat.risk_level === 'High' ? 'var(--neon-pink)' : 'white', fontSize: '0.8rem' }}>{threat.risk_level} Criticality</div>
                        </div>
                        <div>
                          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '4px' }}>Detection Engine</label>
                          <div style={{ color: 'white', fontSize: '0.8rem' }}>Sentinel AI Core v3.1</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                          <button style={{ background: 'var(--neon-purple)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem' }}>Report Leak</button>
                          <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem' }}>Whitelist</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
            );
          })}
          {filteredThreats.length === 0 && !isFetching && <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No intelligence found matching the current filter.</div>}
          {threats.length === 0 && !isFetching && <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>Awaiting Live Dark Web Intelligence. Enter a target domain above.</div>}
        </div>
      </div>
    </div>
  );
}

