
/**
 * Module dependencies.
 */

var express = require('express')
  , config = require('./config/settings')  
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || config.port);
  app.set('views', __dirname  + config.view_folder);
  app.set('view options', { pretty: true });
  app.set('view engine', config.view_engine);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.cookie));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + config.static_folder));
  app.use(express.static(path.join(__dirname, config.static_folder)));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./config/routes.js')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

