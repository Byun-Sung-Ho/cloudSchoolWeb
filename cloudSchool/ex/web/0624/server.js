const mongoclient = require("mongodb").MongoClient;
const ObjId = require("mongodb").ObjectId;
const url = `mongodb+srv://admin:root@cluster0.cvqfjh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
let mydb;
mongoclient
  .connect(url)
  .then((client) => {
    mydb = client.db("myboard");
    // mydb.collection('post').find().toArray().then(result =>{
    //     console.log(result);
    // })
    console.log("mongodb ok ");
    app.listen(8080, function () {
      console.log("포트 8080으로 서버 대기중 ... ");
    });
  })
  .catch((err) => {
    console.log(err);
  });

const express = require("express");
const app = express();

//body-parser 라이브러리 추가
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/book", function (req, res) {
  res.send("도서 목록 관련 페이지입니다.");
});
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/list", function (req, res) {
  //   conn.query("select * from post", function (err, rows, fields) {
  //     if (err) throw err;
  //     console.log(rows);
  //   });
  mydb
    .collection("post")
    .find()
    .toArray()
    .then((result) => {
      console.log(result);
      res.render("list.ejs", { data: result });
    });
});

//'/enter' 요청에 대한 처리 루틴
app.get("/enter", function (req, res) {
  // res.sendFile(__dirname + '/enter.html');
  res.render("enter.ejs");
});

//'/save' 요청에 대한 post 방식의 처리 루틴
app.post("/save", function (req, res) {
  console.log(req.body.title);
  console.log(req.body.content);

  mydb
    .collection("post")
    .insertOne({ title: req.body.title, content: req.body.content, date: req.body.someDate })
    .then((result) => {
      //console.log(result);
      console.log("데이터 추가 성공");
      res.send("데이터 추가 성공");
    });  
});

app.post("/delete", function (req, res) {
  console.log(req.body);
  req.body._id = new ObjId(req.body._id);
  mydb
    .collection("post")
    .deleteOne(req.body)
    .then((result) => {
      console.log("삭제완료");
      res.status(200).send();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
});

app.get('/content/:_id', (req, res) => {
  console.log(req.params._id);
  mydb.collection('post')
    .findOne({_id:new ObjId(req.params._id)})
    .then(result => {
      res.render('content.ejs',{data:result});
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
  
});

app.post('/update', (req, res) => {
  console.log(req.body);
  mydb.collection('post')
      .updateOne(
          { _id: new ObjId(req.body._id) },
          { $set: { title: req.body.title, content: req.body.content, date: req.body.someDate } }
      )
      .then(result => {
          res.redirect('/list');
      })
      .catch(err => {
          console.log(err);
          res.status(500).send();
      });
});