var express = require("express");
var router = express.Router();
const UserController = require("../controllers/User");

// If already logged in, redirect to "/"
// Check session in db?
router.post("/login", UserController.login);

module.exports = router;
