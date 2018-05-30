/**
 * Created by 陈俊 on 2018/4/9.
 * 可移植于各浏览器平台的动画循环逻辑
 */

window.requestNextAnimationFrame = (function (window, undefined) {
    var originalWebkitMethod,
        wrapper = undefined,
        callback = undefined,
        geckoVersion = 0,
        userAgent = navigator.userAgent,
        index = 0,
        self = this;

    //chrome 10版本中运行，animate()函数被回调是所传入的time的参数的值回事undefined，
    //如果要实现基于时间的运动，在更新动画帧的回调函数所出现的undefined值，将会干扰奥动画的播放
    if (window.webkitRequestAnimationFrame) {
        wrapper = function (time) {
            if (time === undefined) {
                time = +new Date();
            }
            self.callback(time);
        };

        originalWebkitMethod = window.webkitRequestAnimationFrame;
        window.webkitRequestAnimationFrame = function (callback, element) {
            self.callback = callback;
            originalWebkitMethod(wrapper, element);
        }
    }


    //Firefox 4.0版本所实现的mozRequestAnimationFrame有个bug，导致大多数动画的帧率被局限在每秒30-40帧，会很慢
    if (window.mozRequestAnimationFrame) {
        index = userAgent.indexOf('rv:');
        if (userAgent.indexOf('Gecko') != -1) { //判断是否是firfox浏览器
            geckoVersion = userAgent.substr(index+3,3);
            if(geckoVersion === '2.0'){
                window.mozRequestAnimationFrame = undefined;
            }
        }
    }


    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (callback, element) {
            var start, finish;
            window.setTimeout(function () {
                start = +new Date();
                callback(start);
                finish = +new Date();
                self.timeout = 1000 / 60 - (finish - start);
            }, self.timeout)
        }
})(window);
