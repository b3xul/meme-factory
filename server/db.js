'use strict';

/* DB access module */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('meme-factory.sqlite', (err) => {
    if (err) throw err;
    else
        db.run("PRAGMA foreign_keys = ON;");
});

module.exports = db;
