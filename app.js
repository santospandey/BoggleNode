var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var compression = require('compression');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dictionaryRouter = require('./routes/dictionary');
var fs = require('fs');
var os = require('os');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('common'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

function start() {
  fs.readFile('./dictionary.txt', { encoding: 'utf-8' }, function (err, data) {
    if (err) {
      throw new Error("Error while reading dictionary");
    }
    let dictionary = {};
    let arr = data.split(os.EOL);
    let length = arr.length;
    for (var i = 0; i < length; i++) {
      dictionary[arr[i]] = true;
    }

    app.locals.dictionary = dictionary;
  });
}

start();

app.use(express.static(path.join(__dirname, 'public', 'build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'build'));
});

app.use('/dictionary', dictionaryRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
