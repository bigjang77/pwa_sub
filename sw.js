const CACHE_NAME = 'my-cache';
const CACHE_URLS = [
    // '/',
    // 'styles/styles.css',
    // 'js/index.js',
    // 'icons/'
    // 필요한 리소스들을 캐싱합니다.
];

self.addEventListener('install', event => {
    // 서비스워커가 설치되면, 리소스들을 캐싱합니다.
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    // 서비스워커가 활성화되면, 이전 버전의 캐시를 정리합니다.
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    // 네트워크 요청을 가로채서 캐시된 리소스를 반환하거나 동적으로 리소스를 캐싱합니다.
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});



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