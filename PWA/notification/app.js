/**
 * Created by chenjun on 2018/6/10.
 */

//添加必要的依赖
const webpush = require('web-push');
const express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const app = express();

// Express setup
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


function saveRegistrationDetails(endpoint, key, authSecret) {
    // Save the users details in a DB
}

//设置 VAPID 详情
webpush.setVapidDetails(
    'mailto:contact@deanhume.com',
    'BAyb_WgaR0L0pODaR7wWkxJi__tWbM1MPBymyRDFEGjtDCWeRYS9EF7yGoCHLdHJi6hikYdg4MuYaK0XoD0qnoY',
    'p6YVD7t8HkABoez1CvVJ5bl7BnEdKUu5bSyVjyxMBh0'
);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/sendMessage', function (req, res) {
    var endpoint = req.body.endpoint;
    var authSecret = req.body.authSecret;
    var key = req.body.key;

    const pushSubscription = {
        endpoint: req.body.endpoint,
        keys: {
            auth: authSecret,
            p256dh: key
        }
    };

    var body = 'Breaking News: Nose picking ban for Manila police';
    var iconUrl = 'homescreen.png';

    webpush.sendNotification(pushSubscription,
        JSON.stringify({
            msg: body,
            url: 'http://localhost:3000/',
            icon: iconUrl,
            type: 'actionMessage'
        })).then(result => {
            console.log(result);
            res.sendStatus(201);
        }).catch(err => {
            console.log(err);
        });
});

//监听指向 '/register' 的 POST 请求
app.post('/register', function (req, res) {
    var endpoint = req.body.endpoint;

    //保存用户注册详情，这样我们可以在稍后阶段向他们发送消息
    saveRegistrationDetails(endpoint, key, authSecret);

    //建立 pushSubscription 对象
    const pushSubscription = {
        endpoint: req.body.endpoint,
        keys: {
            auth: req.body.authSecret,
            p256dh: req.body.key
        }
    };
    var body = 'Thank you for registering';
    var iconUrl = 'homescreen.png';

    //发送 Web 推送消息
    webpush.sendNotification(pushSubscription,
      JSON.stringify({
          msg: body,
          url: 'http://localhost:3000/',
          icon: iconUrl
      })
    ).then(function (res) {
        res.sendStatus(201);
    }).catch(function (err) {
        console.log(err);
    });
    res.send('re')
});

app.listen(3000, function () {
    console.log('Web push app listening on port 3000!')
});