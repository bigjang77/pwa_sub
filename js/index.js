const publicKey = 'BMQlFP2pmowjPJGZPy87Iy9qGcm-ICh9bZE5KR9m1VAaO96TKDo5JM_5qyv_ZpGEMh_3fAJW3nEI1taFohKCS-M';

// 구독 버튼 클릭 이벤트
document.getElementById('subscribes').addEventListener('click', async function () {
    // Service Worker 등록
    const registration = await navigator.serviceWorker.register('./sw.js', { scope: '/' });
    console.log('Service Worker registered: ', registration);

    // Push Notification 등록
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    console.log('Push subscription: ', subscription);

    // 알림 전송
    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // PWA 알림 전송
    registration.showNotification('구독 완료!', {
        body: '성공적으로 구독되었습니다.',
        icon: './images/notification-icon.png',
    });
});

// base64 URL을 Uint8Array로 변환
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}