const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
var objectid = require('mongodb').ObjectId;


const url = 'mongodb+srv://admin:root@cluster0.cvqfjh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
// app.set('views', path.join(__dirname, 'templates'));
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
    res.render('enter.ejs');
})

app.post('/save', function(req, res){
    mydb.collection('post').insertOne({
        title : req.body.title,
        content : req.body.content,
        date : req.body.someDate
    }).then(result => {
        console.log('저장완료', result);
        res.send('ok');
    }
    )
})

app.post('/delete', function(req, res){
    console.log(req.body._id);
    req.body._id = new objectid(req.body._id);
    console.log(req.body._id);
    mydb.collection('post').deleteOne(req.body)
    .then(result => {
        console.log(req.body, "delete success");
        res.status(200).send();
    })
    .catch(err =>{
        console.log(err);
        res.status(500).send();
    });
})

app.get('/content/:_id', (req, res)=>{
    let objId = new objectid(req.params._id);
    console.log(objId);
    mydb.collection('post').findOne({_id:objId})
    .then(result =>{
        console.log(result);
        res.render('content.ejs', {data:result});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).send();
    })
})

app.get('/edit/:_id',(req, res)=>{
    let objId = new objectid(req.params._id);
    mydb.collection('post').findOne({_id:objId})
    .then(result =>{
        console.log(result);
        res.render('edit.ejs', {data:result});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).send();
    })
})

app.post('/edit',(req,res)=>{
    mydb.collection('post').updateOne(
    {
        _id : new objectid(req.body._id)
    },
    {
        $set:{
            title : req.body.title,
            content : req.body.content,
            date : req.body.someDate   
        }
    })
    .then(result => {
        console.log('수정완료', result);
        res.redirect('/list');
    })
    .catch(err=>{
        console.log(err);
    })
})