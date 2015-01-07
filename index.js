var less = require('less');
var sysPath = require('path');
var progeny = require('progeny');
var fs = require('fs');

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
  var path = params.path;
  
  var filePath = sysPath.join(this.rootPath, path);
  var fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });

  less.render(fileContent
    , {
        paths: [this.rootPath, sysPath.dirname(path)].concat(this.config.paths || []),  
        filename: path, 
        dumpLineNumbers: !this.optimize && this.config.dumpLineNumbers 
    }, function(error, output) {
        if (error != null) {
            var err;
            err = '' + error.type + 'Error:' + error.message;
            if (error.filename) {
                err += ' in "' + error.filename + ':' + error.line + ':' + error.column + '"';
            }
            return callback(err);
        }
        return callback(error, {data: output.css});
    });
};

module.exports = LESSCompiler;
