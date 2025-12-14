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

router.get('/sign-in', async (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
  try {
    // try to find the user inthe db
    const { username, password } = req.body;
    // make sure the user does not exist
    const userInDatabase = await User.findOne({ username });

    // if the user does not exist, redirect to sign up with msg
    if (!userInDatabase) {
      return res.send('Username or Password is invalid');
    }
    // i the user exists, lets compare the pw with the usr pw

    const isValidPassword = bcrypt.compareSync(password, userInDatabase.password);
    // if the pw doesnt match, throw an error
    if (!isValidPassword) {
      return res.send('Username or Password is invalid');
    }

    // else continue with the "login"
    req.session.user = {
      username: userInDatabase.username,
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

module.exports = router;
