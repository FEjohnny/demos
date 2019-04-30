// promise 异步测试

module.exports = (name) => {
    return new Promise(resolve => resolve(`hello ${name}`));
}
