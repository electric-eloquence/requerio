/**
 * This file needs to run after amd.js and before main.js and so must be named accordingly alphabetically.
 */

import fs from 'fs';
import path from 'path';

import * as Redux from 'redux';
import cheerio from 'cheerio';
import {expect} from 'chai';
import {JSDOM} from 'jsdom';

const html = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'index.html'), 'utf8');
const $ = global.$ = cheerio.load(html);
const {window} = new JSDOM(html);

delete global.define;
global.window = window;

// Using require so that Requerio is loaded after global.define is unset and global.window is set.
// Also need to invalidate the cached value from amd.js.
const requerioPath = '../../src/requerio';
delete require.cache[require.resolve(requerioPath)];
require(requerioPath);

const $organismsBefore = {
  'window': null,
  'document': null,
  'html': null,
  'body': null,
  '#main': null,
  '.main__section': null,
  '.main__section--0': null,
  '.main__section--1': null
};
const $organismsAfter = Object.assign({}, $organismsBefore);
const $organisms = $organismsAfter;
const requerio = new window.Requerio($, Redux, $organismsAfter);
const actions = {
  attrSet: () => {
    requerio.$orgs['#main'].dispatchAction('attr', ['data-test', 'test']);
  },

  attrSet1: () => {
    requerio.$orgs['.main__section'].dispatchAction('attr', ['data-test', 'test'], 1);
  },

  attrGet: () => {
    requerio.$orgs['#main'].dispatchAction('attr');
  },

  attrGet1: () => {
    requerio.$orgs['.main__section'].dispatchAction('attr', [], 1);
  },

  innerWidthWindow: () => {
    requerio.$orgs.window.dispatchAction('innerWidth', 1000);
  },

  innerHeightWindow: () => {
    requerio.$orgs.window.dispatchAction('innerHeight', 1000);
  }
};

describe('Requerio', function () {
  describe('on the DOM', function () {
    it('should instantiate correctly', function () {
      expect(requerio).to.be.an.instanceof(window.Requerio);
      expect(requerio).to.have.property('$');
      expect(requerio).to.have.property('Redux');
      expect(requerio).to.have.property('$orgs');
      expect(requerio).to.have.property('init');
      expect(requerio.$).to.equal($);
      expect(requerio.Redux).to.equal(Redux);
      expect(requerio.$orgs).to.equal($organismsAfter);
      expect(requerio.init).to.be.a('function');
    });

    it('should initialize correctly', function () {
      // Need to redeclare global.window because it gets unset surreptitiously while loading main.js.
      global.window = window;
      global.document = window.document;

      requerio.init();

      Object.keys($organismsBefore).forEach((selector) => {
        expect($organismsBefore[selector]).to.be.null;
      });
      Object.keys($organismsAfter).forEach((selector) => {
        const $organism = $organismsAfter[selector];

        expect($organism).to.be.an.instanceof(Object);
        expect($organism.selector).to.equal(selector);

        if (selector === 'window' || selector === 'document') {
          return;
        }

        expect($organism.hasRequerio).to.be.true;
        expect($organism.$members).to.be.an('array');
        expect($organism.dispatchAction).to.be.a('function');
        expect($organism.getState).to.be.a('function');
        expect($organism.getStore).to.be.a('function');
        expect($organism.populateMembers).to.be.a('function');
        expect($organism.setBoundingClientRect).to.be.a('function');
        expect($organism.scrollTop).to.be.a('function');
        expect($organism.width).to.be.a('function');
        expect($organism.height).to.be.a('function');
      });
    });

    it('should dispatch the "attr" action', function () {
      actions.attrSet();

      const $org = $organisms['#main'];
      $org[0].attributes = {};
      delete $org[0].attribs;
      $org[0].attributes[0] = {name: 'data-test', value: 'test'};
      $org[0].attributes.length = 1;
      actions.attrGet();
      // Do not call $org.getState() which will reset state.attribs.
      const state = $org.getStore().getState()['#main'];

      expect(state.attribs['data-test']).to.equal('test');
    });

    it('should dispatch the "attr" action in a targeted manner', function () {
      actions.attrSet1();

      const $org = $organisms['.main__section'];
      $org[0].attributes = {};
      $org[1].attributes = {};
      delete $org[0].attribs;
      delete $org[1].attribs;
      $org[1].attributes[0] = {name: 'data-test', value: 'test'};
      $org[1].attributes.length = 1;
      actions.attrGet1();
      // Do not call $org.getState() which will reset state.attribs.
      const state = $org.getStore().getState()['.main__section'].$members[1];

      expect(state.attribs['data-test']).to.equal('test');
    });

    it('should dispatch the "innerWidth" action on the "window" $organism', function () {
      actions.innerWidthWindow();
      const state = $organisms.window.getState();

      expect(state.innerWidth).to.equal(1024);
    });

    it('should dispatch the "innerHeight" action on the "window" $organism', function () {
      actions.innerHeightWindow();
      const state = $organisms.window.getState();

      expect(state.innerHeight).to.equal(1000);
    });
  });
});
