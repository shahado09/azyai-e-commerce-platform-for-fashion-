const isSignedIn = (req, res, next) => {
  if (req.session.user) {
    console.log('You are logged in and able to see this page!!!!');
    next();
  } else {
    console.log('Unauthorized!!!');
    res.redirect('/auth/sign-in');
  }
};

function isAdmin(req, res, next) {
  if (!req.session.user) return res.redirect("/auth/sign-in");
  if (req.session.user.role !== "admin") return res.status(403).send("Admin only!!");
  next();}

function isVendorOrAdmin(req, res, next) {
  if (!req.session.user) return res.redirect("/auth/sign-in");
  const role = req.session.user.role;
  if (role === "vendor" || role === "admin") return next();
  return res.status(403).send("Vendor Or Admin Only!!!");
  next();
}


async function ownsClothOrAdmin(req,res,next){

  const Cloth = require("../models/cloth");
  const cloth = await Cloth.findById(req.params.id);

  if (!cloth)
    return res.status(404).send("Cloth not found");
  if (req.session.user.role === "admin") 
    return next();
   if (req.session.user.role === "vendor" && cloth.userId.equals(req.session.user._id))
    return next();

  return res.status(403).send("Not your cloth");

} 
module.exports ={isSignedIn ,isAdmin , isVendorOrAdmin,ownsClothOrAdmin};


