var express = require("express");
var router = express.Router();
const UserController = require("../controllers/User");

router.post("/login", UserController.login);

module.exports = router;
