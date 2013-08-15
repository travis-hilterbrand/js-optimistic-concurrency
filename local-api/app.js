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
var getModel = function(req, res) {
  var model = Tests[req.params.id];
  if (!model) {
    res.status(404).send('{error:"Unable to find model"}');
    return null;
  }
  return model;
};

var routes = {};
routes.getAll = function(req, res) {
  console.log(req.body);

  res.contentType('application/json');
  res.status(200).send(JSON.stringify(Tests));
};
routes.get = function(req, res) {
  console.log(req.body);
  res.contentType('application/json');

  var model = getModel(req, res);
  if (!model) return;

  res.status(200).send(JSON.stringify(model));
};
routes.put = function(req, res) {
  console.log('put', req.params);
  console.log(req.body);
  res.contentType('application/json');

  var model = getModel(req, res);
  if (!model) return;
  if (req.body.hash !== model.hash) {
    // to keep things simple, just use hash saved in the model
    // see resources in the README for production
    var data = _.extend(model, {
      error:'Invalid hash'
    });
    res.status(412).send(JSON.stringify(data));
    return;
  }

  model = req.body;
  model.hash = _.uniqueId('hash-');
  Tests[model.id] = model;
  res.status(200).send(JSON.stringify(model));
};

app.get('/Test', routes.getAll);
app.get('/Test/:id', routes.get);
app.put('/Test/:id', routes.put);

// Startup
// ------
var port = 5550;
server.listen(port);
console.log('Express server listening on port ' + port);
