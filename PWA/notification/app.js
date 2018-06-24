/**
 * Created by chenjun on 2018/6/10.
 */

//添加必要的依赖
const webpush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase'); // 倒入google firebase模块
const path = require('path');
const app = express();

// Express setup
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Initialize Firebase
// https://console.firebase.google.com/project/notificationtest-42518/overview?hl=zh-cn
const config = {
    apiKey: "AIzaSyBygaa3EvEQboDzNdNez9EodI9xPjXLPFA",
    authDomain: "notificationtest-42518.firebaseapp.com",
    databaseURL: "https://notificationtest-42518.firebaseio.com",
    projectId: "notificationtest-42518",
    storageBucket: "notificationtest-42518.appspot.com",
    messagingSenderId: "809106520866"
};
firebase.initializeApp(config);


var vapidKeys = webpush.generateVAPIDKeys(); // 生成公私钥

//设置 VAPID 详情,设置公私钥
webpush.setVapidDetails(
    'localhost:3000',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);
// webpush.setGCMAPIKey('AIzaSyBygaa3EvEQboDzNdNez9EodI9xPjXLPFA');

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/publicKey', function (req, res) {
    res.send(vapidKeys.publicKey);
})

app.post('/register', function (req, res) {
    var endpoint = req.body.endpoint;
    var key = req.body.key;
    var authSecret = req.body.authSecret;

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
    res.send('success');
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
        console.log('推送消息成功：' + result);
        res.sendStatus(201);
    }).catch(err => {
        console.log('推送消息失败：' + err);
    });
});


app.listen(3000, function () {
    console.log('Web push app listening on port 3000!')
});