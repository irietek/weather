var express, server, path, favicon, logger, cookieParser, bodyParser, routes, forecast;

express       = require('express');
path          = require('path');
favicon       = require('serve-favicon');
logger        = require('morgan');
cookieParser  = require('cookie-parser');
bodyParser    = require('body-parser');

routes        = require('./routes/index');
forecast      = require('./routes/forecast');
app           = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/forecast', forecast);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

server = app.listen(3000, function(){
  var host, port;
  host = server.address().address;
  port = server.address().port;

  console.log('PilotWeather forecast app listening at http://%s:%s', host, port);
});
