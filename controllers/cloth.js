const express = require('express');
const router = express.Router();
const Cloth =require("../models/cloth")
const multer = require('multer');





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




module.exports = router;