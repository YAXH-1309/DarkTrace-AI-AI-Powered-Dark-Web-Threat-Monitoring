export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const fetchThreats = async () => {
  const res = await fetch(`${API_BASE_URL}/threats`);
  return res.json();
};

export const fetchStats = async () => {
  const res = await fetch(`${API_BASE_URL}/threats/stats`);
  return res.json();
};

export const fetchTrends = async () => {
  const res = await fetch(`${API_BASE_URL}/threats/trends`);
  return res.json();
};

export const login = async (username, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
};

export const register = async (username, password, display_name) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, display_name })
  });
  return res.json();
};

export const fetchOrgConfig = async () => {
  const res = await fetch(`${API_BASE_URL}/organization/config`);
  return res.json();
};

export const setupSSE = (onNewThreat, onAlert) => {
  const evtSource = new EventSource(`${API_BASE_URL}/threats/stream`);
  evtSource.onmessage = (event) => {
    const parsed = JSON.parse(event.data);
    if (parsed.type === 'ALERT') {
      onAlert(parsed.data);
    } else {
      onNewThreat(parsed.data);
    }
  };
  return evtSource;
};
