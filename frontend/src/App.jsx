import React, { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import OrgConfig from './components/OrgConfig.jsx';
import { Search, User, Shield } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={{ padding: '32px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Floating Pill Navigation */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '48px',
        padding: '0 24px'
      }}>
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--neon-pink), var(--neon-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Shield size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold', fontSize: '1.25rem', color: 'white' }}>
            DarkTrace
          </span>
        </div>

        {/* Center: Pill Navigation */}
        <nav className="pill-nav">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </div>
          <div className="nav-item">Exposures</div>
          <div className="nav-item">Threats</div>
          <div className={`nav-item ${activeTab === 'orgconfig' ? 'active' : ''}`} onClick={() => setActiveTab('orgconfig')}>
            Settings
          </div>
        </nav>

        {/* Right: Actions */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="pill-nav" style={{ padding: '10px' }}>
            <Search size={18} color="var(--text-secondary)" />
          </div>
          <div className="pill-nav" style={{ display: 'flex', gap: '12px', padding: '6px 16px 6px 6px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2a2a35',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={16} color="var(--text-primary)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold', lineHeight: '1' }}>Alex Rock</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>admin@darktrace</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'orgconfig' && <OrgConfig />}
      </main>
    </div>
  );
}

export default App;
