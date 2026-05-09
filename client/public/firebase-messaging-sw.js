/*
  Firebase Cloud Messaging Service Worker

  - This file must be placed in the `public/` folder so it's served at
    `https://<your-host>/firebase-messaging-sw.js` with the correct
    `application/javascript` MIME type.

  - This file is manual and uses the real sender ID from the client
    Firebase config.

  - The service worker listens for background messages and shows
    a notification using the payload's `notification` fields.
*/

importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

const firebaseConfig = {
  messagingSenderId: '993466980047'
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(function(payload) {
    const title = (payload && payload.notification && payload.notification.title) || 'RIDESAFE';
    const options = {
      body: payload?.notification?.body || '',
      data: payload?.data || {},
      icon: '/favicon.ico'
    };
    self.registration.showNotification(title, options);
  });
} catch (e) {
  // If Firebase scripts or init fail, log but don't crash the SW
  console.error('[firebase-messaging-sw] init failed', e && e.message);
}

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification?.data?.url || '/';
  event.waitUntil(clients.matchAll({ type: 'window' }).then(windowClients => {
    for (let client of windowClients) {
      if (client.url === url && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
