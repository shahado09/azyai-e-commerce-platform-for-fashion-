const express = require("express");
const router = express.Router();
const VendorRequest = require("../models/VendorRequest");
const User = require("../models/user");
const { isAdmin } = require("../middleware/access-control");
const { sendDecisionToUser } = require("../utils/mailer");


// get vendor req router 
router.get("/vendor-requests", isAdmin, async (req, res) => {
  try {
    console.log("body:", req.body);
    const requests = await VendorRequest.find().populate("userId").sort({ createdAt: -1 });

    res.render("admin/vendorRequests.ejs", { requests });
  } 
  catch (err) {
    console.error(err);
    res.status(400).send("Error approving request");
  }});

// vendor approve req router 
router.put('/vendor-requists/:id/approve',isAdmin ,async(req,res)=>{

  try{
    const createdRequest =  await VendorRequest.findById(req.params.id).populate("userId");
    if(!createdRequest){return res.status(404).send("Request not found");}

    createdRequest.status="approved";
    adminNote="";
    await  save();


    await User.findByIdAndUpdate(createdRequest.userId._id,{role:"vendor"})

    await sendDecisionToUser({
      toEmail:createdRequest.userId.email, 
      userName:createdRequest.userId.username, 
      decision:'approved', 
      adminNote:'',
    });
    res.redirect("/admin/vendor-requests");}

  catch (err) {
    console.error(err);
    res.status(400).send("Error approving request");}
})

// vendor reject req router 
router.put('/vendor-requists/:id/reject',isAdmin ,async(req,res)=>{

  try{
    const createdRequest =  await VendorRequest.findById(req.params.id).populate("userId");
    if(!createdRequest){return res.status(404).send("Request not found");}

    createdRequest.status="rejected";
    adminNote=req.body.adminNote || "there is no note";
    await  save();


    await User.findByIdAndUpdate(createdRequest.userId._id,{role:"vendor"})

    await sendDecisionToUser({
      toEmail:createdRequest.userId.email, 
      userName:createdRequest.userId.username, 
      decision:'rejected', 
      adminNote:createdRequest.adminNote,
    });
    res.redirect("/admin/vendor-requests");}

  catch (err) {
    console.error(err);
    res.status(400).send("Error approving request");}
})