var express = require('express');
var path = require('path');
var cheerio = require('cheerio');
var child_process = require('child_process');
var helpers = require('./helpers');
var os = require('os');

var weinrePort = 9090;
var port = 8080;
var weinrepath = path.join(__dirname, 'node_modules/weinre/weinre');

var weinre = child_process.spawn(weinrepath, [
  '--httpPort', weinrePort.toString()
]);

weinre.stdout.pipe(process.stdout);
weinre.stderr.pipe(process.stderr);

var app = express();

app.use(function (req, res, next) {
  console.log(req.path, req.path[req.path.length - 1]);
  if (req.path[req.path.length - 1] === '/' || path.extname(req.path).toLowerCase() === '.html') {
    var p = req.path;
    if (p[p.length - 1] === '/') {
      p += 'index.html';
    }
    helpers
      .injectWeinreIfHTML(
        path.join(process.cwd(), p),
        req.hostname,
        weinrePort,
        function (err, data) {
          console.log('Good');
          if (err) { return next(); }
          res.set('Content-Type', 'text/html').send(data);
        }
      );
    return;
  }
  next();
});
app.use(express.static(process.cwd()))

app.listen(port, function () {
  var interfaces = os.networkInterfaces();
  console.log('Try any of:');
  Object.keys(interfaces).forEach(function (key) {
    interfaces[key].forEach(function (interface) {
      process.stdout.write('  ');
      if (interface.family === 'IPv6') {
        process
          .stdout.write('http://[' + interface.address + ']:' + port + '\n');
      } else {
        process
          .stdout.write('http://' + interface.address + ':' + port + '\n');
      }
    });
  });
});
