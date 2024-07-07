// const dotenv = require('dotenv').config();

// const { MongoClient } = require('mongodb');
// const mysql = require('mysql2');

// let mongodb;
// let mysqldb;
// let client;

// const setup = async () => { 
//     if (mongodb && mysqldb) {
//         return { mongodb, mysqldb };
//     }

//     try {
//         const mongoDbUrl = process.env.MONGO_DB_URL;
//         const client = new MongoClient(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
//         const mongoConn = await client.connect();

//         mongodb = mongoConn.db(process.env.MONGO_DB);
//         console.log("몽고DB 접속 성공");

//         mysqldb = mysql.createConnection({
//             host: process.env.MYSQL_HOST,
//             user: process.env.MYSQL_USER,
//             password: process.env.MYSQL_PASSWORD,
//             database: process.env.MYSQL_DB
//         });
//         mysqldb.connect();
//         console.log("MySQL 접속 성공");

//         return { mongodb, mysqldb, client};
//     } catch (err) {
//         console.error("DB 접속 실패", err);   
//         throw err;
//     }
// };


// module.exports = setup;

const dotenv = require('dotenv').config();
const {MongoClient} = require('mongodb');
const mysql = require('mysql2');

let mongodb;
let mysqldb;

const setup = async () => {
    if(mongodb && mysqldb){
        return {mongodb, mysqldb};
    }
    try{
    const mongoDbUrl = process.env.MONGODB_URL;
    const mongoConn = await MongoClient.connect(mongoDbUrl, 
                        {
                            useNewUrlParser:true,
                            useUnifiedTopology:true
                        });
    mongodb = mongoConn.db(process.env.MONGODB_DB);
    console.log("몽고 DB 접속 성공");
    
    mysqldb = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        port: process.env.MYSQL_PORT,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB
    });
    mysqldb.connect();
    console.log("MySQL 접속 성공");

    return {mongodb, mysqldb};
    }catch(err) {
        console.error("DB 접속 실패", err);
        throw err;
    }
};

module.exports = setup; 