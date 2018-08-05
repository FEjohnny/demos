const express = require('express');
let app = new express();
let count = 0;
let lastCount = -1;

setInterval(() => {
    count++;
},5000); // 每个五秒，改变一下返回值

app.listen(3000,() => {
    console.log('listen port 3000');
});
app.get('/',function (req, res) {
    res.sendfile('./view/test2.html');
});
app.get('/message',function (req, res) {
    const timer = setInterval(()=>{
        if(lastCount !== count){  // 数据发生改变的时候，才响应该请求
            clearInterval(timer);
            lastCount = count;
            res.end(count.toString());
        }
    },1000);
});