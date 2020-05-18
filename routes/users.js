var express = require("express");
var router = express.Router();
var verify = require("../auth");
var pool = require("../db");
var getISOTimestamp = require("../utils/helpers");
var readUserByEmail = require("../dao/users");

/*
  Users Table
*/

router.post("/login", verify, readUserByEmail, (req, res, next) => {
  const { email } = req.body.profile;
  const { login_type, external_login_id } = req.body.login_info;
  const { users } = req.db_data;
  const lastLogin = getISOTimestamp();

  // How to do an if/else in little seperate express functions?
  // create if none exists
  if (users.length === 0) {
    const newUserData = [email, lastLogin, login_type, external_login_id];

    pool.query(
      `INSERT INTO users(email, created_at, last_login_at, login_type, external_login_id)
                VALUES($1, timezone('utc', NOW()), $2, $3, $4)
                ON CONFLICT DO NOTHING
                RETURNING id`,
      newUserData,
      (q_err, q_res) => {
        res.json({
          code: "create_user",
          user_id: q_res.rows[0].id,
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
              SET last_login_at = $2,
                  login_type = $3,
                  external_login_id = $4
              WHERE email=$1
              RETURNING id`,
      values,
      (q_err, q_res) => {
        res.json({
          code: "update_user",
          user_id: q_res.rows[0].id,
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
  const { profile } = req.body;
  const values = [profile.email, profile.lastLogin];

  pool.query(
    `INSERT INTO users(email, created_at, last_login_at)
              VALUES($1, timezone('utc', NOW()), $2)
              ON CONFLICT DO NOTHING`,
    values,
    (q_err, q_res) => {
      res.json(q_res.rows);
    }
  );
});

// Read existing user
router.get("/", verify, readUserByEmail, (req, res, next) => {
  const { users } = req;

  if (users.length === 0) {
    res.status(404).json({
      code: "not_found_user",
      name: "User not found"
    });
  } else {
    res.json(users);
  }
});

// Update existing user's last login
router.put("/", (req, res, next) => {
  const { lastLogin, email } = req.body;
  const values = [lastLogin, email];

  pool.query(
    `UPDATE users
              SET last_login_at = $1
              WHERE email=$2`,
    values,
    (q_err, q_res) => {
      res.json(q_res.rows);
    }
  );
});

module.exports = router;
