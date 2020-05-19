var pool = require("../db");

function readUserByEmail(req, res, next) {
  const { email } = req.body.profile;

  pool.query(
    `SELECT * FROM users
              WHERE email=$1`,
    [email],
    (q_err, q_res) => {
      req.db_data = { users: q_res.rows };
      next();
    }
  );
}

module.exports = readUserByEmail;
