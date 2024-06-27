const setup = require("./db_setup");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for logging incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/', require('./routes/account.js'));

app.listen(8080, async () => {
  await setup();
  console.log("8080 서버가 준비되었습니다...");
});

app.get("/", (req, res) => {
  res.render('index.ejs');
});