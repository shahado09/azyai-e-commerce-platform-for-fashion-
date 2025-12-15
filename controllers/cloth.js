const express = require('express');
const router = express.Router();
const Cloth =require("../models/cloth")
const multer = require('multer');
const path = require('path');
const { isSignedIn, isVendorOrAdmin, ownsClothOrAdmin } = require("../middleware/access-control");

// mutler
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

// index
router.get('/',async(req,res)=>{
    try{
        const allCloth= await Cloth.find()
        res.render('cloth/index.ejs',{allCloth})}
    catch (error) {
    console.error(error);
    res.send("Error loading clothes");}
})

// new
router.get('/new', isSignedIn ,isVendorOrAdmin ,(req,res)=>{
    res.render('cloth/new.ejs')
})

// create
router.post('/', isSignedIn ,isVendorOrAdmin, multiUpload,async(req,res)=>{

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

        req.body.userId = req.session.user._id;
        console.log(req.body)
        const createdcloth =await Cloth.create(req.body)
        res.redirect('/cloth/'+createdcloth._id)
    }

    catch(err){
        console.log(err)
        res.render('cloth/new.ejs', { errorMessage: 'Something went wrong. Please try again.' });
    }

})


// show
router.get('/:id',async (req,res)=>{

  console.log(req.params.id)
  const foundCloth =await Cloth.findById(req.params.id)

  const isSignedIn = !!req.session.user; 

  const isAdmin = isSignedIn && req.session.user.role === "admin";

  const isOwner = isSignedIn && req.session.user.role === "vendor" && foundCloth.userId.equals(req.session.user._id);

  res.render('cloth/show.ejs',{foundCloth,isOwner,isAdmin})
})


// update
router.get('/:id/edit',isSignedIn,isVendorOrAdmin,ownsClothOrAdmin, async (req, res) => {
  const foundCloth = await Cloth.findById(req.params.id);
  res.render('cloth/edit.ejs', { foundCloth });
});
router.put('/:id',isSignedIn,isVendorOrAdmin,ownsClothOrAdmin,multiUpload, async (req,res)=>{
  
  try{
  if (req.body.isAvailable){req.body.isAvailable=true}
  else{ req.body.isAvailable=false}
  const updateData = {
  name: req.body.name,
  description: req.body.description,
  sizes: req.body.sizes,
  isAvailable: req.body.isAvailable};
  if (req.files && req.files["images"] && req.files["images"].length > 0) {
    updateData.images = req.files["images"].map(file => '/uploads/' + file.filename);}

  const updated = await Cloth.findByIdAndUpdate( req.params.id,updateData,{ new: true });
   res.redirect('/cloth/' + updated._id);
  }
  catch(err){
        console.log(err)
        res.render('cloth/new.ejs', { errorMessage: 'Something went wrong. Please try again.' });
    }})
// delete
router.delete('/:id',isSignedIn,isVendorOrAdmin,ownsClothOrAdmin, async (req, res) => {
  await Cloth.findByIdAndDelete(req.params.id)
  res.redirect('/cloth')
})



module.exports = router;