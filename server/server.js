"use strict";

const express = require("express");
const morgan = require("morgan"); // logging middleware
const passport = require("passport"); // auth middleware
const LocalStrategy = require("passport-local").Strategy; // login with username and password
const session = require("express-session"); // enable sessions
const { check, validationResult } = require("express-validator"); // validation middleware

const creatorDAO = require("./creatorDAO"); // module for accessing the creators in the DB


const errorObject = {
  "badCredentials": { "error": "Wrong username or password" },
  "dbError": { "error": "There was a problem with our database. Please try again." },
  "notAuthenticated": { "error": "Only authenticated users can create, copy and delete memes!" }
};

/* -------------------------------------------------------------------------- */
/*                               Set up Passport                              */
/* -------------------------------------------------------------------------- */

passport.use(new LocalStrategy(
  //verification callback
  function (username, password, done) {
    creatorDAO.getCreator(username, password)
      .then((creator) => {
        if (!creator)
          return done(null, false, errorObject["badCredentials"]);

        return done(null, creator);  // creator contains creatorId, username, email
      })
      .catch((err) => { return done(err, null, errorObject["dbError"]); });
  }
));

// the session only contains the creator creatorId
passport.serializeUser((creator, done) => {
  done(null, creator.creatorId);
});

// starting from the data in the session, we extract all the informations about the current (logged-in) creator (creatorId, username, email)
passport.deserializeUser((creatorId, done) => {
  creatorDAO.getCreatorById(creatorId)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(errorObject["dbError"], null);
    });
});

// const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
//   // Format express-validate errors as strings
//   return `${location}[${param}]: ${msg}`;
// };

/* -------------------------------------------------------------------------- */
/*                                Init express                                */
/* -------------------------------------------------------------------------- */
const app = new express();
const PORT = 3001;

/* -------------------------------------------------------------------------- */
/*                             Set up middlewares                             */
/* -------------------------------------------------------------------------- */

app.use(morgan("dev"));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated creator
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json(errorObject["notAuthenticated"]);
};

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: "- lorem ipsum dolor sit amet -",
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/* -------------------------------------------------------------------------- */
/*                                  creator APIs                                 */
/* -------------------------------------------------------------------------- */
// Login --> POST /sessions
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {

    if (err) // db error in verification callback
    {
      return next(errorObject["dbError"]); //TO-DO check if err or my dbError
    }
    if (!user) { // authn failed
      // display wrong login messages
      return res.status(401).json(info); // info is the object containing the error message created inside the verification callback (badCredentials or dbError)
    }
    // authn success, perform the login
    req.login(user, (err) => {
      if (err) {
        return next(errorObject["dbError"]);
      }
      // req.user contains the authenticated creator, we send all the creator info back
      // this is coming from creatorDAO.getCreator() (creatorId, username, email)
      return res.json(req.user);
    });
  })(req, res, next);
});

// Logout --> DELETE /sessions/current 
app.delete("/api/sessions/current", isLoggedIn, (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the creator is logged in or not
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json(errorObject["notAuthenticated"]);
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