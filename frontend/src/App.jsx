import React, { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import OrgConfig from './components/OrgConfig.jsx';
import { Search, User, Shield } from 'lucide-react';

import Login from './components/Login.jsx';
import { LogOut } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  return (
    <div style={{ padding: '32px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
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

        {/* Right: Account Button */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', position: 'relative' }}>
          <div 
            className="pill-nav" 
            style={{ 
              display: 'flex', gap: '12px', padding: '6px 16px 6px 6px', 
              cursor: 'pointer', position: 'relative' 
            }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2a2a35',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={16} color="var(--text-primary)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold', lineHeight: '1' }}>
                {user.display_name}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {user.role === 'admin' ? 'Sentinel Admin' : 'Org Operator'}
              </span>
            </div>
          </div>

          {showProfileMenu && (
            <div className="sentinel-card" style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '12px',
              padding: '8px', width: '200px', zIndex: 100,
              border: '1px solid var(--border-ghost)',
              animation: 'slideIn 0.2s ease-out forwards'
            }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-ghost)', marginBottom: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ID: {user.username}</div>
              </div>
              <button 
                onClick={() => setUser(null)}
                style={{
                  width: '100%', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'transparent', border: 'none', color: 'var(--neon-pink)',
                  fontSize: '0.85rem', cursor: 'pointer', borderRadius: '4px'
                }}
                className="hover-bright"
              >
                <LogOut size={16} />
                Terminate Uplink
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
