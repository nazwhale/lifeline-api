var express = require("express");
var router = express.Router();
var pool = require("./db");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/*
  Users Table
*/

router.get("/", function(req, res, next) {
  res.send("API is working woop!");
});

// Create new user
router.post("/user", (req, res, next) => {
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
router.get("/user", verify, (req, res, next) => {
  const email = req.query.email;

  console.log("🤝", email);

  pool.query(
    `SELECT * FROM users
              WHERE email=$1`,
    [email],
    (q_err, q_res) => {
      if (q_res.rows.length === 0) {
        console.log("about to 404...");
        res.status(404).json({
          code: "user_not_found",
          name: "User not found"
        });
      } else {
        res.json(q_res.rows);
      }
    }
  );
});

// Update existing user's last login
router.put("/user", (req, res, next) => {
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

async function verify(req, res, next) {
  const token = req.headers["authorization"];

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  console.log("🎫", ticket);
  const payload = ticket.getPayload();
  console.log("💵", payload);
  const userid = payload["sub"];
  console.log("🙋‍♀️", userid);
  // If request specified a G Suite domain:
  //const domain = payload['hd'];

  next();
}

module.exports = router;
