// const http = require('http');

// const server = http.createServer((req, res)=>{
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     res.end('<h1>hello world</h1>');
// });

// server.listen(3000, '127.0.0.1', ()=>{
//     console.log('server ready...');
// })

const express = require('express');
const app = express();

app.listen(8080, function(){
    console.log("port 8080 ready");
});

app.get(
    '/book', function(req,res){
        res.send('도서 목록 관련 페이지입니다.');
    }
)

app.get(
    '/', function(req,res){
        res.sendFile('C:/Users/SUNGHO/Documents/GitHub/cloudSchoolWeb/cloudSchool/ex/web/0613/index.html');
    }
)