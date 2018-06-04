/**
 * Created by 陈俊 on 2018/5/31.
 */

var cacheName = 'helloWorld'; //缓存的名称
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll([
            '/js/script.js',
            '/images/worders-life.png'
        ]))
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request,{
            ignoreSearch: true,  //查询url时，忽略附带的查询参数
            ignoreMethod:false,  //是否忽略请求方法，如果忽略则post请求可能会匹配到get请求
            ignoreVary: false, //ignoreVary 选项会忽略已缓存响应中的 vary 首部
        })
        .then(function (response) {
            if (response) {
                return response;
            }
            //克隆请求，因为请求是一个流，只能消耗一次，而我们已经通过缓存消耗了一次
            var requestToCache = event.request.clone();
            return fetch(requestToCache).then(//尝试按预期一样发起原始的 HTTP 请求
                function (response) {
                    if (!response || response.status !== 200) {
                    return response;
                    }
                    //你可能会疑惑我们为什么需要再次克隆响应，请记住响应是一个流，
                    //它只能消耗一次。因为我们想要浏览器和缓存都能够消耗响应，
                    // 所以我们需要克隆它，这样就有了两个流。
                    var responseToCache = response.clone();
                    caches.open(cacheName)
                    .then(function (cache){
                        cache.put(requestToCache, responseToCache);//消耗一次响应
                    });
                    return response;//消耗第二次响应
                }
            );
        })
    );
});

window.addEventListener('beforeinstallprompt', function (event) {
    event.userChoice.then(function (result) {
        console.log(result.outcome);
        if (result.outcome == 'dismissed') {//确认提示

        } else {//关掉提示

        }
    });
});