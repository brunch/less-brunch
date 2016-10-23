/* eslint-env mocha */
/* eslint no-unused-expressions: off */

var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var Plugin = require('./');

describe('Plugin', () => {
  var plugin;

  beforeEach(() => {
    plugin = new Plugin({paths: {root: '.'}});
  });

  it('should be an object', () => {
    expect(plugin).to.be.ok;
  });

  it('should has #compile method', () => {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result', (done) => {
    var content = '@color: #4D926F; #header {color: @color;}';
    var expected = '#header {\n  color: #4D926F;\n}\n';

    plugin.compile({data: content, path: 'style.less'}).then(result => {
      expect(result.data).to.equal(expected);
      done();
    }, error => expect(error).not.to.be.ok);
  });

  it('should handle invalid less gracefully', (done) => {
    var content = '#header {color: @color;}';
    var expected = 'NameError:variable @color is undefined in "style.less:1:16"';

    plugin.compile({data: content, path: 'style.less'}).then(null, error => {
      expect(error).to.equal(expected);
      done();
    });
  });

  it('should correctly identify stylesheet and data-uri dependencies', (done) => {
    var file = 'test-files/test-dependency-resolution.less';
    var content = fs.readFileSync(path.join(__dirname, file));


    plugin.getDependencies({data: content, path: file}).then(deps => {
      expect(deps).to.eql([
        path.join('test-files', 'test-include.less'),
        path.join('test-files', 'img', 'foo.jpg')
      ]);
      done();
    });
  });
});
