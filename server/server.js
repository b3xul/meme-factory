'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // login with username and password
const session = require('express-session'); // enable sessions
const { check, validationResult } = require('express-validator'); // validation middleware

const userDAO = require('./userDAO'); // module for accessing the users in the DB


/* -------------------------------------------------------------------------- */
/*                               Set up Passport                              */
/* -------------------------------------------------------------------------- */

passport.use(new LocalStrategy(
  function (username, password, done) {
    userDAO.getUser(username, password)
      .then((user) => {
        if (!user)
          return done(null, false, { error: 'Wrong username or password' });

        return done(null, user);  // user contains id, username, email
      })
      .catch((err) => { return done(JSON.stringify({ error: 'There was a problem with our database. Please try again.' })); });
  }
));

// the session only contains the user id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract all the informations about the current (logged-in) user (id, username, email)
passport.deserializeUser((id, done) => {
  userDAO.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Format express-validate errors as strings
  return `${location}[${param}]: ${msg}`;
};

/* -------------------------------------------------------------------------- */
/*                                Init express                                */
/* -------------------------------------------------------------------------- */
const app = new express();
const PORT = 3001;

/* -------------------------------------------------------------------------- */
/*                             Set up middlewares                             */
/* -------------------------------------------------------------------------- */

app.use(morgan('dev'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Unauthenticated user!' });
};

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: '- lorem ipsum dolor sit amet -',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/* -------------------------------------------------------------------------- */
/*                                  User APIs                                 */
/* -------------------------------------------------------------------------- */
// Login --> POST /sessions
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {

    if (err) // db error in verification callback
      return next(err);
    if (!user) { // authn failed
      // display wrong login messages
      return res.status(401).json(info); // info is the object containing the error message created inside the verification callback
    }
    // authn success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDAO.getUser() (id, username, email)
      return res.json(req.user);
    });
  })(req, res, next);
});

// Logout --> DELETE /sessions/current 
app.delete('/api/sessions/current', isLoggedIn, (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Hidden auth error' });
});

/* -------------------------------------------------------------------------- */
/*                                  Meme APIs                                 */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                             activate the server                            */
/* -------------------------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});