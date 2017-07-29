/* eslint-env mocha */
/* eslint no-unused-expressions: off */

'use strict';

const fs = require('fs');
const {join} = require('path');
const {expect} = require('chai');
const LESSCompiler = require('..');

const fixtures = join('test', 'fixtures');
const fixture = name => {
  const path = join(fixtures, name);
  const data = fs.readFileSync(path, 'utf-8');

  return {path, data}
};

describe('less-brunch', () => {
  let plugin;

  beforeEach(() => {
    plugin = new LESSCompiler({
      paths: {root: '.'},
      plugins: {
        less: {
          includePaths: [join(fixtures, 'include-paths')],
        },
      },
    });
  });

  it('should be an object', () => {
    expect(plugin).to.be.an.instanceof(LESSCompiler);
  });

  it('should have #compile method', () => {
    expect(plugin).to.respondTo('compile');
  });

  it('should compile and produce valid result', () => {
    const data = '@color: #4D926F; #header {color: @color;}';
    const compiled = '#header {\n  color: #4D926F;\n}\n';

    return plugin.compile({data, path: 'style.less'}).then(result => {
      expect(result.data).to.equal(compiled);
    });
  });

  it('should respect `includePaths` option', () => {
    const file = fixture('include-paths.less');
    const compiled = '.foo {\n  color: rebeccapurple;\n}\n';

    return plugin.compile(file).then(result => {
      expect(result.data).to.equal(compiled);
    });
  });

  it('should handle invalid less gracefully', () => {
    const data = '#header {color: @color;}';
    const msg = 'L1:16 NameError: variable @color is undefined';

    return plugin.compile({data, path: 'style.less'}).catch(error => {
      expect(error.toString()).to.equal(msg);
    });
  });

  it('should have #getDependencies method', () => {
    expect(plugin).to.respondTo('getDependencies');
  });

  it('should correctly identify stylesheet dependencies', () => {
    const file = fixture('data-uri.less');

    return plugin.getDependencies(file).then(deps => {
      expect(deps).to.include(
        join(fixtures, 'data-uri-double.less'),
        join(fixtures, 'data-uri-single.less')
      );
    });
  });

  it('should correctly identify data-uri dependencies', () => {
    const file = fixture('data-uri.less');

    return plugin.getDependencies(file).then(deps => {
      expect(deps).to.include(
        join(fixtures, 'img', 'foo.jpg'),
        join(fixtures, 'img', 'bar.jpg'),
        join(fixtures, 'img', 'baz.jpg')
      );
    });
  });
});
