const { Pool } = require("pg");

const pool = new Pool({
  user: "naz",
  host: "localhost",
  database: "lifelinetest",
  password: "",
  post: 5432
});

module.exports = pool;

// db/index.js
function constructInjectDatabaseMiddleware(user, password) {
  let instance;

  try {
    return function(req, res, next) {
      if (!instance) {
        instance = new Pool({
          user: user,
          host: "localhost",
          database: "lifelinetest",
          password: password,
          post: 5432
        });
      }

      req.db = instance;
      next();
    };
  } catch (e) {
    next(e);
  }
}

module.exports = {
  pool,
  constructInjectDatabaseMiddleware
};
