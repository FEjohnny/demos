// 异步测试

module.exports = (name, callback) => {
    process.nextTick(() => callback(`hello ${name}`));
}
