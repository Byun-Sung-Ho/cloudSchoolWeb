var mysql = require("mysql");
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "myboard",
});

conn.connect();

const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(8080, function(){
    console.log("port 8080 ready");
});

// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "/public/index.html");
// });

app.get("/list", function (req, res) {
    const rows = conn.query("select * from post", function (err, rows, fields) {
      if (err){

      }else{
        console.log(rows);
        res.send(rows);
      }
    });
});