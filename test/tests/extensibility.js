delete global.window;

import fs from 'fs';
import path from 'path';

import * as Redux from 'redux';
import cheerio from 'cheerio';
import {expect} from 'chai';

import Requerio from '../../src/requerio';

const html = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'index.html'), 'utf8');
const $ = global.$ = cheerio.load(html);

const timeout = 100;

const $organisms = {
  'window': null,
  'document': null,
  'html': null,
  'body': null,
  '#main': null,
  '.main__section': null,
  '.main__section--0': null,
  '.main__section--1': null
};
$.prototype.addExtensibility = function () {
  console.log('extensibility added! (jk)'); // eslint-disable-line no-console
};
$.prototype.handleExtensibility = function () {
  console.log('extensibility handled! (jk)'); // eslint-disable-line no-console
};
$.prototype.removeExtensibility = function () {
  console.log('extensibility removed! (jk)'); // eslint-disable-line no-console
};
function customReducer(state, action) {
  switch (action.method) {
    case 'addExtensibility':
      state.extensible = true;
      state[action.args[0]] = action.args[1];
      break;

    case 'handleExtensibility':
      state.handle = () => {};
      break;

    case 'removeExtensibility':
      state.extensible = false;
      break;
  }

  return state;
}
const customMiddleware = () => next => action => {
  switch (action.method) {
    case 'deferExtensibility': {
      console.log('extensibility deferred! (jk)'); // eslint-disable-line no-console

      const startTime = Date.now();
      action.promise = new Promise((resolve) => {
        setTimeout(() => {
          action.$org.dispatchAction('addExtensibility', ['elapsed', Date.now() - startTime]);
          resolve();
        }, timeout);
      });

      return next(action);
    }

    default: {
      return next(action);
    }
  }
};

const requerio = new Requerio($, Redux, $organisms, customReducer, Redux.applyMiddleware(customMiddleware));
requerio.init();

describe('Requerio', function () {
  describe('extensibility', function () {
    it('should accept a custom reducer', function () {
      const $org = requerio.$orgs['#main'];
      $org.dispatchAction('addExtensibility');
      const state = $org.getState();

      expect(state.extensible).to.be.true;
    });

    it('should handle an incorrect state property type in a custom reducer', function () {
      const $org = requerio.$orgs['#main'];
      $org.dispatchAction('handleExtensibility');
      const state = $org.getState();

      expect(state.handle).to.be.undefined;
    });

    it('should accept custom middleware', function (done) {
      const $org = requerio.$orgs['#main'];
      $org.dispatchAction('removeExtensibility');
      const stateBefore = $org.getState();

      $org.dispatchAction('deferExtensibility').promise.then(() => {
        const stateAfter = $org.getState();

        expect(stateBefore.extensible).to.be.false;
        expect(stateAfter.extensible).to.be.true;
        expect(stateAfter.elapsed).to.be.a('number');
        expect(stateAfter.elapsed).to.not.be.below(timeout);
        done();
      });
    });
  });
});
