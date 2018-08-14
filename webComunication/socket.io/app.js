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
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
})

http.listen(3000, () => {
    console.log(`listen http//:localhost:3000`);
})