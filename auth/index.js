const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// TODO: check out passport.js
// TODO: fix hanging errors for expired tokens
async function verify(req, res, next) {
  try {
    const token = req.headers["authorization"];

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = verify;
