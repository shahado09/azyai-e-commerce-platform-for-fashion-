const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../models/user');

const INVALID_MSG = "Username, Email, or Password is invalid";


// GET sign-up 
router.get('/sign-up', async (req, res, next) => {
  res.render('auth/sign-up.ejs');
});


//POST sign-up 
router.post('/sign-up', async (req, res) => {
  try {
    const { username,email, password, confirmPassword } = req.body;
    const userInDatabase = await User.findOne({$or:[
      {username: username.trim() },{email: email.toLowerCase().trim()}
    ],});

    if (userInDatabase) {
      return res.send(INVALID_MSG);}

    if (password !== confirmPassword) {
      return res.send(INVALID_MSG);}

      
    const hashedPassword = await bcrypt.hash(password, 12);

    // create user
    const user = await User.create(req.body);
    req.session.user = {
    username: user.username,
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: "customer"
    };

    // session info
    req.session.user = {
    username: user.username,
    email: user.email,
    role: user.role,
    _id: user._id,
    };

    req.session.save(() => {
      res.redirect('/');
    });
  } catch (error) {
    console.error(error);
    res.send('Something went wrong with registration!');
  }
});

// GET sign-in
router.get('/sign-in', async (req, res) => {
  res.render('auth/sign-in.ejs');
});

//POST sign-in
router.post('/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userInDatabase = await User.findOne({$or:[
      {username: username.trim() },{email: email.toLowerCase().trim()}
    ],});

    if (!userInDatabase) {
      return res.send(INVALID_MSG);
    }


    const isValidPassword = await bcrypt.compare(password, userInDatabase.password);

    if (!isValidPassword) {
      return res.send(INVALID_MSG);
    }

  req.session.user = {
    username: userInDatabase.username,
    email: userInDatabase.email,
    role: userInDatabase.role,
     _id: userInDatabase._id,
    };

    req.session.save(() => {
      res.redirect('/');
    });
  } catch (error) {
    console.error(error);
    res.send('Something went wrong with Sign In');
  }
});

// sign-out

router.get('/sign-out', async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});



module.exports = router;
