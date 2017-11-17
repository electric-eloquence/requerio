const assert = require('assert');
const fs = require('fs');

const cheerio = require('cheerio');
const Redux = global.Redux = require('redux');
const Requerio = require('../dist/requerio.module');

const html = fs.readFileSync('./index.html', 'utf8');
const $ = global.$ = cheerio.load(html);

const $organisms = {
  'window': null,
  'html': null,
  'body': null,
  '#main': null,
  '.main__section--0': null,
  '.main__section--1': null
};

function actionsGet(requerio) {
  return {
    mainHide: () => {
      requerio.$orgs['#main'].dispatchAction('css', ['display', 'none']);
    },

    mainShow: () => {
      requerio.$orgs['#main'].dispatchAction('css', ['display', 'block']);
    }
  };
}

const requerio = new Requerio($, Redux, $organisms, actionsGet);
requerio.init();
const actions = actionsGet(requerio);

/* Test */

actions.mainHide();
const hiddenDisplayStyle = requerio.$orgs['#main'].getState().style.display;
assert.equal(hiddenDisplayStyle, 'none');

actions.mainShow();
const shownDisplayStyle = requerio.$orgs['#main'].getState().style.display;
assert.equal(shownDisplayStyle, 'block');

console.log('Tests passed'); // eslint-disable-line no-console