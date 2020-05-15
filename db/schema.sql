/*
other fields?
  rename user_id to id
  soft deleted_at field?
  timestamp for everything? - enforce we're storing everything in UTC on the backend
  replace NOW() with timezone('utc', NOW())
 */
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  date_created DATE,
  last_login DATE,
  login_type VARCHAR(255),
  external_login_id VARCHAR(255)
);

/*
  rename pid to id
  rename user_id to id
*/
CREATE TABLE experiences (
  pid SERIAL PRIMARY KEY,
  title VARCHAR(255),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  user_id INT REFERENCES users(user_id)
);
