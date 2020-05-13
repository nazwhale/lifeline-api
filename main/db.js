const { Pool } = require("pg");

const pool = new Pool({
  user: "naz",
  host: "localhost",
  database: "lifelinetest",
  password: "",
  post: 5432
});

module.exports = pool;
