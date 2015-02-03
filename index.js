var less = require('less');
var sysPath = require('path');
var progeny = require('progeny');

function LESSCompiler(config) {
  if (config == null) config = {};
  if (config.plugins == null) config.plugins = {};

  this.config = config.plugins.less || {};
  this.rootPath = config.paths.root;
  if (config.optimize) {
    this.config.dumpLineNumbers = false;
  }
  this.getDependencies = progeny({rootPath: this.rootPath, reverseArgs: true});
}

LESSCompiler.prototype.brunchPlugin = true;
LESSCompiler.prototype.type = 'stylesheet';
LESSCompiler.prototype.extension = 'less';

LESSCompiler.prototype.compile = function(params, callback) {
  var data = params.data;
  var path = params.path;

  this.config.paths = [this.rootPath, sysPath.dirname(path)];
  this.config.filename = path;
  less.render(data, this.config, function(error, output) {
    if (error != null) {
      var err;
      err = '' + error.type + 'Error:' + error.message;
      if (error.filename) {
        err += ' in "' + error.filename + ':' + error.line + ':' + error.column + '"';
      }
      return callback(err);
    }
    return callback(error, {
      data: output.css
    });
  });
};

module.exports = LESSCompiler;
