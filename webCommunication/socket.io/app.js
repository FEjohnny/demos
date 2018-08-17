const express = require('express');
const app = new express();
const http = require('http').Server(app);
let io = require('socket.io')(http);
app.use(express.static('static'));

app.get('/', (req, res) => {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    //send a message to everyone
    socket.broadcast.emit('welcome!');
    // 监听chat message 事件
    socket.on('chat message', (msg) => {
        console.log(`msg: ${msg}`);
    });
    // 监听断开链接
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
})

http.listen(3000, () => {
    console.log(`listen http//:localhost:3000`);
})