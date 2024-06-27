const router = require('express').Router;

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

  app.get("/enter", function (req, res) {
    // res.sendFile(__dirname + '/enter.html');
    res.render("enter.ejs");
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
  