'use strict';

const fs = require('fs');
const path = require('path');

const delimitStrStart = 'switch \\(action.method\\) \\{';
const delimitStrStop = 'end switch \\(action.method\\)';
const regexStr = delimitStrStart + '[\\S\\s]*' + delimitStrStop;
const regex = new RegExp(regexStr);

const reducerGet = fs.readFileSync(path.join(__dirname, '..', 'src', 'reducer-get.js'), 'utf8');
const match = reducerGet.match(regex);

if (match) {
  const methods = match[0];
  const regexForComments = /\/\*\*[\S\s]*?\*\//g;
  const comments = methods.match(regexForComments);

  let md = '';

  if (comments) {
    for (let comment of comments) {
      md += comment.slice(3, -2);
    }
  }

  fs.writeFileSync(path.join(__dirname, '..', 'docs', 'README.md'), md);
}
