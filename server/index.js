require("dotenv").config();
const express = require("express");
const cors = require('cors');
const axios = require('axios');
const userRouter = require('./controllers/userInfo');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors())
app.use(express.json());
app.use('/user', userRouter)

const mongoose = require("mongoose");
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.log('Error connecting to DB', err.message);
    });


const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = 'http://localhost:3001/callback/';

app.get("/login", (req, res) => {

    const scope = "user-read-private user-read-email"

    const queryParams = new URLSearchParams({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        scope: scope,
    });

    res.redirect(`${SPOTIFY_AUTH_URL}?${queryParams.toString()}`);

});

app.get("/callback", (req, res) => {
    const code = req.query.code || null;
    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: SPOTIFY_REDIRECT_URI,
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        },
    }).then((response) => {
        if (response.status === 200) {
            const { access_token: accessToken, refresh_token: refreshToken } = response.data;
            res.redirect(`http://localhost:3000/?access_token=${accessToken}&refresh_token=${refreshToken}`);
        } else {
            res.redirect('/#/error/invalid token');
        }
    }).catch((error) => {
        res.redirect('/#/error/invalid token');
    });
});

app.get("/refresh_token", (req, res) => {
    const refreshToken = req.query.refresh_token;

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        },
    }).then((response) => {
        if (response.status === 200) {
            const { access_token: accessToken } = response.data;
            res.redirect(`http://localhost:3000/?access_token=${accessToken}`);
        } else {
            res.redirect('/#/error/invalid token');
        }
    }).catch((error) => {
        res.redirect('/#/error/invalid token');
    });
});


app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});