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
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  }
});

const upload = multer({ storage });
const multiUpload = upload.fields([
  { name: "images", maxCount: 3}
])


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


router.post('/',multiUpload,async(req,res)=>{

    try{ 
         if (req.body.isAvailable){
            req.body.isAvailable=true}
         else{ req.body.isAvailable=false}

        req.body.images = [];

        if (req.files && req.files["images"]) {
        req.files["images"].forEach((file) => {
            req.body.images.push('/uploads/' + file.filename);
        });
        }

        console.log(req.body)
        const createdcloth =await Cloth.create(req.body)
        res.redirect('/cloth/'+createdcloth._id)
    }

    catch(err){
        console.log(err)
        res.render('cloth/new.ejs', { errorMessage: 'Something went wrong. Please try again.' });
    }

})


router.get('/:id',async (req,res)=>{

  console.log(req.params.id)
  const foundCloth =await Cloth.findById(req.params.id)
    res.render('cloth/show.ejs',{foundCloth})
})

router.delete('/:id', async (req, res) => {
  await Cloth.findByIdAndDelete(req.params.id)
  res.redirect('/cloth')
})

router.get('/:id/edit', async (req,res)=>{
  const foundCloth =await Cloth.findById(req.params.id)
    res.render('cloth/edit.ejs',{foundCloth})
})

module.exports = router;