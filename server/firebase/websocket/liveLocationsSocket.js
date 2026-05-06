const WebSocket = require('ws');
const { realtimeDb } = require('../config/firebase');

const STALE_THRESHOLD_MS = 30000;

const addStaleFlags = (locations) => {
  if (!locations) {
    return {};
  }

  const now = Date.now();
  const result = {};

  for (const [busId, location] of Object.entries(locations)) {
    if (!location) {
      continue;
    }
    result[busId] = {
      ...location,
      isStale: now - (location.timestamp || 0) > STALE_THRESHOLD_MS
    };
  }

  return result;
};

const startLiveLocationsSocket = (server) => {
  const wss = new WebSocket.Server({ server, path: '/ws/live-locations' });
  const clients = new Set();

  wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('close', () => {
      clients.delete(ws);
    });

    ws.on('error', () => {
      clients.delete(ws);
    });

    realtimeDb
      .ref('/liveLocations')
      .once('value')
      .then((snapshot) => {
        const locations = addStaleFlags(snapshot.val());
        ws.send(JSON.stringify({ type: 'snapshot', data: locations }));
      })
      .catch(() => {
        ws.send(JSON.stringify({ type: 'snapshot', data: {} }));
      });
  });

  const broadcast = (payload) => {
    const message = JSON.stringify(payload);
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  };

  const liveRef = realtimeDb.ref('/liveLocations');
  const handleUpdate = (snapshot) => {
    const locations = addStaleFlags(snapshot.val());
    broadcast({ type: 'update', data: locations });
  };

  liveRef.on('value', handleUpdate);

  return () => {
    liveRef.off('value', handleUpdate);
    wss.close();
  };
};

module.exports = { startLiveLocationsSocket };
