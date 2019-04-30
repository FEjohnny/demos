require('should');
const mylib = require('../index2');
let name = 'none';

// describe干的事情就是给测试用例分组
describe('my second test', () => {
    describe('welcome to Tmall', () => {
        before(() => name ='Tmall'); // before会在每个分组的所有测试用例运行前
        after(() => name ='none'); // after则会在所有测试用例运行后执行
        it('should be "hello Tmall"', () => {
            mylib(name).should.be.eql('hello Tmall');
        });
    });
    describe('welcome to johnny', () => {
        before(() => name = 'johnny');
        after(() => name = 'none');
        it('should be "hello johnny"', () => {
            mylib(name).should.be.eql('hello johnny');
        });
    })
});
