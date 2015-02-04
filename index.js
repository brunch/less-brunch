var less = require('less');
var sysPath = require('path');
var progeny = require('progeny');
var extend = require('util-extend');

function LESSCompiler(config) {
  if (config == null) config = {};
  if (config.plugins == null) config.plugins = {};

  this.options = extend({}, config.plugins.less);
  if (config.optimize) {
    this.options.dumpLineNumbers = false;
  }
  this.rootPath = config.paths.root;
  this.getDependencies = progeny({rootPath: this.rootPath, reverseArgs: true});
}

LESSCompiler.prototype.brunchPlugin = true;
LESSCompiler.prototype.type = 'stylesheet';
LESSCompiler.prototype.extension = 'less';

LESSCompiler.prototype.compile = function(params, callback) {
  var data = params.data;
  var path = params.path;

  var options = extend({}, this.options);
  options.paths = [this.rootPath, sysPath.dirname(path)];
  options.filename = path;
  less.render(data, options, function(error, output) {
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
