var express = require('express');
var router = express.Router();

require('../models/connection.js');
const User = require('../models/users.js');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/*------------------------------------------*/
// Route POST signup

router.post('/signup', (req, res) => {
  // Check if any field is not empty
  if (!req.body.firstname || !req.body.username || !req.body.password) {
    res.json({
      result: false,
      error: "Missing or empty fields"
    });
  } else { 
    // Check if user has not already been registered
    User.findOne({ username: req.body.username })
    .then(data => {
      // User does not exist
      if (data === null) {
        // Encrypt password
        const hash = bcrypt.hashSync(req.body.password, 10);
        // Create new user
        const newUser = new User({
          firstname: req.body.firstname,
          username: req.body.username,
          password: hash,
          token: uid2(32),
          // tweets: [],
          // likes: [],
        });
        // Save new user into database
        newUser.save().then(newDoc => {
          res.json({
            result: true,
            token: newDoc.token,
          });
        })
      // User already exists
      } else {
        res.json({
          result: false,
          error: "User already exists",
        });
      };
    });
  };
});

/*------------------------------------------*/
// Route POST signin

router.post('/signin', (req, res) => {
  // Check if any field is not empty
  if (!req.body.username || !req.body.password) {
    res.json({
      result: false,
      error: "Missing or empty fields"
    });
  } else {
  // Check if user exists in database
    User.findOne({ username: req.body.username })
    .then(data => {
      // Check if password is correct using bcrypt compareSync
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        res.json({
          result: true,
          token: data.token,
        });
      // Password checked failed
      } else {
        res.json({
          result: false,
          error: "User not found",
        });
      };
    });
  };
});

module.exports = router;
