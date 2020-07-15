import {expect} from 'chai';

let width = 0;
let height = 0;
let top = 0;
let right = 0;
let bottom = 0;
let left = 0;

export default ($organismsBefore, Requerio, $, Redux, $organismsAfter) => {
  const requerio = new Requerio($, Redux, $organismsAfter);

  return function () {
    describe('instantiation and initialization', function () {
      it('instantiates correctly', function () {
        expect(requerio).to.be.an.instanceof(Requerio);
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
        // Need to unset these because they were set in jsdom.js.
        delete global.window;
        delete global.document;

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
          // The following are documented in docs/README.md.
          expect($organism.blur).to.be.a('function');
          expect($organism.dispatchAction).to.be.a('function');
          expect($organism.exclude).to.be.a('function');
          expect($organism.focus).to.be.a('function');
          expect($organism.getState).to.be.a('function');
          expect($organism.getStore).to.be.a('function');
          expect($organism.hasChild).to.be.a('function');
          expect($organism.hasElement).to.be.a('function');
          expect($organism.hasNext).to.be.a('function');
          expect($organism.hasParent).to.be.a('function');
          expect($organism.hasPrev).to.be.a('function');
          expect($organism.hasSelector).to.be.a('function');
          expect($organism.hasSibling).to.be.a('function');
          expect($organism.populateMembers).to.be.a('function');
          expect($organism.resetElementsAndMembers).to.be.a('function');
          expect($organism.setBoundingClientRect).to.be.a('function');
          expect($organism.updateMeasurements).to.be.a('function');
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
            requerio.$orgs['.exclude__w-string-argument'].$members.forEach(() => $membersLengthBefore++);
          });

          after(function () {
            requerio.$orgs['.exclude__w-string-argument'].dispatchAction('removeClass', 'not');
          });

          it('excludes elements from members array when .exclude() is invoked', function () {
            $orgDuring = requerio.$orgs['.exclude__w-string-argument'].exclude('.exclude__w-string-argument--0');

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
            const $org = requerio.$orgs['.exclude__w-string-argument'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.not.include('not');
            expect(classList1).to.include('not');
          });
        });

        describe('with a DOM element argument', function () {
          const mainSpan00 = $('.exclude__w-dom-element-argument--0')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.exclude__w-dom-element-argument'].$members.forEach(() => $membersLengthBefore++);
          });

          after(function () {
            requerio.$orgs['.exclude__w-dom-element-argument'].dispatchAction('removeClass', 'not');
          });

          it('excludes elements from members array when .exclude() is invoked', function () {
            $orgDuring = requerio.$orgs['.exclude__w-dom-element-argument'].exclude(mainSpan00);

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
            const $org = requerio.$orgs['.exclude__w-dom-element-argument'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.not.include('not');
            expect(classList1).to.include('not');
          });
        });

        describe('with a Cheerio/jQuery object argument', function () {
          const $mainSpan0 = $('.exclude__w-cheerio-jquery-argument--0');
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.exclude__w-cheerio-jquery-argument'].$members.forEach(() => $membersLengthBefore++);
          });

          after(function () {
            requerio.$orgs['.exclude__w-cheerio-jquery-argument'].dispatchAction('removeClass', 'not');
          });

          it('excludes elements from members array when .exclude() is invoked', function () {
            $orgDuring = requerio.$orgs['.exclude__w-cheerio-jquery-argument'].exclude($mainSpan0);

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
            const $org = requerio.$orgs['.exclude__w-cheerio-jquery-argument'];
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

          function excludeMainSpan0(i, elem) {
            const classToExclude = 'exclude__w-function-argument--0';

            return $(this).hasClass(classToExclude) &&
              $(elem).hasClass(classToExclude) &&
              $(requerio.$orgs['.exclude__w-function-argument'].get(i)).hasClass(classToExclude);
          }

          before(function () {
            requerio.$orgs['.exclude__w-function-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.exclude__w-function-argument'].exclude(excludeMainSpan0);
          });

          after(function () {
            requerio.$orgs['.exclude__w-function-argument'].dispatchAction('attr', {test: null});
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
            const $org = requerio.$orgs['.exclude__w-function-argument'];
            const attribs0 = $org.getState(0).attribs;
            const attribs1 = $org.getState(1).attribs;

            expect(attribs0).to.not.have.property('test');
            expect(attribs1).to.have.property('test');
            expect(attribs1.test).to.equal('test');
          });
        });

        describe('with no argument', function () {
          it('returns the organism when "attr" is dispatched', function () {
            const retVal =
              requerio.$orgs['.exclude__w-no-argument'].exclude('.exclude__w-no-argument--0').dispatchAction('attr');

            expect(retVal).to.equal(requerio.$orgs['.exclude__w-no-argument']);
          });

          it('returns the organism when "data" is dispatched', function () {
            const retVal =
              requerio.$orgs['.exclude__w-no-argument'].exclude('.exclude__w-no-argument--0').dispatchAction('data');

            expect(retVal).to.equal(requerio.$orgs['.exclude__w-no-argument']);
          });

          it('returns the organism when "getBoundingClientRect" is dispatched', function () {
            const retVal = requerio.$orgs['.exclude__w-no-argument'].exclude('.exclude__w-no-argument--0')
              .dispatchAction('getBoundingClientRect');

            expect(retVal).to.equal(requerio.$orgs['.exclude__w-no-argument']);
          });

          it('returns the organism when "innerWidth" is dispatched', function () {
            const retVal = requerio.$orgs['.exclude__w-no-argument']
              .exclude('.exclude__w-no-argument--0').dispatchAction('innerWidth');

            expect(retVal).to.equal(requerio.$orgs['.exclude__w-no-argument']);
          });

          it('returns the organism when "innerHeight" is dispatched', function () {
            const retVal = requerio.$orgs['.exclude__w-no-argument']
              .exclude('.exclude__w-no-argument--0').dispatchAction('innerHeight');

            expect(retVal).to.equal(requerio.$orgs['.exclude__w-no-argument']);
          });

          it('returns the organism when "scrollTop" is dispatched', function () {
            const retVal = requerio.$orgs['.exclude__w-no-argument']
              .exclude('.exclude__w-no-argument--0').dispatchAction('scrollTop');

            expect(retVal).to.equal(requerio.$orgs['.exclude__w-no-argument']);
          });

          it('returns the organism when "width" is dispatched', function () {
            const retVal =
              requerio.$orgs['.exclude__w-no-argument'].exclude('.exclude__w-no-argument--0').dispatchAction('width');

            expect(retVal).to.equal(requerio.$orgs['.exclude__w-no-argument']);
          });

          it('returns the organism when "height" is dispatched', function () {
            const retVal =
              requerio.$orgs['.exclude__w-no-argument'].exclude('.exclude__w-no-argument--0').dispatchAction('height');

            expect(retVal).to.equal(requerio.$orgs['.exclude__w-no-argument']);
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
          const mainSpan00 = $('.hasElement__w-dom-element-argument--0')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.hasElement__w-dom-element-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.hasElement__w-dom-element-argument'].hasElement(mainSpan00);
          });

          after(function () {
            requerio.$orgs['.hasElement__w-dom-element-argument'].dispatchAction('removeClass', 'hasElement');
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
            const $org = requerio.$orgs['.hasElement__w-dom-element-argument'];
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
            requerio.$orgs['.hasNext__w-string-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.hasNext__w-string-argument'].hasNext('.hasNext__w-string-argument--1');
          });

          after(function () {
            requerio.$orgs['.hasNext__w-string-argument'].dispatchAction('removeClass', 'hasNext');
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
            const $org = requerio.$orgs['.hasNext__w-string-argument'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.include('hasNext');
            expect(classList1).to.not.include('hasNext');
          });
        });

        describe('with a DOM element argument', function () {
          const mainSpan10 = $('.hasNext__w-dom-element-argument--1')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.hasNext__w-dom-element-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.hasNext__w-dom-element-argument'].hasNext(mainSpan10);
          });

          after(function () {
            requerio.$orgs['.hasNext__w-dom-element-argument'].dispatchAction('removeClass', 'hasNext');
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
            const $org = requerio.$orgs['.hasNext__w-dom-element-argument'];
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
            requerio.$orgs['.hasPrev__w-string-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.hasPrev__w-string-argument'].hasPrev('.hasPrev__w-string-argument--0');
          });

          after(function () {
            requerio.$orgs['.hasPrev__w-string-argument'].dispatchAction('removeClass', 'hasPrev');
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
            const $org = requerio.$orgs['.hasPrev__w-string-argument'];
            const classList0 = $org.getState(0).classList;
            const classList1 = $org.getState(1).classList;

            expect(classList0).to.not.include('hasPrev');
            expect(classList1).to.include('hasPrev');
          });
        });

        describe('with a DOM element argument', function () {
          const mainSpan00 = $('.hasPrev__w-dom-element-argument--0')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.hasPrev__w-dom-element-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.hasPrev__w-dom-element-argument'].hasPrev(mainSpan00);
          });

          after(function () {
            requerio.$orgs['.hasPrev__w-dom-element-argument'].dispatchAction('removeClass', 'hasPrev');
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
            const $org = requerio.$orgs['.hasPrev__w-dom-element-argument'];
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
            requerio.$orgs['.hasSelector__w-string-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring =
              requerio.$orgs['.hasSelector__w-string-argument'].hasSelector('.hasSelector__w-string-argument--0');
          });

          after(function () {
            requerio.$orgs['.hasSelector__w-string-argument'].dispatchAction('removeClass', 'hasSelector');
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
            const $org = requerio.$orgs['.hasSelector__w-string-argument'];
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
          const $org = requerio.$orgs['.dispatchAction__css--0'];

          $org.dispatchAction('css', {display: 'none'});

          const displayStyle = $org.getState().style.display;

          expect(displayStyle).to.equal('none');
        });

        it('gets the state for a specific organism $member when .getState() is invoked in a targeted manner\
', function () {
          const $org = requerio.$orgs['.dispatchAction__css'];

          $org.dispatchAction('css', {display: 'none'}, 1);

          const displayStyle1 = $org.getState(1).style.display;
          const displayStyle2 = $org.getState(2).style.display;

          expect(displayStyle1).to.equal('none');
          expect(displayStyle2).to.be.undefined;
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
          const $org = requerio.$orgs['.populateMembers'];
          $org.$members = [];
          const $membersLengthBefore = $org.$members.length;

          $org.populateMembers();

          const $members = $org.$members;
          const $membersLengthAfter = $members.length;

          expect($membersLengthBefore).to.equal(0);
          expect($membersLengthAfter).to.equal(2);

          // Cheerio.
          if ($._root && $._root.attribs) {
            expect($members[0][0].attribs.class).to.equal('populateMembers populateMembers--0');
            expect($members[1][0].attribs.class).to.equal('populateMembers populateMembers--1');
          }
          // jQuery.
          else {
            expect($members[0][0].className).to.equal('populateMembers populateMembers--0');
            expect($members[1][0].className).to.equal('populateMembers populateMembers--1');
          }
        });

        it('sets .boundingClientRect properties when .setBoundingClientRect() is invoked', function () {
          const $org = requerio.$orgs['.setBoundingClientRect--0'];
          const boundingClientRectBefore = $org.getState().boundingClientRect;

          width++;
          height++;
          top++;
          right++;
          bottom++;
          left++;

          $org.setBoundingClientRect(
            {
              width,
              height,
              top,
              right,
              bottom,
              left
            }
          );

          const boundingClientRectAfter = $org.getState().boundingClientRect;

          Object.keys(boundingClientRectBefore).forEach((i) => {
            expect(boundingClientRectBefore[i]).to.be.null;
          });
          expect(boundingClientRectAfter.width).to.equal(width);
          expect(boundingClientRectAfter.height).to.equal(height);
          expect(boundingClientRectAfter.top).to.equal(top);
          expect(boundingClientRectAfter.right).to.equal(right);
          expect(boundingClientRectAfter.bottom).to.equal(bottom);
          expect(boundingClientRectAfter.left).to.equal(left);
        });

        it('sets .boundingClientRect properties on a specific $organism $member when .setBoundingClientRect() is \
invoked in a targeted manner', function () {
          const $org = requerio.$orgs['.setBoundingClientRect'];
          const stateBefore0 = $org.getState(0);
          const stateBefore1 = $org.getState(1);

          width++;
          height++;
          top++;
          right++;
          bottom++;
          left++;

          $org.setBoundingClientRect(
            {
              width,
              height,
              top,
              right,
              bottom,
              left
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
          expect(boundingClientRectAfter1.width).to.equal(width);
          expect(boundingClientRectAfter1.height).to.equal(height);
          expect(boundingClientRectAfter1.top).to.equal(top);
          expect(boundingClientRectAfter1.right).to.equal(right);
          expect(boundingClientRectAfter1.bottom).to.equal(bottom);
          expect(boundingClientRectAfter1.left).to.equal(left);
        });

        it('gets .boundingClientRect properties when .getBoundingClientRect() is invoked', function () {
          const $org = requerio.$orgs['.setBoundingClientRect--0'];
          const boundingClientRect = $org.getBoundingClientRect();

          expect(boundingClientRect.width).to.equal(1);
          expect(boundingClientRect.height).to.equal(1);
          expect(boundingClientRect.top).to.equal(1);
          expect(boundingClientRect.right).to.equal(1);
          expect(boundingClientRect.bottom).to.equal(1);
          expect(boundingClientRect.left).to.equal(1);
        });

        it('.updateMeasurements() updates measurement properties', function () {
          const $org = requerio.$orgs['#main']; // Necessary to set #main for the .reducer-get tests.
          const stateBefore = $org.getState();

          width++;
          height++;
          top++;
          right++;
          bottom++;
          left++;

          $org.setBoundingClientRect(
            {
              width,
              height,
              top,
              right,
              bottom,
              left
            }
          );
          $org.innerWidth(width);
          $org.innerHeight(height);
          $org.scrollTop(top);
          $org.width(width);
          $org.height(height);
          $org.updateMeasurements(stateBefore);

          const stateAfter = $org.getState();

          expect(stateBefore.boundingClientRect.width).to.not.equal(stateAfter.boundingClientRect.width);
          expect(stateBefore.boundingClientRect.height).to.not.equal(stateAfter.boundingClientRect.height);
          expect(stateBefore.boundingClientRect.top).to.not.equal(stateAfter.boundingClientRect.top);
          expect(stateBefore.boundingClientRect.right).to.not.equal(stateAfter.boundingClientRect.right);
          expect(stateBefore.boundingClientRect.bottom).to.not.equal(stateAfter.boundingClientRect.bottom);
          expect(stateBefore.boundingClientRect.left).to.not.equal(stateAfter.boundingClientRect.left);
          expect(stateBefore.innerWidth).to.not.equal(stateAfter.innerWidth);
          expect(stateBefore.innerHeight).to.not.equal(stateAfter.innerHeight);
          expect(stateBefore.scrollTop).to.not.equal(stateAfter.scrollTop);
          expect(stateBefore.width).to.not.equal(stateAfter.width);
          expect(stateBefore.height).to.not.equal(stateAfter.height);

          expect(stateAfter.boundingClientRect.width).to.equal(width);
          expect(stateAfter.boundingClientRect.height).to.equal(height);
          expect(stateAfter.boundingClientRect.top).to.equal(top);
          expect(stateAfter.boundingClientRect.right).to.equal(right);
          expect(stateAfter.boundingClientRect.bottom).to.equal(bottom);
          expect(stateAfter.boundingClientRect.left).to.equal(left);
          expect(stateAfter.innerWidth).to.equal(width);
          expect(stateAfter.innerHeight).to.equal(height);
          expect(stateAfter.scrollTop).to.equal(top);
          expect(stateAfter.width).to.equal(width);
          expect(stateAfter.height).to.equal(height);
        });

        it('.updateMeasurements() updates measurement properties on a specific $organism $member when invoked in a \
targeted manner', function () {
          const $org = requerio.$orgs['.main__span']; // Necessary to set .main__span for the .reducer-get tests.
          const stateBefore1 = $org.getState(1);

          width++;
          height++;
          top++;
          right++;
          bottom++;
          left++;

          // Cheerio.
          if ($._root && $._root.attribs) {
            $org.innerWidth(width);
            $org.innerHeight(height);
            $org.scrollTop(top);
            $org.width(width);
            $org.height(height);
          }
          // jQuery.
          else {
            $org.$members[1].innerWidth(width);
            $org.$members[1].innerHeight(height);
            $org.$members[1].scrollTop(top);
            $org.$members[1].width(width);
            $org.$members[1].height(height);
          }
          $org.setBoundingClientRect(
            {
              width,
              height,
              top,
              right,
              bottom,
              left
            },
            1
          );
          $org.updateMeasurements(stateBefore1, $org, 1);

          const stateAfter0 = $org.getState(0);
          const stateAfter1 = $org.getState(1);

          expect(stateAfter1.boundingClientRect.width).to.not.equal(stateBefore1.boundingClientRect.width);
          expect(stateAfter1.boundingClientRect.height).to.not.equal(stateBefore1.boundingClientRect.height);
          expect(stateAfter1.boundingClientRect.top).to.not.equal(stateBefore1.boundingClientRect.top);
          expect(stateAfter1.boundingClientRect.right).to.not.equal(stateBefore1.boundingClientRect.right);
          expect(stateAfter1.boundingClientRect.bottom).to.not.equal(stateBefore1.boundingClientRect.bottom);
          expect(stateAfter1.boundingClientRect.left).to.not.equal(stateBefore1.boundingClientRect.left);
          expect(stateAfter1.innerWidth).to.not.equal(stateBefore1.innerWidth);
          expect(stateAfter1.innerHeight).to.not.equal(stateBefore1.innerHeight);
          expect(stateAfter1.scrollTop).to.not.equal(stateBefore1.scrollTop);
          expect(stateAfter1.width).to.not.equal(stateBefore1.width);
          expect(stateAfter1.height).to.not.equal(stateBefore1.height);

          expect(stateAfter1.boundingClientRect.width).to.not.equal(stateAfter0.boundingClientRect.width);
          expect(stateAfter1.boundingClientRect.height).to.not.equal(stateAfter0.boundingClientRect.height);
          expect(stateAfter1.boundingClientRect.top).to.not.equal(stateAfter0.boundingClientRect.top);
          expect(stateAfter1.boundingClientRect.right).to.not.equal(stateAfter0.boundingClientRect.right);
          expect(stateAfter1.boundingClientRect.bottom).to.not.equal(stateAfter0.boundingClientRect.bottom);
          expect(stateAfter1.boundingClientRect.left).to.not.equal(stateAfter0.boundingClientRect.left);
          expect(stateAfter1.innerWidth).to.not.equal(stateAfter0.innerWidth);
          expect(stateAfter1.innerHeight).to.not.equal(stateAfter0.innerHeight);
          expect(stateAfter1.scrollTop).to.not.equal(stateAfter0.scrollTop);
          expect(stateAfter1.width).to.not.equal(stateAfter0.width);
          expect(stateAfter1.height).to.not.equal(stateAfter0.height);

          expect(stateAfter1.boundingClientRect.width).to.equal(width);
          expect(stateAfter1.boundingClientRect.height).to.equal(height);
          expect(stateAfter1.boundingClientRect.top).to.equal(top);
          expect(stateAfter1.boundingClientRect.right).to.equal(right);
          expect(stateAfter1.boundingClientRect.bottom).to.equal(bottom);
          expect(stateAfter1.boundingClientRect.left).to.equal(left);
          expect(stateAfter1.innerWidth).to.equal(width);
          expect(stateAfter1.innerHeight).to.equal(height);
          expect(stateAfter1.scrollTop).to.equal(top);
          expect(stateAfter1.width).to.equal(width);
          expect(stateAfter1.height).to.equal(height);
        });
      });
    });

    describe('organism non-prototype methods', function () {
      describe('scrollTop()', function () {
        it('mocks the client-side method call on the server', function () {
          Object.keys(requerio.$orgs).forEach((selector) => {
            let $organism;
            let scrollTopRetVal;

            switch (selector) {
              case 'window':
              case 'document':
                return;

              default:
                $organism = requerio.$orgs[selector];
                scrollTopRetVal = $organism.scrollTop(top);

                expect(scrollTopRetVal).to.equal($organism);
            }
          });
        });

        it('gets the previously set value', function () {
          Object.keys(requerio.$orgs).forEach((selector) => {
            let $organism;
            let scrollTopRetVal;

            switch (selector) {
              case 'window':
              case 'document':
                return;

              default:
                $organism = requerio.$orgs[selector];
                scrollTopRetVal = $organism.scrollTop();

                expect(scrollTopRetVal).to.equal(top);
            }
          });
        });
      });

      describe('width()', function () {
        it('accepts a value and returns the same value on the server to mock the method call on the client\
', function () {
          Object.keys(requerio.$orgs).forEach((selector) => {
            if (selector.includes('augmented')) {
              return;
            }

            const $organism = requerio.$orgs[selector];
            // Sets boundingClientRect.width returned by "getBoundingClientRect" action test.
            const widthRetVal = $organism.width(3);

            expect(widthRetVal).to.equal($organism);
          });
        });
      });

      describe('height()', function () {
        it('accepts a value and returns the same value on the server to mock the method call on the client\
', function () {
          Object.keys(requerio.$orgs).forEach((selector) => {
            if (selector.includes('augmented')) {
              return;
            }

            const $organism = requerio.$orgs[selector];
            // Sets boundingClientRect.height returned by "getBoundingClientRect" action test.
            const heightRetVal = $organism.height(3);

            expect(heightRetVal).to.equal($organism);
          });
        });
      });
    });

    describe('reducer-get', function () {
      it('updates the state $members if the $org $members increase in number', function () {
        const $org = requerio.$orgs['.main__span'];
        const stateMembersLengthBefore = $org.getState().$members.length;
        const htmlSnippet = '<span class="main__span"><h2>Span</h2></span>';

        $org.$members.push($(htmlSnippet));

        const stateMembersLengthAfter = $org.getState().$members.length;

        expect($org.$members.length).to.equal(3);
        expect(stateMembersLengthBefore).to.equal(2);
        expect(stateMembersLengthAfter).to.equal(3);
      });

      it('updates the state $members if the $org $members decrease in number', function () {
        const $org = requerio.$orgs['.main__span'];
        const stateMembersLengthBefore = $org.getState().$members.length;

        $org.$members.pop();

        const stateMembersLengthAfter = $org.getState().$members.length;

        expect($org.$members.length).to.equal(2);
        expect(stateMembersLengthBefore).to.equal(3);
        expect(stateMembersLengthAfter).to.equal(2);
      });

      it('dispatches the "addClass" action with a string argument', function () {
        requerio.$orgs['#main'].dispatchAction('addClass', 'add-class-string');

        const state = requerio.$orgs['#main'].getState();

        expect(state.attribs.class).to.equal('has-child-test add-class-string');
        expect(state.classArray).to.include('add-class-string');
        expect(state.classList).to.include('add-class-string');
      });

      it('dispatches the "addClass" action with a function argument', function () {
        requerio.$orgs['#main'].dispatchAction('addClass', () => 'add-class-function');

        const state = requerio.$orgs['#main'].getState();

        expect(state.attribs.class).to.have.string('add-class-function');
        expect(state.classArray).to.include('add-class-function');
        expect(state.classList).to.include('add-class-function');
      });

      it('dispatches the "addClass" action in a targeted manner', function () {
        requerio.$orgs['.main__span'].dispatchAction('addClass', 'add-class-1', 1);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.attribs.class).to.not.have.string('add-class-1');
        expect(state0.classArray).to.not.include('add-class-1');
        expect(state0.classList).to.not.include('add-class-1');
        expect(state1.attribs.class).to.have.string('add-class-1');
        expect(state1.classArray).to.include('add-class-1');
        expect(state1.classList).to.include('add-class-1');
      });

      it('does not dispatch the "addClass" action if the target is out-of-bounds', function () {
        requerio.$orgs['.main__span'].dispatchAction('addClass', 'out-of-bounds', 2);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.attribs.class).to.not.have.string('out-of-bounds');
        expect(state0.classArray).to.not.include('out-of-bounds');
        expect(state0.classList).to.not.include('out-of-bounds');
        expect(state1.attribs.class).to.not.have.string('out-of-bounds');
        expect(state1.classArray).to.not.include('out-of-bounds');
        expect(state1.classList).to.not.include('out-of-bounds');
      });

      it('dispatches the "removeClass" action with a string argument', function () {
        requerio.$orgs['#main'].dispatchAction('addClass', 'remove-class-string');

        const stateBefore = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('removeClass', 'remove-class-string');

        const stateAfter = requerio.$orgs['#main'].getState();

        expect(stateBefore.attribs.class).to.have.string('remove-class-string');
        expect(stateBefore.classArray).to.include('remove-class-string');
        expect(stateBefore.classList).to.include('remove-class-string');
        expect(stateAfter.attribs.class).to.not.have.string('remove-class-string');
        expect(stateAfter.classArray).to.not.include('remove-class-string');
        expect(stateAfter.classList).to.not.include('remove-class-string');
      });

      it('dispatches the "removeClass" action with a function argument', function () {
        requerio.$orgs['#main'].dispatchAction('addClass', 'remove-class-function');

        const stateBefore = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('removeClass', () => 'remove-class-function');

        const stateAfter = requerio.$orgs['#main'].getState();

        expect(stateBefore.attribs.class).to.have.string('remove-class-function');
        expect(stateBefore.classArray).to.include('remove-class-function');
        expect(stateBefore.classList).to.include('remove-class-function');
        expect(stateAfter.attribs.class).to.not.have.string('remove-class-function');
        expect(stateAfter.classArray).to.not.include('remove-class-function');
        expect(stateAfter.classList).to.not.include('remove-class-function');
      });

      it('dispatches the "toggleClass" action with a string argument', function () {
        const state0 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', 'toggle-class-string');

        const state1 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', 'toggle-class-string');

        const state2 = requerio.$orgs['#main'].getState();

        expect(state0.attribs.class).to.not.have.string('toggle-class-string');
        expect(state0.classArray).to.not.include('toggle-class-string');
        expect(state0.classList).to.not.include('toggle-class-string');
        expect(state1.attribs.class).to.have.string('toggle-class-string');
        expect(state1.classArray).to.include('toggle-class-string');
        expect(state1.classList).to.include('toggle-class-string');
        expect(state2.attribs.class).to.not.have.string('toggle-class-string');
        expect(state2.classArray).to.not.include('toggle-class-string');
        expect(state2.classList).to.not.include('toggle-class-string');
      });

      it('dispatches the "toggleClass" action with a function argument', function () {
        const state0 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', () => 'toggle-class-function');

        const state1 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', () => 'toggle-class-function');

        const state2 = requerio.$orgs['#main'].getState();

        expect(state0.attribs.class).to.not.have.string('toggle-class-function');
        expect(state0.classArray).to.not.include('toggle-class-function');
        expect(state0.classList).to.not.include('toggle-class-function');
        expect(state1.attribs.class).to.have.string('toggle-class-function');
        expect(state1.classArray).to.include('toggle-class-function');
        expect(state1.classList).to.include('toggle-class-function');
        expect(state2.attribs.class).to.not.have.string('toggle-class-function');
        expect(state2.classArray).to.not.include('toggle-class-function');
        expect(state2.classList).to.not.include('toggle-class-function');
      });

      it('dispatches the "toggleClass" action with a function argument in a targeted manner', function () {
        const state0 = requerio.$orgs['.main__span'].getState();

        requerio.$orgs['.main__span'].dispatchAction('toggleClass', () => 'toggle-class-function-1', 1);

        const state1 = requerio.$orgs['.main__span'].getState();

        requerio.$orgs['.main__span'].dispatchAction('toggleClass', () => 'toggle-class-function-1', 1);

        const state2 = requerio.$orgs['.main__span'].getState();

        expect(state0.$members[1].attribs.class).to.not.have.string('toggle-class-function-1');
        expect(state0.$members[1].classArray).to.not.include('toggle-class-function-1');
        expect(state0.$members[1].classList).to.not.include('toggle-class-function-1');
        expect(state1.$members[1].attribs.class).to.have.string('toggle-class-function-1');
        expect(state1.$members[1].classArray).to.include('toggle-class-function-1');
        expect(state1.$members[1].classList).to.include('toggle-class-function-1');
        expect(state2.$members[1].attribs.class).to.not.have.string('toggle-class-function-1');
        expect(state2.$members[1].classArray).to.not.include('toggle-class-function-1');
        expect(state2.$members[1].classList).to.not.include('toggle-class-function-1');
      });

      it('dispatches the "toggleClass" action with a true boolean argument', function () {
        const state0 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', ['toggle-class-true', true]);

        const state1 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', ['toggle-class-true', true]);

        const state2 = requerio.$orgs['#main'].getState();

        expect(state0.attribs.class).to.not.have.string('toggle-class-true');
        expect(state0.classArray).to.not.include('toggle-class-true');
        expect(state0.classList).to.not.include('toggle-class-true');
        expect(state1.attribs.class).to.have.string('toggle-class-true');
        expect(state1.classArray).to.include('toggle-class-true');
        expect(state1.classList).to.include('toggle-class-true');
        expect(state2.attribs.class).to.have.string('toggle-class-true');
        expect(state2.classArray).to.include('toggle-class-true');
        expect(state2.classList).to.include('toggle-class-true');
      });

      it('dispatches the "toggleClass" action with a false boolean argument', function () {
        requerio.$orgs['#main'].dispatchAction('addClass', 'toggle-class-false');

        const state0 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', ['toggle-class-false', false]);

        const state1 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', ['toggle-class-false', false]);

        const state2 = requerio.$orgs['#main'].getState();

        expect(state0.attribs.class).to.have.string('toggle-class-false');
        expect(state0.classArray).to.include('toggle-class-false');
        expect(state0.classList).to.include('toggle-class-false');
        expect(state1.attribs.class).to.not.have.string('toggle-class-false');
        expect(state1.classArray).to.not.include('toggle-class-false');
        expect(state1.classList).to.not.include('toggle-class-false');
        expect(state2.attribs.class).to.not.have.string('toggle-class-false');
        expect(state2.classArray).to.not.include('toggle-class-false');
        expect(state2.classList).to.not.include('toggle-class-false');
      });

      it('dispatches the "attr" action with a single string value argument', function () {
        requerio.$orgs['#main'].dispatchAction('attr', {test: 'testing12345'});

        const state = requerio.$orgs['#main'].getState();

        expect(state.attribs.test).to.equal('testing12345');
      });

      it('dispatches the "attr" action with a multiple string value argument', function () {
        requerio.$orgs['#main'].dispatchAction('attr', {taste: 'tasting12345', test: 'testing67890'});

        const state = requerio.$orgs['#main'].getState();

        expect(state.attribs.taste).to.equal('tasting12345');
        expect(state.attribs.test).to.equal('testing67890');
      });

      it('dispatches the "attr" action with a single string value argument on a single target', function () {
        requerio.$orgs['.main__span'].dispatchAction('attr', {test: 'testing12345'}, 1);

        const state = requerio.$orgs['.main__span'].getState(1);

        expect(state.attribs.test).to.equal('testing12345');
      });

      it('dispatches the "attr" action with a multiple string value argument on a single target', function () {
        requerio.$orgs['.main__span']
          .dispatchAction('attr', {taste: 'tasting12345', test: 'testing67890'}, 1);

        const state = requerio.$orgs['.main__span'].getState(1);

        expect(state.attribs.taste).to.equal('tasting12345');
        expect(state.attribs.test).to.equal('testing67890');
      });

      it('dispatches the "attr" action with a single string value argument on multiple targets', function () {
        requerio.$orgs['.main__span'].dispatchAction('attr', {twist: 'twisting12345'}, [0, 1]);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.attribs.twist).to.equal('twisting12345');
        expect(state1.attribs.twist).to.equal('twisting12345');
      });

      it('dispatches the "attr" action with a multiple string value argument on multiple targets', function () {
        requerio.$orgs['.main__span']
          .dispatchAction('attr', {taste: 'tasting67890', twist: 'twisting67890'}, [0, 1]);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.attribs.taste).to.equal('tasting67890');
        expect(state0.attribs.twist).to.equal('twisting67890');
        expect(state1.attribs.taste).to.equal('tasting67890');
        expect(state1.attribs.twist).to.equal('twisting67890');
      });

      it('dispatches the "css" action with a single string value argument', function () {
        requerio.$orgs['#main'].dispatchAction('css', {color: 'red'});

        const state = requerio.$orgs['#main'].getState();

        expect(state.style.color).to.equal('red');
      });

      it('dispatches the "css" action with a multiple string value argument', function () {
        requerio.$orgs['#main'].dispatchAction('css', {'color': 'green', 'background-color': 'green'});

        const state = requerio.$orgs['#main'].getState();

        expect(state.style.color).to.equal('green');
        expect(state.style['background-color']).to.equal('green');
      });

      it('dispatches the "css" action with a single function value argument', function () {
        requerio.$orgs['#main'].dispatchAction('css', {color: () => 'blue'});

        const state = requerio.$orgs['#main'].getState();

        expect(state.style.color).to.equal('blue');
      });

      it('dispatches the "css" action with a multiple function value argument', function () {
        requerio.$orgs['#main'].dispatchAction('css', {'color': () => 'cyan', 'background-color': () => 'cyan'});

        const state = requerio.$orgs['#main'].getState();

        expect(state.style.color).to.equal('cyan');
        expect(state.style['background-color']).to.equal('cyan');
      });

      it('dispatches the "css" action to update the state with a single string property argument', function () {
        requerio.$orgs['#main'].css({color: 'yellow'});
        requerio.$orgs['#main'].dispatchAction('css', 'color');

        const state = requerio.$orgs['#main'].getState();

        expect(state.style.color).to.equal('yellow');
      });

      it('dispatches the "css" action to update the state with a multiple string properties argument', function () {
        requerio.$orgs['#main'].css({color: 'magenta'});
        requerio.$orgs['#main'].css({'background-color': 'magenta'});
        requerio.$orgs['#main'].dispatchAction('css', ['color', 'background-color']);

        const state = requerio.$orgs['#main'].getState();

        expect(state.style.color).to.equal('magenta');
        expect(state.style['background-color']).to.equal('magenta');
      });

      it('dispatches the "css" action with a single string value argument on a single target', function () {
        requerio.$orgs['.main__span'].dispatchAction('css', {color: 'red'}, 1);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.style.color).to.not.equal(state1.style.color);
        expect(state1.style.color).to.equal('red');
      });

      it('dispatches the "css" action with a single string value argument on multiple targets', function () {
        requerio.$orgs['.main__span'].dispatchAction('css', {color: 'green'}, [0, 1]);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.style.color).to.equal('green');
        expect(state1.style.color).to.equal('green');
      });

      it('dispatches the "css" action with a multiple string value argument on a single target', function () {
        requerio.$orgs['.main__span'].dispatchAction('css', {'color': 'blue', 'background-color': 'blue'}, 1);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.style.color).to.not.equal(state1.style.color);
        expect(state0.style['background-color']).to.not.equal(state1.style['background-color']);
        expect(state1.style.color).to.equal('blue');
        expect(state1.style['background-color']).to.equal('blue');
      });

      it('dispatches the "css" action with a multiple string value argument on multiple targets', function () {
        requerio.$orgs['.main__span'].dispatchAction('css', {'color': 'cyan', 'background-color': 'cyan'}, [0, 1]);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.style.color).to.equal('cyan');
        expect(state0.style['background-color']).to.equal('cyan');
        expect(state1.style.color).to.equal('cyan');
        expect(state1.style['background-color']).to.equal('cyan');
      });

      it('dispatches the "css" action to update the state with a single string property argument on a single target\
', function () {
        requerio.$orgs['.main__span'].css({color: 'yellow'});
        requerio.$orgs['.main__span'].dispatchAction('css', 'color', 1);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.style.color).to.not.equal(state1.style.color);
        expect(state1.style.color).to.equal('yellow');
      });

      it('dispatches the "css" action to update the state with a single string property argument on multiple targets\
', function () {
        requerio.$orgs['.main__span'].css({color: 'magenta'});
        requerio.$orgs['.main__span'].dispatchAction('css', 'color', [0, 1]);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.style.color).to.equal('magenta');
        expect(state1.style.color).to.equal('magenta');
      });

      it('dispatches the "css" action to update the state with a multiple string properties argument on a single target\
', function () {
        requerio.$orgs['.main__span'].css({color: 'black'});
        requerio.$orgs['.main__span'].css({'background-color': 'black'});
        requerio.$orgs['.main__span'].dispatchAction('css', ['color', 'background-color'], 1);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.style.color).to.not.equal(state1.style.color);
        expect(state0.style['background-color']).to.not.equal(state1.style['background-color']);
        expect(state1.style.color).to.equal('black');
        expect(state1.style['background-color']).to.equal('black');
      });

      it('dispatches the "css" action to update the state with a multiple string properties argument on multiple \
targets', function () {
        requerio.$orgs['.main__span'].css({color: 'white'});
        requerio.$orgs['.main__span'].css({'background-color': 'white'});
        requerio.$orgs['.main__span'].dispatchAction('css', ['color', 'background-color'], [0, 1]);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.style.color).to.equal('white');
        expect(state0.style['background-color']).to.equal('white');
        expect(state1.style.color).to.equal('white');
        expect(state1.style['background-color']).to.equal('white');
      });

      it('dispatches the "data" action to update state with data from a data attribute', function () {
        requerio.$orgs['#main'].dispatchAction('data');

        const state = requerio.$orgs['#main'].getState();

        expect(state.data.fromAttribute).to.equal('hyphen-delimited to camelCase');
      });

      it('dispatches the "data" action with a single string value argument', function () {
        requerio.$orgs['#main'].dispatchAction('data', {test: 'testing12345'});

        const state = requerio.$orgs['#main'].getState();

        expect(state.data.test).to.equal('testing12345');
      });

      it('dispatches the "data" action with a multiple string value argument', function () {
        requerio.$orgs['#main'].dispatchAction(
          'data', {taste: 'tasting12345', twist: 'twisting12345', toast: 'toasting12345', trust: 'trusting12345'});

        const state = requerio.$orgs['#main'].getState();

        expect(state.data.taste).to.equal('tasting12345');
        expect(state.data.twist).to.equal('twisting12345');
        expect(state.data.toast).to.equal('toasting12345');
        expect(state.data.trust).to.equal('trusting12345');
      });

      it('dispatches the "data" action with a single string value argument on a single target', function () {
        requerio.$orgs['.main__span'].dispatchAction('data', {test: 'testing12345'}, 1);

        const state = requerio.$orgs['.main__span'].getState(1);

        expect(state.data.test).to.equal('testing12345');
      });

      it('dispatches the "data" action with a multiple string value argument on a single target', function () {
        requerio.$orgs['.main__span'].dispatchAction(
          'data', {taste: 'tasting12345', twist: 'twisting12345', toast: 'toasting12345', trust: 'trusting12345'}, 1);

        const state = requerio.$orgs['.main__span'].getState(1);

        expect(state.data.taste).to.equal('tasting12345');
        expect(state.data.twist).to.equal('twisting12345');
        expect(state.data.toast).to.equal('toasting12345');
        expect(state.data.trust).to.equal('trusting12345');
      });

      it('dispatches the "data" action with a single string value argument on multiple targets', function () {
        requerio.$orgs['.main__span'].dispatchAction('data', {taste: 'tasting67890'}, [0, 1]);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.data.taste).to.equal('tasting67890');
        expect(state1.data.taste).to.equal('tasting67890');
      });

      it('dispatches the "data" action with a multiple string value argument on multiple targets', function () {
        requerio.$orgs['.main__span']
          .dispatchAction('data', {twist: 'twisting67890', toast: 'toasting67890'}, [0, 1]);

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const state1 = requerio.$orgs['.main__span'].getState(1);

        expect(state0.data.twist).to.equal('twisting67890');
        expect(state0.data.toast).to.equal('toasting67890');
        expect(state1.data.twist).to.equal('twisting67890');
        expect(state1.data.toast).to.equal('toasting67890');
      });

      it('dispatches the "getBoundingClientRect" action', function () {
        requerio.$orgs['#main'].dispatchAction('getBoundingClientRect');

        const state = requerio.$orgs['#main'].getState();
        const boundingClientRect = state.boundingClientRect;

        expect(boundingClientRect.width).to.equal(3);
        expect(boundingClientRect.height).to.equal(3);
        expect(boundingClientRect.top).to.equal(3);
        expect(boundingClientRect.right).to.equal(3);
        expect(boundingClientRect.bottom).to.equal(3);
        expect(boundingClientRect.left).to.equal(3);
      });

      it('dispatches the "height" action', function () {
        requerio.$orgs['#main'].dispatchAction('height', 1000);

        const state = requerio.$orgs['#main'].getState();

        expect(state.height).to.equal(1000);
      });

      it('dispatches the "html" action with a string argument', function () {
        const mainInputStateBefore = requerio.$orgs['.main__input'].getState();
        const mainStateBefore = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction(
          'html',
          `<input class="main__input html-string" type="text">
<span class="main__span main__span--0">Foot</span>
<span class="main__span main__span--1">Barf</span>`
        );

        const mainInputStateAfter = requerio.$orgs['.main__input'].getState();
        const mainStateAfter = requerio.$orgs['#main'].getState();

        expect(mainStateBefore.innerHTML).to.not.equal(mainStateAfter.innerHTML);
        expect(mainStateBefore.textContent).to.not.equal(mainStateAfter.textContent);
        expect(mainStateAfter.innerHTML).to.equal(`<input class="main__input html-string" type="text">
<span class="main__span main__span--0">Foot</span>
<span class="main__span main__span--1">Barf</span>`);
        expect(mainStateAfter.textContent).to.equal('\nFoot\nBarf');
        expect(mainInputStateBefore.classList).to.not.include('html-string');
        expect(mainInputStateAfter.classList).to.include('html-string');
      });

      it('dispatches the "html" action with a string argument in a targeted manner', function () {
        const mainSpan1StateBefore = requerio.$orgs['.main__span'].getState(1);

        requerio.$orgs['.main__span'].dispatchAction(
          'html',
          '<span>htmlString</span>',
          1
        );

        const mainSpan1StateAfter = requerio.$orgs['.main__span'].getState(1);

        expect(mainSpan1StateBefore.innerHTML).to.not.equal(mainSpan1StateAfter.innerHTML);
        expect(mainSpan1StateBefore.textContent).to.not.equal(mainSpan1StateAfter.textContent);
        expect(mainSpan1StateAfter.innerHTML).to.equal('<span>htmlString</span>');
        expect(mainSpan1StateAfter.textContent).to.equal('htmlString');
      });

      it('dispatches the "html" action with a differing number of members among its descendants', function () {
        const mainSpanStateBefore = requerio.$orgs['.main__span'].getState();
        const mainStateBefore = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction(
          'html',
          `<input class="main__input" type="text">
<span class="main__span main__span--0">Foo</span>
<span class="main__span main__span--1">Bar</span>
<span class="main__span main__span--2">Baz</span>`
        );

        const mainSpanStateAfter = requerio.$orgs['.main__span'].getState();
        const mainStateAfter = requerio.$orgs['#main'].getState();

        expect(mainStateBefore.innerHTML).to.not.equal(mainStateAfter.innerHTML);
        expect(mainStateBefore.textContent).to.not.equal(mainStateAfter.textContent);
        expect(mainStateAfter.innerHTML).to.equal(`<input class="main__input" type="text">
<span class="main__span main__span--0">Foo</span>
<span class="main__span main__span--1">Bar</span>
<span class="main__span main__span--2">Baz</span>`);
        expect(mainStateAfter.textContent).to.equal('\nFoo\nBar\nBaz');
        expect(mainSpanStateBefore.$members.length).to.equal(2);
        expect(mainSpanStateAfter.$members.length).to.equal(3);
      });

      it('dispatches the "innerWidth" action', function () {
        requerio.$orgs['#main'].dispatchAction('innerWidth', 1000);

        const state = requerio.$orgs['#main'].getState();

        expect(state.innerWidth).to.equal(1000);
      });

      it('dispatches the "innerHeight" action', function () {
        requerio.$orgs['#main'].dispatchAction('innerHeight', 1000);

        const state = requerio.$orgs['#main'].getState();

        expect(state.innerHeight).to.equal(1000);
      });

      it('dispatches the "removeData" action to delete data from the state but not a corresponding data attribute\
', function () {
        const stateBefore = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('removeData', 'fromAttribute');

        const stateAfter = requerio.$orgs['#main'].getState();

        expect(stateBefore.data.fromAttribute).to.equal('hyphen-delimited to camelCase');
        expect(stateAfter.data.fromAttribute).to.be.undefined;
        expect(stateAfter.attribs['data-from-attribute']).to.equal(stateBefore.attribs['data-from-attribute']);
      });

      it('dispatches the "removeData" action with a single string value argument', function () {
        const stateBefore = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('removeData', 'test');

        const stateAfter = requerio.$orgs['#main'].getState();

        expect(stateBefore.data.test).to.equal('testing12345');
        expect(stateAfter.data.test).to.be.undefined;
      });

      it('dispatches the "removeData" action with a multiple string value argument', function () {
        const stateBefore = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('removeData', 'taste twist');

        const stateAfter = requerio.$orgs['#main'].getState();

        expect(stateBefore.data.taste).to.equal('tasting12345');
        expect(stateBefore.data.twist).to.equal('twisting12345');
        expect(stateAfter.data.taste).to.be.undefined;
        expect(stateAfter.data.twist).to.be.undefined;
      });

      it('dispatches the "removeData" action with an array argument', function () {
        const stateBefore = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('removeData', ['toast', 'trust']);

        const stateAfter = requerio.$orgs['#main'].getState();

        expect(stateBefore.data.toast).to.equal('toasting12345');
        expect(stateBefore.data.trust).to.equal('trusting12345');
        expect(stateAfter.data.toast).to.be.undefined;
        expect(stateAfter.data.trust).to.be.undefined;
      });

      it('dispatches the "removeData" action with a single string value argument on a single target', function () {
        const stateBefore = requerio.$orgs['.main__span'].getState(1);

        requerio.$orgs['.main__span'].dispatchAction('removeData', 'test', 1);

        const stateAfter = requerio.$orgs['.main__span'].getState(1);

        expect(stateBefore.data.test).to.equal('testing12345');
        expect(stateAfter.data.test).to.be.undefined;
      });

      it('dispatches the "removeData" action with a multiple string value argument on a single target', function () {
        const stateBefore = requerio.$orgs['.main__span'].getState(1);

        requerio.$orgs['.main__span'].dispatchAction('removeData', 'taste twist', 1);

        const stateAfter = requerio.$orgs['.main__span'].getState();

        expect(stateBefore.data.taste).to.equal('tasting67890');
        expect(stateBefore.data.twist).to.equal('twisting67890');
        expect(stateAfter.data.taste).to.be.undefined;
        expect(stateAfter.data.twist).to.be.undefined;
      });

      it('dispatches the "removeData" action with an array argument on a single target', function () {
        const stateBefore = requerio.$orgs['.main__span'].getState(1);

        requerio.$orgs['.main__span'].dispatchAction('removeData', ['toast', 'trust']);

        const stateAfter = requerio.$orgs['.main__span'].getState();

        expect(stateBefore.data.toast).to.equal('toasting67890');
        expect(stateBefore.data.trust).to.equal('trusting12345');
        expect(stateAfter.data.toast).to.be.undefined;
        expect(stateAfter.data.trust).to.be.undefined;
      });

      it('dispatches the "scrollTop" action', function () {
        requerio.$orgs['#main'].dispatchAction('scrollTop', 100);

        const state = requerio.$orgs['#main'].getState();

        expect(state.scrollTop).to.equal(100);
      });

      it('dispatches the "setBoundingClientRect" action', function () {
        requerio.$orgs['#main'].dispatchAction(
          'setBoundingClientRect',
          {
            width: 1100,
            height: 1100,
            top: 110,
            right: 1210,
            bottom: 1210,
            left: 110
          }
        );

        const state = requerio.$orgs['#main'].getState();
        const boundingClientRect = state.boundingClientRect;

        expect(boundingClientRect.width).to.equal(1100);
        expect(boundingClientRect.height).to.equal(1100);
        expect(boundingClientRect.top).to.equal(110);
        expect(boundingClientRect.right).to.equal(1210);
        expect(boundingClientRect.bottom).to.equal(1210);
        expect(boundingClientRect.left).to.equal(110);
      });

      it('dispatches the "setBoundingClientRect" action in a targeted manner', function () {
        width++;
        height++;
        top++;
        right++;
        bottom++;
        left++;

        requerio.$orgs['.main__span'].dispatchAction(
          'setBoundingClientRect',
          {
            width,
            height,
            top,
            right,
            bottom,
            left
          },
          1
        );

        const state0 = requerio.$orgs['.main__span'].getState(0);
        const boundingClientRect0 = state0.boundingClientRect;
        const state1 = requerio.$orgs['.main__span'].getState(1);
        const boundingClientRect1 = state1.boundingClientRect;

        expect(boundingClientRect0.width).to.not.equal(boundingClientRect1.width);
        expect(boundingClientRect0.height).to.not.equal(boundingClientRect1.height);
        expect(boundingClientRect0.top).to.not.equal(boundingClientRect1.top);
        expect(boundingClientRect0.right).to.not.equal(boundingClientRect1.right);
        expect(boundingClientRect0.bottom).to.not.equal(boundingClientRect1.bottom);
        expect(boundingClientRect0.left).to.not.equal(boundingClientRect1.left);

        expect(boundingClientRect1.width).to.equal(5);
        expect(boundingClientRect1.height).to.equal(5);
        expect(boundingClientRect1.top).to.equal(5);
        expect(boundingClientRect1.right).to.equal(5);
        expect(boundingClientRect1.bottom).to.equal(5);
        expect(boundingClientRect1.left).to.equal(5);
      });

      it('dispatches the "val" action', function () {
        requerio.$orgs['.main__input'].dispatchAction('val', 'element');

        const state = requerio.$orgs['.main__input'].getState();

        expect(state.value).to.equal('element');
      });

      it('gets .value in a targeted manner', function () {
        requerio.$orgs['.main__input'].dispatchAction('val', 'element', 0);

        const state = requerio.$orgs['.main__input'].getState(0);

        expect(state.value).to.equal('element');
      });

      it('updates .value after a val update via user interaction', function () {
        requerio.$orgs['.main__input'].val('compound');

        const state = requerio.$orgs['.main__input'].getState();

        expect(state.value).to.equal('compound');
      });

      it('dispatches the "width" action', function () {
        requerio.$orgs['#main'].dispatchAction('width', 1000);

        const state = requerio.$orgs['#main'].getState();

        expect(state.width).to.equal(1000);
      });
    });

    describe('augmented organism prototype methods', function () {
      let augmentedHtml;

      before(function () {
        requerio.$orgs['#augmented'].dispatchAction('html');

        augmentedHtml = requerio.$orgs['#augmented'].getState().innerHTML;
      });

      afterEach(function () {
        requerio.$orgs['#augmented'].dispatchAction('html', augmentedHtml);
      });

      it('after() updates the innerHTML of the parent organism', function () {
        requerio.$orgs['.augmented__span--1']
          .dispatchAction('after', '\n<span class="augmented__span augmented__span--1.1"></span>');

        const state = requerio.$orgs['#augmented'].getState();

        expect(state.innerHTML).to.equal(`
      <span class="augmented__span augmented__span--0">Foo</span>
      <span class="augmented__span augmented__span--1">Bar</span>
<span class="augmented__span augmented__span--1.1"></span>
    `);
      });

      it('after() updates the innerHTML of the parent organism in a targeted manner', function () {
        requerio.$orgs['.augmented__span']
          .dispatchAction('after', '\n<span class="augmented__span augmented__span--1.2"></span>', 1);

        const state = requerio.$orgs['#augmented'].getState();

        expect(state.innerHTML).to.equal(`
      <span class="augmented__span augmented__span--0">Foo</span>
      <span class="augmented__span augmented__span--1">Bar</span>
<span class="augmented__span augmented__span--1.2"></span>
    `);
      });

      it('append() updates the innerHTML of the organism', function () {
        const stateBefore = requerio.$orgs['.next__span--0'].getState();

        requerio.$orgs['.next__span--0'].dispatchAction('append', '<span>Goo</span>');

        const stateAfter = requerio.$orgs['.next__span--0'].getState();

        requerio.$orgs['.next__span--0'].dispatchAction('append', '<span>Hoo</span>');

        const stateAfterAgain = requerio.$orgs['.next__span--0'].getState();

        expect(stateBefore.innerHTML).to.be.null;
        expect(stateBefore.textContent).to.be.null;
        expect(stateAfter.innerHTML).to.equal('Foo<span>Goo</span>');
        expect(stateAfter.textContent).to.equal('FooGoo');
        expect(stateAfterAgain.innerHTML).to.equal('Foo<span>Goo</span><span>Hoo</span>');
        expect(stateAfterAgain.textContent).to.equal('FooGooHoo');
      });

      it('append() updates the innerHTML of the organism in a targeted manner', function () {
        const stateBefore = requerio.$orgs['.next__span'].getState(1);

        requerio.$orgs['.next__span'].dispatchAction('append', '<span>Car</span>', 1);

        const stateAfter = requerio.$orgs['.next__span'].getState(1);

        requerio.$orgs['.next__span'].dispatchAction('append', '<span>Dar</span>', 1);

        const stateAfterAgain = requerio.$orgs['.next__span'].getState(1);

        expect(stateBefore.innerHTML).to.be.null;
        expect(stateBefore.textContent).to.be.null;
        expect(stateAfter.innerHTML).to.equal('Bar<span>Car</span>');
        expect(stateAfter.textContent).to.equal('BarCar');
        expect(stateAfterAgain.innerHTML).to.equal('Bar<span>Car</span><span>Dar</span>');
        expect(stateAfterAgain.textContent).to.equal('BarCarDar');
      });

      it('before() updates the innerHTML of the parent organism', function () {
        requerio.$orgs['.augmented__span--1']
          .dispatchAction('before', '<span class="augmented__span augmented__span--0.1"></span>\n');

        const state = requerio.$orgs['#augmented'].getState();

        expect(state.innerHTML).to.equal(`
      <span class="augmented__span augmented__span--0">Foo</span>
      <span class="augmented__span augmented__span--0.1"></span>
<span class="augmented__span augmented__span--1">Bar</span>
    `);
      });

      it('before() updates the innerHTML of the parent organism in a targeted manner', function () {
        requerio.$orgs['.augmented__span']
          .dispatchAction('before', '<span class="augmented__span augmented__span--0.2"></span>\n', 1);

        const state = requerio.$orgs['#augmented'].getState();

        expect(state.innerHTML).to.equal(`
      <span class="augmented__span augmented__span--0">Foo</span>
      <span class="augmented__span augmented__span--0.2"></span>
<span class="augmented__span augmented__span--1">Bar</span>
    `);
      });

      it('detach() removes the organism from the DOM', function () {
        const augmentedHtml = requerio.$orgs['#augmented'].html();
        const augmentedSpanHtml = requerio.$orgs['.augmented__span--0'].html();

        requerio.$orgs['#augmented'].dispatchAction('html', augmentedHtml);

        const stateBefore = requerio.$orgs['#augmented'].getState();

        requerio.$orgs['.augmented__span--0'].dispatchAction('detach');

        const stateAfter = requerio.$orgs['#augmented'].getState();

        expect(stateBefore.innerHTML).to.include(augmentedSpanHtml);
        expect(stateAfter.innerHTML).to.not.include(augmentedSpanHtml);

        requerio.$orgs['#augmented'].dispatchAction('html', augmentedHtml);
      });

      it('detach() removes the organism from the DOM in a targeted manner', function () {
        const augmentedHtml = requerio.$orgs['#augmented'].html();
        const augmentedSpanHtml0 = requerio.$orgs['.augmented__span--0'].html();
        const augmentedSpanHtml1 = requerio.$orgs['.augmented__span--1'].html();

        requerio.$orgs['#augmented'].dispatchAction('html', augmentedHtml);

        const stateBefore = requerio.$orgs['#augmented'].getState();

        requerio.$orgs['.augmented__span'].dispatchAction('detach', null, 1);

        const stateAfter = requerio.$orgs['#augmented'].getState();

        expect(stateBefore.innerHTML).to.include(augmentedSpanHtml0);
        expect(stateBefore.innerHTML).to.include(augmentedSpanHtml1);
        expect(stateAfter.innerHTML).to.include(augmentedSpanHtml0);
        expect(stateAfter.innerHTML).to.not.include(augmentedSpanHtml1);

        requerio.$orgs['#augmented'].dispatchAction('html', augmentedHtml);
      });

      it('empty() deletes the innerHTML from the organism', function () {
        const augmentedSpanHtml = requerio.$orgs['.augmented__span--0'].html();

        requerio.$orgs['.augmented__span--0'].dispatchAction('html', augmentedSpanHtml);

        const stateBefore = requerio.$orgs['.augmented__span--0'].getState();

        requerio.$orgs['.augmented__span--0'].dispatchAction('empty');

        const stateAfter = requerio.$orgs['.augmented__span--0'].getState();

        expect(stateBefore.innerHTML).to.equal(augmentedSpanHtml);
        expect(stateAfter.innerHTML).to.equal('');

        requerio.$orgs['.augmented__span--0'].dispatchAction('html', augmentedSpanHtml);
      });

      it('empty() deletes the innerHTML from the organism in a targeted manner', function () {
        const augmentedSpanHtml0 = requerio.$orgs['.augmented__span--0'].html();
        const augmentedSpanHtml1 = requerio.$orgs['.augmented__span--1'].html();

        requerio.$orgs['.augmented__span'].dispatchAction('html', augmentedSpanHtml0, 0);
        requerio.$orgs['.augmented__span'].dispatchAction('html', augmentedSpanHtml1, 1);

        const stateBefore0 = requerio.$orgs['.augmented__span'].getState(0);
        const stateBefore1 = requerio.$orgs['.augmented__span'].getState(1);

        requerio.$orgs['.augmented__span'].dispatchAction('empty', null, 1);

        const stateAfter0 = requerio.$orgs['.augmented__span'].getState(0);
        const stateAfter1 = requerio.$orgs['.augmented__span'].getState(1);

        expect(stateBefore0.innerHTML).to.equal(augmentedSpanHtml0);
        expect(stateBefore1.innerHTML).to.equal(augmentedSpanHtml1);
        expect(stateAfter0.innerHTML).to.equal(augmentedSpanHtml0);
        expect(stateAfter1.innerHTML).to.equal('');

        requerio.$orgs['.augmented__span'].dispatchAction('html', augmentedSpanHtml1, 1);
      });

      it('prepend() updates the innerHTML of the organism', function () {
        const stateBefore = requerio.$orgs['.next__span--2'].getState();

        requerio.$orgs['.next__span--2'].dispatchAction('prepend', '<span>Eoo</span>');

        const stateAfter = requerio.$orgs['.next__span--2'].getState();

        requerio.$orgs['.next__span--2'].dispatchAction('prepend', '<span>Doo</span>');

        const stateAfterAgain = requerio.$orgs['.next__span--2'].getState();

        expect(stateBefore.innerHTML).to.be.null;
        expect(stateBefore.textContent).to.be.null;
        expect(stateAfter.innerHTML).to.equal('<span>Eoo</span>Foo');
        expect(stateAfter.textContent).to.equal('EooFoo');
        expect(stateAfterAgain.innerHTML).to.equal('<span>Doo</span><span>Eoo</span>Foo');
        expect(stateAfterAgain.textContent).to.equal('DooEooFoo');
      });

      it('prepend() updates the innerHTML of the organism in a targeted manner', function () {
        const stateBefore = requerio.$orgs['.next__span'].getState(3);

        requerio.$orgs['.next__span'].dispatchAction('prepend', '<span>Aar</span>', 3);

        const stateAfter = requerio.$orgs['.next__span'].getState(3);

        requerio.$orgs['.next__span'].dispatchAction('prepend', '<span>Zar</span>', 3);

        const stateAfterAgain = requerio.$orgs['.next__span'].getState(3);

        expect(stateBefore.innerHTML).to.be.null;
        expect(stateBefore.textContent).to.be.null;
        expect(stateAfter.innerHTML).to.equal('<span>Aar</span>Bar');
        expect(stateAfter.textContent).to.equal('AarBar');
        expect(stateAfterAgain.innerHTML).to.equal('<span>Zar</span><span>Aar</span>Bar');
        expect(stateAfterAgain.textContent).to.equal('ZarAarBar');
      });

      it('remove() deletes the organism from the DOM', function () {
        const augmentedHtml = requerio.$orgs['#augmented'].html();
        const augmentedSpanHtml = requerio.$orgs['.augmented__span--0'].html();

        requerio.$orgs['#augmented'].dispatchAction('html', augmentedHtml);

        const stateBefore = requerio.$orgs['#augmented'].getState();

        requerio.$orgs['.augmented__span--0'].dispatchAction('remove');

        const stateAfter = requerio.$orgs['#augmented'].getState();

        expect(stateBefore.innerHTML).to.include(augmentedSpanHtml);
        expect(stateAfter.innerHTML).to.not.include(augmentedSpanHtml);

        requerio.$orgs['#augmented'].dispatchAction('html', augmentedHtml);
      });

      it('remove() deletes the organism from the DOM in a targeted manner', function () {
        const augmentedHtml = requerio.$orgs['#augmented'].html();
        const augmentedSpanHtml0 = requerio.$orgs['.augmented__span--0'].html();
        const augmentedSpanHtml1 = requerio.$orgs['.augmented__span--1'].html();

        requerio.$orgs['#augmented'].dispatchAction('html', augmentedHtml);

        const stateBefore = requerio.$orgs['#augmented'].getState();

        requerio.$orgs['.augmented__span'].dispatchAction('remove', null, 1);

        const stateAfter = requerio.$orgs['#augmented'].getState();

        expect(stateBefore.innerHTML).to.include(augmentedSpanHtml0);
        expect(stateBefore.innerHTML).to.include(augmentedSpanHtml1);
        expect(stateAfter.innerHTML).to.include(augmentedSpanHtml0);
        expect(stateAfter.innerHTML).to.not.include(augmentedSpanHtml1);

        requerio.$orgs['#augmented'].dispatchAction('html', augmentedHtml);
      });

      it('text() safely updates text in the DOM', function () {
        const stateBefore = requerio.$orgs['.next__span--4'].getState();

        requerio.$orgs['.next__span--4'].dispatchAction('text', '\n<span>Foof\n</span>');

        const stateAfter = requerio.$orgs['.next__span--4'].getState();

        requerio.$orgs['.next__span--4'].dispatchAction('text', '\n<span>Foot\n</span>');

        const stateAfterAgain = requerio.$orgs['.next__span--4'].getState();

        expect(stateBefore.innerHTML).to.be.null;
        expect(stateBefore.textContent).to.be.null;
        expect(stateAfter.innerHTML).to.equal('\n&lt;span&gt;Foof\n&lt;/span&gt;');
        expect(stateAfter.textContent).to.equal('\n<span>Foof\n</span>');
        expect(stateAfterAgain.innerHTML).to.equal('\n&lt;span&gt;Foot\n&lt;/span&gt;');
        expect(stateAfterAgain.textContent).to.equal('\n<span>Foot\n</span>');
      });

      it('text() safely updates text in the DOM in a targeted manner', function () {
        const stateBefore = requerio.$orgs['.next__span'].getState(5);

        requerio.$orgs['.next__span'].dispatchAction('text', '<span>Barf</span>', 5);

        const stateAfter = requerio.$orgs['.next__span'].getState(5);

        requerio.$orgs['.next__span'].dispatchAction('text', '<span>Bart</span>', 5);

        const stateAfterAgain = requerio.$orgs['.next__span'].getState(5);

        expect(stateBefore.innerHTML).to.be.null;
        expect(stateBefore.textContent).to.be.null;
        expect(stateAfter.innerHTML).to.equal('&lt;span&gt;Barf&lt;/span&gt;');
        expect(stateAfter.textContent).to.equal('<span>Barf</span>');
        expect(stateAfterAgain.innerHTML).to.equal('&lt;span&gt;Bart&lt;/span&gt;');
        expect(stateAfterAgain.textContent).to.equal('<span>Bart</span>');
      });
    });
  };
};
