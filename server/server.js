"use strict";

const express = require("express");
const morgan = require("morgan"); // logging middleware
const passport = require("passport"); // auth middleware
const LocalStrategy = require("passport-local").Strategy; // login with username and password
const session = require("express-session"); // enable sessions
const { check, oneOf, validationResult } = require("express-validator"); // validation middleware

const creatorDAO = require("./creatorDAO"); // module for accessing the creators in the DB
const backgroundImageDAO = require("./backgroundImageDAO"); // module for accessing the background images structures in the DB
const memeDAO = require("./memeDAO"); // module for accessing the memes in the DB

const FONTS = ["Anton", "Comic Neue", "Tangerine", "Arial", "Helvetica", "Verdana", "sans-serif", "Courier New", "monospace", "Georgia", "Times New Roman", "serif"];
const SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
const COLORS = ["black", "white", "red", "green", "blue", "yellow", "brown"];

const errorObject = {
  "badCredentials": { "error": "Wrong username or password" },
  "dbError": { "error": "There was a problem with our database. Please try again." },
  "notAuthenticated": { "error": "Only authenticated users can create, copy and delete memes!" }
};

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Format express-validate errors as strings
  // return `${location}[${param}]: ${msg}. ${value}, ${nestedErrors}`;
  if (param === "_error")
    return `At least one text area must be filled and sentence length can't exceed 100 characters!`;
  return `${param}: ${msg}`;
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
      .catch((err) => { return done(errorObject["dbError"], null); });
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
/*                           BackgroundImages APIs                            */
/* -------------------------------------------------------------------------- */

// GET /api/backgroundImages
app.get('/api/backgroundImages',
  (req, res) => {
    // get backgroundImages that match optional filter in the query
    backgroundImageDAO.listBackgroundImages()
      .then(backgroundImages => { //console.log('ok');
        res.json(backgroundImages);
      })
      .catch((err) => { //console.log(err);
        res.status(500).end();
      });
  });


/* -------------------------------------------------------------------------- */
/*                                  Meme APIs                                 */
/* -------------------------------------------------------------------------- */

// GET /api/memes
app.get('/api/memes',
  isLoggedIn,
  (req, res) => {
    //console.log('all memes');
    memeDAO.listMemes()
      .then(memes => res.json(memes))
      .catch(() => res.status(500).end());
  });

// GET /api/memes/public
app.get('/api/memes/public',
  (req, res) => {
    // get memes that match optional filter in the query
    memeDAO.listPublicMemes()
      .then(memes => res.json(memes))
      .catch(() => res.status(500).end());
  });

// POST /api/memes
app.post('/api/memes',
  isLoggedIn,
  [
    check('title').trim().notEmpty(),
    check('title').isLength({ min: 1, max: 100 }),
    check('isProtected').isBoolean(),
    check('fontFamily').isIn(FONTS),
    check('fontSize').isIn(SIZES),
    check('color').isIn(COLORS),
    check('originalCreatorId').isInt(),
    check('originalIsProtected').isBoolean(),
    oneOf(
      [check('sentences[0]').trim().notEmpty(),
      check('sentences[1]').trim().notEmpty(),
      check('sentences[2]').trim().notEmpty()]),
    check('sentences[0]').isLength({ min: 0, max: 100 }),
    check('sentences[1]').isLength({ min: 0, max: 100 }),
    check('sentences[2]').isLength({ min: 0, max: 100 }),
    check('originalCreatorId').custom((value, { req, loc, path }) => {
      //console.log(value);
      //console.log(req.body.originalCreatorId);
      //console.log(req.body.originalIsProtected);
      console.log(req.body);
      // if (value !== req.user.creatorId) {
      //   //if request passes this check I can use req.body.creatorId to insert into the db
      //   throw new Error("You can only create memes from the logged creator");
      // }
      if (value !== req.user.creatorId && req.body.originalIsProtected && !req.body.isProtected) {
        throw new Error("A copy of a protected meme from another creator can't be made public!");
      } else {
        return value;
      }
    })

    // check(['important', 'private', 'completed']).isBoolean(),
    // check('deadline').isISO8601({ strict: true }).optional({ checkFalsy: true })
  ],
  async (req, res) => {
    //console.log(req.body);
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    //console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    const { originalCreatorId, originalIsProtected, ...meme } = req.body;
    //console.log(meme);

    try {
      const result = await memeDAO.createMeme(meme, req.user.creatorId);
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of new meme: ${err}.` });
    }
  });

// DELETE /api/memes/<memeId>
app.delete('/api/memes/:memeId',
  isLoggedIn,
  [check('memeId').isInt([{ min: 1 }])],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    //console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }
    try {
      console.log(req.user);
      console.log(req.params.memeId);
      const result = await memeDAO.deleteMeme(req.params.memeId, req.user.creatorId);
      if (result === null)
        res.status(200).json({});
      else
        res.status(404).json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of meme ${req.params.memeId}` });
    }
  });


/* -------------------------------------------------------------------------- */
/*                             activate the server                            */
/* -------------------------------------------------------------------------- */
app.listen(PORT, () => {
  //console.log(`Server listening at http://localhost:${PORT}`);
});