const passUserToView = (req, res, next) => {
  res.locals.userId = req.session.userId ? req.session.userId: null;
  next();
};

module.exports = passUserToView;
