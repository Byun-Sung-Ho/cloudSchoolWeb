// express 불러오기
const express = require("express");
// express 인스턴스 생성
const app = express();
// 포트 정보
const port = 8080;
const session = require('express-session');
app.use(session({
  secret: 'your-secret-key', // 세션 암호화에 사용되는 키
  resave: false, // 세션을 언제나 저장할지 설정
  saveUninitialized: false // 초기화되지 않은 세션을 저장할지 설정
}));

// 라우트 설정
// HTTP GET 방식으로 '/' 경로를 요청하였을 때
// Hello World!라는 문자열을 결과값으로 보냄
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// MongoDB접속
const mongoclient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://admin:root@cluster0.cvqfjh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let mydb;
mongoclient
  .connect(url)
  .then((client) => {
    console.log("몽고 DB 접속 성공");
    mydb = client.db("myboard");

    // 서버 실행
    app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
const cors = require("cors");
app.use(cors());

app.post("/insertMember", function (req, res) {
  mydb
    .collection("member")
    .findOne({ id: req.body.id })
    .then((result) => {
      if (result) {
        res.json({ msg: "가입 실패 : 중복된 아이디입니다" });
      } else {
        mydb
          .collection("member")
          .insertOne({
            id: req.body.id,
            pw: req.body.pw,
            name: req.body.name,
            register_date: new Date(),
          })
          .then((result) => {
            res.json({ msg: "회원 가입 되셨습니다" });
          })
          .catch((err) => {
            console.log(err);
            res.json({ msg: "회원 가입 실패 : 서버 오류" });
          });
      }
    })
    .catch((err) => {
      res.json({ msg: "회원 가입 실패 : 서버 오류" });
    });
});

app.post("/login", function (req, res) {
  console.log(req.body);

  mydb
    .collection("member")
    .findOne({ id: req.body.id, pw: req.body.pw })
    .then((result) => {
      if (result) {
        res.json({ msg: "login ok" });
      } else {
        res.json({ msg: "로그인 실패 : ID와 PW를 확인해 주세요" });
      }
    })
    .catch((err) => {
      res.json({ msg: "회원 가입 실패 : 서버 오류" });
    });
});
