require('should');

const mylib = require('../index3');


describe('async test', () => {
    // 这里传入it的第二个参数的函数新增了一个done参数，当有这个参数时，
    // 这个测试用例会被认为是异步测试，只有在done()执行时，才认为测试结束。
    // 那如果done()一直没有执行呢？Mocha会触发自己的超时机制，超过一定时间（默认是2s，
    // 时长可以通过--timeout参数设置）就会自动终止测试，并以测试失败处理。
    it('wellecom to asyncJohnny', done => {
        mylib('asyncJohnny', (rst) => {
            rst.should.be.eql('hello asyncJohnny');
            done();
        })
    })
})
