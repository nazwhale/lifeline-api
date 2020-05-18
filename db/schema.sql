CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP, /* local type is DATE */
  last_login_at TIMESTAMP, /* local type is DATE */
  login_type VARCHAR(255),
  external_login_id VARCHAR(255)
  deleted_at TIMESTAMP
);

CREATE TABLE experiences (
  pid SERIAL PRIMARY KEY,
  title VARCHAR(255),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  user_id INT REFERENCES users(id)
);
