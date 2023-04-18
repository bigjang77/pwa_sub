const publicVapidKey = 'BMQlFP2pmowjPJGZPy87Iy9qGcm-ICh9bZE5KR9m1VAaO96TKDo5JM_5qyv_ZpGEMh_3fAJW3nEI1taFohKCS-M';

// 구독 버튼 클릭 시
document.getElementById('subscribes').addEventListener('click', async () => {
    try {
        // Service Worker 등록
        const registration = await navigator.serviceWorker.register('/sw.js');

        // PushManager에서 구독 정보를 가져옴
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        // 구독 정보를 서버에 전송
        await fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        alert('구독이 완료되었습니다!');
    } catch (error) {
        console.error(error);
        alert('구독 도중 에러가 발생했습니다.');
    }
});

// base64 URL을 Uint8Array로 변환하는 함수
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

//구독취소
const unsubscribe = async () => {
    const subscription = await navigator.serviceWorker.ready.then(registration => registration.pushManager.getSubscription());
    if (subscription) {
        subscription.unsubscribe();
        console.log('Successfully unsubscribed!');
        document.getElementById('subscribes').textContent = '🔕 구독 취소';
    }
};

document.getElementById('subscribes').addEventListener('click', () => {
    if (Notification.permission === 'denied') {
        console.warn('Notifications are denied by the user.');
        return;
    }

    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    } else {
        navigator.serviceWorker.ready.then(registration => {
            registration.pushManager.getSubscription().then(subscription => {
                if (subscription) {
                    unsubscribe();
                } else {
                    subscribe(registration);
                }
            });
        });
    }
});