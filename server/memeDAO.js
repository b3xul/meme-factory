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
                return ({ ...row, isProtected: Boolean(row.isProtected) });
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
                return ({ ...row, isProtected: Boolean(row.isProtected) });
            });
            resolve(memes);
        });
    });
};

// add a new meme
exports.createMeme = (meme, creatorId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Meme (imageId, creatorId, title, isProtected, fontFamily, fontSize, color, sentence1, sentence2, sentence3) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [meme.imageId, creatorId, meme.title, meme.isProtected, meme.fontFamily, meme.fontSize, meme.color, meme.sentences[0], meme.sentences[1], meme.sentences[2]], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve({ ...meme, memeId: this.lastID }); // the memeId is computed automatically by the DB
        });
    });
};

// delete an existing meme
exports.deleteMeme = (memeId, creatorId) => {
    return new Promise((resolve, reject) => {
        // If creatorId is not the owner of the memeId that was passed in the request, this operation will fail
        const sql = 'DELETE FROM Meme WHERE memeId = ? and creatorId = ?';
        db.run(sql, [memeId, creatorId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            if (this.changes === 0) {
                resolve({ error: 'Couldn\'t delete meme: not found.' });
            }
            else
                resolve(null);
        });
    });
};

