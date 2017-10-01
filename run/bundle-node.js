'use strict';

const {spawn} = require('child_process');
const path = require('path');

const binPath = path.resolve('node_modules', '.bin');

spawn(
  `${binPath}/rollup`,
  ['--output.format=cjs', '--output.file=dist/requerio-node.js', '--', 'src/requerio.js'],
  {stdio: 'inherit'}
);
