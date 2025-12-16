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

// post vendor req router 