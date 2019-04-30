require('should');
const mylib = require('../index5');

describe('多分支测试', () => {
    it('wellecom to johnny', () => {
        // Should.js在8.x.x版本自带了Promise支持，可以直接使用fullfilled()、rejected()、fullfilledWith()、
        // rejectedWith()等等一系列API测试Promise对象。
        // 使用should测试Promise对象时，请一定要return，一定要return，一定要return，否则断言将无效
        return mylib('johnny').should.be.fulfilledWith('hello johnny');
    });
    it('wellecom to tmall', () => {
        // Should.js在8.x.x版本自带了Promise支持，可以直接使用fullfilled()、rejected()、fullfilledWith()、
        // rejectedWith()等等一系列API测试Promise对象。
        // 使用should测试Promise对象时，请一定要return，一定要return，一定要return，否则断言将无效
        return mylib('tmall').should.be.fulfilledWith('hello tmall');
    });
})
