var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var coffeeRouter = require('./routes/coffee');
var boardRouter = require('./routes/board');
var recommendRouter = require('./routes/recommend');

var mysql = require('mysql');


var app = express();

/*
//db 연동
var sql = require('./db_sql_test')();

sql.select(function (err, data) {
    if (err) console.log(err);
    else console.log(data);

    sql.pool.end(function (err) {
        if (err) console.log(err);
        else {
            console.log('Connection pool has closed');
            console.log('app.js finished');
        }
    });
});
*/


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/coffee', coffeeRouter);
app.use('/board', boardRouter);
app.use('/recommend', recommendRouter);


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
