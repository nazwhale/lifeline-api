const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const experiencesRouter = require("./routes/experiences");

const verify = require("./auth");

const { constructInjectDatabaseMiddleware } = require("./db");
const databaseMiddleware = constructInjectDatabaseMiddleware("naz", "");

// (
//   process.env.USERNAME,
//   process.env.PASSWORD
// );

// further down in the model... req.db

const app = express();

// switching on CORS handlers
//
// const localCorsHandler = (req, res, next) => next()
//
// if (process.env.NODE_ENV === 'development') {
//   app.use(localCorsHandler())
// } else {
//   app.use(cors())
// }
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// TODO: verify as middleware
app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/experiences", databaseMiddleware, verify, experiencesRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

// no idea why this gets the calc favicon, but it stops the 404s
app.get("/favicon.ico", (req, res) => res.status(204));

module.exports = app;
