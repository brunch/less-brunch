## less-brunch
Adds [LESS](http://lesscss.org/) support to
[brunch](http://brunch.io).

## Usage
Install the plugin via npm with `npm install --save less-brunch`.

Or, do manual install:

* Add `"less-brunch": "x.y.z"` to `package.json` of your brunch app.
  Pick a plugin version that corresponds to your minor (y) brunch version.
* If you want to use git version of plugin, add
`"less-brunch": "git+ssh://git@github.com:brunch/less-brunch.git"`.

### Options
Print source-file references in output via brunch config (supported options: ['comments', 'mediaquery', 'all']):
```
config:
  plugins:
    less:
      dumpLineNumbers: 'comments'
```
