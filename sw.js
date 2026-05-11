// Density fitness tracker — service worker for rest timer notifications
let pendingTimer = null;

self.addEventListener('message', (event) => {
  const { type, delayMs } = event.data || {};

  if (type === 'SCHEDULE_REST_DONE') {
    if (pendingTimer) clearTimeout(pendingTimer);
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      self.registration.showNotification('Rest complete', {
        body: 'Time to hit the next set.',
        tag: 'rest-timer',
        renotify: true,
        vibrate: [200, 100, 200, 100, 200],
        silent: false,
      });
    }, delayMs);
  }

  if (type === 'CANCEL_REST') {
    if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      for (const c of cs) { if ('focus' in c) return c.focus(); }
      return clients.openWindow(self.registration.scope);
    })
  );
});
