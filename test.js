var expect = require('chai').expect;
var Plugin = require('./');

describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({
      paths: {root: '.'},
      plugins: {
        less: {
          globalVars: {
            requiredColor: '#abcdef'
          },
          modifyVars: {
            overridableColor: '#123456'
          }
        }
      }
    });
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok;
  });

  it('should has #compile method', function() {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result', function(done) {
    var content = '@color: #4D926F; #header {color: @color;}';
    var expected = '#header {\n  color: #4d926f;\n}\n';

    plugin.compile({data: content, path: 'style.less'}, function(error, result) {
      expect(error).not.to.be.ok;
      expect(result.data).to.equal(expected)
      done();
    });
  });

  it('should allow `globalVars` to be passed in via plugins config', function(done) {
    var content = '#header {color: @requiredColor;}';
    var expected = '#header {\n  color: #abcdef;\n}\n';

    plugin.compile({data: content, path: 'style.less'}, function(error, result) {
      expect(error).not.to.be.ok;
      expect(result.data).to.equal(expected)
      done();
    });
  });

  it('should allow `modifyVars` to be passed in via plugins config', function(done) {
    var content = '@overridableColor: #4D926F; #header {color: @overridableColor;}';
    var expected = '#header {\n  color: #123456;\n}\n';

    plugin.compile({data: content, path: 'style.less'}, function(error, result) {
      expect(error).not.to.be.ok;
      expect(result.data).to.equal(expected)
      done();
    });
  });

  it('should handle invalid less gracefully', function(done) {
    var content = '#header {color: @color;}';
    var expected = 'NameError:variable @color is undefined in "style.less:2:16"';

    plugin.compile({data: content, path: 'style.less'}, function(error, result) {
      expect(error).to.be.ok;
      expect(error).to.equal(expected);
      done();
    });
  });
});
