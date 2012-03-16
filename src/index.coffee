less = require 'less'
sysPath = require 'path'

module.exports = class LESSCompiler
  brunchPlugin: yes
  type: 'stylesheet'
  extension: 'less'

  constructor: (@config) ->
    null

  compile: (data, path, callback) ->
    parser = new less.Parser
      paths: [@config.rootPath, (sysPath.dirname path)],
      filename: path
    parser.parse data, (error, tree) =>
      return callback error.message if error?
      callback null, tree.toCSS()
