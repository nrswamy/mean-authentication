require('./api/models/db');
require('./api/config/passport');

var socketio = require('socket.io');
var jwtAuth = require('socketio-jwt-auth')
var http = require("http"),
    url = require("url"),
    mime = require("mime"),
    fs = require("fs"),
    SocketIOFileUploadServer = require("./server")
var io;

const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const passport = require('passport');
const path = require('path');

const routesApi = require('./api/routes/index');

// var app = http.createServer(function(req, resp){
// 	var filename = path.join(__dirname, "public_html", url.parse(req.url).pathname);
// 	(fs.exists || path.exists)(filename, function(exists){
// 		if (exists) {
// 			fs.readFile(filename, function(err, data){
// 				if (err) {
// 					// File exists but is not readable (permissions issue?)
// 					resp.writeHead(500, {
// 						"Content-Type": "text/plain"
// 					});
// 					resp.write("Internal server error: could not read file");
// 					resp.end();
// 					return;
// 				}
 
// 				// File exists and is readable
// 				var mimetype = mime.lookup(filename);
// 				resp.writeHead(200, {
// 					"Content-Type": mimetype
// 				});
// 				resp.write(data);
// 				resp.end();
// 				return;
// 			});
// 		}
// 	});
// });

const app = express()
      .use(SocketIOFileUploadServer.router)
      .use(express.static(__dirname + "/out"))
      .use(express.static(__dirname + "/public_html"))
      // .listen(4567);

const server = app.listen(4200, () => {
  console.log("Listening on port: " + 4200);
  });
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

io = socketio.listen(server);

io.use(jwtAuth.authenticate({
  secret: 'MY_SECRET',    // required, used to verify the token's signature
  succeedWithoutToken: true
}, function(payload, done) {

  console.log("checking connection")
  // you done callback will not include any payload data now
  // if no token was supplied
  if (payload && payload.sub) {
    User.findOne({id: payload.sub}, function(err, user) {
      if (err) {
        // return error
        return done(err);
      }
      if (!user) {
        // return fail with an error message
        return done(null, false, 'user does not exist');
      }
      // return success with a user info
      return done(null, user);
    });
  } else {
    return done() // in your connection handler user.logged_in will be false
  }
}));

io.sockets.on("connection", function(socket){
  var siofuServer = new SocketIOFileUploadServer();
  
  socket.on('data', (data) => {
    console.log(data.toString());
  });
  
	siofuServer.on("saved", function(event){
		console.log(event.file);
		event.file.clientDetail.base = event.file.base;
	});
	siofuServer.on("error", function(data){
		console.log("Error: "+data.memo);
		console.log(data.error);
	});
	siofuServer.on("start", function(event){
		if (/\.exe$/.test(event.file.name)) {
			console.log("Aborting: " + event.file.id);
			siofuServer.abort(event.file.id, socket);
		}
	});
	siofuServer.dir = "uploads";
	siofuServer.maxFileSize = 2000;
	siofuServer.listen(socket);
});

module.exports = app;
