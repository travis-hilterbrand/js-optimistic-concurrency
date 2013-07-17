var express = require('express');
var http = require('http');
var _ = require('underscore');

var app = express();
var server = http.createServer(app);

// App Config
// ----------
app.configure(function() {
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(app.router);
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

// CORS
// ------
app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('cookie', JSON.stringify(req.cookies));
  next();
});

// Data
// ------
var Tests = {
  'test-1': {id:'test-1',name:'Test-1',hash:_.uniqueId('hash-')}
};

// Routes
// ------
var routes = {};
routes.get = function(req, res) {
  console.log(req.body);

  res.contentType('application/json');
  res.status(200).send(Tests['test-1']);
};
routes.put = function(req, res) {
  console.log(req.body);

  res.contentType('application/json');
  res.status(200).send('{}');
};

app.get('/Test', routes.get);
app.put('/Test', routes.put);

// Startup
// ------
var port = 5550;
server.listen(port);
console.log('Express server listening on port ' + port);
