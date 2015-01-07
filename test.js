var expect = require('chai').expect;
var Plugin = require('./');

describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({paths: {root: '.'}});
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok;
  });

  it('should has #compile method', function() {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result', function(done) {
    var expected = '#header {\n  color: #4d926f;\n}\n';

    plugin.compile({path: 'test_files\\style.less'}, function(error, result) {
      expect(error).not.to.be.ok;
      expect(result.data).to.equal(expected)
      done();
    });
  });

  it('should handle invalid less gracefully', function(done) {
    var expected = 'NameError:variable @color is undefined in "test_files\\invalidLess.less:1:16"';

    plugin.compile({path: 'test_files\\invalidLess.less'}, function(error, result) {
      expect(error).to.be.ok;
      expect(error).to.equal(expected);
      done();
    });
  });
});
