var cheerio = require('cheerio');
var fs = require('fs');
var debug = require('debug')('helpers');

var TARGET_SCRIPT_PATH =
  module.exports.TARGET_SCRIPT_PATH =
  '/target/target-script-min.js#anonymous';

module.exports.injectWeinreIfHTML =
  function (filepath, hostname, port, callback) {
    var host = hostname + ':' + port;
    fs.readFile(filepath, 'utf8', function (err, data) {
      debug('HTML: %s', data);
      if (err) {
        debug('HTML: %s', err.message);
        return callback(err);
      }
      var $ = cheerio.load(data);
      var scriptSrc =
        '<script src="http://' + host + TARGET_SCRIPT_PATH + '"></script>'
      $('body').append(scriptSrc);

      callback(null, $.html());
    });
  };
