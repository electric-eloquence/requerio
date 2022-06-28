import {expect} from 'chai';

let width = 0;
let height = 0;
let top = 0;
let right = 0;
let bottom = 0;
let left = 0;
let x = 0;
let y = 0;

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

          if (selector === '#non-existent-element') {
            expect($organism).to.be.null;
          }
          else {
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
          }
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
            const classArray0 = $org.getState(0).classArray;
            const classArray1 = $org.getState(1).classArray;

            expect(classArray0).to.not.include('not');
            expect(classArray1).to.include('not');
          });
        });

        describe('with a DOM element argument', function () {
          const domEl = $('.exclude__w-dom-element-argument--0')[0];
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
            $orgDuring = requerio.$orgs['.exclude__w-dom-element-argument'].exclude(domEl);

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
            const classArray0 = $org.getState(0).classArray;
            const classArray1 = $org.getState(1).classArray;

            expect(classArray0).to.not.include('not');
            expect(classArray1).to.include('not');
          });
        });

        describe('with a Cheerio/jQuery object argument', function () {
          const $mainDiv0 = $('.exclude__w-cheerio-jquery-argument--0');
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
            $orgDuring = requerio.$orgs['.exclude__w-cheerio-jquery-argument'].exclude($mainDiv0);

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
            const classArray0 = $org.getState(0).classArray;
            const classArray1 = $org.getState(1).classArray;

            expect(classArray0).to.not.include('not');
            expect(classArray1).to.include('not');
          });
        });

        describe('with a function argument', function () {
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          function excludeMainDiv0(i, elem) {
            const classToExclude = 'exclude__w-function-argument--0';

            return $(this).hasClass(classToExclude) &&
              $(elem).hasClass(classToExclude) &&
              $(requerio.$orgs['.exclude__w-function-argument'].get(i)).hasClass(classToExclude);
          }

          before(function () {
            requerio.$orgs['.exclude__w-function-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.exclude__w-function-argument'].exclude(excludeMainDiv0);
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
          it('returns the organism when "getBoundingClientRect" is dispatched', function () {
            const retVal = requerio.$orgs['.exclude__w-no-argument'].exclude('.exclude__w-no-argument--0')
              .dispatchAction('getBoundingClientRect');

            expect(retVal).to.equal(requerio.$orgs['.exclude__w-no-argument']);
          });

          it('returns the organism when "height" is dispatched', function () {
            const retVal =
              requerio.$orgs['.exclude__w-no-argument'].exclude('.exclude__w-no-argument--0').dispatchAction('height');

            expect(retVal).to.equal(requerio.$orgs['.exclude__w-no-argument']);
          });

          it('returns the organism when "scrollLeft" is dispatched', function () {
            const retVal = requerio.$orgs['.exclude__w-no-argument']
              .exclude('.exclude__w-no-argument--0').dispatchAction('scrollLeft');

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
            requerio.$orgs['.hasChild__w-string-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.hasChild__w-string-argument'].hasChild('.child');
          });

          after(function () {
            requerio.$orgs['.hasChild__w-string-argument'].dispatchAction('removeClass', 'has-child');
          });

          it('excludes elements from members array when .hasChild() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasChild()', function () {
            $orgDuring.dispatchAction('addClass', 'has-child');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasChild()', function () {
            const $org = requerio.$orgs['.hasChild__w-string-argument'];
            const classArray0 = $org.getState(0).classArray;
            const classArray1 = $org.getState(1).classArray;

            expect(classArray0).to.not.include('has-child');
            expect(classArray1).to.include('has-child');
          });
        });

        describe('with a DOM element argument', function () {
          const domEl = $('.hasChild__w-dom-element-argument').children('.child')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.hasChild__w-dom-element-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.hasChild__w-dom-element-argument'].hasChild(domEl);
          });

          after(function () {
            requerio.$orgs['.hasChild__w-dom-element-argument'].dispatchAction('removeClass', 'has-child');
          });

          it('excludes elements from members array when .hasChild() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasChild()', function () {
            $orgDuring.dispatchAction('addClass', 'has-child');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasChild()', function () {
            const $org = requerio.$orgs['.hasChild__w-dom-element-argument'];
            const classArray0 = $org.getState(0).classArray;
            const classArray1 = $org.getState(1).classArray;

            expect(classArray0).to.not.include('has-child');
            expect(classArray1).to.include('has-child');
          });
        });
      });

      // .hasElement() must be tested before manipulating the DOM because these test expect an unmanipulated DOM.
      describe('.hasElement()', function () {
        describe('with a DOM element argument', function () {
          const domEl = $('.hasElement__w-dom-element-argument--0')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.hasElement__w-dom-element-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.hasElement__w-dom-element-argument'].hasElement(domEl);
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
            const classArray0 = $org.getState(0).classArray;
            const classArray1 = $org.getState(1).classArray;

            expect(classArray0).to.include('hasElement');
            expect(classArray1).to.not.include('hasElement');
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
            const classArray0 = $org.getState(0).classArray;
            const classArray1 = $org.getState(1).classArray;

            expect(classArray0).to.include('hasNext');
            expect(classArray1).to.not.include('hasNext');
          });
        });

        describe('with a DOM element argument', function () {
          const mainDiv10 = $('.hasNext__w-dom-element-argument--1')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.hasNext__w-dom-element-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.hasNext__w-dom-element-argument'].hasNext(mainDiv10);
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
            const classArray0 = $org.getState(0).classArray;
            const classArray1 = $org.getState(1).classArray;

            expect(classArray0).to.include('hasNext');
            expect(classArray1).to.not.include('hasNext');
          });
        });
      });

      describe('.hasParent()', function () {
        describe('with a string argument', function () {
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.hasParent__w-string-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.hasParent__w-string-argument'].hasParent('.parent');
          });

          after(function () {
            requerio.$orgs['.hasParent__w-string-argument'].dispatchAction('removeClass', 'has-parent');
          });

          it('excludes elements from members array when .hasParent() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasParent()', function () {
            $orgDuring.dispatchAction('addClass', 'has-parent');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasParent()', function () {
            const $org = requerio.$orgs['.hasParent__w-string-argument'];
            const classArray0 = $org.getState(0).classArray;
            const classArray1 = $org.getState(1).classArray;

            expect(classArray0).to.not.include('has-parent');
            expect(classArray1).to.include('has-parent');
          });
        });

        describe('with a DOM element argument', function () {
          const domEl = $('.hasParent__w-dom-element-argument').parent('.parent')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.hasParent__w-dom-element-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.hasParent__w-dom-element-argument'].hasParent(domEl);
          });

          after(function () {
            requerio.$orgs['.hasParent__w-dom-element-argument'].dispatchAction('removeClass', 'has-parent');
          });

          it('excludes elements from members array when .hasParent() is invoked', function () {
            $orgDuring.$members.forEach(() => $membersLengthDuring++);

            expect($membersLengthBefore).to.equal(2);
            expect($membersLengthDuring).to.equal(1);
          });

          it('resets members array when .dispatchAction() is invoked after .hasParent()', function () {
            $orgDuring.dispatchAction('addClass', 'has-parent');
            $orgDuring.$members.forEach(() => $membersLengthAfter++);

            expect($membersLengthDuring).to.equal(1);
            expect($membersLengthAfter).to.equal(2);
          });

          it('dispatches the action on the element filtered by .hasParent()', function () {
            const $org = requerio.$orgs['.hasParent__w-dom-element-argument'];
            const classArray0 = $org.getState(0).classArray;
            const classArray1 = $org.getState(1).classArray;

            expect(classArray0).to.not.include('has-parent');
            expect(classArray1).to.include('has-parent');
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
            const classArray0 = $org.getState(0).classArray;
            const classArray1 = $org.getState(1).classArray;

            expect(classArray0).to.not.include('hasPrev');
            expect(classArray1).to.include('hasPrev');
          });
        });

        describe('with a DOM element argument', function () {
          const domEl = $('.hasPrev__w-dom-element-argument--0')[0];
          let $membersLengthBefore = 0;
          let $membersLengthDuring = 0;
          let $membersLengthAfter = 0;
          let $orgDuring;

          before(function () {
            requerio.$orgs['.hasPrev__w-dom-element-argument'].$members.forEach(() => $membersLengthBefore++);

            $orgDuring = requerio.$orgs['.hasPrev__w-dom-element-argument'].hasPrev(domEl);
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
            const classArray0 = $org.getState(0).classArray;
            const classArray1 = $org.getState(1).classArray;

            expect(classArray0).to.not.include('hasPrev');
            expect(classArray1).to.include('hasPrev');
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
            const classArray0 = $org.getState(0).classArray;
            const classArray1 = $org.getState(1).classArray;

            expect(classArray0).to.include('hasSelector');
            expect(classArray1).to.not.include('hasSelector');
          });
        });
      });

      describe('.hasSibling()', function () {
        let $membersLengthBefore = 0;
        let $membersLengthDuring = 0;
        let $membersLengthAfter = 0;
        let $orgDuring;

        before(function () {
          requerio.$orgs['.hasSibling'].$members.forEach(() => $membersLengthBefore++);

          $orgDuring = requerio.$orgs['.hasSibling'].hasSibling('.sibling');
        });

        after(function () {
          requerio.$orgs['.hasSibling'].dispatchAction('removeClass', 'has-sibling');
        });

        it('excludes elements from members array when .hasSibling() is invoked', function () {
          $orgDuring.$members.forEach(() => $membersLengthDuring++);

          expect($membersLengthBefore).to.equal(2);
          expect($membersLengthDuring).to.equal(1);
        });

        it('resets members array when .dispatchAction() is invoked after .hasSibling()', function () {
          $orgDuring.dispatchAction('addClass', 'has-sibling');
          $orgDuring.$members.forEach(() => $membersLengthAfter++);

          expect($membersLengthDuring).to.equal(1);
          expect($membersLengthAfter).to.equal(2);
        });

        it('dispatches the action on the element filtered by .hasSibling()', function () {
          const $org = requerio.$orgs['.hasSibling'];
          const classArray0 = $org.getState(0).classArray;
          const classArray1 = $org.getState(1).classArray;

          expect(classArray0).to.not.include('has-sibling');
          expect(classArray1).to.include('has-sibling');
        });
      });

      describe('getting and setting state', function () {
        it('invokes .dispatchAction() to change state which should be retrievable by .getState()', function () {
          const $org = requerio.$orgs['.dispatchAction__css--0'];

          $org.dispatchAction('css', {display: 'none'});

          const displayStyle = $org.getState().css.display;

          expect(displayStyle).to.equal('none');
        });

        it('gets the state for a specific organism member when .getState() is invoked in a targeted manner\
', function () {
          const $org = requerio.$orgs['.dispatchAction__css'];

          $org.dispatchAction('css', {display: 'none'}, 1);

          const displayStyle1 = $org.getState(1).css.display;
          const displayStyle2 = $org.getState(2).css.display;

          expect(displayStyle1).to.equal('none');
          expect(displayStyle2).to.be.undefined;
        });

        it('gets `null` when .getState() targets a non-existent organism member', function () {
          const $org = requerio.$orgs['.dispatchAction__css'];
          const nullState = $org.getState(11);

          expect(nullState).to.be.null;
        });

        it('gets the state for the "document" organism when .getState() is invoked', function () {
          const state = requerio.$orgs.document.getState();

          if (typeof window === 'object') {
            expect(JSON.stringify(state)).to.equal(
              '{"activeOrganism":null,"data":{},"scrollLeft":0,"scrollTop":0,"width":0,"height":0}'
            );
          }
          else {
            expect(JSON.stringify(state)).to.equal(
              '{"activeOrganism":null,"data":{},"scrollLeft":null,"scrollTop":null,"width":null,"height":null}'
            );
          }
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
          x++;
          y++;

          $org.setBoundingClientRect(
            {
              width,
              height,
              top,
              right,
              bottom,
              left,
              x,
              y
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
          expect(boundingClientRectAfter.x).to.equal(x);
          expect(boundingClientRectAfter.y).to.equal(y);
        });

        it('sets .boundingClientRect properties on a specific organism member when .setBoundingClientRect() is invoked \
in a targeted manner', function () {
          const $org = requerio.$orgs['.setBoundingClientRect'];
          const stateBefore0 = $org.getState(0);
          const stateBefore1 = $org.getState(1);

          width++;
          height++;
          top++;
          right++;
          bottom++;
          left++;
          x++;
          y++;

          $org.setBoundingClientRect(
            {
              width,
              height,
              top,
              right,
              bottom,
              left,
              x,
              y
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
          expect(boundingClientRectAfter1.x).to.equal(x);
          expect(boundingClientRectAfter1.y).to.equal(y);
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
          expect(boundingClientRect.x).to.equal(1);
          expect(boundingClientRect.y).to.equal(1);
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
          x++;
          y++;

          $org.setBoundingClientRect(
            {
              width,
              height,
              top,
              right,
              bottom,
              left,
              x,
              y
            }
          );
          $org.innerWidth(width);
          $org.innerHeight(height);
          $org.outerWidth(width);
          $org.outerHeight(height);
          $org.scrollLeft(left);
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
          expect(stateBefore.boundingClientRect.x).to.not.equal(stateAfter.boundingClientRect.x);
          expect(stateBefore.boundingClientRect.y).to.not.equal(stateAfter.boundingClientRect.y);
          expect(stateBefore.innerWidth).to.not.equal(stateAfter.innerWidth);
          expect(stateBefore.innerHeight).to.not.equal(stateAfter.innerHeight);
          expect(stateBefore.outerWidth).to.not.equal(stateAfter.outerWidth);
          expect(stateBefore.outerHeight).to.not.equal(stateAfter.outerHeight);
          expect(stateBefore.scrollLeft).to.not.equal(stateAfter.scrollLeft);
          expect(stateBefore.scrollTop).to.not.equal(stateAfter.scrollTop);
          expect(stateBefore.width).to.not.equal(stateAfter.width);
          expect(stateBefore.height).to.not.equal(stateAfter.height);

          expect(stateAfter.boundingClientRect.width).to.equal(width);
          expect(stateAfter.boundingClientRect.height).to.equal(height);
          expect(stateAfter.boundingClientRect.top).to.equal(top);
          expect(stateAfter.boundingClientRect.right).to.equal(right);
          expect(stateAfter.boundingClientRect.bottom).to.equal(bottom);
          expect(stateAfter.boundingClientRect.left).to.equal(left);
          expect(stateAfter.boundingClientRect.x).to.equal(x);
          expect(stateAfter.boundingClientRect.y).to.equal(y);
          expect(stateAfter.innerWidth).to.equal(width);
          expect(stateAfter.innerHeight).to.equal(height);
          expect(stateAfter.outerWidth).to.equal(width);
          expect(stateAfter.outerHeight).to.equal(height);
          expect(stateAfter.scrollLeft).to.equal(left);
          expect(stateAfter.scrollTop).to.equal(top);
          expect(stateAfter.width).to.equal(width);
          expect(stateAfter.height).to.equal(height);
        });

        it('.updateMeasurements() updates measurement properties in a targeted manner with the default index\
', function () {
          const $org = requerio.$orgs['.main__div']; // Necessary to set .main__div for the .reducer-get tests.
          const stateBefore0 = $org.getState(0);

          width++;
          height++;
          top++;
          right++;
          bottom++;
          left++;
          x++;
          y++;

          // Cheerio.
          if ($._root && $._root.attribs) {
            $org.innerWidth(width, 0);
            $org.innerHeight(height, 0);
            $org.outerWidth(width, 0);
            $org.outerHeight(height, 0);
            $org.scrollLeft(left, 0);
            $org.scrollTop(top, 0);
            $org.width(width, 0);
            $org.height(height, 0);
          }
          // jQuery.
          else {
            $org.$members[0].innerWidth(width);
            $org.$members[0].innerHeight(height);
            $org.$members[0].outerWidth(width);
            $org.$members[0].outerHeight(height);
            $org.$members[0].scrollLeft(left);
            $org.$members[0].scrollTop(top);
            $org.$members[0].width(width);
            $org.$members[0].height(height);
          }
          $org.setBoundingClientRect(
            {
              width,
              height,
              top,
              right,
              bottom,
              left,
              x,
              y
            },
            0
          );
          $org.updateMeasurements(stateBefore0, $org.$members[0]);

          const stateAfter0 = $org.getState(0);

          expect(stateAfter0.boundingClientRect.width).to.not.equal(stateBefore0.boundingClientRect.width);
          expect(stateAfter0.boundingClientRect.height).to.not.equal(stateBefore0.boundingClientRect.height);
          expect(stateAfter0.boundingClientRect.top).to.not.equal(stateBefore0.boundingClientRect.top);
          expect(stateAfter0.boundingClientRect.right).to.not.equal(stateBefore0.boundingClientRect.right);
          expect(stateAfter0.boundingClientRect.bottom).to.not.equal(stateBefore0.boundingClientRect.bottom);
          expect(stateAfter0.boundingClientRect.left).to.not.equal(stateBefore0.boundingClientRect.left);
          expect(stateAfter0.boundingClientRect.x).to.not.equal(stateBefore0.boundingClientRect.x);
          expect(stateAfter0.boundingClientRect.y).to.not.equal(stateBefore0.boundingClientRect.y);
          expect(stateAfter0.innerWidth).to.not.equal(stateBefore0.innerWidth);
          expect(stateAfter0.innerHeight).to.not.equal(stateBefore0.innerHeight);
          expect(stateAfter0.outerWidth).to.not.equal(stateBefore0.outerWidth);
          expect(stateAfter0.outerHeight).to.not.equal(stateBefore0.outerHeight);
          expect(stateAfter0.scrollLeft).to.not.equal(stateBefore0.scrollLeft);
          expect(stateAfter0.scrollTop).to.not.equal(stateBefore0.scrollTop);
          expect(stateAfter0.width).to.not.equal(stateBefore0.width);
          expect(stateAfter0.height).to.not.equal(stateBefore0.height);

          expect(stateAfter0.boundingClientRect.width).to.equal(width);
          expect(stateAfter0.boundingClientRect.height).to.equal(height);
          expect(stateAfter0.boundingClientRect.top).to.equal(top);
          expect(stateAfter0.boundingClientRect.right).to.equal(right);
          expect(stateAfter0.boundingClientRect.bottom).to.equal(bottom);
          expect(stateAfter0.boundingClientRect.left).to.equal(left);
          expect(stateAfter0.boundingClientRect.x).to.equal(x);
          expect(stateAfter0.boundingClientRect.y).to.equal(y);
          expect(stateAfter0.innerWidth).to.equal(width);
          expect(stateAfter0.innerHeight).to.equal(height);
          expect(stateAfter0.outerWidth).to.equal(width);
          expect(stateAfter0.outerHeight).to.equal(height);
          expect(stateAfter0.scrollLeft).to.equal(left);
          expect(stateAfter0.scrollTop).to.equal(top);
          expect(stateAfter0.width).to.equal(width);
          expect(stateAfter0.height).to.equal(height);
        });

        it('.updateMeasurements() updates measurement properties in a targeted manner with a specific index\
', function () {
          const $org = requerio.$orgs['.main__div']; // Necessary to set .main__div for the .reducer-get tests.
          const stateBefore1 = $org.getState(1);

          width++;
          height++;
          top++;
          right++;
          bottom++;
          left++;
          x++;
          y++;

          // Cheerio.
          if ($._root && $._root.attribs) {
            $org.innerWidth(width, 1);
            $org.innerHeight(height, 1);
            $org.outerWidth(width, 1);
            $org.outerHeight(height, 1);
            $org.scrollLeft(left, 1);
            $org.scrollTop(top, 1);
            $org.width(width, 1);
            $org.height(height, 1);
          }
          // jQuery.
          else {
            $org.$members[1].innerWidth(width);
            $org.$members[1].innerHeight(height);
            $org.$members[1].outerWidth(width);
            $org.$members[1].outerHeight(height);
            $org.$members[1].scrollLeft(left);
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
              left,
              x,
              y
            },
            1
          );
          $org.updateMeasurements(stateBefore1, $org.$members[1], 1);

          const stateAfter0 = $org.getState(0);
          const stateAfter1 = $org.getState(1);

          expect(stateAfter1.boundingClientRect.width).to.not.equal(stateBefore1.boundingClientRect.width);
          expect(stateAfter1.boundingClientRect.height).to.not.equal(stateBefore1.boundingClientRect.height);
          expect(stateAfter1.boundingClientRect.top).to.not.equal(stateBefore1.boundingClientRect.top);
          expect(stateAfter1.boundingClientRect.right).to.not.equal(stateBefore1.boundingClientRect.right);
          expect(stateAfter1.boundingClientRect.bottom).to.not.equal(stateBefore1.boundingClientRect.bottom);
          expect(stateAfter1.boundingClientRect.left).to.not.equal(stateBefore1.boundingClientRect.left);
          expect(stateAfter1.boundingClientRect.x).to.not.equal(stateBefore1.boundingClientRect.x);
          expect(stateAfter1.boundingClientRect.y).to.not.equal(stateBefore1.boundingClientRect.y);
          expect(stateAfter1.innerWidth).to.not.equal(stateBefore1.innerWidth);
          expect(stateAfter1.innerHeight).to.not.equal(stateBefore1.innerHeight);
          expect(stateAfter1.outerWidth).to.not.equal(stateBefore1.outerWidth);
          expect(stateAfter1.outerHeight).to.not.equal(stateBefore1.outerHeight);
          expect(stateAfter1.scrollLeft).to.not.equal(stateBefore1.scrollLeft);
          expect(stateAfter1.scrollTop).to.not.equal(stateBefore1.scrollTop);
          expect(stateAfter1.width).to.not.equal(stateBefore1.width);
          expect(stateAfter1.height).to.not.equal(stateBefore1.height);

          expect(stateAfter1.boundingClientRect.width).to.not.equal(stateAfter0.boundingClientRect.width);
          expect(stateAfter1.boundingClientRect.height).to.not.equal(stateAfter0.boundingClientRect.height);
          expect(stateAfter1.boundingClientRect.top).to.not.equal(stateAfter0.boundingClientRect.top);
          expect(stateAfter1.boundingClientRect.right).to.not.equal(stateAfter0.boundingClientRect.right);
          expect(stateAfter1.boundingClientRect.bottom).to.not.equal(stateAfter0.boundingClientRect.bottom);
          expect(stateAfter1.boundingClientRect.left).to.not.equal(stateAfter0.boundingClientRect.left);
          expect(stateAfter1.boundingClientRect.x).to.not.equal(stateAfter0.boundingClientRect.x);
          expect(stateAfter1.boundingClientRect.y).to.not.equal(stateAfter0.boundingClientRect.y);
          expect(stateAfter1.innerWidth).to.not.equal(stateAfter0.innerWidth);
          expect(stateAfter1.innerHeight).to.not.equal(stateAfter0.innerHeight);
          expect(stateAfter1.outerWidth).to.not.equal(stateAfter0.outerWidth);
          expect(stateAfter1.outerHeight).to.not.equal(stateAfter0.outerHeight);
          expect(stateAfter1.scrollLeft).to.not.equal(stateAfter0.scrollLeft);
          expect(stateAfter1.scrollTop).to.not.equal(stateAfter0.scrollTop);
          expect(stateAfter1.width).to.not.equal(stateAfter0.width);
          expect(stateAfter1.height).to.not.equal(stateAfter0.height);

          expect(stateAfter1.boundingClientRect.width).to.equal(width);
          expect(stateAfter1.boundingClientRect.height).to.equal(height);
          expect(stateAfter1.boundingClientRect.top).to.equal(top);
          expect(stateAfter1.boundingClientRect.right).to.equal(right);
          expect(stateAfter1.boundingClientRect.bottom).to.equal(bottom);
          expect(stateAfter1.boundingClientRect.left).to.equal(left);
          expect(stateAfter1.boundingClientRect.x).to.equal(x);
          expect(stateAfter1.boundingClientRect.y).to.equal(y);
          expect(stateAfter1.innerWidth).to.equal(width);
          expect(stateAfter1.innerHeight).to.equal(height);
          expect(stateAfter1.outerWidth).to.equal(width);
          expect(stateAfter1.outerHeight).to.equal(height);
          expect(stateAfter1.scrollLeft).to.equal(left);
          expect(stateAfter1.scrollTop).to.equal(top);
          expect(stateAfter1.width).to.equal(width);
          expect(stateAfter1.height).to.equal(height);
        });

        it('.updateMeasurements() updates measurement properties across multiple targets with default indices\
', function () {
          const $org = requerio.$orgs['.dispatchAction__css']; // Has 3 members.
          const stateBefore0 = $org.getState(0);
          const stateBefore1 = $org.getState(1);
          const stateBefore2 = $org.getState(2);

          width++;
          height++;
          top++;
          right++;
          bottom++;
          left++;
          x++;
          y++;

          // Cheerio.
          if ($._root && $._root.attribs) {
            $org.innerWidth(width, 0);
            $org.innerHeight(height, 0);
            $org.outerWidth(width, 0);
            $org.outerHeight(height, 0);
            $org.scrollLeft(left, 0);
            $org.scrollTop(top, 0);
            $org.width(width, 0);
            $org.height(height, 0);
            $org.innerWidth(width, 1);
            $org.innerHeight(height, 1);
            $org.outerWidth(width, 1);
            $org.outerHeight(height, 1);
            $org.scrollLeft(left, 1);
            $org.scrollTop(top, 1);
            $org.width(width, 1);
            $org.height(height, 1);
            $org.innerWidth(width, 2);
            $org.innerHeight(height, 2);
            $org.outerWidth(width, 2);
            $org.outerHeight(height, 2);
            $org.scrollLeft(left, 2);
            $org.scrollTop(top, 2);
            $org.width(width, 2);
            $org.height(height, 2);
          }
          // jQuery.
          else {
            $org.$members[0].innerWidth(width);
            $org.$members[0].innerHeight(height);
            $org.$members[0].outerWidth(width);
            $org.$members[0].outerHeight(height);
            $org.$members[0].scrollLeft(left);
            $org.$members[0].scrollTop(top);
            $org.$members[0].width(width);
            $org.$members[0].height(height);
            $org.$members[1].innerWidth(width);
            $org.$members[1].innerHeight(height);
            $org.$members[1].outerWidth(width);
            $org.$members[1].outerHeight(height);
            $org.$members[1].scrollLeft(left);
            $org.$members[1].scrollTop(top);
            $org.$members[1].width(width);
            $org.$members[1].height(height);
            $org.$members[2].innerWidth(width);
            $org.$members[2].innerHeight(height);
            $org.$members[2].outerWidth(width);
            $org.$members[2].outerHeight(height);
            $org.$members[2].scrollLeft(left);
            $org.$members[2].scrollTop(top);
            $org.$members[2].width(width);
            $org.$members[2].height(height);
          }
          $org.setBoundingClientRect(
            {
              width,
              height,
              top,
              right,
              bottom,
              left,
              x,
              y
            },
            [0, 1, 2]
          );
          $org.updateMeasurements(stateBefore0, $org.$members);

          const stateAfter0 = $org.getState(0);
          const stateAfter1 = $org.getState(1);
          const stateAfter2 = $org.getState(2);

          expect(stateAfter0.boundingClientRect.width).to.not.equal(stateBefore0.boundingClientRect.width);
          expect(stateAfter0.boundingClientRect.height).to.not.equal(stateBefore0.boundingClientRect.height);
          expect(stateAfter0.boundingClientRect.top).to.not.equal(stateBefore0.boundingClientRect.top);
          expect(stateAfter0.boundingClientRect.right).to.not.equal(stateBefore0.boundingClientRect.right);
          expect(stateAfter0.boundingClientRect.bottom).to.not.equal(stateBefore0.boundingClientRect.bottom);
          expect(stateAfter0.boundingClientRect.left).to.not.equal(stateBefore0.boundingClientRect.left);
          expect(stateAfter0.boundingClientRect.x).to.not.equal(stateBefore0.boundingClientRect.x);
          expect(stateAfter0.boundingClientRect.y).to.not.equal(stateBefore0.boundingClientRect.y);
          expect(stateAfter0.innerWidth).to.not.equal(stateBefore0.innerWidth);
          expect(stateAfter0.innerHeight).to.not.equal(stateBefore0.innerHeight);
          expect(stateAfter0.outerWidth).to.not.equal(stateBefore0.outerWidth);
          expect(stateAfter0.outerHeight).to.not.equal(stateBefore0.outerHeight);
          expect(stateAfter0.scrollLeft).to.not.equal(stateBefore0.scrollLeft);
          expect(stateAfter0.scrollTop).to.not.equal(stateBefore0.scrollTop);
          expect(stateAfter0.width).to.not.equal(stateBefore0.width);
          expect(stateAfter0.height).to.not.equal(stateBefore0.height);

          expect(stateAfter1.boundingClientRect.width).to.not.equal(stateBefore1.boundingClientRect.width);
          expect(stateAfter1.boundingClientRect.height).to.not.equal(stateBefore1.boundingClientRect.height);
          expect(stateAfter1.boundingClientRect.top).to.not.equal(stateBefore1.boundingClientRect.top);
          expect(stateAfter1.boundingClientRect.right).to.not.equal(stateBefore1.boundingClientRect.right);
          expect(stateAfter1.boundingClientRect.bottom).to.not.equal(stateBefore1.boundingClientRect.bottom);
          expect(stateAfter1.boundingClientRect.left).to.not.equal(stateBefore1.boundingClientRect.left);
          expect(stateAfter1.boundingClientRect.x).to.not.equal(stateBefore1.boundingClientRect.x);
          expect(stateAfter1.boundingClientRect.y).to.not.equal(stateBefore1.boundingClientRect.y);
          expect(stateAfter1.innerWidth).to.not.equal(stateBefore1.innerWidth);
          expect(stateAfter1.innerHeight).to.not.equal(stateBefore1.innerHeight);
          expect(stateAfter1.outerWidth).to.not.equal(stateBefore1.outerWidth);
          expect(stateAfter1.outerHeight).to.not.equal(stateBefore1.outerHeight);
          expect(stateAfter1.scrollLeft).to.not.equal(stateBefore1.scrollLeft);
          expect(stateAfter1.scrollTop).to.not.equal(stateBefore1.scrollTop);
          expect(stateAfter1.width).to.not.equal(stateBefore1.width);
          expect(stateAfter1.height).to.not.equal(stateBefore1.height);

          expect(stateAfter2.boundingClientRect.width).to.not.equal(stateBefore2.boundingClientRect.width);
          expect(stateAfter2.boundingClientRect.height).to.not.equal(stateBefore2.boundingClientRect.height);
          expect(stateAfter2.boundingClientRect.top).to.not.equal(stateBefore2.boundingClientRect.top);
          expect(stateAfter2.boundingClientRect.right).to.not.equal(stateBefore2.boundingClientRect.right);
          expect(stateAfter2.boundingClientRect.bottom).to.not.equal(stateBefore2.boundingClientRect.bottom);
          expect(stateAfter2.boundingClientRect.left).to.not.equal(stateBefore2.boundingClientRect.left);
          expect(stateAfter2.boundingClientRect.x).to.not.equal(stateBefore2.boundingClientRect.x);
          expect(stateAfter2.boundingClientRect.y).to.not.equal(stateBefore2.boundingClientRect.y);
          expect(stateAfter2.innerWidth).to.not.equal(stateBefore2.innerWidth);
          expect(stateAfter2.innerHeight).to.not.equal(stateBefore2.innerHeight);
          expect(stateAfter2.outerWidth).to.not.equal(stateBefore2.outerWidth);
          expect(stateAfter2.outerHeight).to.not.equal(stateBefore2.outerHeight);
          expect(stateAfter2.scrollLeft).to.not.equal(stateBefore2.scrollLeft);
          expect(stateAfter2.scrollTop).to.not.equal(stateBefore2.scrollTop);
          expect(stateAfter2.width).to.not.equal(stateBefore2.width);
          expect(stateAfter2.height).to.not.equal(stateBefore2.height);

          expect(stateAfter0.boundingClientRect.width).to.equal(width);
          expect(stateAfter0.boundingClientRect.height).to.equal(height);
          expect(stateAfter0.boundingClientRect.top).to.equal(top);
          expect(stateAfter0.boundingClientRect.right).to.equal(right);
          expect(stateAfter0.boundingClientRect.bottom).to.equal(bottom);
          expect(stateAfter0.boundingClientRect.left).to.equal(left);
          expect(stateAfter0.boundingClientRect.x).to.equal(x);
          expect(stateAfter0.boundingClientRect.y).to.equal(y);
          expect(stateAfter0.innerWidth).to.equal(width);
          expect(stateAfter0.innerHeight).to.equal(height);
          expect(stateAfter0.outerWidth).to.equal(width);
          expect(stateAfter0.outerHeight).to.equal(height);
          expect(stateAfter0.scrollLeft).to.equal(left);
          expect(stateAfter0.scrollTop).to.equal(top);
          expect(stateAfter0.width).to.equal(width);
          expect(stateAfter0.height).to.equal(height);

          expect(stateAfter1.boundingClientRect.width).to.equal(width);
          expect(stateAfter1.boundingClientRect.height).to.equal(height);
          expect(stateAfter1.boundingClientRect.top).to.equal(top);
          expect(stateAfter1.boundingClientRect.right).to.equal(right);
          expect(stateAfter1.boundingClientRect.bottom).to.equal(bottom);
          expect(stateAfter1.boundingClientRect.left).to.equal(left);
          expect(stateAfter1.boundingClientRect.x).to.equal(x);
          expect(stateAfter1.boundingClientRect.y).to.equal(y);
          expect(stateAfter1.innerWidth).to.equal(width);
          expect(stateAfter1.innerHeight).to.equal(height);
          expect(stateAfter1.outerWidth).to.equal(width);
          expect(stateAfter1.outerHeight).to.equal(height);
          expect(stateAfter1.scrollLeft).to.equal(left);
          expect(stateAfter1.scrollTop).to.equal(top);
          expect(stateAfter1.width).to.equal(width);
          expect(stateAfter1.height).to.equal(height);

          expect(stateAfter2.boundingClientRect.width).to.equal(width);
          expect(stateAfter2.boundingClientRect.height).to.equal(height);
          expect(stateAfter2.boundingClientRect.top).to.equal(top);
          expect(stateAfter2.boundingClientRect.right).to.equal(right);
          expect(stateAfter2.boundingClientRect.bottom).to.equal(bottom);
          expect(stateAfter2.boundingClientRect.left).to.equal(left);
          expect(stateAfter2.boundingClientRect.x).to.equal(x);
          expect(stateAfter2.boundingClientRect.y).to.equal(y);
          expect(stateAfter2.innerWidth).to.equal(width);
          expect(stateAfter2.innerHeight).to.equal(height);
          expect(stateAfter2.outerWidth).to.equal(width);
          expect(stateAfter2.outerHeight).to.equal(height);
          expect(stateAfter2.scrollLeft).to.equal(left);
          expect(stateAfter2.scrollTop).to.equal(top);
          expect(stateAfter2.width).to.equal(width);
          expect(stateAfter2.height).to.equal(height);
        });

        it('.updateMeasurements() updates measurement properties across multiple targets with specific indices\
', function () {
          const $org = requerio.$orgs['.dispatchAction__css']; // Has 3 members.
          const stateBefore0 = $org.getState(0);
          const stateBefore2 = $org.getState(2);

          width++;
          height++;
          top++;
          right++;
          bottom++;
          left++;
          x++;
          y++;

          // Cheerio.
          if ($._root && $._root.attribs) {
            $org.innerWidth(width, 0);
            $org.innerHeight(height, 0);
            $org.outerWidth(width, 0);
            $org.outerHeight(height, 0);
            $org.scrollLeft(left, 0);
            $org.scrollTop(top, 0);
            $org.width(width, 0);
            $org.height(height, 0);
            $org.innerWidth(width, 2);
            $org.innerHeight(height, 2);
            $org.outerWidth(width, 2);
            $org.outerHeight(height, 2);
            $org.scrollLeft(left, 2);
            $org.scrollTop(top, 2);
            $org.width(width, 2);
            $org.height(height, 2);
          }
          // jQuery.
          else {
            $org.$members[0].innerWidth(width);
            $org.$members[0].innerHeight(height);
            $org.$members[0].outerWidth(width);
            $org.$members[0].outerHeight(height);
            $org.$members[0].scrollLeft(left);
            $org.$members[0].scrollTop(top);
            $org.$members[0].width(width);
            $org.$members[0].height(height);
            $org.$members[2].innerWidth(width);
            $org.$members[2].innerHeight(height);
            $org.$members[2].outerWidth(width);
            $org.$members[2].outerHeight(height);
            $org.$members[2].scrollLeft(left);
            $org.$members[2].scrollTop(top);
            $org.$members[2].width(width);
            $org.$members[2].height(height);
          }
          $org.setBoundingClientRect(
            {
              width,
              height,
              top,
              right,
              bottom,
              left,
              x,
              y
            },
            [0, 2]
          );
          $org.updateMeasurements(stateBefore0, [$org.$members[0], $org.$members[2]], [0, 2]);

          const stateAfter0 = $org.getState(0);
          const stateAfter1 = $org.getState(1);
          const stateAfter2 = $org.getState(2);


          expect(stateAfter0.boundingClientRect.width).to.not.equal(stateBefore0.boundingClientRect.width);
          expect(stateAfter0.boundingClientRect.height).to.not.equal(stateBefore0.boundingClientRect.height);
          expect(stateAfter0.boundingClientRect.top).to.not.equal(stateBefore0.boundingClientRect.top);
          expect(stateAfter0.boundingClientRect.right).to.not.equal(stateBefore0.boundingClientRect.right);
          expect(stateAfter0.boundingClientRect.bottom).to.not.equal(stateBefore0.boundingClientRect.bottom);
          expect(stateAfter0.boundingClientRect.left).to.not.equal(stateBefore0.boundingClientRect.left);
          expect(stateAfter0.boundingClientRect.x).to.not.equal(stateBefore0.boundingClientRect.x);
          expect(stateAfter0.boundingClientRect.y).to.not.equal(stateBefore0.boundingClientRect.y);
          expect(stateAfter0.innerWidth).to.not.equal(stateBefore0.innerWidth);
          expect(stateAfter0.innerHeight).to.not.equal(stateBefore0.innerHeight);
          expect(stateAfter0.outerWidth).to.not.equal(stateBefore0.outerWidth);
          expect(stateAfter0.outerHeight).to.not.equal(stateBefore0.outerHeight);
          expect(stateAfter0.scrollLeft).to.not.equal(stateBefore0.scrollLeft);
          expect(stateAfter0.scrollTop).to.not.equal(stateBefore0.scrollTop);
          expect(stateAfter0.width).to.not.equal(stateBefore0.width);
          expect(stateAfter0.height).to.not.equal(stateBefore0.height);

          expect(stateAfter2.boundingClientRect.width).to.not.equal(stateBefore2.boundingClientRect.width);
          expect(stateAfter2.boundingClientRect.height).to.not.equal(stateBefore2.boundingClientRect.height);
          expect(stateAfter2.boundingClientRect.top).to.not.equal(stateBefore2.boundingClientRect.top);
          expect(stateAfter2.boundingClientRect.right).to.not.equal(stateBefore2.boundingClientRect.right);
          expect(stateAfter2.boundingClientRect.bottom).to.not.equal(stateBefore2.boundingClientRect.bottom);
          expect(stateAfter2.boundingClientRect.left).to.not.equal(stateBefore2.boundingClientRect.left);
          expect(stateAfter2.boundingClientRect.x).to.not.equal(stateBefore2.boundingClientRect.x);
          expect(stateAfter2.boundingClientRect.y).to.not.equal(stateBefore2.boundingClientRect.y);
          expect(stateAfter2.innerWidth).to.not.equal(stateBefore2.innerWidth);
          expect(stateAfter2.innerHeight).to.not.equal(stateBefore2.innerHeight);
          expect(stateAfter2.outerWidth).to.not.equal(stateBefore2.outerWidth);
          expect(stateAfter2.outerHeight).to.not.equal(stateBefore2.outerHeight);
          expect(stateAfter2.scrollLeft).to.not.equal(stateBefore2.scrollLeft);
          expect(stateAfter2.scrollTop).to.not.equal(stateBefore2.scrollTop);
          expect(stateAfter2.width).to.not.equal(stateBefore2.width);
          expect(stateAfter2.height).to.not.equal(stateBefore2.height);

          if (typeof window === 'object') {
            expect(stateAfter0.boundingClientRect.width).to.not.equal(stateAfter1.boundingClientRect.width);
            expect(stateAfter0.boundingClientRect.height).to.not.equal(stateAfter1.boundingClientRect.height);
            expect(stateAfter0.boundingClientRect.top).to.not.equal(stateAfter1.boundingClientRect.top);
            expect(stateAfter0.boundingClientRect.right).to.not.equal(stateAfter1.boundingClientRect.right);
            expect(stateAfter0.boundingClientRect.bottom).to.not.equal(stateAfter1.boundingClientRect.bottom);
            expect(stateAfter0.boundingClientRect.left).to.not.equal(stateAfter1.boundingClientRect.left);
            expect(stateAfter0.boundingClientRect.x).to.not.equal(stateAfter1.boundingClientRect.x);
            expect(stateAfter0.boundingClientRect.y).to.not.equal(stateAfter1.boundingClientRect.y);
            expect(stateAfter0.innerWidth).to.not.equal(stateAfter1.innerWidth);
            expect(stateAfter0.innerHeight).to.not.equal(stateAfter1.innerHeight);
            expect(stateAfter0.outerWidth).to.not.equal(stateAfter1.outerWidth);
            expect(stateAfter0.outerHeight).to.not.equal(stateAfter1.outerHeight);
            expect(stateAfter0.scrollLeft).to.not.equal(stateAfter1.scrollLeft);
            expect(stateAfter0.scrollTop).to.not.equal(stateAfter1.scrollTop);
            expect(stateAfter0.width).to.not.equal(stateAfter1.width);
            expect(stateAfter0.height).to.not.equal(stateAfter1.height);

            expect(stateAfter2.boundingClientRect.width).to.not.equal(stateAfter1.boundingClientRect.width);
            expect(stateAfter2.boundingClientRect.height).to.not.equal(stateAfter1.boundingClientRect.height);
            expect(stateAfter2.boundingClientRect.top).to.not.equal(stateAfter1.boundingClientRect.top);
            expect(stateAfter2.boundingClientRect.right).to.not.equal(stateAfter1.boundingClientRect.right);
            expect(stateAfter2.boundingClientRect.bottom).to.not.equal(stateAfter1.boundingClientRect.bottom);
            expect(stateAfter2.boundingClientRect.left).to.not.equal(stateAfter1.boundingClientRect.left);
            expect(stateAfter2.boundingClientRect.x).to.not.equal(stateAfter1.boundingClientRect.x);
            expect(stateAfter2.boundingClientRect.y).to.not.equal(stateAfter1.boundingClientRect.y);
            expect(stateAfter2.innerWidth).to.not.equal(stateAfter1.innerWidth);
            expect(stateAfter2.innerHeight).to.not.equal(stateAfter1.innerHeight);
            expect(stateAfter2.outerWidth).to.not.equal(stateAfter1.outerWidth);
            expect(stateAfter2.outerHeight).to.not.equal(stateAfter1.outerHeight);
            expect(stateAfter2.scrollLeft).to.not.equal(stateAfter1.scrollLeft);
            expect(stateAfter2.scrollTop).to.not.equal(stateAfter1.scrollTop);
            expect(stateAfter2.width).to.not.equal(stateAfter1.width);
            expect(stateAfter2.height).to.not.equal(stateAfter1.height);
          }

          expect(stateAfter0.boundingClientRect.width).to.equal(width);
          expect(stateAfter0.boundingClientRect.height).to.equal(height);
          expect(stateAfter0.boundingClientRect.top).to.equal(top);
          expect(stateAfter0.boundingClientRect.right).to.equal(right);
          expect(stateAfter0.boundingClientRect.bottom).to.equal(bottom);
          expect(stateAfter0.boundingClientRect.left).to.equal(left);
          expect(stateAfter0.boundingClientRect.x).to.equal(x);
          expect(stateAfter0.boundingClientRect.y).to.equal(y);
          expect(stateAfter0.innerWidth).to.equal(width);
          expect(stateAfter0.innerHeight).to.equal(height);
          expect(stateAfter0.outerWidth).to.equal(width);
          expect(stateAfter0.outerHeight).to.equal(height);
          expect(stateAfter0.scrollLeft).to.equal(left);
          expect(stateAfter0.scrollTop).to.equal(top);
          expect(stateAfter0.width).to.equal(width);
          expect(stateAfter0.height).to.equal(height);

          expect(stateAfter2.boundingClientRect.width).to.equal(width);
          expect(stateAfter2.boundingClientRect.height).to.equal(height);
          expect(stateAfter2.boundingClientRect.top).to.equal(top);
          expect(stateAfter2.boundingClientRect.right).to.equal(right);
          expect(stateAfter2.boundingClientRect.bottom).to.equal(bottom);
          expect(stateAfter2.boundingClientRect.left).to.equal(left);
          expect(stateAfter2.boundingClientRect.x).to.equal(x);
          expect(stateAfter2.boundingClientRect.y).to.equal(y);
          expect(stateAfter2.innerWidth).to.equal(width);
          expect(stateAfter2.innerHeight).to.equal(height);
          expect(stateAfter2.outerWidth).to.equal(width);
          expect(stateAfter2.outerHeight).to.equal(height);
          expect(stateAfter2.scrollLeft).to.equal(left);
          expect(stateAfter2.scrollTop).to.equal(top);
          expect(stateAfter2.width).to.equal(width);
          expect(stateAfter2.height).to.equal(height);
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

                if ($organism) {
                  scrollTopRetVal = $organism.scrollTop(top);

                  expect(scrollTopRetVal).to.equal($organism);
                }
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

                if ($organism) {
                  scrollTopRetVal = $organism.scrollTop();

                  expect(scrollTopRetVal).to.equal(top);
                }
            }
          });
        });
      });

      describe('width()', function () {
        it('accepts a value and returns the same value on the server to mock the method call on the client\
', function () {
          Object.keys(requerio.$orgs).forEach((selector) => {
            // Arbitrary condition. Can't operate on all organisms because it will mess with later tests.
            if (!selector.includes('.exclude__')) {
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
            // Arbitrary condition. Can't operate on all organisms because it will mess with later tests.
            if (!selector.includes('.exclude__')) {
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
      it('dispatches the "addClass" action with a string argument', function () {
        requerio.$orgs['#main'].dispatchAction('addClass', 'add-class-string');

        const state = requerio.$orgs['#main'].getState();

        expect(state.attribs.class).to.equal('add-class-string');
        expect(state.classArray).to.include('add-class-string');
        expect(state.classArray).to.include('add-class-string');
      });

      it('dispatches the "addClass" action with a function argument', function () {
        requerio.$orgs['#main'].dispatchAction('addClass', () => 'add-class-function');

        const state = requerio.$orgs['#main'].getState();

        expect(state.attribs.class).to.have.string('add-class-function');
        expect(state.classArray).to.include('add-class-function');
        expect(state.classArray).to.include('add-class-function');
      });

      it('dispatches the "addClass" action in a targeted manner', function () {
        requerio.$orgs['.main__div'].dispatchAction('addClass', 'add-class-1', 1);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.attribs.class).to.not.have.string('add-class-1');
        expect(state0.classArray).to.not.include('add-class-1');
        expect(state0.classArray).to.not.include('add-class-1');
        expect(state1.attribs.class).to.have.string('add-class-1');
        expect(state1.classArray).to.include('add-class-1');
        expect(state1.classArray).to.include('add-class-1');
      });

      it('does not dispatch the "addClass" action if the target is out-of-bounds', function () {
        requerio.$orgs['.main__div'].dispatchAction('addClass', 'out-of-bounds', 2);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.attribs.class).to.not.have.string('out-of-bounds');
        expect(state0.classArray).to.not.include('out-of-bounds');
        expect(state0.classArray).to.not.include('out-of-bounds');
        expect(state1.attribs.class).to.not.have.string('out-of-bounds');
        expect(state1.classArray).to.not.include('out-of-bounds');
        expect(state1.classArray).to.not.include('out-of-bounds');
      });

      it('dispatches the "removeClass" action with a string argument', function () {
        requerio.$orgs['#main'].dispatchAction('addClass', 'remove-class-string');

        const stateBefore = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('removeClass', 'remove-class-string');

        const stateAfter = requerio.$orgs['#main'].getState();

        expect(stateBefore.attribs.class).to.have.string('remove-class-string');
        expect(stateBefore.classArray).to.include('remove-class-string');
        expect(stateBefore.classArray).to.include('remove-class-string');
        expect(stateAfter.attribs.class).to.not.have.string('remove-class-string');
        expect(stateAfter.classArray).to.not.include('remove-class-string');
        expect(stateAfter.classArray).to.not.include('remove-class-string');
      });

      it('dispatches the "removeClass" action with a function argument', function () {
        requerio.$orgs['#main'].dispatchAction('addClass', 'remove-class-function');

        const stateBefore = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('removeClass', () => 'remove-class-function');

        const stateAfter = requerio.$orgs['#main'].getState();

        expect(stateBefore.attribs.class).to.have.string('remove-class-function');
        expect(stateBefore.classArray).to.include('remove-class-function');
        expect(stateBefore.classArray).to.include('remove-class-function');
        expect(stateAfter.attribs.class).to.not.have.string('remove-class-function');
        expect(stateAfter.classArray).to.not.include('remove-class-function');
        expect(stateAfter.classArray).to.not.include('remove-class-function');
      });

      it('dispatches the "toggleClass" action with a string argument', function () {
        const state0 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', 'toggle-class-string');

        const state1 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', 'toggle-class-string');

        const state2 = requerio.$orgs['#main'].getState();

        expect(state0.attribs.class).to.not.have.string('toggle-class-string');
        expect(state0.classArray).to.not.include('toggle-class-string');
        expect(state0.classArray).to.not.include('toggle-class-string');
        expect(state1.attribs.class).to.have.string('toggle-class-string');
        expect(state1.classArray).to.include('toggle-class-string');
        expect(state1.classArray).to.include('toggle-class-string');
        expect(state2.attribs.class).to.not.have.string('toggle-class-string');
        expect(state2.classArray).to.not.include('toggle-class-string');
        expect(state2.classArray).to.not.include('toggle-class-string');
      });

      it('dispatches the "toggleClass" action with a function argument', function () {
        const state0 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', () => 'toggle-class-function');

        const state1 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', () => 'toggle-class-function');

        const state2 = requerio.$orgs['#main'].getState();

        expect(state0.attribs.class).to.not.have.string('toggle-class-function');
        expect(state0.classArray).to.not.include('toggle-class-function');
        expect(state0.classArray).to.not.include('toggle-class-function');
        expect(state1.attribs.class).to.have.string('toggle-class-function');
        expect(state1.classArray).to.include('toggle-class-function');
        expect(state1.classArray).to.include('toggle-class-function');
        expect(state2.attribs.class).to.not.have.string('toggle-class-function');
        expect(state2.classArray).to.not.include('toggle-class-function');
        expect(state2.classArray).to.not.include('toggle-class-function');
      });

      it('dispatches the "toggleClass" action with a function argument in a targeted manner', function () {
        const state0 = requerio.$orgs['.main__div'].getState();

        requerio.$orgs['.main__div'].dispatchAction('toggleClass', () => 'toggle-class-function-1', 1);

        const state1 = requerio.$orgs['.main__div'].getState();

        requerio.$orgs['.main__div'].dispatchAction('toggleClass', () => 'toggle-class-function-1', 1);

        const state2 = requerio.$orgs['.main__div'].getState();

        expect(state0.$members[1].attribs.class).to.not.have.string('toggle-class-function-1');
        expect(state0.$members[1].classArray).to.not.include('toggle-class-function-1');
        expect(state0.$members[1].classArray).to.not.include('toggle-class-function-1');
        expect(state1.$members[1].attribs.class).to.have.string('toggle-class-function-1');
        expect(state1.$members[1].classArray).to.include('toggle-class-function-1');
        expect(state1.$members[1].classArray).to.include('toggle-class-function-1');
        expect(state2.$members[1].attribs.class).to.not.have.string('toggle-class-function-1');
        expect(state2.$members[1].classArray).to.not.include('toggle-class-function-1');
        expect(state2.$members[1].classArray).to.not.include('toggle-class-function-1');
      });

      it('dispatches the "toggleClass" action with a true boolean argument', function () {
        const state0 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', ['toggle-class-true', true]);

        const state1 = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('toggleClass', ['toggle-class-true', true]);

        const state2 = requerio.$orgs['#main'].getState();

        expect(state0.attribs.class).to.not.have.string('toggle-class-true');
        expect(state0.classArray).to.not.include('toggle-class-true');
        expect(state0.classArray).to.not.include('toggle-class-true');
        expect(state1.attribs.class).to.have.string('toggle-class-true');
        expect(state1.classArray).to.include('toggle-class-true');
        expect(state1.classArray).to.include('toggle-class-true');
        expect(state2.attribs.class).to.have.string('toggle-class-true');
        expect(state2.classArray).to.include('toggle-class-true');
        expect(state2.classArray).to.include('toggle-class-true');
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
        expect(state0.classArray).to.include('toggle-class-false');
        expect(state1.attribs.class).to.not.have.string('toggle-class-false');
        expect(state1.classArray).to.not.include('toggle-class-false');
        expect(state1.classArray).to.not.include('toggle-class-false');
        expect(state2.attribs.class).to.not.have.string('toggle-class-false');
        expect(state2.classArray).to.not.include('toggle-class-false');
        expect(state2.classArray).to.not.include('toggle-class-false');
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

      it('dispatches the "attr" action with a single string value argument in a targeted manner', function () {
        requerio.$orgs['.main__div'].dispatchAction('attr', {test: 'testing12345'}, 1);

        const state = requerio.$orgs['.main__div'].getState(1);

        expect(state.attribs.test).to.equal('testing12345');
      });

      it('dispatches the "attr" action with a multiple string value argument in a targeted manner', function () {
        requerio.$orgs['.main__div']
          .dispatchAction('attr', {taste: 'tasting12345', test: 'testing67890'}, 1);

        const state = requerio.$orgs['.main__div'].getState(1);

        expect(state.attribs.taste).to.equal('tasting12345');
        expect(state.attribs.test).to.equal('testing67890');
      });

      it('dispatches the "attr" action with a single string value argument across multiple targets', function () {
        requerio.$orgs['.main__div'].dispatchAction('attr', {twist: 'twisting12345'}, [0, 1]);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.attribs.twist).to.equal('twisting12345');
        expect(state1.attribs.twist).to.equal('twisting12345');
      });

      it('dispatches the "attr" action with a multiple string value argument across multiple targets', function () {
        requerio.$orgs['.main__div']
          .dispatchAction('attr', {taste: 'tasting67890', twist: 'twisting67890'}, [0, 1]);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.attribs.taste).to.equal('tasting67890');
        expect(state0.attribs.twist).to.equal('twisting67890');
        expect(state1.attribs.taste).to.equal('tasting67890');
        expect(state1.attribs.twist).to.equal('twisting67890');
      });

      it('dispatches the "css" action with a single string value argument', function () {
        requerio.$orgs['#main'].dispatchAction('css', {color: 'red'});

        const state = requerio.$orgs['#main'].getState();

        expect(state.css.color).to.equal('red');
      });

      it('dispatches the "css" action with a single string camelCase value argument', function () {
        requerio.$orgs['#main'].dispatchAction('css', {backgroundColor: 'darkred'});

        const state = requerio.$orgs['#main'].getState();

        expect(state.css.backgroundColor).to.equal('darkred');

        // Cheerio does not convert from camelCase to hyphenated.
        if (typeof window === 'object') {
          expect(state.css['background-color']).to.equal('darkred');
        }
      });

      it('dispatches the "css" action with a multiple string value argument', function () {
        requerio.$orgs['#main'].dispatchAction('css', {color: 'green', 'background-color': 'green'});

        const state = requerio.$orgs['#main'].getState();

        expect(state.css.color).to.equal('green');
        expect(state.css['background-color']).to.equal('green');

        if (typeof window === 'object') {
          expect(state.css.backgroundColor).to.equal('green');
        }
      });

      it('dispatches the "css" action with a single function value argument', function () {
        requerio.$orgs['#main'].dispatchAction('css', {color: () => 'blue'});

        const state = requerio.$orgs['#main'].getState();

        expect(state.css.color).to.equal('blue');
      });

      it('dispatches the "css" action with a multiple function value argument', function () {
        requerio.$orgs['#main'].dispatchAction('css', {color: () => 'cyan', 'background-color': () => 'cyan'});

        const state = requerio.$orgs['#main'].getState();

        expect(state.css.color).to.equal('cyan');
        expect(state.css['background-color']).to.equal('cyan');

        if (typeof window === 'object') {
          expect(state.css.backgroundColor).to.equal('cyan');
        }

        expect(state.css['background-color']).to.equal('cyan');
      });

      it('dispatches the "css" action with an empty string value argument to unset a style', function () {
        const stateBefore = requerio.$orgs['#main'].getState();

        requerio.$orgs['#main'].dispatchAction('css', {color: ''});

        const stateAfter = requerio.$orgs['#main'].getState();

        expect(stateBefore.css.color).to.equal('cyan');

        expect(stateAfter.css.color).to.be.undefined;
      });

      it('dispatches the "css" action with a single string value argument in a targeted manner', function () {
        requerio.$orgs['.main__div'].dispatchAction('css', {color: 'red'}, 1);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.css.color).to.not.equal(state1.css.color);
        expect(state1.css.color).to.equal('red');
      });

      it('dispatches the "css" action with a single string camelCase value argument in a targeted manner', function () {
        requerio.$orgs['.main__div'].dispatchAction('css', {backgroundColor: 'darkred'}, 1);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.css.backgroundColor).to.not.equal(state1.css.backgroundColor);
        expect(state1.css.backgroundColor).to.equal('darkred');

        // Cheerio does not convert from camelCase to hyphenated.
        if (typeof window === 'object') {
          expect(state0.css['background-color']).to.not.equal(state1.css['background-color']);
          expect(state1.css['background-color']).to.equal('darkred');
        }
      });

      it('dispatches the "css" action with a multiple string value argument in a targeted manner', function () {
        requerio.$orgs['.main__div'].dispatchAction('css', {color: 'blue', 'background-color': 'blue'}, 1);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.css.color).to.not.equal(state1.css.color);
        expect(state1.css.color).to.equal('blue');

        if (typeof window === 'object') {
          expect(state0.css.backgroundColor).to.not.equal(state1.css.backgroundColor);
          expect(state1.css.backgroundColor).to.equal('blue');
        }

        expect(state0.css['background-color']).to.not.equal(state1.css['background-color']);
        expect(state1.css['background-color']).to.equal('blue');
      });

      it('dispatches the "css" action with an empty string value argument to unset a style in a targeted matter\
', function () {
        requerio.$orgs['.main__div'].dispatchAction('css', {color: 'blue', 'background-color': 'blue'}, 0);

        const state0Before = requerio.$orgs['.main__div'].getState(0);
        const state1Before = requerio.$orgs['.main__div'].getState(1);

        requerio.$orgs['.main__div'].dispatchAction('css', {'background-color': ''}, 1);

        const state0After = requerio.$orgs['.main__div'].getState(0);
        const state1After = requerio.$orgs['.main__div'].getState(1);

        expect(state0Before.css['background-color']).to.equal('blue');
        expect(state1Before.css['background-color']).to.equal('blue');

        expect(state0After.css['background-color']).to.equal('blue');
        expect(state1After.css['background-color']).to.be.undefined;
      });

      it('dispatches the "css" action with a single string value argument across multiple targets', function () {
        requerio.$orgs['.main__div'].dispatchAction('css', {color: 'green'}, [0, 1]);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.css.color).to.equal('green');
        expect(state1.css.color).to.equal('green');
      });

      it('dispatches the "css" action with a single string camelCase value argument across multiple targets\
', function () {
        requerio.$orgs['.main__div'].dispatchAction('css', {backgroundColor: 'darkgreen'}, [0, 1]);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.css.backgroundColor).to.equal('darkgreen');
        expect(state1.css.backgroundColor).to.equal('darkgreen');

        // Cheerio does not convert from camelCase to hyphenated.
        if (typeof window === 'object') {
          expect(state0.css['background-color']).to.equal('darkgreen');
          expect(state1.css['background-color']).to.equal('darkgreen');
        }
      });

      it('dispatches the "css" action with a multiple string value argument across multiple targets', function () {
        requerio.$orgs['.main__div'].dispatchAction('css', {color: 'cyan', 'background-color': 'cyan'}, [0, 1]);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.css.color).to.equal('cyan');
        expect(state1.css.color).to.equal('cyan');

        if (typeof window === 'object') {
          expect(state0.css.backgroundColor).to.equal('cyan');
          expect(state1.css.backgroundColor).to.equal('cyan');
        }

        expect(state0.css['background-color']).to.equal('cyan');
        expect(state1.css['background-color']).to.equal('cyan');
      });

      it('dispatches the "css" action with an empty string value argument to unset a style across multiple targets\
', function () {
        const state0Before = requerio.$orgs['.main__div'].getState(0);
        const state1Before = requerio.$orgs['.main__div'].getState(1);

        requerio.$orgs['.main__div'].dispatchAction('css', {backgroundColor: ''}, [0, 1]);

        const state0After = requerio.$orgs['.main__div'].getState(0);
        const state1After = requerio.$orgs['.main__div'].getState(1);

        expect(state0Before.css.backgroundColor).to.equal('cyan');
        expect(state1Before.css.backgroundColor).to.equal('cyan');

        expect(state0After.css.backgroundColor).to.be.undefined;
        expect(state1After.css.backgroundColor).to.be.undefined;
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

      it('dispatches the "data" action with a single string value argument in a targeted manner', function () {
        requerio.$orgs['.main__div'].dispatchAction('data', {test: 'testing12345'}, 1);

        const state = requerio.$orgs['.main__div'].getState(1);

        expect(state.data.test).to.equal('testing12345');
      });

      it('dispatches the "data" action with a multiple string value argument in a targeted manner', function () {
        requerio.$orgs['.main__div'].dispatchAction(
          'data', {taste: 'tasting12345', twist: 'twisting12345', toast: 'toasting12345', trust: 'trusting12345'}, 1);

        const state = requerio.$orgs['.main__div'].getState(1);

        expect(state.data.taste).to.equal('tasting12345');
        expect(state.data.twist).to.equal('twisting12345');
        expect(state.data.toast).to.equal('toasting12345');
        expect(state.data.trust).to.equal('trusting12345');
      });

      it('dispatches the "data" action with a single string value argument across multiple targets', function () {
        requerio.$orgs['.main__div'].dispatchAction('data', {taste: 'tasting67890'}, [0, 1]);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.data.taste).to.equal('tasting67890');
        expect(state1.data.taste).to.equal('tasting67890');
      });

      it('dispatches the "data" action with a multiple string value argument across multiple targets', function () {
        requerio.$orgs['.main__div']
          .dispatchAction('data', {twist: 'twisting67890', toast: 'toasting67890'}, [0, 1]);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

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
        expect(boundingClientRect.x).to.equal(3);
        expect(boundingClientRect.y).to.equal(3);
      });

      it('dispatches the "height" action', function () {
        requerio.$orgs['#main'].dispatchAction('height', 1000);

        const state = requerio.$orgs['#main'].getState();

        expect(state.height).to.equal(1000);
      });

      it('dispatches the "height" action in a targeted manner', function () {
        requerio.$orgs['.main__div'].dispatchAction('height', 1010, 0);

        const state = requerio.$orgs['.main__div'].getState(0);

        expect(state.height).to.equal(1010);
      });

      it('dispatches the "height" action across multiple targets', function () {
        requerio.$orgs['.main__div'].dispatchAction('height', 1020, [0, 1]);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.height).to.equal(1020);
        expect(state1.height).to.equal(1020);
      });

      it('dispatches the "height" action with a function argument', function () {
        requerio.$orgs['#main'].dispatchAction(
          'height',
          function (idx, distance) {
            return distance + parseInt(Object.keys(this).length + '' + idx, 10);
          }
        );

        const state = requerio.$orgs['#main'].getState();

        if (typeof window === 'object') {
          expect(state.height).to.equal(1020);
        }
        else {
          expect(state.height).to.equal(1110);
        }
      });

      it('dispatches the "height" action with a function argument in a targeted manner', function () {
        requerio.$orgs['.main__div'].dispatchAction(
          'height',
          function (idx, distance) {
            return distance + parseInt(Object.keys(this).length + '' + idx, 10);
          },
          0
        );

        const state = requerio.$orgs['.main__div'].getState(0);

        if (typeof window === 'object') {
          expect(state.height).to.equal(1040);
        }
        else {
          expect(state.height).to.equal(1130);
        }
      });

      it('dispatches the "height" action with a function argument across multiple targets', function () {
        requerio.$orgs['.main__div'].dispatchAction(
          'height',
          function (idx, distance) {
            return distance + parseInt(Object.keys(this).length + '' + idx, 10);
          },
          [0, 1]
        );

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        if (typeof window === 'object') {
          expect(state0.height).to.equal(1060);
          expect(state1.height).to.equal(1040);
        }
        else {
          expect(state0.height).to.equal(1240);
          expect(state1.height).to.equal(1131);
        }
      });

      it('dispatches the "prop" action', function () {
        requerio.$orgs['.main__input'].dispatchAction('prop', {disabled: true});

        const state = requerio.$orgs['.main__input'].getState();

        expect(state.prop.disabled).to.be.true;
      });

      it('dispatches the "prop" action in a targeted manner', function () {
        requerio.$orgs['input'].dispatchAction('prop', {disabled: true}, 1);

        const state = requerio.$orgs['input'].getState(1);

        expect(state.prop.disabled).to.be.true;
      });

      it('dispatches the "prop" action across multiple targets', function () {
        requerio.$orgs['input'].dispatchAction('prop', {disabled: false}, [0, 1]);

        const state0 = requerio.$orgs['input'].getState(0);
        const state1 = requerio.$orgs['input'].getState(1);

        expect(state0.prop.disabled).to.be.false;
        expect(state1.prop.disabled).to.be.false;
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

      it('dispatches the "removeData" action with a single string value argument in a targeted manner', function () {
        const stateBefore = requerio.$orgs['.main__div'].getState(1);

        requerio.$orgs['.main__div'].dispatchAction('removeData', 'test', 1);

        const stateAfter = requerio.$orgs['.main__div'].getState(1);

        expect(stateBefore.data.test).to.equal('testing12345');
        expect(stateAfter.data.test).to.be.undefined;
      });

      it('dispatches the "removeData" action with a multiple string value argument in a targeted manner', function () {
        const stateBefore = requerio.$orgs['.main__div'].getState(1);

        requerio.$orgs['.main__div'].dispatchAction('removeData', 'taste twist', 1);

        const stateAfter = requerio.$orgs['.main__div'].getState();

        expect(stateBefore.data.taste).to.equal('tasting67890');
        expect(stateBefore.data.twist).to.equal('twisting67890');
        expect(stateAfter.data.taste).to.be.undefined;
        expect(stateAfter.data.twist).to.be.undefined;
      });

      it('dispatches the "removeData" action with an array argument in a targeted manner', function () {
        const stateBefore = requerio.$orgs['.main__div'].getState(1);

        requerio.$orgs['.main__div'].dispatchAction('removeData', ['toast', 'trust']);

        const stateAfter = requerio.$orgs['.main__div'].getState();

        expect(stateBefore.data.toast).to.equal('toasting67890');
        expect(stateBefore.data.trust).to.equal('trusting12345');
        expect(stateAfter.data.toast).to.be.undefined;
        expect(stateAfter.data.trust).to.be.undefined;
      });

      it('dispatches the "scrollLeft" action', function () {
        requerio.$orgs['#main'].dispatchAction('scrollLeft', 100);

        const state = requerio.$orgs['#main'].getState();

        expect(state.scrollLeft).to.equal(100);
      });

      it('dispatches the "scrollLeft" action in a targeted manner', function () {
        requerio.$orgs['.main__div'].dispatchAction('scrollLeft', 101, 0);

        const state = requerio.$orgs['.main__div'].getState(0);

        expect(state.scrollLeft).to.equal(101);
      });

      it('dispatches the "scrollLeft" action across multiple targets', function () {
        requerio.$orgs['.main__div'].dispatchAction('scrollLeft', 110, [0, 1]);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.scrollLeft).to.equal(110);
        expect(state1.scrollLeft).to.equal(110);
      });

      it('dispatches the "scrollTop" action', function () {
        requerio.$orgs['#main'].dispatchAction('scrollTop', 100);

        const state = requerio.$orgs['#main'].getState();

        expect(state.scrollTop).to.equal(100);
      });

      it('dispatches the "scrollTop" action in a targeted manner', function () {
        requerio.$orgs['.main__div'].dispatchAction('scrollTop', 101, 0);

        const state = requerio.$orgs['.main__div'].getState(0);

        expect(state.scrollTop).to.equal(101);
      });

      it('dispatches the "scrollTop" action across multiple targets', function () {
        requerio.$orgs['.main__div'].dispatchAction('scrollTop', 110, [0, 1]);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.scrollTop).to.equal(110);
        expect(state1.scrollTop).to.equal(110);
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
            left: 110,
            x: 110,
            y: 110
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
        expect(boundingClientRect.x).to.equal(110);
        expect(boundingClientRect.y).to.equal(110);
      });

      it('dispatches the "setBoundingClientRect" action in a targeted manner', function () {
        width++;
        height++;
        top++;
        right++;
        bottom++;
        left++;
        x++;
        y++;

        requerio.$orgs['.main__div'].dispatchAction(
          'setBoundingClientRect',
          {
            width,
            height,
            top,
            right,
            bottom,
            left,
            x,
            y
          },
          1
        );

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const boundingClientRect0 = state0.boundingClientRect;
        const state1 = requerio.$orgs['.main__div'].getState(1);
        const boundingClientRect1 = state1.boundingClientRect;

        expect(boundingClientRect0.width).to.not.equal(boundingClientRect1.width);
        expect(boundingClientRect0.height).to.not.equal(boundingClientRect1.height);
        expect(boundingClientRect0.top).to.not.equal(boundingClientRect1.top);
        expect(boundingClientRect0.right).to.not.equal(boundingClientRect1.right);
        expect(boundingClientRect0.bottom).to.not.equal(boundingClientRect1.bottom);
        expect(boundingClientRect0.left).to.not.equal(boundingClientRect1.left);
        expect(boundingClientRect0.x).to.not.equal(boundingClientRect1.x);
        expect(boundingClientRect0.y).to.not.equal(boundingClientRect1.y);

        expect(boundingClientRect1.width).to.equal(8);
        expect(boundingClientRect1.height).to.equal(8);
        expect(boundingClientRect1.top).to.equal(8);
        expect(boundingClientRect1.right).to.equal(8);
        expect(boundingClientRect1.bottom).to.equal(8);
        expect(boundingClientRect1.left).to.equal(8);
        expect(boundingClientRect1.x).to.equal(8);
        expect(boundingClientRect1.y).to.equal(8);
      });

      it('dispatches the "val" action', function () {
        requerio.$orgs['.main__input'].dispatchAction('val', 'element');

        const state = requerio.$orgs['.main__input'].getState();

        expect(state.val).to.equal('element');
      });

      it('gets .val in a targeted manner', function () {
        requerio.$orgs['.main__input'].dispatchAction('val', 'element', 0);

        const state = requerio.$orgs['.main__input'].getState(0);

        expect(state.val).to.equal('element');
      });

      it('updates .val after a val update via user interaction', function () {
        requerio.$orgs['.main__input'].val('compound');

        const state = requerio.$orgs['.main__input'].getState();

        expect(state.val).to.equal('compound');
      });

      it('dispatches the "width" action', function () {
        requerio.$orgs['#main'].dispatchAction('width', 1000);

        const state = requerio.$orgs['#main'].getState();

        expect(state.width).to.equal(1000);
      });

      it('dispatches the "width" action in a targeted manner', function () {
        requerio.$orgs['.main__div'].dispatchAction('width', 1010, 0);

        const state = requerio.$orgs['.main__div'].getState(0);

        expect(state.width).to.equal(1010);
      });

      it('dispatches the "width" action across multiple targets', function () {
        requerio.$orgs['.main__div'].dispatchAction('width', 1020, [0, 1]);

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        expect(state0.width).to.equal(1020);
        expect(state1.width).to.equal(1020);
      });

      it('dispatches the "width" action with a function argument', function () {
        requerio.$orgs['#main'].dispatchAction(
          'width',
          function (idx, distance) {
            return distance + parseInt(Object.keys(this).length + '' + idx, 10);
          }
        );

        const state = requerio.$orgs['#main'].getState();

        if (typeof window === 'object') {
          expect(state.width).to.equal(1020);
        }
        else {
          expect(state.width).to.equal(1110);
        }
      });

      it('dispatches the "width" action with a function argument in a targeted manner', function () {
        requerio.$orgs['.main__div'].dispatchAction(
          'width',
          function (idx, distance) {
            return distance + parseInt(Object.keys(this).length + '' + idx, 10);
          },
          0
        );

        const state = requerio.$orgs['.main__div'].getState(0);

        if (typeof window === 'object') {
          expect(state.width).to.equal(1040);
        }
        else {
          expect(state.width).to.equal(1130);
        }
      });

      it('dispatches the "width" action with a function argument across multiple targets', function () {
        requerio.$orgs['.main__div'].dispatchAction(
          'width',
          function (idx, distance) {
            return distance + parseInt(Object.keys(this).length + '' + idx, 10);
          },
          [0, 1]
        );

        const state0 = requerio.$orgs['.main__div'].getState(0);
        const state1 = requerio.$orgs['.main__div'].getState(1);

        if (typeof window === 'object') {
          expect(state0.width).to.equal(1060);
          expect(state1.width).to.equal(1040);
        }
        else {
          expect(state0.width).to.equal(1240);
          expect(state1.width).to.equal(1131);
        }
      });
    });

    describe('augmented organism prototype methods', function () {
      it('after() updates the html of the parent organism', function () {
        requerio.$orgs['#after'].dispatchAction('html');

        const stateBefore = requerio.$orgs['#after'].getState();

        requerio.$orgs['.after--0']
          .dispatchAction('after', '\n        <span class="after after--0.5"></span>');

        const stateAfter = requerio.$orgs['#after'].getState();

        expect(stateBefore.html).to.equal(`
        <span class="after after--0"></span>
        <span class="after after--1"></span>
      `);
        expect(stateAfter.html).to.equal(`
        <span class="after after--0"></span>
        <span class="after after--0.5"></span>
        <span class="after after--1"></span>
      `);
      });

      it('after() updates the html of the parent organism in a targeted manner', function () {
        requerio.$orgs['#after'].dispatchAction('html');

        const stateBefore = requerio.$orgs['#after'].getState();

        requerio.$orgs['.after']
          .dispatchAction('after', '\n        <span class="after after--1.5"></span>', 2);

        const stateAfter = requerio.$orgs['#after'].getState();

        expect(stateBefore.html).to.equal(`
        <span class="after after--0"></span>
        <span class="after after--0.5"></span>
        <span class="after after--1"></span>
      `);
        expect(stateAfter.html).to.equal(`
        <span class="after after--0"></span>
        <span class="after after--0.5"></span>
        <span class="after after--1"></span>
        <span class="after after--1.5"></span>
      `);
      });

      it('append() updates the html of the organism', function () {
        const stateBefore = requerio.$orgs['.append--0'].getState();

        requerio.$orgs['.append--0'].dispatchAction('append', '  <span>Bar</span>\n');

        const stateAfter = requerio.$orgs['.append--0'].getState();

        expect(stateBefore.html).to.be.null;
        expect(stateBefore.textContent).to.be.null;
        expect(stateAfter.html).to.equal(`
        <span>Foo</span>
        <span>Bar</span>
`);
        expect(stateAfter.textContent).to.equal(`
        Foo
        Bar
`);
      });

      it('append() updates the html of the organism in a targeted manner', function () {
        const stateBefore = requerio.$orgs['.append'].getState(1);

        requerio.$orgs['.append'].dispatchAction('append', '  <span>Bar</span>\n', 1);

        const stateAfter = requerio.$orgs['.append'].getState(1);

        expect(stateBefore.html).to.be.null;
        expect(stateBefore.textContent).to.be.null;
        expect(stateAfter.html).to.equal(`
        <span>Foo</span>
        <span>Bar</span>
`);
        expect(stateAfter.textContent).to.equal(`
        Foo
        Bar
`);
      });

      it('before() updates the html of the parent organism', function () {
        requerio.$orgs['#before'].dispatchAction('html');

        const stateBefore = requerio.$orgs['#before'].getState();

        requerio.$orgs['.before--0']
          .dispatchAction('before', '<span class="before before---0.5"></span>\n        ');

        const stateAfter = requerio.$orgs['#before'].getState();

        expect(stateBefore.html).to.equal(`
        <span class="before before--0"></span>
        <span class="before before--1"></span>
      `);
        expect(stateAfter.html).to.equal(`
        <span class="before before---0.5"></span>
        <span class="before before--0"></span>
        <span class="before before--1"></span>
      `);
      });

      it('before() updates the html of the parent organism in a targeted manner', function () {
        requerio.$orgs['#before'].dispatchAction('html');

        const stateBefore = requerio.$orgs['#before'].getState();

        requerio.$orgs['.before']
          .dispatchAction('before', '<span class="before before--0.5"></span>\n        ', 2);

        const stateAfter = requerio.$orgs['#before'].getState();

        expect(stateBefore.html).to.equal(`
        <span class="before before---0.5"></span>
        <span class="before before--0"></span>
        <span class="before before--1"></span>
      `);
        expect(stateAfter.html).to.equal(`
        <span class="before before---0.5"></span>
        <span class="before before--0"></span>
        <span class="before before--0.5"></span>
        <span class="before before--1"></span>
      `);
      });

      it('detach() disconnects the organism from the DOM', function () {
        requerio.$orgs['#detach'].dispatchAction('html');

        const stateBefore = requerio.$orgs['#detach'].getState();

        requerio.$orgs['.detach--0'].dispatchAction('detach');

        const stateAfter = requerio.$orgs['#detach'].getState();

        expect(stateBefore.html).to.include('<span class="detach detach--0"></span>');
        expect(stateAfter.html).to.not.include('<span class="detach detach--0"></span>');
      });

      it('detach() disconnects the organism from DOM in a targeted manner', function () {
        const stateBefore = requerio.$orgs['#detach'].getState();

        requerio.$orgs['.detach'].dispatchAction('detach', 1);

        const stateAfter = requerio.$orgs['#detach'].getState();

        expect(stateBefore.html).to.include('<span class="detach detach--1"></span>');
        expect(stateAfter.html).to.not.include('<span class="detach detach--1"></span>');
      });

      it('empty() deletes the html from the organism', function () {
        requerio.$orgs['.empty--0'].dispatchAction('html');

        const stateBefore = requerio.$orgs['.empty--0'].getState();

        requerio.$orgs['.empty--0'].dispatchAction('empty');

        const stateAfter = requerio.$orgs['.empty--0'].getState();

        expect(stateBefore.html).to.equal('<span></span>');
        expect(stateAfter.html).to.equal('');
      });

      it('empty() deletes the html from the organism in a targeted manner', function () {
        requerio.$orgs['.empty'].dispatchAction('html', null, 1);
        requerio.$orgs['.empty'].dispatchAction('html', null, 2);
        requerio.$orgs['.empty'].dispatchAction('html', null, 3);

        const stateBefore1 = requerio.$orgs['.empty'].getState(1);
        const stateBefore2 = requerio.$orgs['.empty'].getState(2);
        const stateBefore3 = requerio.$orgs['.empty'].getState(3);

        requerio.$orgs['.empty'].dispatchAction('empty', null, 1);

        const stateAfter1 = requerio.$orgs['.empty'].getState(1);
        const stateAfter2 = requerio.$orgs['.empty'].getState(2);
        const stateAfter3 = requerio.$orgs['.empty'].getState(3);

        expect(stateBefore1.html).to.equal('<span></span>');
        expect(stateBefore2.html).to.equal('<span></span>');
        expect(stateBefore3.html).to.equal('<span></span>');
        expect(stateAfter1.html).to.equal('');
        expect(stateAfter2.html).to.equal('<span></span>');
        expect(stateAfter3.html).to.equal('<span></span>');
      });

      it('empty() deletes the html from the organism across multiple targets', function () {
        const stateBefore2 = requerio.$orgs['.empty'].getState(2);
        const stateBefore3 = requerio.$orgs['.empty'].getState(3);

        requerio.$orgs['.empty'].dispatchAction('empty', null, [2, 3]);

        const stateAfter2 = requerio.$orgs['.empty'].getState(2);
        const stateAfter3 = requerio.$orgs['.empty'].getState(3);

        expect(stateBefore2.html).to.equal('<span></span>');
        expect(stateBefore3.html).to.equal('<span></span>');
        expect(stateAfter2.html).to.equal('');
        expect(stateAfter3.html).to.equal('');
      });

      it('html() dangerously writes HTML to the DOM', function () {
        requerio.$orgs['.html--0'].dispatchAction('html');

        const stateBefore = requerio.$orgs['.html--0'].getState();

        requerio.$orgs['.html--0'].dispatchAction('html', '<span>Foo</span>');

        const stateAfter = requerio.$orgs['.html--0'].getState();

        expect(stateBefore.html).to.equal('');
        expect(stateBefore.textContent).to.equal('');
        expect(stateAfter.html).to.equal('<span>Foo</span>');
        expect(stateAfter.textContent).to.equal('Foo');
      });

      it('html() dangerously writes HTML to the DOM in a targeted manner', function () {
        requerio.$orgs['.html'].dispatchAction('html');

        const stateBefore = requerio.$orgs['.html'].getState();
        const stateBefore1 = requerio.$orgs['.html'].getState(1);

        requerio.$orgs['.html'].dispatchAction('html', '<span>Bar</span>', 1);

        const stateAfter = requerio.$orgs['.html'].getState();
        const stateAfter1 = requerio.$orgs['.html'].getState(1);

        expect(stateBefore.html).to.equal('<span>Foo</span>');
        expect(stateBefore.textContent).to.equal('Foo');
        expect(stateBefore1.html).to.be.null;
        expect(stateBefore1.textContent).to.be.null;
        expect(stateAfter.html).to.equal('<span>Foo</span>');
        expect(stateAfter.textContent).to.equal('Foo');
        expect(stateAfter1.html).to.equal('<span>Bar</span>');
        expect(stateAfter1.textContent).to.equal('Bar');
      });

      it('html() dangerously writes HTML to the DOM across multiple targets', function () {
        const stateBefore = requerio.$orgs['.html'].getState();
        const stateBefore2 = requerio.$orgs['.html'].getState(2);
        const stateBefore3 = requerio.$orgs['.html'].getState(3);

        requerio.$orgs['.html'].dispatchAction('html', '<span>Bar</span>', [2, 3]);

        const stateAfter = requerio.$orgs['.html'].getState();
        const stateAfter2 = requerio.$orgs['.html'].getState(2);
        const stateAfter3 = requerio.$orgs['.html'].getState(3);

        expect(stateBefore.html).to.equal('<span>Foo</span>');
        expect(stateBefore.textContent).to.equal('Foo');
        expect(stateBefore2.html).to.be.null;
        expect(stateBefore2.textContent).to.be.null;
        expect(stateBefore3.html).to.be.null;
        expect(stateBefore3.textContent).to.be.null;
        expect(stateAfter.html).to.equal('<span>Foo</span>');
        expect(stateAfter.textContent).to.equal('Foo');
        expect(stateAfter2.html).to.equal('<span>Bar</span>');
        expect(stateAfter2.textContent).to.equal('Bar');
        expect(stateAfter3.html).to.equal('<span>Bar</span>');
        expect(stateAfter3.textContent).to.equal('Bar');
      });

      it('html(), by adding HTML elements, can increase the number of members among descendants', function () {
        requerio.$orgs['.html'].dispatchAction('html', null, 4); // For coverage.

        const membersStateBefore = requerio.$orgs['.html'].getState();

        requerio.$orgs['#html'].dispatchAction(
          'html',
          `
<span class="html html--0"></span>
<span class="html html--1">Foo</span>
<span class="html html--2">Foo</span>
<span class="html html--3">Foo</span>
<span class="html html--4">Foo</span>
`);

        const membersStateAfter = requerio.$orgs['.html'].getState();

        expect(membersStateBefore.members).to.equal(4);
        expect(membersStateAfter.members).to.equal(5);
      });

      it('html(), by removing HTML elements, can decrease the number of members among descendants', function () {
        requerio.$orgs['.html'].dispatchAction('html', null, [4, 5]); // For coverage.

        const membersStateBefore = requerio.$orgs['.html'].getState();

        requerio.$orgs['#html'].dispatchAction(
          'html',
          `
<span class="html html--0"></span>
<span class="html html--1">Foo</span>
<span class="html html--2">Foo</span>
<span class="html html--3">Foo</span>
`);

        const membersStateAfter = requerio.$orgs['.html'].getState();

        expect(membersStateBefore.members).to.equal(5);
        expect(membersStateAfter.members).to.equal(4);
      });

      it('prepend() updates the html of the organism', function () {
        const stateBefore = requerio.$orgs['.prepend--0'].getState();

        requerio.$orgs['.prepend--0'].dispatchAction('prepend', '\n        <span>Foo</span>');

        const stateAfter = requerio.$orgs['.prepend--0'].getState();

        expect(stateBefore.html).to.be.null;
        expect(stateBefore.textContent).to.be.null;
        expect(stateAfter.html).to.equal(`
        <span>Foo</span>
        <span>Bar</span>
      `);
        expect(stateAfter.textContent).to.equal(`
        Foo
        Bar
      `);
      });

      it('prepend() updates the html of the organism in a targeted manner', function () {
        const stateBefore = requerio.$orgs['.prepend'].getState(1);

        requerio.$orgs['.prepend'].dispatchAction('prepend', '\n        <span>Foo</span>', 1);

        const stateAfter = requerio.$orgs['.prepend'].getState(1);

        expect(stateBefore.html).to.be.null;
        expect(stateBefore.textContent).to.be.null;
        expect(stateAfter.html).to.equal(`
        <span>Foo</span>
        <span>Bar</span>
      `);
        expect(stateAfter.textContent).to.equal(`
        Foo
        Bar
      `);
      });

      it('remove() deletes the organism from the DOM', function () {
        requerio.$orgs['#remove'].dispatchAction('html');

        const stateBefore = requerio.$orgs['#remove'].getState();

        requerio.$orgs['.remove--0'].dispatchAction('detach');

        const stateAfter = requerio.$orgs['#remove'].getState();

        expect(stateBefore.html).to.include('<span class="remove remove--0"></span>');
        expect(stateAfter.html).to.not.include('<span class="remove remove--0"></span>');
      });

      it('remove() deletes the organism from the DOM in a targeted manner', function () {
        const stateBefore = requerio.$orgs['#remove'].getState();

        requerio.$orgs['.remove'].dispatchAction('remove', 1);

        const stateAfter = requerio.$orgs['#remove'].getState();

        expect(stateBefore.html).to.include('<span class="remove remove--1"></span>');
        expect(stateAfter.html).to.not.include('<span class="remove remove--1"></span>');
      });

      it('text() safely writes text to the DOM', function () {
        requerio.$orgs['.text--0'].dispatchAction('text');

        const stateBefore = requerio.$orgs['.text--0'].getState();

        requerio.$orgs['.text--0'].dispatchAction('text', '<span>Foo</span>');

        const stateAfter = requerio.$orgs['.text--0'].getState();

        expect(stateBefore.html).to.equal('');
        expect(stateBefore.textContent).to.equal('');
        expect(stateAfter.html).to.equal('&lt;span&gt;Foo&lt;/span&gt;');
        expect(stateAfter.textContent).to.equal('<span>Foo</span>');
      });

      it('text() safely writes text to the DOM in a targeted manner', function () {
        requerio.$orgs['.text'].dispatchAction('text');

        const stateBefore = requerio.$orgs['.text'].getState();
        const stateBefore1 = requerio.$orgs['.text'].getState(1);

        requerio.$orgs['.text'].dispatchAction('text', '<span>Bar</span>', 1);

        const stateAfter = requerio.$orgs['.text'].getState();
        const stateAfter1 = requerio.$orgs['.text'].getState(1);

        expect(stateBefore.html).to.equal('&lt;span&gt;Foo&lt;/span&gt;');
        expect(stateBefore.textContent).to.equal('<span>Foo</span>');
        expect(stateBefore1.html).to.be.null;
        expect(stateBefore1.textContent).to.be.null;
        expect(stateAfter.html).to.equal('&lt;span&gt;Foo&lt;/span&gt;');
        expect(stateAfter.textContent).to.equal('<span>Foo</span>');
        expect(stateAfter1.html).to.equal('&lt;span&gt;Bar&lt;/span&gt;');
        expect(stateAfter1.textContent).to.equal('<span>Bar</span>');
      });

      it('text() safely writes text to the DOM across multiple targets', function () {
        const stateBefore = requerio.$orgs['.text'].getState();
        const stateBefore2 = requerio.$orgs['.text'].getState(2);
        const stateBefore3 = requerio.$orgs['.text'].getState(3);

        requerio.$orgs['.text'].dispatchAction('text', '<span>Bar</span>', [2, 3]);

        const stateAfter = requerio.$orgs['.text'].getState();
        const stateAfter2 = requerio.$orgs['.text'].getState(2);
        const stateAfter3 = requerio.$orgs['.text'].getState(3);

        expect(stateBefore.html).to.equal('&lt;span&gt;Foo&lt;/span&gt;');
        expect(stateBefore.textContent).to.equal('<span>Foo</span>');
        expect(stateBefore2.html).to.be.null;
        expect(stateBefore2.textContent).to.be.null;
        expect(stateBefore3.html).to.be.null;
        expect(stateBefore3.textContent).to.be.null;
        expect(stateAfter.html).to.equal('&lt;span&gt;Foo&lt;/span&gt;');
        expect(stateAfter.textContent).to.equal('<span>Foo</span>');
        expect(stateAfter2.html).to.equal('&lt;span&gt;Bar&lt;/span&gt;');
        expect(stateAfter2.textContent).to.equal('<span>Bar</span>');
        expect(stateAfter3.html).to.equal('&lt;span&gt;Bar&lt;/span&gt;');
        expect(stateAfter3.textContent).to.equal('<span>Bar</span>');
      });
    });
  };
};
