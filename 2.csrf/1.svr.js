const http = require('http');
const fs = require('fs');



const proxy = http.createServer((req, res) => {

    if(req.method == 'POST'){
        req.on('data' , (data)=>{
            console.log('referer :' ,   req.headers.referer);
            console.log('data :' ,   data.toString() , ' cookies:' , req.headers.cookie);
        });

        req.on('end' , (data)=>{
            res.writeHead(200, { 'Content-Type': 'text/html' });

            res.end('');
        })
    } else {
        res.setHeader('Set-Cookie', ['login=1']);

        res.end('');
    }




}).listen(3001);


