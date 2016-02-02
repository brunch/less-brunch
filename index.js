'use strict';

const less = require('less');
const sysPath = require('path');
const progeny = require('progeny');

class LESSCompiler {
  constructor(config) {
    if (config == null) config = {};

    this.config = config && config.plugins && config.plugins.less || {};
    this.rootPath = config.paths.root;
    this.optimize = config.optimize;
    this.getDependencies = progeny({rootPath: this.rootPath, reverseArgs: true});
  }

  compile(params) {
    const data = params.data;
    const path = params.path;

    return new Promise((resolve, reject) => {
      less.render(data, {
        paths: [this.rootPath, sysPath.dirname(path)],
        filename: path,
        plugins: this.config.plugins,
        dumpLineNumbers: !this.optimize && this.config.dumpLineNumbers
      }, (error, output) => {
        //console.log(error, output);
        if (error) {
          let err;
          err = '' + error.type + 'Error:' + error.message;
          if (error.filename) {
            err += ' in "' + error.filename + ':' + error.line + ':' + error.column + '"';
          }
          return reject(err);
        }
        return resolve({data: output.css});
      });
    });
  }
}

LESSCompiler.prototype.brunchPlugin = true;
LESSCompiler.prototype.type = 'stylesheet';
LESSCompiler.prototype.extension = 'less';


module.exports = LESSCompiler;
