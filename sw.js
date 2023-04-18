self.addEventListener('push', (event) => {
    console.log('Push received:', event);
    let data = { title: 'Push notification' };
    if (event.data) {
        data = JSON.parse(event.data.text());
    }

    const options = {
        body: data.body,
        icon: '/images/icon-192x192.png',
        badge: '/images/badge-72x72.png',
        data: {
            url: data.url,
        },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);

    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    const url = event.notification.data.url;
    event.waitUntil(clients.openWindow(url));
});

self.addEventListener('pushsubscriptionchange', async (event) => {
    console.log('Push subscription change:', event);

    const subscription = await self.registration.pushManager.getSubscription();
    if (subscription) {
        const response = await fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Subscription updated:', response);
    }
});