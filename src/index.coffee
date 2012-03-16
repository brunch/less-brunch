less = require 'less'
sysPath = require 'path'

module.exports = class LESSCompiler
  brunchPlugin: yes
  type: 'stylesheet'
  extension: 'less'

  constructor: (@config) ->
    null

  compile: (data, path, callback) ->
    less.render data, callback
