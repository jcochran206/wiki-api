//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");


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

app.route('/articles')
.get(function(req, res){
  Article.find(function(err, foundArticles){
    res.send(foundArticles);
   });
 })

.post(function(req,res){
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
})

.delete(function(req, res){
   Article.deleteMany(function(err){
     if(!err){
       res.send("successfully deleted all articles");
     }else{
       res.send(err);
     }
   });
});

app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("no articles found");
    }
  });
})

.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully update article");
      }else{
        res.send(err);
      }
    }
  );
})

.patch(function(req,res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: {req.body},
    function(err){
      if(!err){
        res.send(err);
      }else{
        res.send("update successful");
      }
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("successfully deleted");
      }else{
        res.send(err);
      }
    }
  );
});



// app.get('/articles', function(req, res){
//   Article.find(function(err, foundArticles){
//     res.send(foundArticles);
//   });
// });
//
// app.post('/articles', function(req,res){
//
//   const newArticle = new Article ({
//     title : req.body.title,
//      content : req.body.content
//   });
//
//   newArticle.save(function(err){
//     if(!err){
//       res.send("Successfully added a new article");
//     }else{
//       res.send(err);
//     }
//   });
// });
//
// app.delete('/articles', function(req, res){
//   Article.deleteMany(function(err){
//     if(!err){
//       res.send("successfully deleted all articles");
//     }else{
//       res.send(err),
//     }
//   });
// });


app.listen(port, function(){
  console.log(`server started ${port}`);
});
