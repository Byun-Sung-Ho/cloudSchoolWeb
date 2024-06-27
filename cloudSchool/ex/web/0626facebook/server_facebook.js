// const https = require('https');
// const fs = require('fs');
// const express = require('express');
// const mongoclient = require('mongodb').MongoClient;
// const ObjId = require("mongodb").ObjectId;
// const app = express();
// const url = `mongodb+srv://admin:root@cluster0.cvqfjh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// let mydb;
// const options = {
//     keys:fs.readFileSync('server.key'),
//     cert:fs.readFileSync('server.cert')
// }
// const passport = require("passport");
// const session = require("express-session");

// //DB & https연결
// mongoclient.connect(url)    
//     .then(client =>{
//         mydb = client.db("faccount");
//         console.log("mongodb ok ");

//         https.createServer(options, app).listen(443, ()=>{
//             console.log('https server is runnung on port 443');
//         });
//     })
//     .catch(err=>{
//         console.log(err);
//     });

// //session
// app.use(
//   session({
//     secret: "암호화키",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// ////// facebook 인증
// const FacebookStrategy = require("passport-facebook");

// app.get("/facebook", passport.authenticate("facebook"));
// app.get('/facebook/callback', passport.authenticate('facebook', {
//     successRedirect:'/',
//     // failureRedirect: '/fail'
// }),
//     (req,res)=>{}
// )

// passport.use(new FacebookStrategy(
//     {
//         clientID: '1534468477418804',
//         clientSecret:'b475338a061e72ed9e1240c33788933a',
//         callbackURL:'/facebook/callback'
//     },
//     (accessToken, refreshToken, profile, done)=>{
//         console.log('2',profile);
//         var authKey = 'facebook'+profile.id;
//         var authName = profile.displayName;

//         mydb.collection('faccount').findOne({userkey:authKey})
//         .then(result=>{
//             console.log('3', result);
//             if(result!=null){
//                 console.log('found facebook user on myDB');
//                 done(null, result);
//             }
//             else{
//                 console.log('3-1 Can not found facebook user on myDB');
//                 mydb.collection('faccount').insertOne({
//                     userkey: authKey,
//                     userid: authName
//                 })
//                 .then(insertResult => {
//                     if(insertResult != null){
//                         console.log('3-2 facebook userinfo save complete');
//                         mydb.collection('faccount').findOne({userkey:authKey})
//                         .then(result2=>{
//                             if(result2 != null){
//                                 console.log('3-3 save and refind');
//                                 done(null, result2);
//                             }
//                         })
//                         .catch(err=>{
//                             console.log(err);
//                         });
//                     }
//                 })
//                 .catch(err=>{
//                     console.log(err);
//                 });
//             }
//         })
//         .catch(err=>{
//             console.log(err);
//         });
//     }
// ));

// passport.serializeUser((user, done)=>{
//     try {
//         console.log("4 serializeUser", user);   
//         done(null, user);
//     }
//     catch (err) {
//         console.log(err);
//     }
// })

// passport.deserializeUser((user, done) => {
//     console.log("5.deserializeUser", user);
  
//     mydb
//       .collection("account")
//       .findOne({ userkey: user.userkey })
//       .then((result) => {
//         console.log(result);
//         done(null, result);
//       });
// });

// app.get('/', (req, res)=>{
//     console.log("/ 요청");

//     try{
//         console.log("1", req.session.passport);
//         if(typeof req.session.passport != undefined && req.session.passport.user){
//             res.render("index.ejs", { data: req.session.passport });
//         }
//         else{
//             res.render("index.ejs", { data: null });
//         }
//     }
//     catch{
//         console.log('1-1');
//         res.render("index.ejs", { data: null });
//     }
// });


// app.get('/login', (res,req)=>{
//     res.render('login.ejs');
// })

const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();

// SSL 인증서와 키 파일 읽기
let options;
try {
    options = {
        key: fs.readFileSync(__dirname + "/server.key"),
        cert: fs.readFileSync(__dirname + "/server.cert"),
    };
} catch (error) {
    console.error("Failed to read SSL certificate or key:", error);
    process.exit(1);
}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const mongoclient = require("mongodb").MongoClient;
const url = `mongodb+srv://admin:root@cluster0.cvqfjh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let mydb;
mongoclient
    .connect(url)
    .then((client) => {
        console.log("몽고DB 접속 성공");
        mydb = client.db("faccount");

        // HTTPS 서버 생성
        https.createServer(options, app).listen(443, () => {
            console.log("HTTPS Server running on port 443");
        });
    })
    .catch((err) => {
        console.error("몽고DB 접속 실패:", err);
    });

//////// passport 등록
const passport = require("passport");

const session = require("express-session");
app.use(
    session({
        secret: "암호화키",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

////// facebook 인증
const FacebookStrategy = require("passport-facebook");

app.get("/facebook", passport.authenticate("facebook"));

app.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/",
        failureRedirect: "/fail",
    }),
    (req, res) => {}
);

passport.use(
    new FacebookStrategy(
        {
            clientID: '1534468477418804',
            clientSecret:'b475338a061e72ed9e1240c33788933a',
            callbackURL:'/facebook/callback'
        },
        function (accessToken, refreshToken, profile, done) {
        console.log("2", profile);
        const authkey = "facebook" + profile.id;
        const authName = profile.displayName;

        mydb
            .collection("faccount")
            .findOne({ userkey: authkey })
            .then((result) => {
            console.log("3", result);
            if (result != null) {
                console.log("페이스북 사용자를 우리 DB에서 찾았음");
                done(null, result);
            } else {
                console.log("3-1 페이스북 사용자를 우리 DB에서 못찾았음");
                mydb
                .collection("faccount")
                .insertOne({
                    userkey: authkey,
                    userid: authName,
                })
                .then((insertResult) => {
                    if (insertResult != null) {
                    console.log("3-2 페이스북 사용자를 우리 DB에 저장 완료");
                    mydb
                        .collection("faccount")
                        .findOne({ userkey: authkey })
                        .then((result2) => {
                        if (result2 != null) {
                            console.log("3-3 페이스북 사용자를 우리 DB에 저장 후 다시 찾았음");
                            done(null, result2);
                        }
                        })
                        .catch((err) => {
                        console.log(err);
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            }
            })
            .catch((err) => {
            console.log(err);
            //done(null, false, err);
            });    
        }
    )
);

passport.serializeUser(function (user, done) {
    try {
        console.log("4 serializeUser", user);   
        done(null, user);
    } catch (err) {
        console.log(err);
    }
});

passport.deserializeUser(function (user, done) {
    console.log("5.deserializeUser");

    mydb
    .collection("faccount")
    .findOne({ userkey: user.userkey })
    .then((result) => {
    console.log(result);
    done(null, result);
    });
});


app.get("/", (req, res) => {
    console.log("/ 요청");
    try {
        console.log("1", req.session.passport);
        if (typeof req.session.passport != undefined && req.session.passport.user) {
        res.render("index.ejs", { data: req.session.passport });
        } else {
        res.render("index.ejs", { data: null });
        }
    } catch (err) {
        console.log('1-1');
        res.render("index.ejs", { data: null });
    }
});

///////// login
app.get("/login", (req, res) => {
    console.log("/login", req.session.passport);
    res.render("login.ejs");
});
