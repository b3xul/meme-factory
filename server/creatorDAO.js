'use strict';
/* Data Access Object (DAO) module for accessing users */

const db = require('./db');
const bcrypt = require('bcrypt');

exports.getCreator = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT creatorId,username,email,hashedPassword FROM Creator WHERE username=?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) { // username does not exist
                resolve(false);
            }
            else {
                const creator = { creatorId: row.creatorId, username: row.username, email: row.email };
                // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
                bcrypt.compare(password, row.hashedPassword).then(result => {
                    if (result)
                        resolve(creator);
                    else
                        resolve(false);
                });
            }
        });
    });
};

exports.getCreatorById = (creatorId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT creatorId,username,email FROM Creator WHERE creatorId = ?';
        db.get(sql, [creatorId], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined) // username does not exist;
                resolve(false);
            else {
                // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
                const creator = { creatorId: row.creatorId, username: row.username, email: row.email };
                resolve(creator);
            }
        });
    });
};