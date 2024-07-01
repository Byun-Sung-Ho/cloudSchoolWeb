const express = require('express');
const mysql = require('mysql');

const app = express();

const conn = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "root",
    database: "myboard"
});
conn.connect();

app.use(express.static('static'));

app.listen(8080, function(){
    console.log("server open...");
})

