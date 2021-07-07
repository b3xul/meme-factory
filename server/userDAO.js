'use strict';
/* Data Access Object (DAO) module for accessing users */

const db = require('./db');
const bcrypt = require('bcrypt');

exports.getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id,username,email,hashedPassword FROM User WHERE username=?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) { // username does not exist
                resolve(false);
            }
            else {
                const user = { id: row.id, username: row.username, email: row.email };
                // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
                bcrypt.compare(password, row.hashedPassword).then(result => {
                    if (result)
                        resolve(user);
                    else
                        resolve(false);
                });
            }
        });
    });
};

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id,username,email FROM User WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
                const user = { id: row.id, username: row.username, email: row.email };
                resolve(user);
            }
        });
    });
};