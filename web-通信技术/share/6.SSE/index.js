var http = require('http');
var fs = require('fs');

var num = 0;
var lastNum = -1;
setInterval(function(){
    num ++;
}, 5 * 1000);

var server = http.createServer(function (req, res) {
    if (req.url === '/getNumber') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream'
        });
        var timer = setInterval(function() {
            if (num !== lastNum) {
                // res.write('id: ' + num + '\n');
                res.write('data: ' + num + '\n\n');
                lastNum = num;
            }
        }, 1000);
    };
    if (req.url === '/') {
        fs.readFile('./index.html', 'binary', function (err, file) {
            if (!err) {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write(file, 'binary');
                res.end();
            }
        });
    }
}).listen(8080, 'localhost');

server.on('connection', function(socket) {
    console.log('connection');
});
server.on('close', function() {
    console.log('close');
});