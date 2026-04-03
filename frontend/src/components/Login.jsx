import React, { useState } from 'react';
import { Shield, Lock, User, Terminal, AlertTriangle } from 'lucide-react';
import { login, register } from '../services/api.js';

const Login = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = isRegister 
        ? await register(username, password, displayName)
        : await login(username, password);

      if (data.user) {
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'Sentinel access denied.');
      }
    } catch (err) {
      setError('Connection to Sentinel Core failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #1a1a2e 0%, #09090b 100%)',
      padding: '24px'
    }}>
      <div className="sentinel-card" style={{
        width: '100%',
        maxWidth: '450px',
        border: '1px solid var(--border-ghost)',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated accent bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: isRegister 
            ? 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))'
            : 'linear-gradient(90deg, var(--neon-pink), var(--neon-purple), var(--neon-cyan))',
          boxShadow: `0 2px 10px ${isRegister ? 'rgba(0, 245, 255, 0.5)' : 'rgba(112, 0, 255, 0.5)'}`,
          transition: 'all 0.3s ease'
        }} />

        <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: isRegister 
              ? 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))'
              : 'linear-gradient(135deg, var(--neon-pink), var(--neon-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: `0 0 20px ${isRegister ? 'rgba(0, 245, 255, 0.3)' : 'rgba(255, 0, 127, 0.3)'}`,
            transition: 'all 0.3s ease'
          }}>
            <Shield size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'white', marginBottom: '8px' }}>DARKTRACE AI</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            {isRegister ? 'NEW OPERATOR ENROLLMENT' : 'SENTINEL ACCESS TERMINAL'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(255, 0, 127, 0.1)',
            border: '1px solid var(--neon-pink)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            animation: 'shake 0.4s ease-in-out'
          }}>
            <AlertTriangle size={18} color="var(--neon-pink)" />
            <span style={{ color: 'var(--neon-pink)', fontSize: '0.85rem', fontWeight: 500 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isRegister && (
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '8px', marginLeft: '4px' }}>DISPLAY NAME</label>
              <div style={{ position: 'relative' }}>
                <Terminal size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="e.g. Operator Alpha"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 48px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-ghost)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '8px', marginLeft: '4px' }}>OPERATOR ID</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-ghost)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '8px', marginLeft: '4px' }}>ACCESS KEY</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-ghost)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-neon"
            style={{
              marginTop: '12px',
              padding: '14px',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              opacity: loading ? 0.7 : 1,
              background: isRegister 
                ? 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))'
                : 'linear-gradient(135deg, var(--neon-pink), var(--neon-purple))',
            }}
          >
            {loading ? (
              <Terminal size={20} className="animate-spin" />
            ) : (
              <>
                <Shield size={20} />
                {isRegister ? 'CREATE UPLINK' : 'ESTABLISH UPLINK'}
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button 
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ 
              background: 'transparent', border: 'none', color: 'var(--neon-cyan)', 
              fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' 
            }}
          >
            {isRegister ? 'Already have an uplink? Login' : 'Request New Operator Enrollment'}
          </button>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', opacity: 0.6 }}>
          <p>PROTECTED BY DARKTRACE SENTINEL CORE</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
