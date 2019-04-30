require('should');
const mylib = require('../index1');

// describe干的事情就是给测试用例分组
describe('my first test', () => {
    // it()函数定义了一个测试用例，通过Should.js提供的api，可以非常语义化的描述测试用例
    it('should get "hello tmall"', () => {
        mylib('tmall').should.be.eql('hello tmall');
    });
});
