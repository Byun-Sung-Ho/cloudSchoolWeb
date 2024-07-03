const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');


const url = 'mongodb+srv://admin:root@cluster0.cvqfjh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

let mydb;
mongoClient.connect(url)
    .then(client => {
        console.log('mongodb connect success!');
        mydb = client.db('myboard');
        // mydb.collection('post').find().toArray()
        //     .then(result => {
        //         console.log(result);
        //     });
        app.listen(8080, function(){
            console.log('server is ready');
        })
    }).catch( err => {
        console.log(err);   
    });

app.get('/list', function(req, res){
    mydb.collection('post').find().toArray()
            .then(result => {
                console.log(result);
                // res.sendFile(__dirname+'/list.html');
                res.render('list.ejs', {data:result});
            });
});


//
app.get('/enter', function(req, res){
    res.sendFile(__dirname + '/enter.html');
})

app.post('/save', function(req, res){
    mydb.collection('post').insertOne({
        title : req.body.title,
        content : req.body.content
    }).then(result => {
        console.log('저장완료', result);
        res.send('ok');
    }
    )
})