var less = require('less');
var sysPath = require('path');
var progeny = require('progeny');

function LESSCompiler(config) {
  if (config == null) config = {};
  if (config.plugins == null) config.plugins = {};

  this.config = config.plugins.less || {};
  this.rootPath = config.paths.root;
  this.optimize = config.optimize;
  this.getDependencies = progeny({rootPath: this.rootPath});
}

LESSCompiler.prototype.brunchPlugin = true;
LESSCompiler.prototype.type = 'stylesheet';
LESSCompiler.prototype.extension = 'less';

LESSCompiler.prototype.compile = function(params, callback) {
  var data = params.data;
  var path = params.path;

  var parser = new less.Parser({
    paths: [this.rootPath, sysPath.dirname(path)].concat(this.config.paths || []),
    filename: path,
    dumpLineNumbers: !this.optimize && this.config.dumpLineNumbers
  });

  parser.parse(data, function(error, tree) {
    if (error != null) return callback(error.message);
    var result, err;
    try {
      result = tree.toCSS();
    } catch (ex) {
      err = '' + ex.type + 'Error:' + ex.message;
      if (ex.filename) {
        err += ' in "' + ex.filename + ':' + ex.line + ':' + ex.column + '"';
      }
    }

    return callback(err, {data: result});
  }, this.config.addtionalData || {});
};

module.exports = LESSCompiler;
