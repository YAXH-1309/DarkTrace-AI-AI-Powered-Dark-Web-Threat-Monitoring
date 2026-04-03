import { ThreatIntelligenceCollector } from '../src/services/ThreatIntelligenceCollector.js';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('ThreatIntelligenceCollector', () => {
  let collector;

  beforeEach(() => {
    collector = new ThreatIntelligenceCollector(100); // 100ms for fast testing
    jest.useFakeTimers();
  });

  afterEach(() => {
    collector.stopScanning();
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it('Property 1: Scan Interval Compliance', () => {
    const mockSource = [{ id: '1', status: 'active', url: 'mock.json', type: 'simulated_dataset' }];
    fs.readFile.mockResolvedValue(JSON.stringify([{ id: 'a', content: 'test' }]));

    const scanAllSpy = jest.spyOn(collector, 'scanAll');

    collector.startScanning(mockSource);
    expect(scanAllSpy).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(scanAllSpy).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(200);
    expect(scanAllSpy).toHaveBeenCalledTimes(4);
  });

  it('Property 2: Collected Data Completeness', async () => {
    const mockSource = { id: 'source1', type: 'simulated_dataset', url: 'mock.json', status: 'active' };
    const mockData = [{ id: 'item1', content: 'secure email@example.com' }];
    
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));

    const callback = jest.fn();
    collector.subscribe(callback);

    await collector.scanAll([mockSource]);

    expect(callback).toHaveBeenCalledWith(expect.objectContaining({
      sourceId: 'source1',
      sourceType: 'simulated_dataset',
      content: 'secure email@example.com',
      metadata: { originalId: 'item1' },
      collectedAt: expect.any(Date)
    }));
  });
});
