// 多分枝测试

module.exports = (name) => {
    if (name === 'johnny') {
        return new Promise(resolve => resolve(`hello ${name}`));
    }
    return new Promise(resolve => resolve(`hello ${name}`));
}
