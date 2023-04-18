self.addEventListener('push', function (event) {
    if (event.data) {
        console.log('Push notification received: ', event.data.text());

        event.waitUntil(
            self.registration.showNotification('FCM Push Notification', {
                body: event.data.text(),
                icon: 'icons/icon-144x144',
            })
        );
    } else {
        console.log('Push notification received but no payload.');
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    event.waitUntil(
        clients.openWindow('http://127.0.0.1:5500/')
    );
});