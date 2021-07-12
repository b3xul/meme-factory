'use strict';

/* Data Access Object (DAO) module for accessing BackgroundImages */
const db = require('./db');

// get all backgroundImages
exports.listBackgroundImages = () => {
    return new Promise((resolve, reject) => {
        const sql =
            `SELECT imageId, path, numberOfAreas, top1, left1, width1, height1, top2, left2, width2, height2, top3, left3, width3, height3
            FROM BackgroundImage`;
        db.all(sql, (err, rows) => {
            if (err) {
                //console.log(err);
                reject(JSON.stringify(err));
                return;
            }

            //console.log("db ok");
            const backgroundImages = rows.map((row) => {
                //console.log(row);
                return ({ ...row });
            });

            resolve(backgroundImages);
        });
    });
};


