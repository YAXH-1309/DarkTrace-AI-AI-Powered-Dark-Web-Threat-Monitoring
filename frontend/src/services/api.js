const BASE_URL = 'https://darktrace-backend-7zd5.onrender.com/api';
export const API_BASE_URL = BASE_URL;

export const fetchThreats = async () => {
  const res = await fetch(`${BASE_URL}/threats`);
  return res.json();
};

export const fetchStats = async () => {
  const res = await fetch(`${BASE_URL}/threats/stats`);
  return res.json();
};

export const fetchTrends = async () => {
  const res = await fetch(`${BASE_URL}/threats/trends`);
  return res.json();
};

export const login = async (username, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
};

export const register = async (username, password, display_name) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, display_name })
  });
  return res.json();
};

export const fetchOrgConfig = async () => {
  const res = await fetch(`${BASE_URL}/organization/config`);
  return res.json();
};

export const setupSSE = (onNewThreat, onAlert) => {
  const evtSource = new EventSource(`${BASE_URL}/threats/stream`);
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
