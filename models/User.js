const pool = require("../db");
const { promisify } = require("util");

/* models/Experience.js */

class User {
  constructor({
    id,
    email,
    created_at,
    last_login_at,
    login_type,
    external_login_id
  }) {
    this.id = id;
    this.email = email;
    this.created_at = created_at;
    this.last_login_at = last_login_at;
    this.login_type = login_type;
    this.external_login_id = external_login_id;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      created_at: this.created_at,
      last_login_at: this.last_login_at,
      login_type: this.login_type,
      external_login_id: this.external_login_id
    };
  }

  /* Actions */

  async save(db, fn) {
    const data = [this.email, this.login_type, this.external_login_id];

    db.query(
      `INSERT INTO users(email, created_at, last_login_at, login_type, external_login_id)
                VALUES($1, timezone('utc', NOW()), timezone('utc', NOW()), $2, $3)
                ON CONFLICT DO NOTHING
                RETURNING id`,
      data,
      (q_err, q_res) => {
        if (q_err) return fn(q_err, null);
        fn(null, q_res.rows);
      }
    );
  }

  async updateLoginDetails(db, fn) {
    const data = [this.email, this.login_type, this.external_login_id];

    db.query(
      `UPDATE users
              SET last_login_at = timezone('utc', NOW()),
                  login_type = $2,
                  external_login_id = $3
              WHERE email=$1
              RETURNING id`,
      data,
      (q_err, q_res) => {
        if (q_err) return fn(q_err, null);
        fn(null, q_res.rows);
      }
    );
  }

  static async findByEmail(db, email, fn) {
    db.query(
      `SELECT * FROM users
                WHERE email=$1`,
      [email],
      (q_err, q_res) => {
        if (q_err) return fn(q_err, null);
        const ex = q_res.rows.length > 0 ? new User(q_res.rows[0]) : null;

        fn(null, ex);
      }
    );
  }
}

module.exports = User;
