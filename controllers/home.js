const express = require('express');
const models = require('../models');
const passport = require('../middlewares/authentication');

const router = express.Router();

router.get('/sign-up', passport.redirectIfLoggedIn('/profile'), (req, res) => {
  res.render('sign-up');
});

router.post('/sign-up', (req, res) => {
  models.Users.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    hashed_password: req.body.password
  })
  .then(user => {
    req.login(user, () => {
      res.redirect('/profile');
    });
  });
});

router.get('/login', passport.redirectIfLoggedIn('/profile'), (req, res) => {
  res.render('login')
});

router.post('/login', (req, res) => {
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  })(req, res);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
})

// Only allow access to logged in users
// passport.redirectIfNotLoggedIn can be used at application level 
// by using router.use() at the top of the file.
router.get('/profile', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  res.send('The secret profile page');
});

module.exports = router;
