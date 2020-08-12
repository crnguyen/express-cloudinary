require("dotenv").config();  //requires dotevn
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const multer = require("multer");
const upload = multer({dest: "./uploads"})
const cloudinary = require("cloudinary");
const db = require("./models");

app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.static("static")); //reference the static folder
cloudinary.config(process.env.CLOUDINARY_URL)

app.get('/', function(req, res) {
  res.render('index');
});

//cloudinary requires special syntax
//post route grabbing cloudinary data
app.post("/", upload.single("myFile"), (req,res)=>{
  cloudinary.uploader.upload(req.file.path,(result)=>{
    db.cloudpic.findOrCreate({
      where: {
        url: result.url
      }
    })
    .then(()=>{
      res.redirect("/show")
    })
    .catch(err=>{
      console.log("error",err)
    })
    })
    //res.send(result);
  })

app.get("/show", (req,res)=>{
  db.cloudpic.findAll()
  .then(myPics=>{
    res.render("show", {myPics})
  })
  .catch(err=>{

  })

})
app.listen(3000);
