self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
  });
  
  self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching', event.request.url);
    // يمكنك هنا التعامل مع الطلبات وإعادة توجيهها أو تخزين البيانات في الخلفية
  });
  
  self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    const title = 'Push Notification';
    const options = {
      body: 'This is a push notification',
      icon: '/path/to/icon.png',
    };
    event.waitUntil(self.registration.showNotification(title, options));
  });
