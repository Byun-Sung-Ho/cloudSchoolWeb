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

app.use(express.static('static'));

app.listen(8080, function(){
    console.log("port 8080 ready");
});

// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "/public/index.html");
// });

app.get("/list", function (err, req, res) {
    const rows = conn.query("select post.id, post.title, profile.writer, email, content, created from post left join profile on post.profile_id = profile.id;", function (err, rows, fields) {
      if (err){
        throw err;
      }else{
        console.log(rows);
        res.send(rows);
      }
    });
});

app.get("/a", function (req, res) {
  const rows = conn.query("select content from post", function (err, rows, fields) {
    if (err){
    }else{
      console.log(rows);
      res.send(rows);
    }
  });
});