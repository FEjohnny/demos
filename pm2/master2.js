var fork = require('child_process').fork;
var cpus = require('os').cpus();


var server = require('net').createServer();

server.listen(8000);

var workers = {};

var createWorker = function () {
    var worker = fork(__dirname + '/child.js');

    // 退出时自动重启
    worker.on('exit', function () {
        console.log('Worker ' + worker.pid + ' exited.');
        delete workers[worker.pid];
        createWorker();
    });

    // 句柄转发
    worker.send('server', server);
    workers[worker.pid] = worker;
    console.log('create workder. pid: ' + worker.pid);
};

for(var i = 0; i < cpus.length; i ++) {
    createWorker();
}

// 主进程退出，同时退出工作进程
process.on('exit', function () {
    for (var pid in workers) {
        console.log('child exit: ' + pid);
        workers[pid].kill();
    }
})

