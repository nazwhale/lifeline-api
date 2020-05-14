var express = require("express");
var router = express.Router();
var pool = require("./db");

/*
  Users Table
*/

router.get("/", function(req, res, next) {
  res.send("API is working woop!");
});

// Create new user
router.post("/post/user", (req, res, next) => {
  console.log("🙏", req.body);
  const { profile } = req.body;

  const values = [profile.email, profile.lastLogin];
  console.log("⚡️", values);
  pool.query(
    `INSERT INTO users(email, date_created, last_login)
              VALUES($1, NOW(), $2)
              ON CONFLICT DO NOTHING`,
    values,
    (q_err, q_res) => {
      res.json(q_res.rows);
    }
  );
});

// Read existing user
router.get("/get/user", (req, res, next) => {
  const email = req.query.email;
  console.log("🤝", email);
  pool.query(
    `SELECT * FROM users
              WHERE email=$1`,
    [email],
    (q_err, q_res) => {
      res.json(q_res.rows);
    }
  );
});

// Update existing user's last login
router.put("/put/user", (req, res, next) => {
  console.log("🙏", req.body);
  const { lastLogin, email } = req.body;
  const values = [lastLogin, email];

  pool.query(
    `UPDATE users
              SET last_login = $1
              WHERE email=$2`,
    values,
    (q_err, q_res) => {
      res.json(q_res.rows);
    }
  );
});

module.exports = router;
