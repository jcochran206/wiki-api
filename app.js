//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose connection
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

// article schema
const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model('Article', articleSchema);

app.get('/articles', function(req, res){
  Article.find(function(err, foundArticles){
    res.send(foundArticles);
  });
});

app.post('/articles', function(req,res){

  const newArticle = new Article ({
    title : req.body.title,
     content : req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article");
    }else{
      res.send(err);
    }
  });
});


app.listen(port, function(){
  console.log(`server started ${port}`);
});
