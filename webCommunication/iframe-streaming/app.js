
const express = require('express');
let app = new express();
app.use(express.static('./'));
let num = 0;
let currNum = null;
const timer1 = setInterval(() => {
    num++;
    console.log(num);
}, 3000)
app.listen(3000,() => {
    console.log('listen port 3000');
});
app.get('/',function (req, res) {
    res.sendfile('./index.html');
});
app.get('/message',function (req, res) {
    num = 0;
    const timer = setInterval(() => {

        if(num !== currNum) {
            res.write(
                '<script type=\"text/javascript\">parent.process("'
                + num.toString() + '")</script>'
            );
            currNum = num;
        }
        if(num > 9) {
            clearInterval(timer1);
            clearInterval(timer);
            res.end();
        }
    },1000);
});