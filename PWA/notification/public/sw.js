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
//
// self.addEventListener('push', function (event) {
//     if (event.data) {
//         var promiseChain = Promise.resolve(event.data.json())
//             .then(data => self.registration.showNotification(data.msg, {}));
//         event.waitUntil(promiseChain);
//     }
// });

self.addEventListener('offline', function() {
    Notification.requestPermission().then(grant => {
        if (grant !== 'granted') {
            return;
        }
        const notification = new Notification("Hi，网络不给力哟", {
            body: '您的网络貌似离线了，不过在志文工作室里访问过的页面还可以继续打开~',
            icon: '//lzw.me/images/avatar/lzwme-80x80.png'
        });
        notification.onclick = function() {
            notification.close();
        };
    });
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
