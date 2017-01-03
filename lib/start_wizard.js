var Q = require('q');
var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');

var Utils = require('./utils');
var log = require('./logging').logger;

var Start = require('./start');

function getBody(req, cb) {
  var body = [];
  req.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    cb(body);
  });
}

function handleApiCli(req, res) {
  getBody(req, function(body) {

    var d = JSON.parse(body);
    console.log('DOING CLI COMMAND', d);

    Start.startApp({
       appDirectory: d.app.directory,
       appName: d.app.name,
       packageName: d.app.id,
       isCordovaProject: true,
       template: d.app.template,
       targetPath: Utils.getProjectDirectory({ appDirectory: d.app.directory }),
       v2: true
    })
    .then(function() {
      console.log('DONE');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end('{"status": "success", "data": ""}');
    })
    .catch(function(error) {
      log.error(error);
      throw error;
    });

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
