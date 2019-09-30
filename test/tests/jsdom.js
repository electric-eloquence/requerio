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
global.document = window.document;

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
  'input': null,
  '#main': null,
  '.main__input': null,
  '.main__section': null,
  '.main__section--0': null,
  '.main__section--1': null,
  '#yoda__input': null
};
const $organismsAfter = Object.assign({}, $organismsBefore);
const requerio = new window.Requerio($, Redux, $organismsAfter);

describe('Requerio', function () {
  describe('on the DOM', function () {
    describe('instantiation and initialization', function () {
      it('instantiates correctly', function () {
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

      it('initializes correctly', function () {
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
    });

    describe('"attr" action', function () {
      let $org;

      before(function () {
        $org = requerio.$orgs['.main__section'];

        $org.each((i, elem) => {
          delete elem.attribs;
          elem.attributes = {};
        });
      });

      after(function () {
        $org.each((i, elem) => {
          elem.attribs = {};
          delete elem.attributes;
        });
      });

      it('dispatches the "attr" action', function () {
        $org[0].attributes = {};
        $org[0].attributes[0] = {name: 'data-test', value: 'test2'};
        $org[0].attributes.length = 1;

        $org.dispatchAction('attr');

        // Do not call $org.getState() which will reset state.attribs.
        const state = requerio.store.getState()['.main__section'];

        expect(state.attribs['data-test']).to.equal('test2');
      });

      it('dispatches the "attr" action on a single target', function () {
        $org[1].attributes[0] = {name: 'data-test', value: 'test1'};
        $org[1].attributes.length = 1;

        $org.dispatchAction('attr', null, 1);

        // Do not call $org.getState() which will reset state.attribs.
        const state = requerio.store.getState()['.main__section'].$members[1];

        expect(state.attribs['data-test']).to.equal('test1');
      });

      it('dispatches the "attr" action on multiple targets', function () {
        $org[0].attributes[0] = {name: 'data-test', value: 'test2'};
        $org[0].attributes.length = 1;
        $org[1].attributes[0] = {name: 'data-test', value: 'test2'};
        $org[1].attributes.length = 1;

        $org.dispatchAction('attr', null, [0, 1]);

        // Do not call $org.getState() which will reset state.attribs.
        const state0 = requerio.store.getState()['.main__section'].$members[0];
        const state1 = requerio.store.getState()['.main__section'].$members[1];

        expect(state0.attribs['data-test']).to.equal('test2');
        expect(state1.attribs['data-test']).to.equal('test2');
      });
    });

    describe('other actions', function () {
      it('dispatches the "focus" action', function () {
        requerio.$orgs['.main__input'].dispatchAction('focus');

        const state = requerio.$orgs.document.getState();

        expect(state.activeOrganism).to.equal('.main__input');
      });

      it('dispatches the "blur" action', function () {
        requerio.$orgs['.main__input'].dispatchAction('blur');

        const state = requerio.$orgs.document.getState();

        expect(state.activeOrganism).to.be.null;
      });

      it('picks up on a user-enacted focus on an id selector', function () {
        const stateBefore = requerio.$orgs.document.getState();

        document.querySelector('#yoda__input').focus();

        const stateAfter = requerio.$orgs.document.getState();

        expect(stateBefore.activeOrganism).to.not.equal(stateAfter.activeOrganism);
        // User-enacted focus cannot specifically target the organism by id if the tagname is an organism as well.
        expect(stateAfter.activeOrganism).to.equal('input');

        requerio.$orgs['input'].dispatchAction('blur');
        document.querySelector('#yoda__input').blur();
      });

      it('picks up on a user-enacted focus on a class selector', function () {
        const stateBefore = requerio.$orgs.document.getState();

        document.querySelector('.main__input').focus();

        const stateAfter = requerio.$orgs.document.getState();

        expect(stateBefore.activeOrganism).to.not.equal(stateAfter.activeOrganism);
        // User-enacted focus cannot specifically target the organism by class if the tagname is an organism as well.
        expect(stateAfter.activeOrganism).to.equal('input');
      });

      it('picks up on a user-enacted focus on a tag selector', function () {
        // Testing mainly for coverage.
        document.querySelector('input').focus();

        const stateAfter = requerio.$orgs.document.getState();

        expect(stateAfter.activeOrganism).to.equal('input');
      });

      it('dispatches the "getBoundingClientRect" action on "window" but does not update its state', function () {
        const stateBefore = requerio.$orgs.window.getState();

        requerio.$orgs['window'].dispatchAction('getBoundingClientRect');

        const stateAfter = requerio.$orgs.window.getState();

        expect(JSON.stringify(stateBefore)).to.equal('{"data":null,"scrollTop":null,"width":null,"height":null}');
        expect(JSON.stringify(stateAfter)).to.equal('{"data":null,"scrollTop":null,"width":null,"height":null}');
      });

      it('dispatches the "innerWidth" action on the "window" organism', function () {
        requerio.$orgs['window'].dispatchAction('innerWidth');

        const state = requerio.$orgs.window.getState();

        expect(state.innerWidth).to.equal(1024);
      });

      it('dispatches the "innerHeight" action on the "window" organism', function () {
        requerio.$orgs['window'].dispatchAction('innerHeight');

        const state = requerio.$orgs.window.getState();

        expect(state.innerHeight).to.equal(768);
      });
    });
  });
});
