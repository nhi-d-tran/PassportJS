const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

const Users = require('../models').Users;

function passwordsMatch(passwordSubmitted, storedPassword) {
  return bcrypt.compareSync(passwordSubmitted, storedPassword);
}

// Call when user tries to log in
passport.use(new LocalStrategy({
    // You can use email or username as usernameField (aka login as username or email)
    usernameField: 'email',
  },
  (email, password, done) => {
    Users.findOne({
      where: { email },
    }).then(user => {
      // In practice you don't want to tell the user their email or password is incorrect
      // for security purpose.
      if(!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      if (passwordsMatch(password, user.password_hash) === false) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user, { message: 'Successfully Logged In!' });
    });
  })
);

passport.serializeUser((user, done) => {
  // store user.id into session cookie (express-session)
  // it's not necessary to store other user info
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // deserialize user.id and check if user exists in the database 
  Users.findById(id).then((user) => {
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  });
});

// Redirect to the route path, i.e, /profile, /home, if user is logged in;
// Otherwise, let the user proceed to next()
passport.redirectIfLoggedIn = (route) =>
  (req, res, next) => (req.user ? res.redirect(route) : next());

passport.redirectIfNotLoggedIn = (route) =>
  (req, res, next) => (req.user ? next() : res.redirect(route));

module.exports = passport;