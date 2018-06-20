/**
 * Created by chenjun on 2018/6/9.
 */
var catchName = 'mySw';

//监听 service worker 的 install 事件
self.addEventListener('install',function (event) {
    // 如果监听到了 service worker 已经安装成功的话，就会调用 event.waitUntil 回调函数
    event.waitUntil(
        // 安装成功后操作 CacheStorage 缓存，使用之前需要先通过 caches.open() 打开对应缓存空间。
        caches.open(catchName).then(function (catche) {
            // 通过 cache 缓存对象的 addAll 方法添加 precache 缓存
            catche.addAll([
                '/',
                '/css/index.css',
                '/js/index.js',
                '/img/logo.png',
                '/data/data.json',
            ]);
        })
    )
});

// 安装阶段跳过等待，直接进入 active
// self.addEventListener('install', function (event) {
//     event.waitUntil(self.skipWaiting());
// });
// self.addEventListener('activate', function (event) {
//     event.waitUntil(
//         Promise.all([
//             caches.open(catchName).then(function (catche) {
//                 // 通过 cache 缓存对象的 addAll 方法添加 precache 缓存
//                 catche.addAll([
//                     '/',
//                     '/css/index.css',
//                     '/js/index.js',
//                     '/img/logo.png',
//                     '/data/data.json',
//                 ])
//             }),
//             // 更新客户端
//             self.clients.claim(),
//             // 清理旧版本
//             caches.keys().then(function (cacheList) {
//                 return Promise.all(
//                     cacheList.map(function (oldcacheName) {
//                         if (oldcacheName !== catchName) {
//                             return caches.delete(oldcacheName);
//                         }
//                     })
//                 );
//             })
//         ])
//     );
// });

//监听网络请求
self.addEventListener('fetch',function (event) {
    event.respondWith(
        caches.match(event.request,{ //优先匹配缓存
            ignoreSearch: false,  //查询url时，忽略附带的查询参数
            ignoreMethod:false,  //是否忽略请求方法，如果忽略则post请求可能会匹配到get请求
            ignoreVary: false, //ignoreVary 选项会忽略已缓存响应中的 vary 首部
        }).then(function (response) {
            // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
            if(response){
                return response;
            }

            // 如果 service worker 没有返回，那就得直接请求真实远程服务

            //克隆请求，因为请求是一个流，只能消耗一次，而我们已经通过缓存消耗了一次
            var requst = event.request.clone();
            return fetch(requst).then(function (res) {

                // 如果请求失败了，直接返回失败的结果就好了。。
                if (!res || res.status !== 200) {
                    return res;
                }
                // 请求成功的话，将请求缓存起来。
                var resClone = res.clone();
                caches.open(catchName).then(function(cathe){
                    cathe.put(event.request, resClone);
                });

                return res;
            })
        })

    )
})