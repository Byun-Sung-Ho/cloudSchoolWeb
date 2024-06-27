const router = require("express").Router();
const setup = require("../db_setup");
const sha = require("sha256");

router.get("/account/enter", (req, res) => {
  res.render("enter.ejs");
});

router.post("/account/save", async (req, res) => {
  console.log(req.body); // Add this line for debugging
  const { mongodb, mysqldb } = await setup();
  mongodb
    .collection("account")
    .findOne({ userid: req.body.userid })
    .then((result) => {
      if (result) {
        res.render("enter.ejs", { data: { msg: "ID가 중복되었습니다" } });
      } else {
        const generateSalt = (length = 16) => {
          const crypto = require('crypto');
          return crypto.randomBytes(length).toString("hex");
        };

        const salt = generateSalt();
        req.body.userpw = sha(req.body.userpw + salt);
        mongodb
          .collection("account")
          .insertOne(req.body)
          .then((result) => {
            if (result) {
              console.log("회원가입 성공");

              //MySQL에 salt를 저장
              const sql = `INSERT INTO UserSalt (userid, salt)
                    VALUES (?,?)`;
              mysqldb.query(sql, [req.body.userid, salt], (err, result2) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("salt 저장 성공");
                }
              });
              res.redirect("/");
            } else {
              console.log("회원가입 fail");
              res.render("enter.ejs", { data: { alertMsg: "회원가입 fail" } });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send();
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
});

module.exports = router;