//import Meme from './Meme';

const BASEURL = '/api';

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

const API = { logIn, logOut, getCreatorInfo };
export default API;