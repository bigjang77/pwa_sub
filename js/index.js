const publicKey = 'BMQlFP2pmowjPJGZPy87Iy9qGcm-ICh9bZE5KR9m1VAaO96TKDo5JM_5qyv_ZpGEMh_3fAJW3nEI1taFohKCS-M';

//서비스워커 등록
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./sw.js')
            .then(reg => console.log('Service Worker: Registered (Pages)'))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
}

// 구독 버튼 클릭 이벤트 핸들러
var subscribeButton = document.getElementById('subscribes');
subscribeButton.addEventListener('click', function () {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function (registration) {
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey)
            }).then(function (subscription) {
                console.log('User is subscribed.');

                // 구독 알림 전송
                registration.showNotification('🎊구독 알림', {
                    body: '구독이 완료되었습니다.',
                    icon: '/images/icon-72x72.png',
                    badge: '/images/badge-96x96.png'
                });
            }).catch(function (err) {
                console.log('Failed to subscribe the user: ', err);
            });
        }).catch(function (err) {
            console.log('Failed to get service worker registration: ', err);
        });
    } else {
        console.log('Notification permission denied.');
    }
});

// Public VAPID Key를 Uint8Array로 변환하는 함수
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

