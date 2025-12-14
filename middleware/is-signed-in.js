const isSignedIn = (req, res, next) => {
  if (req.session.userId) {
    console.log('You are logged in and able to see this page!!!!');
    next();
  } else {
    console.log('Unauthorized!!!');
    res.redirect('/auth/sign-in');
  }
};

function isAdmin(req, res, next) {

  if (!req.session.userId) return res.redirect("/auth/sign-in");
  if (req.session.role !== "admin") return res.status(403).send("Forbidden (Admin only)");

  next();
}

function isVendor(req, res, next) {
  if (!req.session.user) return res.redirect("/sign-in");
  if (req.session.user.role !== "vendor") return res.status(403).send("Forbidden (Vendor only)");
  next();
}

module.exports =(isSignedIn,isAdmin,isVendor);
