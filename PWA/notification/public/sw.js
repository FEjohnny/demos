/**
 * Created by chenjun on 2018/6/10.
 */

const cacheName = 'sw';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll([
           'homescreen.png'
        ]))
    );
});

self.addEventListener('push', function (event) {
    //检查服务端是否发来了任何有效载荷数据
    var payload = event.data ? JSON.parse(event.data.text()) : 'no payload';
    var title = 'Progressive Times';
    event.waitUntil(
        //使用提供的信息来显示 Web 推送通知
        self.registration.showNotification(title, {
            body: payload.msg,
            url: payload.url,
            icon: payload.icon
        })
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    // Check if any actions were added
    if (event.action === 'voteup') {
        clients.openWindow('http://localhost:3111/voteup');
    }
    else if (event.action === 'voteup') {
        clients.openWindow('http://localhost:3111/votedown');
    }
    else {
        clients.openWindow('http://localhost:3111');
    }
}, false);