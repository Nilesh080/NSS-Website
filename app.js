const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const collection = require("./mongodb")
const path = require("path")


// app.set("view engine","ejs")


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = " Mervis:9004742917     Antara:9004742917      Anujeet:9004742917     Nilesh:9004742917";

const app = express();
app.use(express.json())

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = []; 
// add below
app.use(express.urlencoded({extended:false}))

app.get("/",function(req , res){
  res.render("login")
})

app.get("/signup",function(req,res){
  res.render("signup")
})

app.post("/signup", async (req,res)=>{
  const data={
    name:req.body.name,
    password:req.body.password
  }
  await collection.insertMany([data])
  res.render("home" , {startingContent:homeStartingContent ,
    posts:posts});
})

app.post("/login", async (req,res)=>{
  
  try{
    const check=await collection.findOne({name:req.body.name})
    if(check.password === req.body.password){
      res.render("home" , {startingContent:homeStartingContent ,
        posts:posts});
    }
    else{
      res.send("Wrong password")
    }
   
  }
  catch{
    res.send("wrong details")
  }

  
})
//add above

// app.get("/" , function(req , res){
//   res.render("home" , {startingContent:homeStartingContent ,
//                       posts:posts});
  
// }); 

app.get("/about" , function(req,res){
  res.render("about" , {aboutContent:aboutContent});
});

app.get("/contact" ,function(req , res){
  
res.render("contact" , {contactContent:contactContent});
  
});

app.get("/compose" , function(req , res){
  res.render("compose");
})
app.post("/compose" , function(req ,res){
  const post = {
    title:req.body.postTitle,
    content:req.body.postBody
  }; 
  posts.push(post);
  res.redirect("/");
})

app.get("/posts/:postName", function(req , res){
  const requiredTitle = _.lowerCase(req.params.postName);
  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);
    if(requiredTitle === storedTitle){
      res.render("post" , {
        title:post.title, 
        content:post.content
      })
    } 
  })
})



app.listen(3000, function() {
  console.log("Server started on port 3000 and Port connected");
});
