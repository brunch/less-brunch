## less-brunch
Adds [LESS](http://lesscss.org/) support to
[brunch](http://brunch.io).

## Usage
`npm install --save less-brunch`

### Options
Print source-file references in output by setting `dumpLineNumbers` in your
`brunch-config` (only available when `optimize` option is disabled):

```coffee
  plugins:
    less:
      dumpLineNumbers: 'comments' # other options: 'mediaquery', 'all'
```

Set or override global variables using `globalVars` and `modifyVars` respectively.

```coffee
  plugins:
    less:
      globalVars:
        requiredColor: '#abcdef'
      modifyVars: {
        overridableColor: '#123456'
```

## License

The MIT License (MIT)

Copyright (c) 2012 - 2015 Paul Miller (http://paulmillr.com) & Elan Shanker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
