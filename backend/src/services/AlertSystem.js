export class AlertSystem {
  constructor() {
    this.clients = [];
  }

  addClient(req, res) {
    this.clients.push(res);
    req.on('close', () => {
      this.clients = this.clients.filter(client => client !== res);
    });
  }

  triggerAlert(threat) {
    if (threat.risk_level === 'High') {
      this.broadcast({ type: 'ALERT', data: threat });
    } else {
      this.broadcast({ type: 'NEW_THREAT', data: threat });
    }
  }

  broadcast(message) {
    this.clients.forEach(client => {
      client.write(`data: ${JSON.stringify(message)}\n\n`);
    });
  }
}

export const alertSystem = new AlertSystem();
