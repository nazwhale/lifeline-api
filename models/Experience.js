const pool = require("../db");
const { promisify } = require("util");

/* models/Experience.js */

class Experience {
  constructor({ title, start_date, end_date, user_id }) {
    this.title = title;
    this.start_date = start_date;
    this.end_date = end_date;
    this.user_id = user_id;
  }

  toJSON() {
    return {
      title: this.title,
      start_date: this.start_date,
      end_date: this.end_date,
      user_id: this.user_id
    };
  }

  /* Validation */

  async validate(db) {
    this.mustNotClash = promisify(this.mustNotClash);

    try {
      await this.mustNotClash(db);
    } catch (err) {
      throw err;
    }
  }

  async mustNotClash(db, fn) {
    const data = [this.start_date, this.end_date, this.user_id];

    db.query(
      `SELECT * FROM experiences
              WHERE user_id=$3
              AND
              (
                (start_date <= $1 AND end_date > $1)
                OR
                (start_date < $2 AND end_date >= $2)
              )
          `,
      data,
      (q_err, q_res) => {
        if (q_err) return fn(q_err, null);

        if (q_res.rows.length > 0) {
          return fn("Experience overlaps another", null);
        }

        fn(null, q_res.rows);
      }
    );
  }

  /* Actions */

  async save(db, fn) {
    const data = [this.title, this.start_date, this.end_date, this.user_id];

    db.query(
      `INSERT INTO experiences(title, start_date, end_date, user_id, created_at)
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
      `SELECT * FROM experiences
                WHERE id=$1`,
      [id],
      (q_err, q_res) => {
        if (q_err) return fn(q_err, null);
        const ex = q_res.rows.length > 0 ? new Experience(q_res.rows[0]) : null;

        fn(null, ex);
      }
    );
  }

  static async findByUserId(db, id, fn) {
    db.query(
      `SELECT * FROM experiences
                  WHERE user_id=$1
                  ORDER BY start_date`,
      [id],
      (q_err, q_res) => {
        if (q_err) return fn(q_err, null);

        // marshal rows to Experiences
        let experiences = [];
        q_res.rows.forEach(row => {
          const e = new Experience(row);
          experiences.push(e);
        });

        fn(null, experiences);
      }
    );
  }
}

module.exports = Experience;
