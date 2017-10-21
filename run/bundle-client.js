'use strict';

const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');

const binPath = path.resolve('node_modules', '.bin');
const begin = Date.now();
const bld = 'dist/requerio.min.js';
const src = 'dist/requerio.module.js';

let cmd = `${binPath}/browserify ${src} | `;
cmd += `${binPath}/uglifyjs -o ${bld}`;

exec(cmd, (err, stdout, stderr) => {
  if (err) {
    throw err;
  }

  /* eslint-disable no-console */
  if (stdout) {
    console.log(stdout);
  }

  if (stderr) {
    console.error(stderr);
  }

  if (fs.existsSync(bld)) {
    const end = Date.now();
    const elapsed = end - begin;

    console.log();
    console.log('\x1b[1m\x1b[36m' + src + '\x1b[0m\x1b[36m → \x1b[1m' + bld + '\x1b[0m\x1b[36m' + '...' + '\x1b[0m');
    console.log('\x1b[32m' + 'created ' + `\x1b[1m${bld} ` + '\x1b[0m\x1b[32m' + 'in \x1b[1m' + `${elapsed}ms` +
      '\x1b[0m');
  }
});
