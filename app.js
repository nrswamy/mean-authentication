require('./api/models/db');
require('./api/config/passport');
var cors = require('cors')

var bodyParser = require('body-parser');
var multer = require('multer');

const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const passport = require('passport');
const path = require('path');

const routesApi = require('./api/routes/index');
const port = 4200;
const app = express()
      .use(express.static(__dirname + "/out"))
      .use(express.static(__dirname + "/public_html"))
      // .listen(4567);

const server = app.listen(port, () => {
  console.log("Listening on port: " + port);
  });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(function(req, res, next) { //allow cross origin requests
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "0.0.0.0");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());  
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({credentials: false, origin: true}));

app.use(passport.initialize());

app.use("/api", routesApi);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch unauthorised errors
app.use((err, req, res) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({ message: `${err.name}: ${err.message}` });
  }
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/** API path that will upload the files */

module.exports = app;
