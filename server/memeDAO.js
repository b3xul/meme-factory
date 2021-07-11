'use strict';

/* Data Access Object (DAO) module for accessing memes */
const db = require('./db');

// get all memes
exports.listMemes = (user, filter) => {
    return new Promise((resolve, reject) => {
        const sql =
            `SELECT memeId, imageId, Meme.creatorId, username as creatorUsername, title, isProtected, fontFamily, fontSize, color, sentence1, sentence2, sentence3
            FROM Meme, Creator
            WHERE Meme.creatorId=Creator.creatorId;`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const memes = rows.map((row) => {
                return ({ ...row });
            });
            resolve(memes);
        });
    });
};

// get public memes
exports.listPublicMemes = (user, filter) => {

    return new Promise((resolve, reject) => {
        const sql =
            `SELECT memeId, imageId, Meme.creatorId, username as creatorUsername, title, isProtected, fontFamily, fontSize, color, sentence1, sentence2, sentence3
            FROM Meme, Creator
            WHERE Meme.creatorId=Creator.creatorId and isProtected=false;`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const memes = rows.map((row) => {
                return ({ ...row });
            });
            resolve(memes);
        });
    });
};

// get the course identified by {code}
exports.getMeme = (memeId) => {
    return new Promise((resolve, reject) => {
        const sql =
            `SELECT memeId, imageId, Meme.creatorId, username as creatorUsername, title, isProtected, fontFamily, fontSize, color, sentence1, sentence2, sentence3
            FROM Meme, Creator
            WHERE Meme.creatorId=Creator.creatorId and memeId=?;`;
        db.get(sql, [memeId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined) {
                resolve({ error: 'Meme not found.' });
            } else {
                const meme = { ...row };
                resolve(meme);
            }
        });
    });
};


// add a new meme
// the meme id is added automatically by the DB, and it is returned as result
exports.createMeme = (meme) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tasks (description, important, private, deadline, completed, user) VALUES(?, ?, ?, ?, ?, ?)';
        db.run(sql, [meme.description, meme.important, meme.private, meme.deadline, meme.completed, meme.user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(exports.getMeme(this.lastID));
        });
    });
};

// update an existing meme
exports.updateMeme = (user, id, meme) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE memes SET description = ?, important = ?, private = ?, deadline = ?, completed = ? WHERE id = ? and user = ?';
        db.run(sql, [meme.description, meme.important, meme.private, meme.deadline, meme.completed, id, user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(exports.getMeme(id)); // changed from resolve(exports.getMeme(this.lastID) because of error "not found" (wrong lastID)
        });
    });
};

// delete an existing meme
exports.deleteMeme = (memeId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM memes WHERE memeId = ?';
        db.run(sql, [memeId], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null);
        });
    });
};

