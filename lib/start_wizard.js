var Q = require('q');
var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');

var Utils = require('./utils');
var log = require('./logging').logger;

function handleApiCLI(req, res) {
  var body = [];
  req.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();

    console.log('DOING CLI COMMAND', body);
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end('{"status": "success", "data": ""}');
  });

}

module.exports = {
  start: function() {
    var q = Q.defer();

    var app = connect();

    console.log('Starting Start Wizard From App Lib', __dirname);

    var serve = serveStatic(__dirname + '/assets/wizard');
    var server = http.createServer(function(req, res) {
      var done = finalhandler(req, res);

      if(req.url == '/api/cli') {
        handleApiCLI(req, res);
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
