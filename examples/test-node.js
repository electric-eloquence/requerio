const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {JSDOM} = require('jsdom');
const Redux = global.Redux = require('redux');
const Requerio = require(path.join(__dirname, '..', 'dist', 'requerio.npm.js'));

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const {window} = new JSDOM(html);
global.window = window;
global.document = window.document;
const $ = global.$ = require('jquery');

const $organisms = {
  window: null,
  html: null,
  body: null,
  '#main': null,
  '.main__section--0': null,
  '.main__section--1': null
};

function behaviorsGet(requerio) {
  return {
    mainHide: () => {
      requerio.$orgs['.main__section--1'].dispatchAction('css', {display: 'none'});
    },

    mainShow: () => {
      requerio.$orgs['.main__section--1'].dispatchAction('css', {display: 'block'});
    }
  };
}

const requerio = new Requerio($, Redux, $organisms);
requerio.init();
const behaviors = behaviorsGet(requerio);

/* Test */

behaviors.mainHide();
const hiddenDisplayCss = requerio.$orgs['.main__section--1'].getState().css.display;
assert.equal(hiddenDisplayCss, 'none');

behaviors.mainShow();
const shownDisplayCss = requerio.$orgs['.main__section--1'].getState().css.display;
assert.equal(shownDisplayCss, 'block');

console.log('Tests passed'); // eslint-disable-line no-console
