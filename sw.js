// sw.js - Service Worker لإدارة إشعارات الهاتف
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// عند الضغط على الإشعار في الهاتف: يفتح التطبيق أو يركز عليه
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // إذا ضغط المستخدم على زر إجراء داخل الإشعار (مثل: شربت كوباً)
  if (event.action === 'drink-water') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        if (clientList.length > 0) {
          clientList[0].postMessage({ type: 'ADD_WATER_FROM_NOTIF' });
          return clientList[0].focus();
        }
        return self.clients.openWindow('./');
      })
    );
    return;
  }

  // السلوك الافتراضي: فتح التطبيق عند لمس الإشعار
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});