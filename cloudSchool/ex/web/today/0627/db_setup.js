const { MongoClient } = require("mongodb");
const mysql = require("mysql2");

let mongodb;
let mysqldb;

const setup = async () => {
  if (mongodb && mysqldb) {
    return { mongodb, mysqldb };
  }

  try {
    // 몽고DB 접속
    const mongoDbUrl = `mongodb+srv://admin:root@cluster0.cvqfjh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    const mongoConn = await MongoClient.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    mongodb = mongoConn.db("myboard");
    console.log("몽고DB 접속 성공");

    // MySQL 접속
    mysqldb = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "myboard",
    });
    mysqldb.connect();
    console.log("MySQL 접속 성공");

    return { mongodb, mysqldb };
  } catch (err) {
    console.error("DB 접속 실패", err);
    throw err;
  }
};

module.exports = setup;