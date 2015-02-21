var helpers = require('../helpers');
var expect = require('expect.js');
var path = require('path');
var cheerio = require('cheerio');
var debug = require('debug')('test');

describe('injectWeinreIfHTML', function () {
  it('should inject weinre if the specified file is HTML', function (done) {
    var filepath = path.join(__dirname, 'fixtures', 'good.html');
    var hostname = 'host';
    var port     = 9090;
    helpers
      .injectWeinreIfHTML(filepath, hostname, port, function (err, data) {
        if (err) { throw err; }
        debug('HTML: %s', data);
        var src =
          'http://' + hostname + ':' + port + helpers.TARGET_SCRIPT_PATH;
        var $ = cheerio.load(data);
        var $script = $('script');
        expect($script.length).to.not.be(0);
        expect($script.attr('src')).to.be(src);
        done();
      });
  });
});
