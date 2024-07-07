const dotenv = require("dotenv").config();
const setup = require("./db_setup");
const express = require("express");
const app = express();
const { MongoClient } = require('mongodb');

///////////// session 설정
const session = require("express-session");
app.use(
  session({
    secret: "암호화키",
    resave: false,
    saveUninitialized: false,
  })
);

//////////// cookie 설정
const cookieParser = require("cookie-parser");
app.use(cookieParser());


////////////// body-parser 라이브러리 추가
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));


//라우팅 
app.get("/", (req, res) => {
  res.render("index.ejs");
});
// //라우팅 포함하는 코드
// app.use('/', require('./routes/account.js')); 
// app.use('/', require('./routes/post'));

app.listen(process.env.WEB_PORT, async () => {
  await setup();
  console.log("8080 서버가 준비되었습니다...");
});


async function runTransaction() {
  const client = new MongoClient(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

    let session;
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        session = client.startSession();
        console.log('Session started');

        const db = client.db('test'); // Replace 'test' with your database name
        const collection1 = db.collection('collection2'); // Replace with your collection name
        const collection2 = db.collection('collection2'); // Replace with your collection name

        session.startTransaction();
        console.log('Transaction started');

        // Perform multiple operations as part of the transaction
        await collection1.insertOne({ name: 'Alice', age: 30 }, { session });
        console.log('Inserted into collection1');

        await collection2.insertOne({ name: 'Bob', age: 25 }, { session });
        console.log('Inserted into collection2');

        // Commit the transaction
        await session.commitTransaction();
        console.log('Transaction committed');
    } catch (error) {
        console.error('Transaction aborted due to error:', error);
        if (session && session.inTransaction()) {
            await session.abortTransaction();
            console.log('Transaction aborted');
        }
    } finally {
        if (session) {
            session.endSession();
            console.log('Session ended');
        }
        await client.close();
        console.log('Client closed');
    }
}
app.get('/trTEST', async(req, res)=>{
  const { mongodb, mysqldb } = await setup();

  mysqldb.beginTransaction((err) => {
    if (err) {
      return mysqldb.rollback(() => {
        throw err;
      });
    }
  
    mysqldb.query('INSERT INTO testing VALUES (?, ?)', [null, 'john@example.com'], (err, results) => {
      if (err) {
        return mysqldb.rollback(() => {
          throw err;
        });
      }
  
      const userId = results.insertId;
  
      mysqldb.query('INSERT INTO testing VALUES (?, ?)', [null, 'Laptop'], (err, results) => {
        if (err) {
          return mysqldb.rollback(() => {
            throw err;
          });
        }
  
        mysqldb.commit((err) => {
          if (err) {
            return mysqldb.rollback(() => {
              throw err;
            });
          }
          console.log('Transaction Completed Successfully.');
          mysqldb.end();
        });
      });
    });
  });
})