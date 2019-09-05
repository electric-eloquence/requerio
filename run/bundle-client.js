'use strict';

process.chdir(__dirname);

const babelify = require('babelify');
const browserify = require('browserify');
const fs = require('fs');
const uglifyES = require('uglify-es');

const begin = Date.now();
const bld = '../dist/requerio.min.js';
const src = '../dist/requerio.npm.js';

browserify(src)
  .transform(babelify, {presets: ['@babel/preset-env']})
  .bundle((err, buf) => {
    if (err) {
      throw err;
    }

    const browserified = buf.toString('utf8');
    const uglified = uglifyES.minify(browserified);

    if (uglified.error) {
      throw uglified.error;
    }

    fs.writeFileSync(bld, uglified.code);

    const end = Date.now();
    const elapsed = end - begin;

    console.log();
    console.log('\x1b[1m\x1b[36m' + src + '\x1b[0m\x1b[36m → \x1b[1m' + bld + '\x1b[0m\x1b[36m' + '...' + '\x1b[0m');
    console.log('\x1b[32m' + 'created ' + `\x1b[1m${bld} ` + '\x1b[0m\x1b[32m' + 'in \x1b[1m' + `${elapsed}ms` +
      '\x1b[0m');
  });
