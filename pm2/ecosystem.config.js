module.exports = {
    apps: [{
        name: 'workder1', // 应用进程名称
        script: '/Users/chenjun/Documents/personal/demos/pm2/workder1.js', //  启动脚本路径
        cwd: '/Users/chenjun/Documents/personal/demos/pm2/', //  应用启动的路径
        interpreter: '', //  指定的脚本解释器
        out_file: '', //  日志保存路径
        error_file: '', //  错误日志路径

        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        exec_mode: "cluster_mode", // 执行模式
        instances: 2, // 启动实力个数， 仅在cluster模式有效，默认为fork
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],
};
