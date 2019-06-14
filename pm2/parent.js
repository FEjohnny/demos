var child1 = require('child_process').fork('./child.js');
var child2 = require('child_process').fork('./child.js');
var child3 = require('child_process').fork('./child.js');
var child4 = require('child_process').fork('./child.js');

var server = require('net').createServer();

server.listen(8000, function () {
    child1.send('server', server);
    child2.send('server', server);
    child3.send('server', server);
    child4.send('server', server);
    server.close();  改良版本
});


