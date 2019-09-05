'use strict';

const fs = require('fs');
const path = require('path');

// Using IIFEs to scope vars and to return from false conditions.
(() => {
  const delimitStrStart = 'switch \\(action.method\\) \\{';
  const delimitStrStop = 'end switch \\(action.method\\)';
  const regexStr = delimitStrStart + '[\\S\\s]*' + delimitStrStop;
  const regex = new RegExp(regexStr);

  const reducerGet = fs.readFileSync(path.join(__dirname, '..', 'src', 'reducer-get.js'), 'utf8');
  const match = reducerGet.match(regex);

  if (!match) {
    return;
  }

  const postInception = fs.readFileSync(path.join(__dirname, '..', 'src', 'post-inception.js'), 'utf8');
  const methods = match[0] + postInception;
  const regexForComments = /\/\*\*\n###[\S\s]*?\*\//g;
  const comments = methods.match(regexForComments);

  let md = '# Action Methods\n';

  if (!comments) {
    return;
  }

  for (let comment of comments) {
    md += comment.slice(3, -2);
  }

  fs.writeFileSync(path.join(__dirname, '..', 'docs', 'methods.md'), md);
})();

(() => {
  const delimitReadStart = 'export default \\(requerio\\) => \\{'
  const delimitReadStop = 'end export default \\(requerio\\)'
  const delimitWriteStart = '<!-- START GENERATED API DOC -->';
  const delimitWriteStop = '<!-- STOP GENERATED API DOC -->';
  const regexReadStr = delimitReadStart + '[\\S\\s]*' + delimitReadStop;
  const regexWriteStr = delimitWriteStart + '[\\S\\s]*' + delimitWriteStop;
  const regexRead = new RegExp(regexReadStr);
  const regexWrite = new RegExp(regexWriteStr);

  const prototypeOverride = fs.readFileSync(path.join(__dirname, '..', 'src', 'prototype-override.js'), 'utf8');
  const matchRead = prototypeOverride.match(regexRead);

  if (!matchRead) {
    return;
  }

  const props = matchRead[0];
  const regexForComments = /\/\*\*\n###[\S\s]*?\*\//g;
  const comments = props.match(regexForComments);

  let md = '';

  if (!comments) {
    return;
  }

  for (let comment of comments) {
    md += comment.slice(3, -2);
  }

  const readmeFile = path.join(__dirname, '..', 'docs', 'README.md');
  let readmeContent = fs.readFileSync(readmeFile, 'utf8');
  readmeContent = readmeContent.replace(regexWrite, delimitWriteStart + '\n\n' + md + delimitWriteStop);

  fs.writeFileSync(readmeFile, readmeContent);
})();
