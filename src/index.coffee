less = require 'less'
sysPath = require 'path'
progeny = require 'progeny'

module.exports = class LESSCompiler
  brunchPlugin: yes
  type: 'stylesheet'
  extension: 'less'

  constructor: (@config) ->
    @getDependencies = progeny()

  compile: (data, path, callback) ->
    parser = new less.Parser
      paths: [@config.paths.root, (sysPath.dirname path)],
      filename: path,
      dumpLineNumbers: if @config.optimize then null else @config.plugins?.less?.dumpLineNumbers
    parser.parse data, (error, tree) =>
      return callback error.message if error?
      result = null
      err = null

      try
        result = tree.toCSS()
      catch ex
        err = "#{ex.type}Error:#{ex.message}"
        if ex.filename
          err += " in '#{ex.filename}:#{ex.line}:#{ex.column}'"
      callback err, result
