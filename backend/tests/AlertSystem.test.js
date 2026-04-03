import { AlertSystem } from '../src/services/AlertSystem.js';

describe('AlertSystem Property Testing', () => {
  let alertSystem;
  let mockClient;

  beforeEach(() => {
    alertSystem = new AlertSystem();
    mockClient = {
      write: jest.fn(),
      on: jest.fn()
    };
    alertSystem.addClient(mockClient);
  });

  test('High risk threats trigger an ALERT event', () => {
    const threat = { id: 1, riskLevel: 'High', category: 'API_Key_Exposure' };
    alertSystem.triggerAlert(threat);
    
    expect(mockClient.write).toHaveBeenCalledWith(
      `data: ${JSON.stringify({ type: 'ALERT', data: threat })}\n\n`
    );
  });

  test('Non-High risk threats trigger a NEW_THREAT event', () => {
    const threat = { id: 2, riskLevel: 'Medium', category: 'Credential_Leak' };
    alertSystem.triggerAlert(threat);
    
    expect(mockClient.write).toHaveBeenCalledWith(
      `data: ${JSON.stringify({ type: 'NEW_THREAT', data: threat })}\n\n`
    );
  });
});
