var pool = require("../db");

function createExperience(req, res, next) {
  const { title, start_date, end_date, user_id } = req.body;
  const newExperienceData = [title, start_date, end_date, user_id];
  const { db_data } = req;

  if (db_data != null && db_data.error != null) {
    // if we've errorred, don't create an experience
    next();
  } else {
    pool.query(
      `INSERT INTO experiences(title, start_date, end_date, user_id, created_at)
              VALUES($1, $2, $3, $4, timezone('utc', NOW()))
              RETURNING *`,
      newExperienceData,
      (q_err, q_res) => {
        if (q_err) {
          req.db_data = {
            experiences: null,
            error: {
              code: "error_creating_experience",
              data: q_err
            }
          };
        } else {
          req.db_data = { experiences: q_res.rows, error: null };
        }
        next();
      }
    );
  }
}

function readExperienceById(req, res, next) {
  const { id } = req.query;
  console.log("✨", id);

  pool.query(
    `SELECT * FROM experiences
              WHERE id=$1`,
    [id],
    (q_err, q_res) => {
      req.db_data = { experiences: q_res.rows };
      next();
    }
  );
}

function readExperienceByUserId(req, res, next) {
  const { user_id } = req.query;

  pool.query(
    `SELECT * FROM experiences
              WHERE user_id=$1
              ORDER BY start_date`,
    [user_id],
    (q_err, q_res) => {
      req.db_data = { experiences: q_res.rows };
      next();
    }
  );
}

// TODO: make sure this totally works
function checkExperienceDateClash(req, res, next) {
  const { title, start_date, end_date, user_id } = req.body;
  const clashQueryData = [start_date, end_date, user_id];

  pool.query(
    `SELECT * FROM experiences
    WHERE user_id=$3
    AND
    (
      (start_date <= $1 AND end_date > $1)
      OR
      (start_date < $2 AND end_date >= $2)
    )
    `,
    clashQueryData,
    (q_err, q_res) => {
      // conflict
      if (q_res.rows.length > 0) {
        req.db_data = {
          error: {
            code: "date_clash_experience",
            data: q_res.rows
          }
        };
      }
      next();
    }
  );
}

module.exports = {
  createExperience,
  readExperienceById,
  readExperienceByUserId,
  checkExperienceDateClash
};
