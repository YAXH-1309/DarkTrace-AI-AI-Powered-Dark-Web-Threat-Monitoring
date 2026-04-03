import express from 'express';

const router = express.Router();

let mockOrgConfig = {
  domains: ['example.com', 'acmecorp.com', 'global.corp'],
  keywords: ['confidential', 'source_code', 'breach'],
  alertPreferences: {
    soundEnabled: true,
    highRiskOnly: false
  }
};

router.get('/config', (req, res) => {
  res.json(mockOrgConfig);
});

router.post('/domains', (req, res) => {
  const { domain } = req.body;
  if (domain && !mockOrgConfig.domains.includes(domain)) {
    mockOrgConfig.domains.push(domain);
  }
  res.json(mockOrgConfig);
});

router.post('/keywords', (req, res) => {
  const { keyword } = req.body;
  if (keyword && !mockOrgConfig.keywords.includes(keyword)) {
    mockOrgConfig.keywords.push(keyword);
  }
  res.json(mockOrgConfig);
});

router.put('/alert-preferences', (req, res) => {
  const { soundEnabled, highRiskOnly } = req.body;
  mockOrgConfig.alertPreferences = { soundEnabled, highRiskOnly };
  res.json(mockOrgConfig);
});

export default router;
