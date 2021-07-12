import Meme from './models/Meme';
import { BackgroundImage, MemeTextArea } from './models/BackgroundImage';

const BASEURL = '/api';

function getJson(httpResponsePromise) {
    return new Promise((resolve, reject) => {
        httpResponsePromise
            .then((response) => {
                if (response.ok) {
                    // always return {} from server, never null or non json, otherwise it will fail
                    response.json()
                        .then(json => resolve(json))
                        .catch(err => reject({ error: "Cannot parse server response" }));

                } else {
                    // analyze the cause of error
                    response.json()
                        .then(obj => reject(obj)) // error msg in the response body
                        .catch(err => reject({ error: "Cannot parse server response" })); // something else
                }
            })
            .catch(err => reject({ error: "Connection error" })); // connection error
    });
}

/* -------------------------------------------------------------------------- */
/*                             Authentication API                             */
/* -------------------------------------------------------------------------- */

async function logIn(credentials) {
    let response = await fetch(BASEURL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const creator = await response.json();
        return creator;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch(BASEURL + '/sessions/current', { method: 'DELETE' });
}

async function getCreatorInfo() {
    const response = await fetch(BASEURL + '/sessions/current');
    const creatorInfo = await response.json();
    if (response.ok) {
        return creatorInfo;
    } else {
        throw creatorInfo;  // an object with the error coming from the server
    }
}

/* -------------------------------------------------------------------------- */
/*                           BackgroundImages APIs                            */
/* -------------------------------------------------------------------------- */

async function loadBackgroundImages() {
    return getJson(fetch(BASEURL + '/backgroundImages'))
        .then(backgroundImages => {
            return backgroundImages.map((backgroundImage) => {
                let textAreas = [];
                for (let i = 1; i <= backgroundImage.numberOfAreas; i++) {
                    textAreas.push(new MemeTextArea(backgroundImage[`top${i}`], backgroundImage[`left${i}`], backgroundImage[`width${i}`], backgroundImage[`height${i}`]));
                }
                //console.log(textAreas);
                return new BackgroundImage(backgroundImage.imageId, backgroundImage.path, backgroundImage.numberOfAreas, textAreas);
            });
        });
}

/* -------------------------------------------------------------------------- */
/*                                  Meme API                                  */
/* -------------------------------------------------------------------------- */

async function loadAllMemes() { // return list of memes
    return getJson(fetch(BASEURL + '/memes'))
        .then(memes => {
            return memes.map((meme) => {
                let sentences = [meme.sentence1, meme.sentence2, meme.sentence3];
                return new Meme(meme.memeId, meme.imageId, meme.creatorId, meme.creatorUsername, meme.title, meme.isProtected, meme.fontFamily, meme.fontSize, meme.color, sentences);
            });
        });
}

async function loadPublicMemes() {
    return getJson(fetch(BASEURL + '/memes/public'))
        .then(memes => {
            return memes.map((meme) => {
                let sentences = [meme.sentence1, meme.sentence2, meme.sentence3];
                //console.log(new Meme(meme.memeId, meme.imageId, meme.creatorId, meme.creatorUsername, meme.title, meme.isProtected, meme.fontFamily, meme.fontSize, meme.color, sentences));
                return new Meme(meme.memeId, meme.imageId, meme.creatorId, meme.creatorUsername, meme.title, meme.isProtected, meme.fontFamily, meme.fontSize, meme.color, sentences);
            });
        });
}

// function addExam(exam) {
//     // call: POST /api/exams
//     return new Promise((resolve, reject) => {
//         fetch(BASEURL + '/exams', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ code: exam.coursecode, score: exam.score, date: exam.date }),
//         }).then((response) => {
//             if (response.ok) {
//                 resolve(null);
//             } else {
//                 // analyze the cause of error
//                 response.json()
//                     .then((message) => { reject(message); }) // error message in the response body
//                     .catch(() => { reject({ error: "Cannot parse server response." }); }); // something else
//             }
//         }).catch(() => { reject({ error: "Cannot communicate with the server." }); }); // connection errors
//     });
// }

async function addMeme(meme, originalCreatorId, originalIsProtected) {
    console.log(meme);
    // console.log(JSON.stringify({ ...meme, originalCreatorId, originalIsProtected: originalIsProtected }));
    return getJson(
        fetch(BASEURL + "/memes", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...meme, originalCreatorId: originalCreatorId, originalIsProtected: originalIsProtected })
        })
    );
}

// async function addNewmemeSlow(meme) {
//     return new Promise((resolve, reject) => {
//         setTimeout(async () => {

//             const response = await fetch(url + '/api/memes', {  //initialization object for the request
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ ...meme, deadline: (meme.deadline) ? ((meme.containsTime) ? meme.deadline.format('YYYY-MM-DD HH:mm') : meme.deadline.format('YYYY-MM-DD')) : null })
//             });
//             if (response.ok) {
//                 resolve(meme);
//             } else resolve({ 'err': 'POST error' });

//         }, 3000);
//     });
// }

async function deleteMeme(memeId) {
    return getJson(
        fetch(BASEURL + `/memes/${memeId}`, {
            method: 'DELETE',
        })
    );
}


// async function copyMeme(meme) {

//     const response = await fetch(BASEURL + `/memes/${meme.id}`, {  //initialization object for the request
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...meme, deadline: (meme.deadline) ? ((meme.containsTime) ? meme.deadline.format('YYYY-MM-DD HH:mm') : meme.deadline.format('YYYY-MM-DD')) : null })
//     });
//     if (response.ok) {
//         return (meme);
//     } else return ({ 'err': 'POST error' });

// }

// async function updatememeSlow(meme) {
//     return new Promise((resolve, reject) => {
//         setTimeout(async () => {
//             const response = await fetch(BASEURL + '/memes/${meme.id}`, {  //initialization object for the request
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ ...meme, deadline: (meme.deadline) ? ((meme.containsTime) ? meme.deadline.format('YYYY-MM-DD HH:mm') : meme.deadline.format('YYYY-MM-DD')) : null })
//             });
//             if (response.ok) {
//                 resolve(meme);
//             } else resolve({ 'err': 'POST error' });
//         }, 3000);
//     });
// }

const API = { logIn, logOut, getCreatorInfo, loadBackgroundImages, loadAllMemes, loadPublicMemes, addMeme, deleteMeme };
export default API;