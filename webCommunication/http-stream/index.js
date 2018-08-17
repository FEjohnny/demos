const express = require('express');
const app = new express();
app.use(express.static('./'));
let num = -1;
let currNum = null;
setInterval(() => {
    num++;
    console.log(num);
}, 3000)
app.get('/', (req, res) => {
    res.sendFile('./index.html');
    res.end();
});
app.get('/message', (req, res) => {
    res.header('content-type', 'multipart/octet-stream');
    setInterval(() => {
        if(num !== currNum) {
            res.write(num.toString());
            currNum = num;
        }
        if(num > 9) {
            res.end();
        }
    },1000);
});

app.listen(8081, ()=>{
   console.log('app running at http://localhost:8081');
});