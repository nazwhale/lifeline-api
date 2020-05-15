var express = require("express");
var router = express.Router();
var verify = require("../auth");
var pool = require("../db");
var getISOTimestamp = require("../utils/helpers");
var getUserByEmail = require("../dao/users");

/*
  Users Table
*/

router.post("/login", verify, getUserByEmail, (req, res, next) => {
  const { email } = req.body.profile;
  const { login_type, external_login_id } = req.body.login_info;
  const { users } = req;
  const lastLogin = getISOTimestamp();

  // How to do an if/else in little seperate express functions?
  // create if none exists
  if (users.length === 0) {
    const newUserData = [email, lastLogin, login_type, external_login_id];

    pool.query(
      `INSERT INTO users(email, date_created, last_login, login_type, external_login_id)
                VALUES($1, NOW(), $2, $3, $4)
                ON CONFLICT DO NOTHING`,
      newUserData,
      (q_err, q_res) => {
        res.json({
          code: "created_new_user",
          email: email,
          last_login_at: lastLogin,
          login_type: login_type
        });
      }
    );
  } else {
    // update last login
    const values = [email, lastLogin, login_type, external_login_id];

    pool.query(
      `UPDATE users
              SET last_login = $2,
                  login_type = $3,
                  external_login_id = $4
              WHERE email=$1`,
      values,
      (q_err, q_res) => {
        res.json({
          code: "update_existing_user",
          email: email,
          last_login_at: lastLogin,
          login_type: login_type
        });
      }
    );
  }
});

// Create new user
router.post("/", (req, res, next) => {
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
router.get("/", verify, getUserByEmail, (req, res, next) => {
  const { users } = req;
  console.log("peeps", req.users);

  if (users.length === 0) {
    console.log("about to 404...");
    res.status(404).json({
      code: "user_not_found",
      name: "User not found"
    });
  } else {
    res.json(users);
  }
});

// Update existing user's last login
router.put("/", (req, res, next) => {
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
