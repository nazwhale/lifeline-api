var express = require("express");
var router = express.Router();
var pool = require("./db");

/*
  Users Table
*/

router.get("/", function(req, res, next) {
  res.send("API is working woop!");
});

router.post("/post/user", (req, res, next) => {
  const values = [req.body.profile.email];
  pool.query(
    `INSERT INTO users(email, date_created)
              VALUES($1, NOW())
              ON CONFLICT DO NOTHING`,
    values,
    (q_err, q_res) => {
      res.json(q_res.rows);
    }
  );
});

router.get("/get/user", (req, res, next) => {
  const email = req.query.email;
  console.log(email);
  pool.query(
    `SELECT * FROM users
              WHERE email=$1`,
    [email],
    (q_err, q_res) => {
      res.json(q_res.rows);
    }
  );
});

module.exports = router;
