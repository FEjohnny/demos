const express = require('express');
let app = new express();
let count = 0;

setInterval(() => {
    count++;
},5000); // 每个五秒，改变一下返回值

app.listen(3000,() => {
    console.log('listen port 3000');
});
app.get('/',function (req, res) {
    res.sendfile('./index.html');
});
app.get('/message',function (req, res) {
    res.end(count.toString());
});