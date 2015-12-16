var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');

var flash = require('connect-flash');

var app = express();

//===========passport set up============
var passport = require('passport');
require('./config/passport')(passport);

//======================================

app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var session = require('express-session');

app.use(session({
	secret: 'jonamislearning',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

//changed routing addition to pass in passport
require('./routes/index.js')(app, passport);

app.listen(8080);

module.exports = app;
