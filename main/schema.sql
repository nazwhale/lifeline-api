CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  date_created DATE,
  last_login DATE
);

CREATE TABLE experiences (
  pid SERIAL PRIMARY KEY,
  title VARCHAR(255),
  start_date TIMESTAMP
  end_date TIMESTAMP
  user_id INT REFERENCES users(user_id),
);
