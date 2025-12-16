const express = require("express");
const router = express.Router();
const VendorRequest = require("../models/VendorRequest");
const User = require("../models/user");
const { isSignedIn } = require("../middleware/access-control");
const { sendVendorRequestToAdmin } = require("../utils/mailer");

// get req router 
router.get("/request", isSignedIn, async (req, res) => {
  try {
    console.log("body:", req.body);
    const latest = await VendorRequest.findOne({ userId: req.session.user._id }).sort({ createdAt: -1 });
    res.render("vendor/request.ejs", { latest });
  } 
  catch (err) {
    console.error(err);
    res.status(400).send("Error loading vendor request page");
  }});
  

// post req router

router.post("/request", isSignedIn, async (req, res) => {
  try {
    const { instagram,  vendorName, aboutVendor } = req.body;

    const pending = await VendorRequest.findOne({ userId: req.session.user._id, status: "pending", });

    if (pending) {return res.redirect("/vendor/request");}

    console.log({ instagram, vendorName, aboutVendor });
    const createdRequest = await VendorRequest.create({
      userId: req.session.user._id,
      instagram: instagram.trim(),
      vendorName: vendorName.trim(),
      aboutVendor: aboutVendor.trim(),
      status: "pending",
    });

    const user = await User.findById(req.session.user._id);

    await sendVendorRequestToAdmin({
      userEmail: user.email,
      userName: user.username,
      instagram: createdRequest.instagram,
      vendorName: createdRequest.vendorName,
      aboutVendor: createdRequest.aboutVendor,
    });


    res.redirect("vendor/request.ejs"); } 
    
    catch (err) {
    console.error(err);
    res.status(400).send("Error submitting vendor request");
  }
});


module.exports = router;

