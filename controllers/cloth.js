const express = require('express');
const router = express.Router();
const Cloth =require("../models/cloth")
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('public', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });


router.get('/',async(req,res)=>{
    try{
        const allCloth= await Cloth.find()
        res.render('cloth/index.ejs',{allCloth})}
    catch (error) {
    console.error(error);
    res.send("Error loading clothes");}
})


router.get('/new',(req,res)=>{
    res.render('cloth/new.ejs')
})


router.post('/cloth',upload.array('image'),async(req,res)=>{

    try{ 
         if (req.body.isAvailable){
            req.body.isAvailable=true}
         else{ req.body.isAvailable=false}

        if (req.files && req.files.length > 0) {
        req.body.images = req.files.map(file => '/uploads/' + file.filename);}

        console.log(req.body)
        const createdcloth =await Cloth.create(req.body)
        res.redirect('/cloth/'+createdcloth._id)}

    catch(err){
        console.log(err)
        res.render('cloth/new.ejs', { errorMessage: 'Something went wrong. Please try again.' });
    }

})




module.exports = router;