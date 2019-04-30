// 异步运行测试
// 有时候，我们可能并不只是某个测试用例需要异步，而是整个测试过程都需要异步执行。
// 比如测试Gulp插件的一个方案就是，首先运行Gulp任务，完成后测试生成的文件是否和
// 预期的一致。那么如何异步执行整个测试过程呢？

// 其实Mocha提供了异步启动测试，只需要在启动Mocha的命令后加上--delay参数，
// Mocha就会以异步方式启动。这种情况下我们需要告诉Mocha什么时候开始跑测试用例，
// 只需要执行run()方法即可

require('should');

const mylib = require('../index4');

setTimeout(() => {
    describe('异步运行测试', () => {
        it('wellecom to promiseJohnny', () => {
            return mylib('promiseJohnny').should.be.fulfilledWith('hello promiseJohnny');
        })
    })
    run();
}, 1000)

