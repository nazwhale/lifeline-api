const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const { constructInjectDatabaseMiddleware } = require("./db");
const databaseMiddleware = constructInjectDatabaseMiddleware("naz", ""); // TODO: Get from process.env

const verify = require("./auth");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const experiencesRouter = require("./routes/experiences");

const app = express();

// Switching on CORS handlers
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

app.use("/api", indexRouter);
app.use("/api/users", databaseMiddleware, verify, usersRouter);
app.use("/api/experiences", databaseMiddleware, verify, experiencesRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
