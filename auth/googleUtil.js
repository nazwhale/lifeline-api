const axios = require("axios");
const queryString = require("query-string");

const stringifiedParams = queryString.stringify({
  client_id: process.env.GOOGLE_CLIENT_ID,
  redirect_uri: "http://localhost:3000/",
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
  ].join(" "), // space seperated string
  response_type: "code",
  access_type: "offline",
  prompt: "consent"
});
const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

async function getAuthDetailsFromCode(code) {
  const { data } = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "POST",
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "http://localhost:3000/",
      grant_type: "authorization_code",
      code
    }
  });
  return data;
}

async function getGoogleUserInfo(accessToken) {
  const { data } = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return data;
}

/* exports */

module.exports = {
  googleLoginUrl,
  getAuthDetailsFromCode,
  getGoogleUserInfo
};
