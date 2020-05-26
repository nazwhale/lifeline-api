var express = require("express");
var router = express.Router();
const UserController = require("../controllers/User");

const {
  googleLoginUrl,
  getAccessTokenFromCode,
  getGoogleUserInfo
} = require("../auth/googleUtil");

router.get("/google-url", function(req, res) {
  res.send({ googleLoginUrl });
});

router.post("/login", UserController.login);

module.exports = router;
