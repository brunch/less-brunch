describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({});
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok();
  });

  it('should has #compile method', function() {
    expect(plugin.compile).to.be.a(Function);
  });

  it('should compile and produce valid result', function(done) {
    var content = '@color: #4D926F; #header {color: @color;}';
    var expected = '#header {\n  color: #4d926f;\n}\n';

    plugin.compile(content, 'style.less', function(error, data) {
      expect(error).not.to.be.ok();
      expect(data).to.equal(expected)
      done();
    });
  });
});
