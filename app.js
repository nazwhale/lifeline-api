const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

/* Require Auth */
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

/* Datebase Initialization Middleware */
const { constructInjectDatabaseMiddleware } = require("./db");
const databaseMiddleware = constructInjectDatabaseMiddleware(
  process.env.DB_USER,
  process.env.DB_PASSWORD
);

/* Require Routes */
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const experiencesRouter = require("./routes/experiences");

const app = express();

/* CORS */
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true
    })
  );
} else {
  app.use(cors());
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* Get loggedIn Cookie */
app.use(function(req, res, next) {
  const cookie = req.cookies.loggedIn;

  if (cookie === undefined) {
    console.log("🍪no cookie");
  } else {
    console.log("🍪loggedIn cookie exists");
  }

  next();
});

app.use(express.static(path.join(__dirname, "public")));

/* Routes */
app.use("/api", databaseMiddleware, indexRouter);
app.use("/api/users", databaseMiddleware, usersRouter);
app.use("/api/experiences", databaseMiddleware, experiencesRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

/* Error Handler */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.log("errrrr", err);

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
