const express = require('express');
const router = express.Router();

// Added Facebook
const spotifyApi = new Spotify({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', (_, res) => {
  const state = generateRandomString(16);
  res.cookie(STATE_KEY, state);
  res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
});

router.get('/callback', (req, res) => {
 const { code, state } = req.query;
 const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
 if (state === null || state !== storedState) {
    res.redirect('/#/error/state mismatch');
  } else {
    spotifyApi.authorizationCodeGrant(code).then(data => {
      const { expires_in, access_token, refresh_token } = data.body;
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
      res.redirect(`/#/user/${access_token}/${refresh_token}`);
    });
  }
  }).catch(err => {
    res.redirect('/#/error/invalid token');
  });




module.exports = router;
