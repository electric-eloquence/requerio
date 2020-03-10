/**
 * This file needs to run after amd.js and before main.js and so must be named accordingly alphabetically.
 */
import fs from 'fs';
import path from 'path';

import * as Redux from 'redux';
import {expect} from 'chai';
import {JSDOM} from 'jsdom';

const html = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'index.html'), 'utf8');
const {window} = new JSDOM(html);

global.window = window;
global.document = window.document;
const $ = global.$ = require('jquery');

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
  '.has-child-test': null,
  '.has-parent-test': null,
  '.main__input': null,
  '.main__section': null,
  '.main__section--0': null,
  '.main__section--1': null,
  '#yoda__input': null
};
const $organismsAfter = Object.assign({}, $organismsBefore);
const requerio = new window.Requerio($, Redux, $organismsAfter);

describe('Requerio', function () {
  describe('with JSDOM and jQuery', function () {
    describe('instantiation and initialization', function () {
      it('instantiates correctly', function () {
        expect(requerio).to.be.an.instanceof(window.Requerio);
        expect(requerio).to.have.property('$');
        expect(requerio).to.have.property('Redux');
        expect(requerio).to.have.property('$orgs');
        expect(requerio).to.have.property('init');
        expect(requerio).to.have.property('incept');
        expect(requerio).to.have.property('store');
        expect(requerio.$).to.equal($);
        expect(requerio.Redux).to.equal(Redux);
        expect(requerio.$orgs).to.equal($organismsAfter);
        expect(requerio.init).to.be.a('function');
        expect(requerio.incept).to.be.a('function');
      });

      it('initializes correctly', function () {
        requerio.init();

        expect(requerio.store).to.be.an('object');
        expect(requerio.store).to.have.property('dispatch');
        expect(requerio.store).to.have.property('subscribe');
        expect(requerio.store).to.have.property('getState');
        expect(requerio.store).to.have.property('replaceReducer');

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

    describe('requerio instance after initialization', function () {
      it('incepts additional organisms', function () {
        requerio.incept('#yoda', '.midi-chlorian', '#cheshire-cat');

        expect(requerio.$orgs['#yoda']).to.be.an.instanceof($);
        expect(requerio.$orgs['.midi-chlorian']).to.be.an.instanceof($);
        expect(requerio.$orgs['#cheshire-cat']).to.be.an.instanceof($);
        expect(requerio.$orgs['#yoda'].hasRequerio).to.be.true;
        expect(requerio.$orgs['.midi-chlorian'].hasRequerio).to.be.true;
        expect(requerio.$orgs['#cheshire-cat'].hasRequerio).to.be.true;
      });
    });

    describe('prototype-override', function () {
      // .exclude() must be tested before manipulating the DOM because these test expect an unmanipulated DOM.
      describe('.exclude()', function () {
        describe('with a string argument', function () {
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.main__section'].$members.forEach(() => $membersLengthBefore++);
          });

          after(function () {
            requerio.$orgs['.main__section'].dispatchAction('removeClass', 'not');
          });

          it('excludes elements from members array when .exclude() is invoked', function () {
            $orgDuring = requerio.$orgs['.main__section'].exclude('.main__section--0');

            $orgDuring.$members.forEach(() => $membersLengthDuring++);
            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction is invoked after .exclude()', function () {
            $orgDuring.dispatchAction('addClass', 'not');

            $orgDuring.$members.forEach(() => $membersLengthAfter++);
            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('does not dispatch the action on the element specified by .exclude()', function () {
            const $org = requerio.$orgs['.main__section'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.not.include('not');
            expect(classList1).to.include('not');
          });
        });

        describe('with a DOM element argument', function () {
          const mainSection00 = $('.main__section--0')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.main__section'].$members.forEach(() => $membersLengthBefore++);
          });

          after(function () {
            requerio.$orgs['.main__section'].dispatchAction('removeClass', 'not');
          });

          it('excludes elements from members array when .exclude() is invoked', function () {
            $orgDuring = requerio.$orgs['.main__section'].exclude(mainSection00);

            $orgDuring.$members.forEach(() => $membersLengthDuring++);
            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .exclude()', function () {
            $orgDuring.dispatchAction('addClass', 'not');

            $orgDuring.$members.forEach(() => $membersLengthAfter++);
            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('does not dispatch the action on the element specified by .exclude()', function () {
            const $org = requerio.$orgs['.main__section'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.not.include('not');
            expect(classList1).to.include('not');
          });
        });

        describe('with a Cheerio argument', function () {
          const $mainSection0 = $('.main__section--0');
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.main__section'].$members.forEach(() => $membersLengthBefore++);
          });

          after(function () {
            requerio.$orgs['.main__section'].dispatchAction('removeClass', 'not');
          });

          it('excludes elements from members array when .exclude() is invoked', function () {
            $orgDuring = requerio.$orgs['.main__section'].exclude($mainSection0);

            $orgDuring.$members.forEach(() => $membersLengthDuring++);
            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .exclude()', function () {
            $orgDuring.dispatchAction('addClass', 'not');

            $orgDuring.$members.forEach(() => $membersLengthAfter++);
            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('does not dispatch the action on the element specified by .exclude()', function () {
            const $org = requerio.$orgs['.main__section'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.not.include('not');
            expect(classList1).to.include('not');
          });
        });

        describe('with a function argument', function () {
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          function excludeMainSection0(i, elem) {
            const classToExclude = 'main__section--0';

            return $(this).hasClass(classToExclude) &&
              $(elem).hasClass(classToExclude) &&
              $(requerio.$orgs['.main__section'].get(i)).hasClass(classToExclude);
          }

          before(function () {
            requerio.$orgs['.main__section'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.main__section'].exclude(excludeMainSection0);
          });

          after(function () {
            requerio.$orgs['.main__section'].dispatchAction('attr', {test: null});
          });

          it('excludes elements from members array when .exclude() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .exclude()', function () {
            $orgDuring.dispatchAction('attr', {test: 'test'});
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('does not dispatch the action on the element specified by .exclude()', function () {
            const $org = requerio.$orgs['.main__section'];
            const attribs0 = $org.getState(0).attribs;
            const attribs1 = $org.getState(1).attribs;

            expect(attribs0).to.not.have.property('test');
            expect(attribs1).to.have.property('test');
            expect(attribs1.test).to.equal('test');
          });
        });

        describe('with no argument', function () {
          it('returns the organism when "attr" is dispatched', function () {
            const retVal = requerio.$orgs['.main__section'].exclude('.main__section--0').dispatchAction('attr');

            expect(retVal).to.equal(requerio.$orgs['.main__section']);
          });

          it('returns the organism when "data" is dispatched', function () {
            const retVal = requerio.$orgs['.main__section'].exclude('.main__section--0').dispatchAction('data');

            expect(retVal).to.equal(requerio.$orgs['.main__section']);
          });

          it('returns the organism when "getBoundingClientRect" is dispatched', function () {
            const retVal = requerio.$orgs['.main__section'].exclude('.main__section--0')
              .dispatchAction('getBoundingClientRect');

            expect(retVal).to.equal(requerio.$orgs['.main__section']);
          });

          it('returns the organism when "innerWidth" is dispatched', function () {
            const retVal = requerio.$orgs['.main__section'].exclude('.main__section--0').dispatchAction('innerWidth');

            expect(retVal).to.equal(requerio.$orgs['.main__section']);
          });

          it('returns the organism when "innerHeight" is dispatched', function () {
            const retVal = requerio.$orgs['.main__section'].exclude('.main__section--0').dispatchAction('innerHeight');

            expect(retVal).to.equal(requerio.$orgs['.main__section']);
          });

          it('returns the organism when "scrollTop" is dispatched', function () {
            const retVal = requerio.$orgs['.main__section'].exclude('.main__section--0').dispatchAction('scrollTop');

            expect(retVal).to.equal(requerio.$orgs['.main__section']);
          });

          it('returns the organism when "width" is dispatched', function () {
            const retVal = requerio.$orgs['.main__section'].exclude('.main__section--0').dispatchAction('width');

            expect(retVal).to.equal(requerio.$orgs['.main__section']);
          });

          it('returns the organism when "height" is dispatched', function () {
            const retVal = requerio.$orgs['.main__section'].exclude('.main__section--0').dispatchAction('height');

            expect(retVal).to.equal(requerio.$orgs['.main__section']);
          });
        });
      });

      // .hasChild() must be tested before manipulating the DOM because these test expect an unmanipulated DOM.
      describe('.hasChild()', function () {
        describe('with a string argument', function () {
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.has-child-test'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.has-child-test'].hasChild('#yoda__input');
          });

          after(function () {
            requerio.$orgs['.has-child-test'].dispatchAction('removeClass', 'hasChild');
          });

          it('excludes elements from members array when .hasChild() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasChild()', function () {
            $orgDuring.dispatchAction('addClass', 'hasChild');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasChild()', function () {
            const $org = requerio.$orgs['.has-child-test'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.not.include('hasChild');
            expect(classList1).to.include('hasChild');
          });
        });

        describe('with a DOM element argument', function () {
          const yodaInputEl = $('#yoda__input')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.has-child-test'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.has-child-test'].hasChild(yodaInputEl);
          });

          after(function () {
            requerio.$orgs['.has-child-test'].dispatchAction('removeClass', 'hasChild');
          });

          it('excludes elements from members array when .hasChild() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasChild()', function () {
            $orgDuring.dispatchAction('addClass', 'hasChild');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasChild()', function () {
            const $org = requerio.$orgs['.has-child-test'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.not.include('hasChild');
            expect(classList1).to.include('hasChild');
          });
        });
      });

      // .hasElement() must be tested before manipulating the DOM because these test expect an unmanipulated DOM.
      describe('.hasElement()', function () {
        describe('with a DOM element argument', function () {
          const mainSection00 = $('.main__section--0')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.main__section'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.main__section'].hasElement(mainSection00);
          });

          after(function () {
            requerio.$orgs['.main__section'].dispatchAction('removeClass', 'hasElement');
          });

          it('excludes elements from members array when .hasElement() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasElement()', function () {
            $orgDuring.dispatchAction('addClass', 'hasElement');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasElement()', function () {
            const $org = requerio.$orgs['.main__section'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.include('hasElement');
            expect(classList1).to.not.include('hasElement');
          });
        });
      });

      // .hasNext() must be tested before manipulating the DOM because these test expect an unmanipulated DOM.
      describe('.hasNext()', function () {
        describe('with a string argument', function () {
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.main__section'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.main__section'].hasNext('.main__section--1');
          });

          after(function () {
            requerio.$orgs['.main__section'].dispatchAction('removeClass', 'hasNext');
          });

          it('excludes elements from members array when .hasNext() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasNext()', function () {
            $orgDuring.dispatchAction('addClass', 'hasNext');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasNext()', function () {
            const $org = requerio.$orgs['.main__section'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.include('hasNext');
            expect(classList1).to.not.include('hasNext');
          });
        });

        describe('with a DOM element argument', function () {
          const mainSection10 = $('.main__section--1')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.main__section'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.main__section'].hasNext(mainSection10);
          });

          after(function () {
            requerio.$orgs['.main__section'].dispatchAction('removeClass', 'hasNext');
          });

          it('excludes elements from members array when .hasNext() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasNext()', function () {
            $orgDuring.dispatchAction('addClass', 'hasNext');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasNext()', function () {
            const $org = requerio.$orgs['.main__section'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.include('hasNext');
            expect(classList1).to.not.include('hasNext');
          });
        });
      });

      // .hasParent() must be tested before manipulating the DOM because these test expect an unmanipulated DOM.
      describe('.hasParent()', function () {
        describe('with a string argument', function () {
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.has-parent-test'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.has-parent-test'].hasParent('#yoda');
          });

          after(function () {
            requerio.$orgs['.has-parent-test'].dispatchAction('removeClass', 'hasParent');
          });

          it('excludes elements from members array when .hasParent() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasParent()', function () {
            $orgDuring.dispatchAction('addClass', 'hasParent');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasParent()', function () {
            const $org = requerio.$orgs['.has-parent-test'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.not.include('hasParent');
            expect(classList1).to.include('hasParent');
          });
        });

        describe('with a DOM element argument', function () {
          const yodaEl = $('#yoda')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.has-parent-test'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.has-parent-test'].hasParent(yodaEl);
          });

          after(function () {
            requerio.$orgs['.has-parent-test'].dispatchAction('removeClass', 'hasParent');
          });

          it('excludes elements from members array when .hasParent() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasParent()', function () {
            $orgDuring.dispatchAction('addClass', 'hasParent');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasParent()', function () {
            const $org = requerio.$orgs['.has-parent-test'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.not.include('hasParent');
            expect(classList1).to.include('hasParent');
          });
        });
      });

      // .hasPrev() must be tested before manipulating the DOM because these test expect an unmanipulated DOM.
      describe('.hasPrev()', function () {
        describe('with a string argument', function () {
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.main__section'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.main__section'].hasPrev('.main__section--0');
          });

          after(function () {
            requerio.$orgs['.main__section'].dispatchAction('removeClass', 'hasPrev');
          });

          it('excludes elements from members array when .hasPrev() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasPrev()', function () {
            $orgDuring.dispatchAction('addClass', 'hasPrev');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasPrev()', function () {
            const $org = requerio.$orgs['.main__section'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.not.include('hasPrev');
            expect(classList1).to.include('hasPrev');
          });
        });

        describe('with a DOM element argument', function () {
          const mainSection00 = $('.main__section--0')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.main__section'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.main__section'].hasPrev(mainSection00);
          });

          after(function () {
            requerio.$orgs['.main__section'].dispatchAction('removeClass', 'hasPrev');
          });

          it('excludes elements from members array when .hasPrev() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasPrev()', function () {
            $orgDuring.dispatchAction('addClass', 'hasPrev');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasPrev()', function () {
            const $org = requerio.$orgs['.main__section'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.not.include('hasPrev');
            expect(classList1).to.include('hasPrev');
          });
        });
      });

      // .hasSelector() must be tested before manipulating the DOM because these test expect an unmanipulated DOM.
      describe('.hasSelector()', function () {
        describe('with a string argument', function () {
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.main__section'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.main__section'].hasSelector('.main__section--0');
          });

          after(function () {
            requerio.$orgs['.main__section'].dispatchAction('removeClass', 'hasSelector');
          });

          it('excludes elements from members array when .hasSelector() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasSelector()', function () {
            $orgDuring.dispatchAction('addClass', 'hasSelector');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasSelector()', function () {
            const $org = requerio.$orgs['.main__section'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.include('hasSelector');
            expect(classList1).to.not.include('hasSelector');
          });
        });
      });

      // .hasSibling() must be tested before manipulating the DOM because these test expect an unmanipulated DOM.
      describe('.hasSibling()', function () {
        let $membersLengthBefore = 0;
        let $membersLengthDuring = 0;
        let $membersLengthAfter = 0;
        let $orgDuring;

        before(function () {
          requerio.$orgs['.midi-chlorian'].$members.forEach(() => $membersLengthBefore++);

          $orgDuring = requerio.$orgs['.midi-chlorian'].hasSibling('.has-sibling-test');
        });

        after(function () {
          requerio.$orgs['.midi-chlorian'].dispatchAction('removeClass', 'hasSibling');
        });

        it('excludes elements from members array when .hasSibling() is invoked', function () {
          $orgDuring.$members.forEach(() => $membersLengthDuring++);

          expect($membersLengthBefore).to.equal(2);
          expect($membersLengthDuring).to.equal(1);
        });

        it('resets members array when .dispatchAction() is invoked after .hasSibling()', function () {
          $orgDuring.dispatchAction('addClass', 'hasSibling');
          $orgDuring.$members.forEach(() => $membersLengthAfter++);

          expect($membersLengthDuring).to.equal(1);
          expect($membersLengthAfter).to.equal(2);
        });

        it('dispatches the action on the element filtered by .hasSibling()', function () {
          const $org = requerio.$orgs['.midi-chlorian'];
          const classList0 = $org.getState(0).classList;
          const classList1 = $org.getState(1).classList;

          expect(classList0).to.include('hasSibling');
          expect(classList1).to.not.include('hasSibling');
        });
      });

      describe('getting and setting state', function () {
        it('invokes .dispatchAction() to change state which should be retrievable by .getState()', function () {
          const $org = requerio.$orgs['#main'];

          $org.dispatchAction('css', {display: 'none'});

          const displayStyle = $org.getState().style.display;

          expect(displayStyle).to.equal('none');
        });

        it('gets the state for a specific organism $member when .getState() is invoked in a targeted manner\
', function () {
          const $org = requerio.$orgs['.main__section'];

          $org.dispatchAction('css', {display: 'none'}, 1);

          const displayStyle0 = $org.getState(0).style.display;
          const displayStyle1 = $org.getState(1).style.display;

          expect(displayStyle0).to.be.undefined;
          expect(displayStyle1).to.equal('none');
        });

        it('gets the Redux store when .getStore() is invoked', function () {
          const $org = requerio.$orgs['#main'];
          const stateStore = $org.getStore();

          expect(stateStore).to.have.property('dispatch');
          expect(stateStore).to.have.property('subscribe');
          expect(stateStore).to.have.property('getState');
          expect(stateStore).to.have.property('replaceReducer');
        });

        it('resets .$members when .populateMembers() is invoked', function () {
          const $org = requerio.$orgs['.main__section'];
          $org.$members = [];
          const $membersLengthBefore = $org.$members.length;

          $org.populateMembers();

          const $members = $org.$members;
          const $membersLengthAfter = $members.length;

          expect($membersLengthBefore).to.equal(0);
          expect($membersLengthAfter).to.equal(2);
          expect($members[0][0].className).to.equal('main__section main__section--0');
          expect($members[1][0].className).to.equal('main__section main__section--1 has-parent-test');
        });

        it('sets .boundingClientRect properties when .setBoundingClientRect() is invoked', function () {
          const $org = requerio.$orgs['#main'];
          const boundingClientRectBefore = $org.getState().boundingClientRect;

          $org.setBoundingClientRect(
            {
              width: 1000,
              height: 1000,
              top: 100,
              right: 1100,
              bottom: 1100,
              left: 100
            }
          );

          const boundingClientRectAfter = $org.getState().boundingClientRect;

          Object.keys(boundingClientRectBefore).forEach((i) => {
            expect(boundingClientRectBefore[i]).to.be.null;
          });
          expect(boundingClientRectAfter.width).to.equal(1000);
          expect(boundingClientRectAfter.height).to.equal(1000);
          expect(boundingClientRectAfter.top).to.equal(100);
          expect(boundingClientRectAfter.right).to.equal(1100);
          expect(boundingClientRectAfter.bottom).to.equal(1100);
          expect(boundingClientRectAfter.left).to.equal(100);
        });

        // eslint-ignore-next-line max-len
        it('sets .boundingClientRect properties on a specific $organism $member when .setBoundingClientRect() is \
invoked in a targeted manner', function () {
          const $org = requerio.$orgs['.main__section'];
          const stateBefore0 = $org.getState(0);
          const stateBefore1 = $org.getState(1);

          $org.setBoundingClientRect(
            {
              width: 1000,
              height: 1000,
              top: 100,
              right: 1100,
              bottom: 1100,
              left: 100
            },
            1
          );

          const stateAfter0 = $org.getState(0);
          const stateAfter1 = $org.getState(1);
          const boundingClientRectBefore0 = stateBefore0.boundingClientRect;
          const boundingClientRectBefore1 = stateBefore1.boundingClientRect;
          const boundingClientRectAfter0 = stateAfter0.boundingClientRect;
          const boundingClientRectAfter1 = stateAfter1.boundingClientRect;

          Object.keys(boundingClientRectBefore0).forEach((i) => {
            expect(boundingClientRectBefore0[i]).to.be.null;
          });
          Object.keys(boundingClientRectBefore1).forEach((i) => {
            expect(boundingClientRectBefore1[i]).to.be.null;
          });
          Object.keys(boundingClientRectAfter0).forEach((i) => {
            expect(boundingClientRectAfter0[i]).to.be.null;
          });
          expect(boundingClientRectAfter1.width).to.equal(1000);
          expect(boundingClientRectAfter1.height).to.equal(1000);
          expect(boundingClientRectAfter1.top).to.equal(100);
          expect(boundingClientRectAfter1.right).to.equal(1100);
          expect(boundingClientRectAfter1.bottom).to.equal(1100);
          expect(boundingClientRectAfter1.left).to.equal(100);
        });

        it('gets .boundingClientRect properties when .getBoundingClientRect() is invoked', function () {
          const $org = requerio.$orgs['#main'];
          const boundingClientRect = $org.getBoundingClientRect();

          expect(boundingClientRect.width).to.equal(1000);
          expect(boundingClientRect.height).to.equal(1000);
          expect(boundingClientRect.top).to.equal(100);
          expect(boundingClientRect.right).to.equal(1100);
          expect(boundingClientRect.bottom).to.equal(1100);
          expect(boundingClientRect.left).to.equal(100);
        });

        it('.updateMeasurements() updates measurement properties', function () {
          const $org = requerio.$orgs['#main'];

          const innerWidthOrig = $org.innerWidth;
          const innerHeightOrig = $org.innerHeight;
          const scrollTopOrig = $org.scrollTop;
          const widthOrig = $org.width;
          const heightOrig = $org.height;

          $org.setBoundingClientRect(
            {
              width: 0,
              height: 0,
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
          );

          const stateBefore = $org.getState();

          $org.innerWidth(1000);
          $org.innerHeight(1000);
          $org.scrollTop(100);
          $org.width(1000);
          $org.height(1000);

          $org.setBoundingClientRect(
            {
              width: 1000,
              height: 1000,
              top: 100,
              right: 1100,
              bottom: 1100,
              left: 100
            }
          );
          $org.updateMeasurements(stateBefore);

          const stateAfter = $org.getState();

          expect(stateBefore.boundingClientRect.width).to.equal(0);
          expect(stateBefore.boundingClientRect.height).to.equal(0);
          expect(stateBefore.boundingClientRect.top).to.equal(0);
          expect(stateBefore.boundingClientRect.right).to.equal(0);
          expect(stateBefore.boundingClientRect.bottom).to.equal(0);
          expect(stateBefore.boundingClientRect.left).to.equal(0);
          expect(stateBefore.innerWidth).to.equal(0);
          expect(stateBefore.innerHeight).to.equal(0);
          expect(stateBefore.scrollTop).to.equal(0);
          expect(stateBefore.width).to.equal(0);
          expect(stateBefore.height).to.equal(0);

          expect(stateAfter.boundingClientRect.width).to.equal(1000);
          expect(stateAfter.boundingClientRect.height).to.equal(1000);
          expect(stateAfter.boundingClientRect.top).to.equal(100);
          expect(stateAfter.boundingClientRect.right).to.equal(1100);
          expect(stateAfter.boundingClientRect.bottom).to.equal(1100);
          expect(stateAfter.boundingClientRect.left).to.equal(100);
          expect(stateAfter.innerWidth).to.equal(1000);
          expect(stateAfter.innerHeight).to.equal(1000);
          expect(stateAfter.scrollTop).to.equal(100);
          expect(stateAfter.width).to.equal(1000);
          expect(stateAfter.height).to.equal(1000);

          $org.innerWidth = innerWidthOrig;
          $org.innerHeight = innerHeightOrig;
          $org.scrollTop = scrollTopOrig;
          $org.width = widthOrig;
          $org.height = heightOrig;
        });

        it('.updateMeasurements() updates measurement properties on a specific $organism $member when invoked in a \
targeted manner', function () {
          const $org = requerio.$orgs['.main__section'];

          const innerWidthOrig = $org.innerWidth;
          const innerHeightOrig = $org.innerHeight;
          const scrollTopOrig = $org.scrollTop;
          const widthOrig = $org.width;
          const heightOrig = $org.height;

          $org.setBoundingClientRect(
            {
              width: 0,
              height: 0,
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
            1
          );

          const stateBefore = $org.getState(1);

          $org.innerWidth(1000);
          $org.innerHeight(1000);
          $org.scrollTop(100);
          $org.width(1000);
          $org.height(1000);

          $org.setBoundingClientRect(
            {
              width: 1000,
              height: 1000,
              top: 100,
              right: 1100,
              bottom: 1100,
              left: 100
            },
            1
          );
          $org.updateMeasurements(stateBefore, $org, 1);

          const stateAfter = $org.getState(1);

          expect(stateBefore.boundingClientRect.width).to.equal(0);
          expect(stateBefore.boundingClientRect.height).to.equal(0);
          expect(stateBefore.boundingClientRect.top).to.equal(0);
          expect(stateBefore.boundingClientRect.right).to.equal(0);
          expect(stateBefore.boundingClientRect.bottom).to.equal(0);
          expect(stateBefore.boundingClientRect.left).to.equal(0);
          expect(stateBefore.innerWidth).to.equal(0);
          expect(stateBefore.innerHeight).to.equal(0);
          expect(stateBefore.scrollTop).to.equal(0);
          expect(stateBefore.width).to.equal(0);
          expect(stateBefore.height).to.equal(0);

          expect(stateAfter.boundingClientRect.width).to.equal(1000);
          expect(stateAfter.boundingClientRect.height).to.equal(1000);
          expect(stateAfter.boundingClientRect.top).to.equal(100);
          expect(stateAfter.boundingClientRect.right).to.equal(1100);
          expect(stateAfter.boundingClientRect.bottom).to.equal(1100);
          expect(stateAfter.boundingClientRect.left).to.equal(100);
          expect(stateAfter.innerWidth).to.equal(1000);
          expect(stateAfter.innerHeight).to.equal(1000);
          expect(stateAfter.scrollTop).to.equal(100);
          expect(stateAfter.width).to.equal(1000);
          expect(stateAfter.height).to.equal(1000);

          $org.innerWidth = innerWidthOrig;
          $org.innerHeight = innerHeightOrig;
          $org.scrollTop = scrollTopOrig;
          $org.width = widthOrig;
          $org.height = heightOrig;
        });
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
        expect(JSON.stringify(stateAfter))
          .to.equal('{"data":null,"scrollTop":0,"width":0,"height":0,"innerWidth":0,"innerHeight":0}');
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
