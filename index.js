'use strict';

const less = require('less');
const sysPath = require('path');
const progeny = require('progeny');

const postcss = require('postcss');
const postcssModules = require('postcss-modules');
const anymatch = require('anymatch');

const cssModulify = (path, data, map) => {
  let json = {};
  const getJSON = (_, _json) => json = _json;

  return postcss([postcssModules({getJSON})]).process(data, {from: path, map}).then(x => {
    const exports = 'module.exports = ' + JSON.stringify(json) + ';';
    return { data: x.css, map: x.map, exports };
  });
};

class LESSCompiler {
  constructor(config) {
    this.config = config.plugins.less || {};
    this.rootPath = config.paths.root;
    this.optimize = config.optimize;

    this.modules = this.config.modules || this.config.cssModules;
    
    this.isIgnored = anymatch(this.config.ignore);
    
    delete this.config.modules;
    delete this.config.cssModules;
  }

  getDependencies(file) {
    return new Promise((resolve, reject) => {
      progeny({rootPath: this.rootPath})(file.path, file.data, (err, deps) => {
        if (!err) {
          const re = /data-uri\s*\(\s*("|'|)([^)]*)\1\s*\)/g;
          let match;
          while (match = re.exec(file.data)) {
            deps.push(sysPath.join(sysPath.dirname(file.path), match[2]));
          }
        }
        if (err) reject(err);
        else resolve(deps);
      });
    });
  }

  compile(file) {
    const data = file.data;
    const path = file.path;
    const config = Object.assign({}, this.config, {
      paths: [this.rootPath, sysPath.dirname(path)],
      filename: path,
      dumpLineNumbers: !this.optimize && this.config.dumpLineNumbers
    });

    if (this.isIgnored(file.path)) return Promise.resolve(file);

    return less.render(data, config).then(output => {
      const data = output.css;
      return this.modules ? cssModulify(path, data) : {data};
    }, err => {
      let msg = `${err.type}Error: ${err.message}`;
      if (err.filename) {
        msg += ` in "${err.filename}:${err.line}:${err.column}"`;
      }
      throw msg;
    });
  }
}

LESSCompiler.prototype.brunchPlugin = true;
LESSCompiler.prototype.type = 'stylesheet';
LESSCompiler.prototype.extension = 'less';


module.exports = LESSCompiler;
