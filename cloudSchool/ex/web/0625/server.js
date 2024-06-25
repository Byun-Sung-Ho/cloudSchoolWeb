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
const se = require('express-session');
const sha = require('sha256');
app.use(se(({
  secret: 'abc',
  resave : false,
  saveUninitialized : false
})));

//body-parser 라이브러리 추가
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/book", function (req, res) {
  res.send("도서 목록 관련 페이지입니다.");
});
app.get("/", function (req, res) {
  if(typeof req.session.user!=='undefined' && req.session.user){
    // res.send('login connecting');
    res.render('index.ejs', {user:req.session.user});
  }else{
    res.render('index.ejs', {user:null});
  }
});
app.get("/list", function (req, res) {
  //   conn.query("select * from post", function (err, rows, fields) {
  //     if (err) throw err;
  //     console.log(rows);
  //   });
  list(req, res)
});

function list(req, res){
  mydb
    .collection("post")
    .find()
    .toArray()
    .then((result) => {
      console.log(result);
      res.render("list.ejs", { data: result });
    });
}

//'/enter' 요청에 대한 처리 루틴
app.get("/enter", function (req, res) {
  // res.sendFile(__dirname + '/enter.html');
  res.render("enter.ejs");
});

//'/save' 요청에 대한 post 방식의 처리 루틴
app.post("/save", function (req, res) {
  // console.log(req.body.title);
  // console.log(req.body.content);

  mydb
    .collection("post")
    .insertOne({ title: req.body.title, content: req.body.content, date: req.body.someDate })
    .then((result) => {
      //console.log(result);
      console.log("데이터 추가 성공");
      list(req,res);
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
          // res.redirect('/list');
          list(req, res);
      })
      .catch(err => {
          console.log(err);
          res.status(500).send();
      });
});

//쿠키 테스트
const cp = require('cookie-parser');
app.use(cp('암호화키'));

app.get('/cookie', (req,res)=>{
  let milk = parseInt(req.signedCookies.cookies.milk)+1000;
  if(isNaN(milk)){
    milk=0;
  }
  res.cookie('milk', milk,{signed:true});
  res.cookie('name', 'sungho', {signed:true});
  res.send('cookie setting complete: '+ req.cookies.milk);
});

app.get('/session',(req, res)=>{
  if(isNaN(req.session.milk)){
    req.session.milk = 0;
  }

  req.session.milk = req.session.milk +1000;
  res.send('session: '+req.session.milk + 'won');
})

app.get('/login', (req, res)=>{
  if(req.session.user){
    // res.send('login connecting');
    res.render('index.ejs', {user:req.session.user});
  }else{
    res.render('login.ejs');
  }
})

app.post('/login', (req, res)=>{
  console.log(req.body.userid +'/'+req.body.userpw);

  mydb.collection('account')
  .findOne({userid : req.body.userid})
  .then(result =>{
    console.log(result.userpw);
    if(result!=null && req.body.userpw == result.userpw){
      req.session.user = req.body;

      // res.send('access success');
      res.render('index.ejs',{user:req.session.user});
    }else{
      // res.send('access fail');
      res.render('login.ejs');
    }
  }).catch(err=>{
    res.send('access fail');
    res.status(500).send();
  })
})

app.get('/logout', (req,res)=>{
  req.session.destroy();
  // res.redirect('/');4
  res.render('index.ejs', {user:null});
})

app.get('/signup', (req,res)=>{
  res.render('signup.ejs');
})

app.post('/signup', (req,res)=>{
  mydb.collection('account')
  .insertOne({
    userid : req.body.userid,
    userpw : sha(req.body.userpw),
  })
  .then((result =>{
    res.redirect('/');
  }))
})

app.get('/bank', (req,res)=>{
  if(typeof req.session.user != `undefined`){
    res.send(`${req.session.user.userid}님 자산 현황`);
  }else{
    res.send('로그인 먼저 해주세요!');
  }
})