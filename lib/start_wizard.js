var Q = require('q');
var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');

var Utils = require('./utils');
var log = require('./logging').logger;

function getBody(req, cb) {
  req.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    var body = Buffer.concat(body).toString();
    cb(body);
  });
}

function handleApiCli(req, res) {
  getBody(req, function(body) {
    console.log('DOING CLI COMMAND', body);

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end('{"status": "success", "data": ""}');
  });

}

function handleApiEnv(req, res) {
  var appDirectory = process.cwd();
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({
    cwd: appDirectory
  }));
}


module.exports = {
  start: function() {
    var q = Q.defer();

    var app = connect();

    console.log('Starting Start Wizard From App Lib', __dirname);

    var serve = serveStatic(__dirname + '/assets/wizard');
    var server = http.createServer(function(req, res) {
      var done = finalhandler(req, res);

      if(req.url == '/api/env') {
        handleApiEnv(req, res);
        return;
      }
      if(req.url == '/api/cli') {
        handleApiCli(req, res);
        return;
      }

      serve(req, res, done);
    });

    // Listen
    app.use(server);
    try {
      runningServer = app.listen('8090', '0.0.0.0');
    } catch (ex) {
      Utils.fail('Failed to start the Ionic server: ' + ex.message);
    }

    log.info('√ Running dev server: ', chalk.cyan(options.devServer));

    return q.promise;
  }
}
