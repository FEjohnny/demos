require('should');

const mylib = require('../index4');


describe('promise test', () => {
    it('wellecom to promiseJohnny', () => {
        // Should.js在8.x.x版本自带了Promise支持，可以直接使用fullfilled()、rejected()、fullfilledWith()、
        // rejectedWith()等等一系列API测试Promise对象。
        // 使用should测试Promise对象时，请一定要return，一定要return，一定要return，否则断言将无效
        return mylib('promiseJohnny').should.be.fulfilledWith('hello promiseJohnny');
    })
})
