import fs from 'fs/promises';

export class ThreatIntelligenceCollector {
  constructor(scanIntervalMs = 30000) {
    this.scanIntervalMs = scanIntervalMs;
    this.intervalId = null;
    this.subscribers = [];
  }

  startScanning(dataSources) {
    if (this.intervalId) return;

    // Run initial scan
    this.scanAll(dataSources);

    this.intervalId = setInterval(() => {
      this.scanAll(dataSources);
    }, this.scanIntervalMs);
  }

  stopScanning() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  async scanAll(dataSources) {
    for (const source of dataSources) {
      if (source.status === 'active') {
        try {
          const data = await this.retryWithBackoff(source);
          if (data && data.length > 0) {
            for (const item of data) {
              const collectedData = {
                sourceId: source.id,
                sourceType: source.type,
                content: item.content,
                metadata: { originalId: item.id },
                collectedAt: new Date()
              };
              this.subscribers.forEach(cb => cb(collectedData));
            }
          }
        } catch (error) {
          console.error(`Failed to scan source ${source.name}:`, error.message);
        }
      }
    }
  }

  async retryWithBackoff(source, maxRetries = 3) {
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        return await this.scanDataSource(source);
      } catch (error) {
        attempts++;
        if (attempts >= maxRetries) throw error;
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempts - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  async scanDataSource(source) {
    if (source.type === 'simulated_dataset') {
      // In MVP, we read from local JSON files
      const fileContent = await fs.readFile(source.url, 'utf-8');
      return JSON.parse(fileContent);
    }
    throw new Error(`Unsupported source type: ${source.type}`);
  }
}
