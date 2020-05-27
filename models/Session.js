const pool = require("../db");
const { promisify } = require("util");

/* models/Session.js */

class Session {
  constructor({ user_id, access_token, refresh_token, expiry }) {
    this.user_id = user_id;
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.expiry = expiry;
  }

  toJSON() {
    return {
      user_id: this.user_id,
      access_token: this.access_token,
      refresh_token: this.refresh_token,
      expiry: this.expiry
    };
  }

  /* Actions */

  async save(db, fn) {
    const data = [
      this.user_id,
      this.access_token,
      this.refresh_token,
      this.expiry
    ];

    db.query(
      `INSERT INTO sessions(user_id, access_token, refresh_token, expiry, created_at)
                VALUES($1, $2, $3, $4, timezone('utc', NOW()))
                RETURNING *`,
      data,
      (q_err, q_res) => {
        if (q_err) return fn(q_err, null);
        fn(null, q_res.rows);
      }
    );
  }

  static async findById(db, id, fn) {
    db.query(
      `SELECT * FROM sessions
                WHERE id=$1`,
      [id],
      (q_err, q_res) => {
        if (q_err) return fn(q_err, null);
        const ex = q_res.rows.length > 0 ? new Session(q_res.rows[0]) : null;

        fn(null, ex);
      }
    );
  }

  static async findByUserId(db, id, fn) {
    db.query(
      `SELECT * FROM sessions
                  WHERE user_id=$1
                  ORDER BY start_date`,
      [id],
      (q_err, q_res) => {
        if (q_err) return fn(q_err, null);

        // marshal rows to Sessions
        let sessions = [];
        q_res.rows.forEach(row => {
          const e = new Session(row);
          sessions.push(e);
        });

        fn(null, sessions);
      }
    );
  }
}

module.exports = Session;
