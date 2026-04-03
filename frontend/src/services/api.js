const BASE_URL = '/api';

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
