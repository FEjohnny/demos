var http = require('http');
var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World/n');
}).listen(Math.round((1 + Math.random()) * 1000), '127.0.0.1', function () {
    console.log("应用实例，访问地址为 http://%s:%s", server.address().address, server.address().port)
});
