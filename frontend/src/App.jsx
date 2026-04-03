import React, { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';

function App() {
  return (
    <div className="app-container">
      {/* Sidebar Placeholder */}
      <aside style={{ width: '250px', backgroundColor: 'var(--bg-elevated)', borderRight: '1px solid var(--border-ghost)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--brand-primary)', fontWeight: 'bold' }}>
          DarkTrace AI
        </div>
        <nav style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '12px 16px', background: 'rgba(77,0,255,0.1)', color: 'var(--brand-primary)', borderRadius: '8px', cursor: 'pointer' }}>Dashboard</div>
          <div style={{ padding: '12px 16px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Threat Intel</div>
          <div style={{ padding: '12px 16px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Org Config</div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2>Threat Dashboard</h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <select className="glass-panel" style={{ padding: '8px 16px', color: 'var(--text-primary)', outline: 'none' }}>
              <option>global.corp</option>
              <option>internal-nexus.net</option>
            </select>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--brand-gradient)' }}></div>
          </div>
        </header>

        {/* Dashboard Component loaded here */}
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
